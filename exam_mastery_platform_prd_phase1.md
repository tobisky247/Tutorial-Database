# Exam Mastery Platform — Phase 1 Build Specification
## Lean Production Spec: IELTS Academic + AP English Language and Composition

**Document status:** Build specification (Phase 1 of a multi-exam platform)
**Version:** 1.0
**Relationship to full platform vision:** This is not a separate product. It is the first real, complete slice of the platform described in the master PRD, scoped to two exams instead of five. Every architectural decision below must not block adding IELTS General Training, TOEFL iBT, or PTE Academic later without a rebuild.

---

# 1. Purpose and standard for "done"

Phase 1 must ship a **commercially real, complete learning loop** for two exams:

- IELTS Academic
- AP English Language and Composition

"Complete" means the full cycle works end to end for both exams, not partially:

> Diagnose → Learn → Practise → Review → Improve → Simulate → Master

A phase-1 build that has lessons and quizzes but no honest full mock exam and no real feedback has **not** met the bar, even if it's polished. A phase-1 build that only covers one exam has not met the bar either — the point of pairing IELTS and AP is to prove the platform generalises across structurally different exams before adding more.

What is deliberately **not** the bar for phase 1: five exams, an elaborate CMS, multi-currency billing, org accounts, or an advanced ML recommendation engine. Depth over breadth.

---

# 2. What's explicitly out of scope for Phase 1 (and why it's still safe to defer)

| Deferred | Why deferring doesn't block later addition |
|---|---|
| IELTS General Training | Shares Listening/Speaking with Academic; only Reading/Writing content is new. Slots into the existing `exam_pathway` model. |
| TOEFL iBT, PTE Academic | New `exam_family` + `exam_pathway` rows, new question types and scoring config. No schema change if §11 rules are followed. |
| Full-featured CMS (WYSIWYG, workflow automation, bulk import UI) | Phase 1 uses a minimal but real publish/review flow. Content structure is the same either way. |
| Multi-currency billing, coupons, trials | Single price point, single currency, manual comps if needed. Entitlement model is unchanged. |
| Organisation/teacher accounts | Data model reserves the concept (§14) but no UI. |
| Advanced ML-driven recommendations | Phase 1 uses transparent rule-based recommendations. Same recommendation *interface*, simpler *logic* inside it. |
| Search/discovery, notifications beyond essentials, advanced analytics dashboards | Nice-to-have, not core to the learning loop. |

The rule for the build agent: **defer breadth, never defer the honesty of the loop.** If a shortcut would make scoring, feedback, or content provenance less trustworthy, it is not an acceptable way to move faster.

---

# 3. Product principles (carried over, unchanged)

1. **Exam-specific, not generic** — shared platform, but IELTS and AP must not be forced into an identical shape. Their differences (skills covered, scoring scale, timing, task types) are the actual test of the architecture.
2. **Authentic without copying protected material** — all content original or licensed. No official exam material reproduced.
3. **Honest scoring** — every estimated score is labelled as a practice estimate. Never implied as an official result.
4. **Actionable feedback** — specific, not generic ("your topic sentences don't state a clear claim" beats "improve your writing").
5. **Version-controlled formats** — even in phase 1, exam format and scoring config are versioned and dated. This is cheap to do now and expensive to retrofit.
6. **Mobile-accessible, desktop-capable** — writing tasks, reading passages, and full mocks must work well on larger screens; browsing and short practice must work on mobile.

---

# 4. The extensibility contract (read this before building anything)

This section exists because "lean" and "future-proof" pull in opposite directions, and the build agent must resolve that tension the same way every time: **narrow the content and features, never narrow the data model or the assumptions baked into code.**

Hard rules:

