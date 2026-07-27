import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

interface Profile {
  firstName: string;
  lastName: string;
}

interface Exam {
  name: string;
  targetScore: string;
  daysLeft: number;
  estimatedOverall: number;
  skills: Record<string, number>;
}

interface Recommendation {
  id: string;
  title: string;
  reason: string;
}

interface Question {
  id: string;
  questionType: string;
  difficulty: string;
  prompt: string;
  passage?: {
    title: string;
    content: string;
  };
  skill: {
    name: string;
  };
}

interface FeedbackDimension {
  dimension: string;
  score: number;
  comments: string;
}

type Tab = 'dashboard' | 'ielts-practice' | 'ielts-mock' | 'ap-practice' | 'ap-mock';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // ─── IELTS Practice state ───────────────────────────────────────────────────
  const [ieltsPracticeSubmitted, setIeltsPracticeSubmitted] = useState(false);
  const [ieltsSelectedOption, setIeltsSelectedOption] = useState<string | null>(null);
  const [ieltsPracticeFeedback, setIeltsPracticeFeedback] = useState<any>(null);

  // ─── IELTS Mock state ────────────────────────────────────────────────────────
  const [ieltsEssay, setIeltsEssay] = useState('');
  const [ieltsWordCount, setIeltsWordCount] = useState(0);
  const [ieltsSubmitted, setIeltsSubmitted] = useState(false);
  const [ieltsFeedback, setIeltsFeedback] = useState<FeedbackDimension[]>([]);
  const [ieltsScore, setIeltsScore] = useState<number | null>(null);
  const [ieltsTimer, setIeltsTimer] = useState(2400); // 40 min
  const [ieltsSubmitting, setIeltsSubmitting] = useState(false);

  // ─── AP MCQ Practice state ───────────────────────────────────────────────────
  const [apMcqSubmitted, setApMcqSubmitted] = useState(false);
  const [apMcqSelected, setApMcqSelected] = useState<string | null>(null);
  const [apMcqFeedback, setApMcqFeedback] = useState<any>(null);

  // ─── AP Mock (Argument FRQ) state ────────────────────────────────────────────
  const [apEssay, setApEssay] = useState('');
  const [apWordCount, setApWordCount] = useState(0);
  const [apSubmitted, setApSubmitted] = useState(false);
  const [apFeedback, setApFeedback] = useState<FeedbackDimension[]>([]);
  const [apScore, setApScore] = useState<number | null>(null);
  const [apTimer, setApTimer] = useState(2700); // 45 min
  const [apSubmitting, setApSubmitting] = useState(false);

  // Auto Login
  useEffect(() => {
    async function login() {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'sena@example.com', password: 'password123' }),
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        setToken(data.token);
        setProfile(data.user.profile);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    login();
  }, []);

  // Fetch Dashboard & Questions
  useEffect(() => {
    if (!token) return;
    async function fetchData() {
      try {
        setLoading(true);
        const [dashRes, qRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/practice/questions`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const dashData = await dashRes.json();
        const qData = await qRes.json();
        setExams(dashData.exams);
        setRecommendations(dashData.recommendations);
        setQuestions(qData.questions);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  // IELTS mock timer
  useEffect(() => {
    if (activeTab !== 'ielts-mock' || ieltsSubmitted) return;
    const t = setInterval(() => setIeltsTimer(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [activeTab, ieltsSubmitted]);

  // AP mock timer
  useEffect(() => {
    if (activeTab !== 'ap-mock' || apSubmitted) return;
    const t = setInterval(() => setApTimer(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [activeTab, apSubmitted]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ─── Submit helpers ─────────────────────────────────────────────────────────
  const submitPractice = async (questionId: string, answer: string, onFeedback: (d: any) => void, onSubmitted: () => void) => {
    if (!token) return;
    const res = await fetch(`${API_BASE}/practice/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ questionId, answer }),
    });
    const data = await res.json();
    onFeedback(data);
    onSubmitted();
  };

  const submitMock = async (questionId: string, content: string, onDone: (data: any) => void, onFinally: () => void) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/mock/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ questionId, content }),
      });
      const data = await res.json();
      onDone(data);
    } finally {
      onFinally();
    }
  };

  // ─── Derived questions ───────────────────────────────────────────────────────
  const tfngQ = questions.find(q => q.questionType === 'TFNG');
  const mcqQ = questions.find(q => q.questionType === 'MCQ');
  const mcqData = mcqQ ? (() => { try { return JSON.parse(mcqQ.prompt); } catch { return null; } })() : null;
  const ieltsWritingQ = questions.find(q => q.questionType === 'FREE_RESPONSE' && !q.skill?.name?.includes('Argument'));
  const apArgumentQ = questions.find(q => q.questionType === 'FREE_RESPONSE' && q.skill?.name?.includes('Argument'));

  const avatarInitials = profile ? `${profile.firstName[0]}${profile.lastName[0]}` : 'SN';

  // Format skill names for display (handle camelCase keys from API)
  const formatSkillLabel = (key: string): string => {
    const map: Record<string, string> = {
      RhetoricalAnalysis: 'Rhet. Analysis',
      Listening: 'Listening',
      Reading: 'Reading',
      Writing: 'Writing',
      Speaking: 'Speaking',
      MCQ: 'MCQ',
      Synthesis: 'Synthesis',
      Argument: 'Argument',
    };
    return map[key] ?? key.replace(/([A-Z])/g, ' $1').trim();
  };

  if (loading && !profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading Exam Mastery Platform…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Error Loading Platform</h2>
        <p style={{ color: 'var(--brick)' }}>{error}</p>
        <p>Ensure the backend server is running on port 4000.</p>
      </div>
    );
  }

  return (
    <div>
      {/* ─── Nav ─────────────────────────────────────────────────────────────── */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </button>

        {/* IELTS group */}
        <span className="tab-group-label">IELTS Academic</span>
        <button className={`tab ${activeTab === 'ielts-practice' ? 'active' : ''}`} onClick={() => setActiveTab('ielts-practice')}>
          Reading Practice
        </button>
        <button className={`tab ${activeTab === 'ielts-mock' ? 'active' : ''}`} onClick={() => setActiveTab('ielts-mock')}>
          Writing Mock
        </button>

        {/* AP group */}
        <span className="tab-group-label" style={{ color: 'var(--clay)' }}>AP English</span>
        <button className={`tab ${activeTab === 'ap-practice' ? 'active' : ''}`} onClick={() => setActiveTab('ap-practice')}>
          MCQ Practice
        </button>
        <button className={`tab ${activeTab === 'ap-mock' ? 'active' : ''}`} onClick={() => setActiveTab('ap-mock')}>
          Argument FRQ Mock
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          DASHBOARD
      ═══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="app-header">
            <div className="brand"><span className="brand-mark">E</span> Exam Mastery</div>
            <div className="header-right">
              <span className="pill">42-day streak</span>
              <div className="avatar">{avatarInitials}</div>
            </div>
          </div>

          <div className="with-rail">
            <div>
              <div className="greeting">Welcome back</div>
              <h1 className="greeting-name">Good morning, {profile?.firstName || 'Student'}</h1>

              {/* Exam cards */}
              <div className="exam-cards">
                {exams.map((exam, i) => (
                  <div className="exam-card" key={i}>
                    <div className="exam-card-top">
                      <div>
                        <div className="exam-name">{exam.name}</div>
                        <div className="exam-sub">Target: {exam.targetScore} · Exam in {exam.daysLeft} days</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="band">{exam.estimatedOverall}</div>
                        <div className="band-label">estimated {exam.name.includes('AP') ? 'composite' : 'overall'}</div>
                      </div>
                    </div>
                    {Object.entries(exam.skills).map(([skill, val]) => (
                      <div className="skill-row" key={skill}>
                        <span title={skill}>{formatSkillLabel(skill)}</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${val}%`, backgroundColor: val < 55 ? 'var(--clay)' : 'var(--forest)' }} />
                        </div>
                      </div>
                    ))}
                    {/* Quick-start buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                      {exam.name.includes('IELTS') ? (
                        <>
                          <button className="btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setActiveTab('ielts-practice')}>Reading Practice →</button>
                          <button className="btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setActiveTab('ielts-mock')}>Writing Mock →</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-ghost" style={{ fontSize: '12px', padding: '6px 12px', borderColor: 'var(--clay)', color: 'var(--clay)' }} onClick={() => setActiveTab('ap-practice')}>MCQ Practice →</button>
                          <button className="btn-ghost" style={{ fontSize: '12px', padding: '6px 12px', borderColor: 'var(--clay)', color: 'var(--clay)' }} onClick={() => setActiveTab('ap-mock')}>Argument FRQ →</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue card */}
              <div className="continue-card">
                <div>
                  <div className="continue-eyebrow">Continue learning</div>
                  <div className="continue-title">Writing Task 2 — Opinion Essays</div>
                  <div className="continue-sub">Module 3 of 6 · IELTS Academic · ~18 min left</div>
                </div>
                <button className="btn-primary" onClick={() => setActiveTab('ielts-mock')}>Continue →</button>
              </div>

              {/* Recommendations */}
              <div className="section-label">Recommended next</div>
              <div className="rec-list">
                {recommendations.map(rec => (
                  <div className="rec-item" key={rec.id}>
                    <div>
                      <div className="rec-title">{rec.title}</div>
                      <div className="rec-reason">{rec.reason}</div>
                    </div>
                    <button className="btn-ghost" onClick={() => setActiveTab(rec.title.includes('AP') ? 'ap-practice' : 'ielts-mock')}>Start</button>
                  </div>
                ))}
                {/* AP recommendation always visible */}
                <div className="rec-item">
                  <div>
                    <div className="rec-title">AP Argument FRQ — Public Figures</div>
                    <div className="rec-reason">Diagnostic flagged Argument writing as a weak area, not yet practised</div>
                  </div>
                  <button className="btn-ghost" style={{ borderColor: 'var(--clay)', color: 'var(--clay)' }} onClick={() => setActiveTab('ap-mock')}>Start</button>
                </div>
              </div>
            </div>

            {/* Rail */}
            <div className="rail">
              <div className="rail-block">
                <div className="rail-label">Mock readiness</div>
                <div className="rail-value">Not yet ready</div>
              </div>
              <div className="rail-block">
                <div className="rail-label">This week</div>
                <div className="rail-value">3h 40m studied</div>
              </div>
              <div className="rail-note">Your Writing scores move fastest when practice is timed. Try one timed Task 2 or AP Argument this week.</div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          IELTS READING PRACTICE
      ═══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ielts-practice' && (
        <div>
          <div className="app-header">
            <div className="brand"><span className="brand-mark">E</span> Exam Mastery</div>
            <div className="header-right">
              <span className="pill">IELTS Academic · Untimed</span>
              <div className="avatar">{avatarInitials}</div>
            </div>
          </div>

          <div className="with-rail">
            <div className="passage-wrap">
              <div className="passage-meta">
                <span className="tag">Reading</span>
                <span className="tag" style={{ background: 'var(--clay-soft)', color: 'var(--clay)' }}>Moderate</span>
              </div>
              <h2 className="passage-title">{tfngQ?.passage?.title || 'Urban Beekeeping and Wild Pollinators'}</h2>
              <div className="passage-text">
                {(tfngQ?.passage?.content || '').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>

              <div className="question-block">
                <div className="q-number">Question 4 of 13</div>
                <div className="q-text">
                  Do the following statements agree with the claims of the writer?<br />
                  <em>Researchers agree that urban beekeeping helps wild pollinator populations.</em>
                </div>

                {(['True', 'False', 'Not Given'] as const).map(opt => {
                  const chosen = ieltsSelectedOption === opt;
                  const correct = chosen && ieltsPracticeFeedback?.isCorrect;
                  const wrong = chosen && !ieltsPracticeFeedback?.isCorrect;
                  return (
                    <div
                      key={opt}
                      className={`option ${correct ? 'correct' : wrong ? 'incorrect' : ''}`}
                      onClick={() => {
                        if (ieltsPracticeSubmitted || !tfngQ) return;
                        setIeltsSelectedOption(opt);
                        submitPractice(
                          tfngQ.id, opt,
                          d => setIeltsPracticeFeedback(d),
                          () => setIeltsPracticeSubmitted(true),
                        );
                      }}
                    >
                      <div className="option-mark" />
                      {opt}
                      {correct && <div className="underline-mark" />}
                      {wrong && <div className="strike" />}
                    </div>
                  );
                })}

                {ieltsPracticeSubmitted && (
                  <div className="explanation">{ieltsPracticeFeedback?.explanation}</div>
                )}

                {ieltsPracticeSubmitted && (
                  <button className="btn-ghost" style={{ marginTop: '16px' }} onClick={() => { setIeltsPracticeSubmitted(false); setIeltsSelectedOption(null); setIeltsPracticeFeedback(null); }}>
                    Try again
                  </button>
                )}
              </div>
            </div>

            <div className="rail">
              <div className="rail-block"><div className="rail-label">Skill</div><div className="rail-value">Reading — T/F/NG</div></div>
              <div className="rail-block"><div className="rail-label">Progress</div><div className="rail-value">4 / 13</div></div>
              <div className="rail-block"><div className="rail-label">Accuracy so far</div><div className="rail-value mono">75%</div></div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          IELTS WRITING MOCK
      ═══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ielts-mock' && (
        <div>
          <div className="exam-header">
            <div>
              <div className="pill" style={{ marginBottom: '6px', display: 'inline-block' }}>IELTS Academic — Full Mock</div>
              <div className="exam-progress-dots">
                <div className="dot done" /><div className="dot done" /><div className="dot done" /><div className="dot now" />
              </div>
            </div>
            <div className="timer-block">
              <div className="timer" style={{ color: ieltsTimer < 120 ? 'var(--brick)' : 'var(--ink)' }}>{formatTime(ieltsTimer)}</div>
              <div className="timer-label">Writing Task 2</div>
            </div>
          </div>

          <div className="exam-body">
            <div className="exam-instructions">
              Write at least 250 words. You have 40 minutes for this task. This is a practice estimate — results are not an official IELTS score.
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '18px' }}>
              {ieltsWritingQ?.prompt || 'Some people believe that governments should invest primarily in public transportation rather than road infrastructure for private vehicles. To what extent do you agree or disagree?'}
            </h3>

            {ieltsSubmitted ? (
              <div className="feedback-container">
                <h3 className="feedback-title">Submitted — Estimated Band: {ieltsScore}</h3>
                <div className="feedback-grid">
                  {ieltsFeedback.map((fb, i) => (
                    <div className="feedback-item" key={i}>
                      <div className="feedback-header"><span>{fb.dimension}</span><span className="feedback-score">{fb.score} / 9</span></div>
                      <div className="feedback-comments">{fb.comments}</div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => { setIeltsSubmitted(false); setIeltsEssay(''); setIeltsWordCount(0); setIeltsTimer(2400); }}>Try Again</button>
              </div>
            ) : (
              <textarea
                className="essay"
                placeholder="Start writing your response here…"
                value={ieltsEssay}
                onChange={e => { setIeltsEssay(e.target.value); setIeltsWordCount(e.target.value.trim() ? e.target.value.trim().split(/\s+/).length : 0); }}
              />
            )}
          </div>

          {!ieltsSubmitted && (
            <div className="exam-footer">
              <span className="word-count">{ieltsWordCount} words</span>
              <button
                className="btn-primary"
                disabled={ieltsSubmitting || !ieltsEssay.trim()}
                onClick={() => {
                  if (!ieltsWritingQ) return;
                  setIeltsSubmitting(true);
                  submitMock(
                    ieltsWritingQ.id, ieltsEssay,
                    d => { setIeltsFeedback(d.feedback); setIeltsScore(d.overallEstimate); setIeltsSubmitted(true); },
                    () => setIeltsSubmitting(false),
                  );
                }}
              >
                {ieltsSubmitting ? 'Submitting…' : 'Submit Task 2 →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          AP MCQ PRACTICE
      ═══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ap-practice' && (
        <div>
          <div className="app-header">
            <div className="brand"><span className="brand-mark">E</span> Exam Mastery</div>
            <div className="header-right">
              <span className="pill" style={{ background: 'var(--clay-soft)', color: 'var(--clay)', borderColor: 'var(--clay)' }}>AP English · MCQ Practice</span>
              <div className="avatar">{avatarInitials}</div>
            </div>
          </div>

          <div className="with-rail">
            <div className="passage-wrap">
              <div className="passage-meta">
                <span className="tag" style={{ background: 'var(--clay-soft)', color: 'var(--clay)' }}>MCQ</span>
                <span className="tag" style={{ background: 'var(--clay-soft)', color: 'var(--clay)' }}>Moderate</span>
              </div>
              <h2 className="passage-title">{mcqQ?.passage?.title || 'Attention as a Resource'}</h2>
              <div className="passage-text">
                {(mcqQ?.passage?.content || 'It has become fashionable to speak of attention as a scarce resource, something to be "spent" or "protected" like a household budget. This metaphor is useful, but it obscures an important difference between money and attention: money, once spent, is simply gone, while attention shapes the very mind that must decide how to spend it next...').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>

              <div className="question-block">
                <div className="q-number">Question 1 of 10</div>
                <div className="q-text">{mcqData?.text || "The author's use of the household budget comparison primarily serves to"}</div>

                {(mcqData?.options || [
                  "establish an analogy that the passage will later complicate",
                  "mock a viewpoint the author considers naive",
                  "provide statistical evidence for the passage's claim",
                  "transition to an unrelated discussion of finance",
                ]).map((opt: string, i: number) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const chosen = apMcqSelected === opt;
                  const correct = chosen && apMcqFeedback?.isCorrect;
                  const wrong = chosen && !apMcqFeedback?.isCorrect;
                  return (
                    <div
                      key={i}
                      className={`option ${correct ? 'correct' : wrong ? 'incorrect' : ''}`}
                      onClick={() => {
                        if (apMcqSubmitted || !mcqQ) return;
                        setApMcqSelected(opt);
                        submitPractice(
                          mcqQ.id, opt,
                          d => setApMcqFeedback(d),
                          () => setApMcqSubmitted(true),
                        );
                      }}
                    >
                      <div className="option-mark" style={{ borderRadius: '3px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>
                        {apMcqSubmitted ? (correct ? '✓' : wrong ? '✗' : letters[i]) : letters[i]}
                      </div>
                      {opt}
                      {correct && <div className="underline-mark" />}
                      {wrong && <div className="strike" />}
                    </div>
                  );
                })}

                {apMcqSubmitted && (
                  <div className="explanation">{apMcqFeedback?.explanation}</div>
                )}

                {apMcqSubmitted && (
                  <button className="btn-ghost" style={{ marginTop: '16px', borderColor: 'var(--clay)', color: 'var(--clay)' }} onClick={() => { setApMcqSubmitted(false); setApMcqSelected(null); setApMcqFeedback(null); }}>
                    Next question
                  </button>
                )}
              </div>
            </div>

            <div className="rail">
              <div className="rail-block"><div className="rail-label">Exam</div><div className="rail-value">AP English Language</div></div>
              <div className="rail-block"><div className="rail-label">Section</div><div className="rail-value">MCQ — Reading</div></div>
              <div className="rail-block"><div className="rail-label">Skill</div><div className="rail-value">Rhetorical Analysis</div></div>
              <div className="rail-block"><div className="rail-label">Progress</div><div className="rail-value">1 / 10</div></div>
              <div className="rail-block"><div className="rail-label">Accuracy so far</div><div className="rail-value mono">{apMcqSubmitted ? (apMcqFeedback?.isCorrect ? '100%' : '0%') : '—'}</div></div>
              <div className="rail-note">AP MCQ questions test whether you can identify how a writer's choices contribute to the argument, not just what they say.</div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          AP ARGUMENT FRQ MOCK
      ═══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ap-mock' && (
        <div>
          <div className="exam-header">
            <div>
              <div className="pill" style={{ marginBottom: '6px', display: 'inline-block', background: 'var(--clay-soft)', color: 'var(--clay)', borderColor: 'var(--clay)' }}>AP English Language — FRQ Mock</div>
              <div className="exam-progress-dots">
                <div className="dot done" /><div className="dot done" /><div className="dot now" />
              </div>
            </div>
            <div className="timer-block">
              <div className="timer" style={{ color: apTimer < 120 ? 'var(--brick)' : 'var(--ink)' }}>{formatTime(apTimer)}</div>
              <div className="timer-label">Argument Essay</div>
            </div>
          </div>

          <div className="exam-body">
            <div className="exam-instructions">
              Write an essay arguing your position. Aim for at least 250 words. You have 45 minutes for this task. This is a practice estimate — results are not an official AP score.
            </div>

            {/* AP Rubric reference card */}
            <div style={{ background: 'var(--rule-soft)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: '20px', fontSize: '13px' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: '8px' }}>Scoring rubric (6 points total)</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[['Thesis', '1 pt'], ['Evidence & Commentary', '4 pts'], ['Sophistication', '1 pt']].map(([name, pts]) => (
                  <div key={name} style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '8px', padding: '8px 12px', fontSize: '12.5px' }}>
                    <strong>{name}</strong><span style={{ color: 'var(--clay)', fontFamily: 'IBM Plex Mono, monospace', marginLeft: '6px' }}>{pts}</span>
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '18px', fontFamily: 'Fraunces, serif', fontWeight: 500 }}>
              {apArgumentQ?.prompt?.split('\n\n')[0] || 'Public figures — including politicians, celebrities, and business leaders — are increasingly expected to state personal opinions on social and political issues unrelated to their profession.'}
            </h3>
            {apArgumentQ?.prompt?.split('\n\n')[1] && (
              <p style={{ fontSize: '15px', color: 'var(--ink-soft)', marginBottom: '20px', fontStyle: 'italic' }}>
                {apArgumentQ.prompt.split('\n\n')[1]}
              </p>
            )}

            {apSubmitted ? (
              <div className="feedback-container">
                <h3 className="feedback-title">Submitted — AP Estimated Score: {apScore} / 5</h3>
                <div className="feedback-grid">
                  {apFeedback.map((fb, i) => (
                    <div className="feedback-item" key={i}>
                      <div className="feedback-header">
                        <span>{fb.dimension}</span>
                        <span className="feedback-score" style={{ color: 'var(--clay)' }}>{fb.score} pts</span>
                      </div>
                      <div className="feedback-comments">{fb.comments}</div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ marginTop: '20px', background: 'var(--clay)' }} onClick={() => { setApSubmitted(false); setApEssay(''); setApWordCount(0); setApTimer(2700); }}>
                  Try Again
                </button>
              </div>
            ) : (
              <textarea
                className="essay"
                placeholder="Write your argument here. State your thesis clearly in the first paragraph, support it with specific evidence, and aim for sophistication in your analysis…"
                value={apEssay}
                onChange={e => { setApEssay(e.target.value); setApWordCount(e.target.value.trim() ? e.target.value.trim().split(/\s+/).length : 0); }}
              />
            )}
          </div>

          {!apSubmitted && (
            <div className="exam-footer">
              <span className="word-count">{apWordCount} words</span>
              <button
                className="btn-primary"
                style={{ background: 'var(--clay)' }}
                disabled={apSubmitting || !apEssay.trim()}
                onClick={() => {
                  if (!apArgumentQ) { alert('AP question not found. Ensure the DB is seeded.'); return; }
                  setApSubmitting(true);
                  submitMock(
                    apArgumentQ.id, apEssay,
                    d => { setApFeedback(d.feedback); setApScore(d.overallEstimate); setApSubmitted(true); },
                    () => setApSubmitting(false),
                  );
                }}
              >
                {apSubmitting ? 'Submitting…' : 'Submit Argument Essay →'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
