import { Router } from 'express';
import { prisma } from './db.js';

export const apiRouter = Router();

// Middleware to authenticate mock sessions
async function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing bearer token' });
  }
  const token = authHeader.split(' ')[1];
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { include: { profile: true } } },
  });

  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ error: 'Unauthorized: invalid or expired session' });
  }

  req.user = session.user;
  next();
}

// 1. Auth Login Endpoint
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Simple mock password check since it's Phase 1
  if (password !== user.passwordHash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create session
  const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile,
    },
  });
});

// 2. Auth Register Endpoint
apiRouter.post('/auth/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: password, // Plain text for phase 1
        profile: {
          create: {
            firstName,
            lastName,
            targetScore: 7,
            studyHoursPerWeek: 5,
          },
        },
        recommendations: {
          create: [
            {
              title: 'Writing Task 2 — Opinion Essays',
              reason: 'Recommended because your last Writing Task 2 attempts scored lowest on Coherence & Cohesion',
            },
            {
              title: 'Reading — True/False/Not Given',
              reason: 'Practice this question type to improve your Reading score.',
            }
          ]
        },
        masteryRecords: {
          create: [
            { skillName: 'Writing Task 2', status: 'Learning' },
            { skillName: 'Reading - T/F/NG', status: 'Developing' },
            { skillName: 'AP Argument FRQ', status: 'Not started' }
          ]
        }
      },
      include: { profile: true },
    });

    // Create session
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: newUser.id,
        token,
        expiresAt,
      },
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        profile: newUser.profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

// 2. Dashboard Endpoint
apiRouter.get('/dashboard', authenticate, async (req: any, res) => {
  const userId = req.user.id;

  const profile = req.user.profile;
  const mastery = await prisma.masteryRecord.findMany({ where: { userId } });
  const recommendations = await prisma.recommendation.findMany({ where: { userId } });
  const skillProgress = await prisma.skillProgress.findMany({
    where: { userId },
    include: { skill: true },
  });

  // Calculate estimated overall band or composite scores dynamically
  // In Phase 1, we pull from default values or computed estimates.
  // IELTS overall: 6.5
  // AP composite: 3

  res.json({
    profile,
    exams: [
      {
        name: 'IELTS Academic',
        targetScore: 'Band ' + (profile?.targetScore || '7.0'),
        daysLeft: 34,
        estimatedOverall: 6.5,
        skills: {
          Listening: 78,
          Reading: 70,
          Writing: 52,
          Speaking: 64,
        },
      },
      {
        name: 'AP English Language',
        targetScore: 'Score 4',
        daysLeft: 112,
        estimatedOverall: 3.0,
        skills: {
          MCQ: 66,
          Synthesis: 48,
          RhetoricalAnalysis: 58,
          Argument: 61,
        },
      },
    ],
    recommendations,
    mastery,
    skillProgress,
  });
});

// 3. Practice questions endpoint
apiRouter.get('/practice/questions', authenticate, async (req, res) => {
  // Return mock/seeded questions
  const questions = await prisma.question.findMany({
    include: { passage: true, skill: true },
  });

  res.json({ questions });
});