1. Every exam-specific concept (skills, question types, scoring dimensions, section structure, timing rules) lives in configuration/data, not in code branches like `if (exam === 'ielts')`.
2. No skill is assumed universal. IELTS has Speaking and Listening; AP has neither. The schema must represent "this exam has these N skills," not assume 4.
3. No single generic numeric `score` field. IELTS uses bands (0–9, in 0.5 steps) across 4 skills plus overall; AP uses a 1–5 composite built from MCQ + 3 rubric-scored essays. Both must be representable without a schema change for exam #3.
4. Question types are a registry, not a fixed enum baked into the UI. IELTS and AP already require different types (e.g. IELTS map-labelling vs AP passage-based rhetorical-analysis MCQ); a new exam should mean adding registry entries, not new code paths through core screens.
5. Entitlements gate access, never plan-name string checks. Adding an exam = adding an entitlement (`exam.toefl`) that a plan can include later.
6. Content review/publish workflow is exam-agnostic. A reviewer approving an AP essay rubric and a reviewer approving an IELTS Writing Task 1 graph-description rubric go through the same states (draft → in review → approved → published).

The build agent should treat "would this decision survive adding TOEFL next quarter" as a running test throughout, even though TOEFL isn't being built now.

---

# 5. Users and roles (trimmed to what phase 1 needs)

## 5.1 Independent student
Primary user. Needs: understand the exam, find current ability, improve weak skills, do timed practice, complete full mocks, get a readiness estimate.

## 5.2 Parent or sponsor
Can purchase a plan and manage billing. Cannot see detailed student performance without student consent. (Full parent dashboard is out of scope; billing access is not.)

## 5.3 Internal roles
- **Super administrator** — full access.
- **Content administrator** — creates/edits lessons, questions, mocks for both exams.
- **Content reviewer** — approves or rejects content before publish. (Can be the same person as content admin in phase 1, but the *workflow state* must still exist — no self-publish without an approval step, even a lightweight one.)
- **Support administrator** — manages users, refunds, support cases.

Analyst role and full permission granularity can wait; role-based access control itself (not the full role catalogue) is required from day one for security reasons (§16).

---

# 6. Information architecture (unchanged from master spec — this is the part that must not be simplified)

```text
Platform
└── Exam family (e.g. IELTS, AP)
    └── Exam pathway (e.g. IELTS Academic)
        └── Format version (dated, versioned)
            └── Course
                └── Stage
                    └── Module
                        └── Lesson
                            ├── Learning blocks
                            ├── Examples
                            ├── Practice sets
                            └── Checkpoint
```

A mock exam belongs to a pathway + format version. It does not need to belong to a course module.

This hierarchy is exactly why IELTS and AP can share a platform without sharing content — and exactly why exam #3 later is a data addition, not a rearchitecture.

---

# 7. IELTS Academic — Phase 1 scope

## 7.1 Skills covered
Listening, Reading, Writing, Speaking — all four, none deferred. A mock exam missing a skill isn't a real mock.

## 7.2 Content areas
- Academic Reading (passages, question types: matching, True/False/Not Given, multiple choice, sentence completion, etc.)
- Academic Writing Task 1 (graphs, charts, tables, maps, processes — at least 3 of these visual types with real content, not all 6 at launch)
- Writing Task 2 (essay)
- Listening (4-section format, real audio, real question types)
- Speaking (3-part format; recorded responses, AI-assisted + rubric feedback)
- Shared foundation content: vocabulary, grammar, pronunciation basics, time management, test-day prep

## 7.3 Reporting
- Per-skill estimated band (Listening, Reading, Writing, Speaking)
- Overall estimated band
- Confidence level (simple version: based on amount of evidence — full multi-factor model can come later)
- Strongest/weakest criteria
- Recommended next lessons

## 7.4 Phase 1 IELTS Academic content targets
- 1 exam overview, 1 diagnostic
- 2 learning stages fully built (Foundation, Exam Ready) — Developing/Mastery stages can be added post-launch without restructuring
- Minimum 4 modules per skill
- Minimum 150 reviewed questions across skills (leaner than the 300 in the master spec, but real and reviewed)
- Minimum 4 timed practice sets per skill
- **At least 1 full mock exam, fully working end to end** — this is non-negotiable; it's the proof the loop is real

---

# 8. AP English Language and Composition — Phase 1 scope

## 8.1 Content covered
- Rhetorical situation, claims and evidence, reasoning and organisation, style, audience and purpose
- Multiple-choice reading and writing analysis
- Three essay types: Synthesis, Rhetorical Analysis, Argument
- Timed free-response practice and full section simulations

