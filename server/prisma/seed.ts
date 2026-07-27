import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: 'student' },
    update: {},
    create: { name: 'student' },
  });

  // 2. User
  const defaultUser = await prisma.user.upsert({
    where: { email: 'sena@example.com' },
    update: {},
    create: {
      email: 'sena@example.com',
      passwordHash: '$2b$10$EPf9y.0X/188h2g6f/pWae15R6aFhUuM9.N6m124qY21.b1b1b1b1', // mock hash for 'password123'
      profile: {
        create: {
          firstName: 'Sena',
          lastName: 'Ndiaye',
          targetScore: 7.0,
          plannedExamDate: new Date('2026-08-30'),
          studyHoursPerWeek: 5,
        },
      },
      roles: {
        create: {
          roleId: studentRole.id,
        },
      },
      subscriptions: {
        create: {
          planName: 'Premium',
          isActive: true,
        },
      },
    },
  });

  // 3. Exam Families
  const ieltsFamily = await prisma.examFamily.upsert({
    where: { name: 'IELTS' },
    update: {},
    create: { name: 'IELTS' },
  });

  const apFamily = await prisma.examFamily.upsert({
    where: { name: 'AP' },
    update: {},
    create: { name: 'AP' },
  });

  // 4. Pathways
  const ieltsAcademic = await prisma.examPathway.upsert({
    where: {
      examFamilyId_name: {
        examFamilyId: ieltsFamily.id,
        name: 'Academic',
      },
    },
    update: {},
    create: {
      examFamilyId: ieltsFamily.id,
      name: 'Academic',
    },
  });

  const apLang = await prisma.examPathway.upsert({
    where: {
      examFamilyId_name: {
        examFamilyId: apFamily.id,
        name: 'English Language',
      },
    },
    update: {},
    create: {
      examFamilyId: apFamily.id,
      name: 'English Language',
    },
  });

  // 5. Formats
  const ieltsVersion = await prisma.examFormatVersion.create({
    data: {
      examPathwayId: ieltsAcademic.id,
      version: '2026',
      isActive: true,
    },
  });

  const apVersion = await prisma.examFormatVersion.create({
    data: {
      examPathwayId: apLang.id,
      version: '2026',
      isActive: true,
    },
  });

  // 6. Exam Sections & Skills
  // IELTS Sections
  const ieltsListeningSec = await prisma.examSection.create({
    data: {
      examFormatVersionId: ieltsVersion.id,
      name: 'Listening',
      order: 1,
      durationMinutes: 30,
    },
  });

  const ieltsReadingSec = await prisma.examSection.create({
    data: {
      examFormatVersionId: ieltsVersion.id,
      name: 'Reading',
      order: 2,
      durationMinutes: 60,
    },
  });

  const ieltsWritingSec = await prisma.examSection.create({
    data: {
      examFormatVersionId: ieltsVersion.id,
      name: 'Writing',
      order: 3,
      durationMinutes: 60,
    },
  });

  const ieltsSpeakingSec = await prisma.examSection.create({
    data: {
      examFormatVersionId: ieltsVersion.id,
      name: 'Speaking',
      order: 4,
      durationMinutes: 15,
    },
  });

  // AP Sections
  const apMcqSec = await prisma.examSection.create({
    data: {
      examFormatVersionId: apVersion.id,
      name: 'MCQ',
      order: 1,
      durationMinutes: 60,
    },
  });

  const apFrqSec = await prisma.examSection.create({
    data: {
      examFormatVersionId: apVersion.id,
      name: 'FRQ',
      order: 2,
      durationMinutes: 135,
    },
  });

  // 7. Skills
  const ieltsTfngSkill = await prisma.skill.create({
    data: { examSectionId: ieltsReadingSec.id, name: 'Reading — T/F/NG' },
  });

  const ieltsTask1Skill = await prisma.skill.create({
    data: { examSectionId: ieltsWritingSec.id, name: 'Writing Task 1' },
  });

  const ieltsTask2Skill = await prisma.skill.create({
    data: { examSectionId: ieltsWritingSec.id, name: 'Writing Task 2' },
  });

  const apMcqSkill = await prisma.skill.create({
    data: { examSectionId: apMcqSec.id, name: 'MCQ Rhetorical Analysis' },
  });

  const apSynthesisSkill = await prisma.skill.create({
    data: { examSectionId: apFrqSec.id, name: 'Synthesis' },
  });

  const apRhetAnalysisSkill = await prisma.skill.create({
    data: { examSectionId: apFrqSec.id, name: 'Rhetorical Analysis' },
  });

  const apArgumentSkill = await prisma.skill.create({
    data: { examSectionId: apFrqSec.id, name: 'Argument' },
  });

  // 8. Courses, Stages, Modules, Lessons
  // IELTS Course
  const ieltsCourse = await prisma.course.create({
    data: { examPathwayId: ieltsAcademic.id, name: 'IELTS Academic Masterclass' },
  });

  const ieltsFoundationStage = await prisma.courseStage.create({
    data: { courseId: ieltsCourse.id, name: 'Foundation', order: 1 },
  });

  const ieltsReadyStage = await prisma.courseStage.create({
    data: { courseId: ieltsCourse.id, name: 'Exam Ready', order: 2 },
  });

  const ieltsWritingModule = await prisma.module.create({
    data: { courseStageId: ieltsReadyStage.id, name: 'Writing Task 2 Mastery', order: 1 },
  });

  const ieltsWritingLesson = await prisma.lesson.create({
    data: { moduleId: ieltsWritingModule.id, name: 'Writing Task 2 — Opinion Essays', order: 1 },
  });

  await prisma.lessonBlock.createMany({
    data: [
      {
        lessonId: ieltsWritingLesson.id,
        type: 'heading',
        content: JSON.stringify({ value: 'Introduction to Opinion Essays' }),
        order: 1,
      },
      {
        lessonId: ieltsWritingLesson.id,
        type: 'text',
        content: JSON.stringify({
          value:
            'An opinion essay (agree or disagree) requires you to state a clear position and support it with structured arguments. You must outline your position in the introduction, defend it with evidence, and summarize it in the conclusion.',
        }),
        order: 2,
      },
      {
        lessonId: ieltsWritingLesson.id,
        type: 'tip',
        content: JSON.stringify({
          value: 'Avoid sitting on the fence. Choosing one side clearly makes it much easier to write a coherent essay.',
        }),
        order: 3,
      },
    ],
  });

  // 9. Rubrics
  const ieltsWritingRubric = await prisma.rubric.create({
    data: {
      name: 'IELTS Writing Task 2 Rubric',
      version: '1.0',
      dimensions: {
        create: [
          { name: 'Task Response', description: 'Covers all parts of the prompt, states a clear position.', maxScore: 9 },
          { name: 'Coherence & Cohesion', description: 'Logical structure, paragraphing, linking devices.', maxScore: 9 },
          { name: 'Lexical Resource', description: 'Vocabulary range, accuracy, collocations.', maxScore: 9 },
          { name: 'Grammatical Range & Accuracy', description: 'Sentence variety, error-free structures.', maxScore: 9 },
        ],
      },
    },
  });

  const apWritingRubric = await prisma.rubric.create({
    data: {
      name: 'AP English Language FRQ Rubric',
      version: '1.0',
      dimensions: {
        create: [
          { name: 'Thesis', description: 'Responds to the prompt with a defensible thesis that establishes a clear position.', maxScore: 1 },
          { name: 'Evidence & Commentary', description: 'Provides specific evidence and commentary that explains the relationship between evidence and the thesis.', maxScore: 4 },
          { name: 'Sophistication', description: 'Demonstrates a sophistication of thought or a complex understanding of the rhetorical situation.', maxScore: 1 },
        ],
      },
    },
  });

  // 10. Passages & Questions
  // Reading Passage (IELTS)
  const urbanBeekeepingPassage = await prisma.passage.create({
    data: {
      title: 'Urban Beekeeping and Wild Pollinators',
      content:
        'Urban beekeeping has grown rapidly in cities over the past decade, driven partly by concern over declining pollinator populations. Municipal governments in several countries have relaxed zoning restrictions that once prohibited hives within city limits, and community groups now run beekeeping courses aimed at first-time hobbyists.\n\nResearchers remain divided, however, on whether concentrating large numbers of managed honeybee colonies in small urban areas actually benefits wild pollinator species or instead increases competition for limited forage. Some studies suggest that in floral-scarce districts, high hive density can measurably reduce the foraging success of native bee species.',
    },
  });

  // AP Reading Passage
  const attentionPassage = await prisma.passage.create({
    data: {
      title: 'Attention as a Resource',
      content:
        'It has become fashionable to speak of attention as a scarce resource, something to be "spent" or "protected" like a household budget. This metaphor is useful, but it obscures an important difference between money and attention: money, once spent, is simply gone, while attention shapes the very mind that must decide how to spend it next...',
    },
  });

  // Reading Question (IELTS)
  await prisma.question.create({
    data: {
      examFormatVersionId: ieltsVersion.id,
      skillId: ieltsTfngSkill.id,
      questionType: 'TFNG',
      difficulty: 'Moderate',
      passageId: urbanBeekeepingPassage.id,
      prompt: 'Do the following statements agree with the claims of the writer?\nResearchers agree that urban beekeeping helps wild pollinator populations.',
    },
  });

  // MCQ Question (AP)
  await prisma.question.create({
    data: {
      examFormatVersionId: apVersion.id,
      skillId: apMcqSkill.id,
      questionType: 'MCQ',
      difficulty: 'Moderate',
      passageId: attentionPassage.id,
      prompt: JSON.stringify({
        text: "The author's use of the household budget comparison primarily serves to",
        options: [
          "establish an analogy that the passage will later complicate",
          "mock a viewpoint the author considers naive",
          "provide statistical evidence for the passage's claim",
          "transition to an unrelated discussion of finance"
        ],
        correctAnswer: "establish an analogy that the passage will later complicate"
      }),
    },
  });

  // Writing Task 2 Question (IELTS)
  await prisma.question.create({
    data: {
      examFormatVersionId: ieltsVersion.id,
      skillId: ieltsTask2Skill.id,
      questionType: 'FREE_RESPONSE',
      difficulty: 'Difficult',
      prompt:
        'Some people believe that governments should invest primarily in public transportation rather than road infrastructure for private vehicles. To what extent do you agree or disagree? Give reasons for your answer and include relevant examples.',
      rubricId: ieltsWritingRubric.id,
    },
  });

  // Argument Question (AP)
  await prisma.question.create({
    data: {
      examFormatVersionId: apVersion.id,
      skillId: apArgumentSkill.id,
      questionType: 'FREE_RESPONSE',
      difficulty: 'Difficult',
      prompt:
        'Public figures — including politicians, celebrities, and business leaders — are increasingly expected to state personal opinions on social and political issues unrelated to their profession.\n\nWrite an essay that argues your position on the extent to which public figures should be expected to publicly share their opinions on such issues. Use appropriate evidence to support your argument.',
      rubricId: apWritingRubric.id,
    },
  });

  // 11. Initial Progress / Recommendations / Skill metrics for Sena
  await prisma.skillProgress.create({
    data: {
      userId: defaultUser.id,
      skillId: ieltsTfngSkill.id,
      accuracy: 0.75,
      attemptsCount: 4,
    },
  });

  await prisma.masteryRecord.createMany({
    data: [
      { userId: defaultUser.id, skillName: 'Listening', status: 'Learning' },
      { userId: defaultUser.id, skillName: 'Reading', status: 'Developing' },
      { userId: defaultUser.id, skillName: 'Writing', status: 'Learning' },
      { userId: defaultUser.id, skillName: 'Speaking', status: 'Learning' },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      {
        userId: defaultUser.id,
        activityType: 'LESSON',
        activityId: ieltsWritingLesson.id,
        title: 'Writing Task 2 — Opinion Essays',
        reason: 'Recommended because your last Writing Task 2 attempts scored lowest on Coherence & Cohesion',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