// 4. Practice submit endpoint
apiRouter.post('/practice/submit', authenticate, async (req: any, res) => {
  const { questionId, answer } = req.body;
  const userId = req.user.id;

  if (!questionId) {
    return res.status(400).json({ error: 'Question ID is required' });
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Simple auto-marking rule: T/F/NG or MCQ validation
  let isCorrect = false;
  let explanation = '';

  if (question.questionType === 'TFNG') {
    isCorrect = answer.trim().toLowerCase() === 'false';
    explanation =
      'The passage states researchers "remain divided" on this question — this directly contradicts a claim of agreement, which makes the statement False.';
  } else if (question.questionType === 'MCQ') {
    try {
      const parsed = JSON.parse(question.prompt);
      isCorrect = answer.trim().toLowerCase() === parsed.correctAnswer.trim().toLowerCase();
      explanation = `The author compares attention to a household budget but immediately complicates this metaphor by explaining how attention shapes the mind that decides how to spend it next. This complicates the initial analogy, making (A) the correct choice.`;
    } catch (e) {
      isCorrect = true;
      explanation = 'Response evaluated.';
    }
  } else {
    // default/other
    isCorrect = true;
    explanation = 'Self-review or mock response received.';
  }

  // Save attempt response
  const attempt = await prisma.attempt.create({
    data: {
      userId,
      examPathwayId: (await prisma.examPathway.findFirst())?.id || '',
      completedAt: new Date(),
      responses: {
        create: {
          questionId,
          content: answer,
          isCorrect,
        },
      },
    },
  });

  res.json({
    isCorrect,
    explanation,
    attemptId: attempt.id,
  });
});

// 5. Mock Exam submit endpoint (construct feedback dynamically)
apiRouter.post('/mock/submit', authenticate, async (req: any, res) => {
  const { questionId, content } = req.body;
  const userId = req.user.id;

  if (!questionId || !content) {
    return res.status(400).json({ error: 'Question ID and content are required' });
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { skill: true },
  });

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const isAP = question.skill.name.includes('Argument') || question.skill.name.includes('Synthesis') || question.skill.name.includes('Rhetorical');
  const wordCount = content.trim().split(/\s+/).length;

  let mockFeedback = [];
  let overallEstimate = 6.0;
  let metricName = 'Writing Estimate';

  if (isAP) {
    metricName = 'AP Composite Estimate';
    overallEstimate = 4.0; // on a 1-5 scale
    mockFeedback = [
      {
        dimension: 'Thesis',
        score: 1.0,
        comments: 'The response presents a defensible thesis that establishes a clear position on the expectations of public figures.',
      },
      {
        dimension: 'Evidence & Commentary',
        score: 3.0,
        comments: 'Provides specific evidence supporting the thesis. The commentary clearly explains how the evidence supports the argument, though a few connections could be more explicit.',
      },
      {
        dimension: 'Sophistication',
        score: 1.0,
        comments: 'Demonstrates a complex understanding of the prompt by analyzing the tensions between civic engagement and personal privacy.',
      },
    ];
  } else {
    overallEstimate = 6.0; // on a 0-9 scale
    mockFeedback = [
      {
        dimension: 'Task Response',
        score: 6.5,
        comments:
          'The essay addresses all parts of the prompt. The overall position is clear throughout the response, though some points could be more fully developed.',
      },
      {
        dimension: 'Coherence & Cohesion',
        score: 5.5,
        comments:
          'Information and ideas are logically organized, but paragraph structures need work. The use of cohesive devices is sometimes repetitive or mechanical.',
      },
      {
        dimension: 'Lexical Resource',
        score: 6.0,
        comments:
          'Uses an adequate range of vocabulary for the task. Some attempts at less common lexis, with occasional spelling mistakes.',
      },
      {
        dimension: 'Grammatical Range & Accuracy',
        score: 6.5,
        comments:
          'Uses a mix of simple and complex sentence structures. Good grammatical control, though minor errors persist.',
      },
    ];
  }

  // Save full attempt record
  const attempt = await prisma.attempt.create({
    data: {
      userId,
      examPathwayId: (await prisma.examPathway.findFirst())?.id || '',
      isMock: true,
      completedAt: new Date(),
      responses: {
        create: {
          questionId,
          content,
          feedback: {
            createMany: {
              data: mockFeedback.map((fb) => ({
                dimension: fb.dimension,
                score: fb.score,
                comments: fb.comments,
              })),
            },
          },
        },
      },
      estimates: {
        create: {
          metricName,
          estimatedScore: overallEstimate,
          confidence: 'MEDIUM',
        },
      },
    },
  });

  res.json({
    attemptId: attempt.id,
    wordCount,
    overallEstimate,
    feedback: mockFeedback,
  });
});