## 8.2 Assessment modes
- Topic quizzes, passage-based MCQ sets, untimed essay practice, timed free-response practice, full mock

## 8.3 Reporting
- MCQ performance
- Free-response performance (per rubric dimension, per essay type)
- Estimated composite score (1–5 range with clear "estimate" labelling)
- Confidence level
- Recommended skills and lessons

## 8.4 Phase 1 AP content targets
- 1 course overview, 1 diagnostic
- 2 learning stages fully built
- Minimum 4 modules covering MCQ skills + the 3 essay types
- Minimum 150 reviewed MCQ items
- At least 2 full practice sets per essay type, with model/annotated responses
- **At least 1 full mock exam** (MCQ section + all 3 essay types, timed) — same non-negotiable as IELTS

---

# 9. Learning stages (simplified for phase 1)

Two stages instead of four to start:

- **Foundation** — core concepts, vocabulary/grammar (IELTS) or rhetorical concepts (AP), introductory strategies
- **Exam Ready** — timed practice, mixed question sets, section tests, pacing, full mocks

"Developing" and "Mastery" stages from the master spec are real future additions, not cut features — the course/stage/module schema already supports inserting them later without moving existing content.

---

# 10. Student onboarding

## 10.1 Registration
Email + password, Google sign-in. Email verification, terms + privacy acceptance, age confirmation, separate marketing consent.

## 10.2 Onboarding questions
1. Which exam are you preparing for? (IELTS Academic / AP English Language)
2. Target score
3. Planned exam date
4. Current estimated score (self-reported)
5. Study availability (days/week, time/session)
6. Which skills feel hardest
7. Take a diagnostic now?

## 10.3 Diagnostic
Exam-specific, uses a representative subset of skills, explicitly labelled as an estimate, never blocks access to learning content, produces a baseline and a recommended starting point.

---

# 11. Student dashboard

Display: selected exam, target score, exam date, current estimate, overall progress, streak, recommended next activity, skill summary, recent results, mock readiness, subscription status.

## 11.1 Recommendation logic (phase 1: rule-based, transparent)
Consider: incomplete prerequisites, diagnostic weaknesses, recent mistakes, time since last practice, exam date proximity, repeated low performance. Every recommendation shows a plain-language reason ("Recommended because your last 3 Reading practice sets averaged 55% on inference questions").

A learned/weighted model is a legitimate phase-2 upgrade to the *same* recommendation surface — not a rebuild.

---

# 12. Courses and lessons

## 12.1 Lesson blocks (trimmed set for phase 1)
Heading, rich text, key idea, definition, tip, example, worked example, image, audio, video, transcript, flashcards, knowledge check, fill-in-the-gap, short response, speaking prompt, embedded practice, summary.

(Ordering/matching/comparison/reflection blocks from the master spec are easy additions later; they're not required to make the loop real.)

## 12.2 Lesson behaviour
Autosave, resume from last position, captions/transcripts, adjustable text size, content issue reporting, protection against lost responses. These are cheap to build right the first time and expensive to retrofit — keep them in phase 1.

---

# 13. Question bank

Each question includes: unique ID, exam family, pathway, format version, section, skill, question type, difficulty, prompt, passage/media, correct answer or rubric, explanation, estimated time, mark value, scoring dimensions, status, author, reviewer, version number.

## 13.1 Content statuses (minimal but real workflow)
Draft → In review → Approved → Published → Retired.
(Changes requested / Scheduled / Suspended / Archived from the master spec can be added later without breaking this chain.)

## 13.2 Difficulty values
Foundation, Easy, Moderate, Difficult, Advanced.

---

# 14. Assessment engine

Must support, generically across both exams:
- Objective auto-marking (MCQ, matching, fill-in-the-gap, True/False/Not Given)
- Constructed-response capture (essays, spoken recordings) routed to rubric-based scoring
- Timed sections with server-trusted timing (never trust client-side timers)
- Section-level and full-exam assembly from question pools
- Attempt storage that preserves the exact content and scoring rules used at attempt time, even if content is later edited

This is the component most worth building generically well, since IELTS and AP already exercise very different marking logic (band-per-skill vs composite-from-MCQ-plus-rubrics) — if this layer handles both cleanly, it will handle TOEFL/PTE later.

---

# 15. AI-assisted feedback (simplified from master spec, still honest)

Requirements:
- Exam-specific, versioned rubrics
- Structured, validated output (not free text pasted into a score field)
- Store rubric version, model/prompt version used
- Label all feedback as an estimate
- Detect empty/irrelevant/corrupted responses and flag rather than score
- Administrator override capability
- Audit trail of AI-generated scores

Deferred to later: the full multi-factor confidence-scoring model and automated moderation queue from the master spec. Phase 1 can use a simpler confidence signal (e.g. "based on limited evidence" vs "based on full mock") as long as it's never presented as more certain than it is.

---

# 16. Full mock examinations

Both IELTS Academic and AP need **at least one complete, working full mock** at launch — this is the single clearest proof that the loop is real, not a demo.

Required behaviour: dedicated start screen, device/audio checks (IELTS speaking/listening), clear timing, autosave, recovery from short connection loss, final submission, results report with skill/dimension breakdown, comparison with previous attempts.

Content protection: randomise eligible items, protected media URLs, no sequential public IDs, preserve historical attempt integrity even as the question bank evolves.

---

# 17. Progress and mastery (simplified)

Track: lessons started/completed, practice accuracy, time spent, skill performance, diagnostic baseline, mock history, streaks.

Mastery statuses: Not started, Learning, Developing, Proficient, Mastered, Needs review — driven by recent accuracy, difficulty, and consistency (not completion alone), but the full weighted algorithm from the master spec can start simple and be tuned post-launch. The *statuses and their meaning to the student* should not change later, even if the calculation improves.

---

# 18. Monetisation (deliberately minimal)

- **Free tier**: registration, exam overview, limited foundation lessons, limited diagnostic, limited daily practice
- **Premium (single price point)**: full access to both IELTS Academic and AP — no need to split into per-exam SKUs yet, since there are only two exams
- Monthly and annual subscription only. No coupons, trials, or multi-currency in phase 1 — add when there's a reason to (e.g. a specific market push).
- Entitlements: `exam.ielts.academic`, `exam.ap_language`, `feature.full_mocks`, `feature.ai_feedback` — structured this way from day one so a `exam.toefl` entitlement later is a data row, not new logic.

---

# 19. Admin content management (minimal but real)

Required: create/edit lessons and questions for both exams, submit for review, approve/reject, publish, version history. A basic list-and-form UI is sufficient — rich WYSIWYG block editors, bulk import/export, and workflow automation are legitimate phase-2 additions on top of the same data model.

---

# 20. Data model (kept close to full — this is not the place to cut corners)

## 20.1 Identity and access
users, user_profiles, roles, permissions, role_permissions, user_roles, sessions, consent_records

## 20.2 Exams and curriculum
exam_families, exam_pathways, exam_format_versions, exam_sections, skills, courses, course_stages, modules, lessons, lesson_versions, lesson_blocks

## 20.3 Questions and content
questions, question_versions, question_types, passages, media_assets, rubrics, rubric_versions, rubric_dimensions, scoring_rules

## 20.4 Assessments
assessment_templates, assessment_sections, assessment_items, attempts, attempt_sections, responses, response_files, objective_scores, constructed_response_scores, score_estimates, feedback_records

## 20.5 Learning and progress
lesson_progress, course_enrolments, skill_progress, mastery_records, study_plans, recommendations, diagnostic_profiles

## 20.6 Commerce
products, prices, plans, entitlements, plan_entitlements, subscriptions, payment_transactions, invoices, refunds, payment_webhook_events

## 20.7 Operations
content_reviews, audit_logs, feature_flags, background_jobs

**Every table above must already be exam-family-agnostic** — none should have IELTS- or AP-specific columns. Exam-specific behaviour lives in configuration rows (question_types, scoring_rules, exam_sections), not schema.

---

# 21. API, background jobs, technical architecture (unchanged principles, condensed)

Versioned REST API (`/api/v1/...`) with auth, RBAC, validation, pagination, rate limiting, idempotency on submissions/payments, OpenAPI docs.

Background queue for: email, audio processing, speech transcription, AI feedback, score calculation, media conversion, subscription reconciliation. Must support retry, backoff, dead-letter handling, idempotency.

Architecture rules carried over unchanged from the master spec — these are cheap now, expensive later:
- Do not hard-code exam structures, pricing, or entitlements
- Do not store large media in the relational database
- Do not perform AI scoring inside synchronous web requests
- Do not overwrite published content versions
- Do not trust client-side timers or scores
- Do not use one generic score field for every exam

---

# 22. Security, privacy, accessibility (non-negotiable even in a lean build)

- Secure password hashing, MFA for administrators, RBAC, least privilege
- CSRF/XSS/SQL-injection protection, secure cookies, session expiry, rate limiting
- Signed media URLs, encryption in transit and at rest, secrets management
- Audit logging for content, billing, scoring, and access changes
- Data retention controls, account deletion workflow
- Accessibility: captions/transcripts, keyboard navigation, adjustable text size — required for lessons and mocks, not deferred
- Trademark/disclaimer language: exam names belong to their respective owners, platform is independently produced, scores are estimates — reviewed by legal counsel before launch, including how "IELTS" and "AP" appear in marketing and the product name/domain

---

# 23. Testing requirements

- Automated: unit, integration, API, permission, scoring-rule, payment webhook, autosave, entitlement tests
- End-to-end: registration → onboarding → lesson completion → timed practice → full mock (both exams) → results → upgrade/cancellation → admin publish
- Content QA: every published item reviewed for accuracy, originality, answer validity, explanation quality, difficulty, rubric alignment, copyright status

---

# 24. Phase 1 acceptance criteria

Phase 1 is accepted only when:

1. A student can register, verify email, and complete onboarding for either exam.
2. A student can complete structured lessons through both built stages for IELTS Academic and AP.
3. A student can complete timed practice for every skill in both exams.
4. **A student can complete a full IELTS Academic mock (all 4 skills) and receive a results report with band estimates.**
5. **A student can complete a full AP mock (MCQ + all 3 essays) and receive a results report with composite estimate.**
6. Objective questions are marked correctly; constructed responses receive rubric-based feedback, clearly labelled as estimated.
7. Students see progress, mastery status, and at least rule-based recommendations with reasons.
8. Free and paid entitlements correctly restrict access for both exams.
9. An administrator can create, review, approve, and publish content for both exams through the same workflow.
10. Historical attempts retain the content and scoring version used at the time, even after content updates.
11. Security controls (§22) are implemented and verified.
12. Legal pages, trademark disclaimers, and academic integrity policy are published.
13. No official affiliation with IELTS (British Council/IDP/Cambridge) or AP (College Board) is implied anywhere in the product.
14. The data model contains no IELTS- or AP-specific hard-coding that would block adding a third exam without schema changes.

---

# 25. What "add TOEFL next" looks like, concretely (validation of §4)

To confirm the extensibility contract holds, here's what adding TOEFL iBT *should* require once phase 1 is live, and what it should **not** require:

**Should require:** a new `exam_family`/`exam_pathway` row, new `question_types` and `scoring_rules` entries, new content (lessons, questions, mocks) authored and reviewed through the existing workflow, a new entitlement (`exam.toefl`), and a new section on the marketing site.

**Should not require:** changes to the attempts/responses/scoring schema, changes to the entitlement or billing system's core logic, a new admin workflow, or changes to how the recommendation engine or progress tracking work.

If building TOEFL later would require touching any of the "should not" items, that's a signal something in phase 1 was over-specialised to IELTS/AP and should be revisited before launch, not after.

---

# 26. Summary

Phase 1 ships a real, trustworthy version of the platform's core promise — for two exams chosen specifically because their differences stress-test the architecture — rather than a thin layer across many exams or a deep build of just one. The cut is in breadth of features and content volume, never in the honesty or completeness of the diagnose-to-mastery loop, and never in the parts of the data model that make future exams additive instead of disruptive.
