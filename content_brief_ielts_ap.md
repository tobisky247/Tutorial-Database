# Content Brief: Item-Writing Guidelines, Rubrics & Style Guide
## For IELTS Academic and AP English Language and Composition

**Audience:** Content writers, item writers, and reviewers producing lessons, questions, and mock exams for the Exam Mastery Platform.
**Status:** Working spec — pairs with the Phase 1 build PRD.

---

# 1. Purpose and the one rule that overrides everything else

Every writer on this project needs to internalise one constraint before anything else:

> **Nothing in this platform may be copied, closely paraphrased, or reconstructed from a real IELTS or AP test — including retired ones, leaked ones, or ones found on prep websites.**

This isn't caution for its own sake. IELTS content is owned by the British Council, IDP, and Cambridge Assessment English. AP content is owned by the College Board. Both organisations actively enforce copyright against prep companies, and reconstructing "what a real passage was about" closely enough that it reads as the same text is still infringement even without literal copy-paste.

What's required instead: **content that is structurally authentic — same format, timing, difficulty, and cognitive demand — but substantively original.** A writer should be able to study the *pattern* of a real exam (freely available from official sources: format guides, sample question *types*, published rubrics) and then write a brand-new passage, prompt, or item that tests the same skill in a different context.

---

# 2. Sourcing rules (what's safe, what isn't)

| Source | Safe to use? | Notes |
|---|---|---|
| Official format/spec pages (ielts.org, apcentral.collegeboard.org) | Yes | Use for structure, timing, weighting only — never copy example passages/prompts shown there |
| Public domain texts (pre-1929 US works, government reports, many historical speeches) | Yes, with adaptation | Good raw material for reading passages if edited for length/level and cited |
| Creative Commons–licensed journalism, essays, reports | Yes, if licence permits adaptation and commercial use — check licence terms per source | Verify licence type; CC BY-NC is not usable in a paid product |
| Commissioned original writing (freelance writers, in-house writers) | Yes — this should be the majority source | Preferred default. Full ownership, no licence risk |
| Retired official test papers, "leaked" papers, prep-site "practice tests" that mirror real ones | **No** | Even if labelled "practice," these are frequently near-verbatim copies of real content |
| AI-generated passages/questions | Yes, as a drafting aid, with mandatory human review | Treat as a first draft only — check for accidental resemblance to known real texts, factual accuracy, and tone |

**Every content item must record a provenance note** at creation: original / adapted-from-public-domain / adapted-from-licensed-source (with licence type and source URL) / AI-drafted-then-edited. This maps directly to the `copyright and licence record` field already in the question bank schema (§13 of the Phase 1 PRD) — don't skip it, even under deadline pressure.

---

# 3. Style guide (applies across both exams)

- **Tone:** clear, neutral, encouraging. Never condescending, never falsely urgent ("Only 3 questions left before you MASTER this!").
- **Terminology consistency:** use the same term for the same concept everywhere (e.g., always "band score" for IELTS, never mix with "score" or "grade"; always "FRQ" or "free-response question" for AP, not "essay question" in some places and "written task" in others).
- **Reading level:** instructions and explanations should be written more simply than the exam content itself — a student struggling with a passage shouldn't also struggle to understand the instructions.
- **Explanations, not verdicts:** every answer explanation states *why* the correct answer is correct and, where useful, why the strongest distractor is tempting but wrong. "Correct answer: B" alone is never sufficient.
- **No exam-specific jargon left unexplained on first use** (e.g., first mention of "Task Achievement" in an IELTS lesson should briefly define it).
- **Numerals and units:** follow en-GB conventions per the platform locale (already set in the master PRD) — but note AP content should still use US spelling/conventions where it reflects authentic AP source material (e.g., quoted historical American texts), flagged inline if it deviates from platform locale.
- **Accessibility in writing, not just markup:** avoid describing images as the sole carrier of meaning ("as shown above" without alt text); write transcripts for every audio item as a first-class deliverable, not an afterthought.

---

# 4. IELTS Academic — item-writing guidelines

## 4.1 Reading

- **Passage length:** 700–900 words per passage, 3 passages per full test (matches real format).
- **Topic range:** general-interest academic topics — science, history, social science, environment, technology. Avoid highly technical jargon that would advantage students from specific academic backgrounds.
- **Question types to cover** (write items across all of these, not just multiple choice): matching headings, True/False/Not Given, Yes/No/Not Given, matching information, sentence completion, summary completion, multiple choice, matching features, diagram/flow-chart labelling.
- **Difficulty progression:** Passage 1 easiest, Passage 3 hardest — mirror this within practice sets too, not just full mocks.
- **Distractor design:** for True/False/Not Given items, "Not Given" distractors should be genuinely ambiguous from the text, not just "info not mentioned at all" — this is the hardest question type for students and needs care.

## 4.2 Listening

- **4 sections, 40 questions total**, increasing difficulty: Section 1 (everyday conversation, e.g. booking/registration), Section 2 (monologue, e.g. a talk about a facility), Section 3 (academic discussion, 2–4 speakers), Section 4 (academic lecture, monologue).
- **Scripts must be written for natural spoken English**, not read-aloud written English — include false starts, self-corrections, and natural discourse markers where authentic, since real IELTS audio does this.
- **Accent range:** commission recordings across British, Australian, New Zealand, and North American accents — don't default to one accent for all content.
- **One-listen constraint:** items must be answerable from a single listen (as in the real test) — pilot-test scripts by having someone unfamiliar with the answers listen once and attempt the items.

## 4.3 Writing

- **Task 1:** data-description prompts (bar/line/pie charts, tables, maps, process diagrams). Data must be invented but plausible and internally consistent (a common item-writing failure is charts whose numbers don't actually add up). Target: 150+ words, 20 minutes.
- **Task 2:** essay prompts covering opinion, discussion, problem/solution, and advantages/disadvantages types. Target: 250+ words, 40 minutes. Prompts should be answerable from general knowledge — never require specialist subject knowledge to have an opinion.
- Each prompt needs a written **model answer at Band 7–8 level** and, ideally, an annotated Band 5–6 answer showing common weaknesses, for teaching purposes.

## 4.4 Speaking

- **Part 1** (4–5 min): short questions on familiar topics (home, work, studies, interests).
- **Part 2** (3–4 min): "cue card" — a topic with 3–4 bullet prompts, 1 minute prep, speak for up to 2 minutes.
- **Part 3** (4–5 min): abstract discussion questions extending the Part 2 topic.
- Write prompts as templates with topic variation, since Speaking content needs frequent rotation to stay useful for repeat practice.

## 4.5 IELTS rubric skeleton (original, not copied from official band descriptors)

Use these as the assessed constructs — write fresh descriptive language for each band level rather than reusing official wording:

**Writing:** Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy — each scored 0–9 in 0.5 increments, averaged (Task 2 weighted higher than Task 1).

**Speaking:** Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation — same 0–9 scale.

For each construct, write **your own** band descriptors at 4, 6, 8 (with 5, 7 as implied midpoints) describing observable features — e.g. at Band 6 for Grammatical Range: "Uses a mix of simple and complex sentence forms; some errors occur but rarely impede communication." Reviewers must confirm descriptor language is original phrasing, not copied from IELTS's published descriptors.

---

# 5. AP English Language and Composition — item-writing guidelines

## 5.1 Multiple choice (Section I — 45 questions, 45% of score)

- Passage-based: pair each set of 5–10 questions with an original nonfiction excerpt (400–700 words) — essays, speeches, articles, argumentative prose.
- Two question families to cover: **reading questions** (rhetorical purpose, author's claims, tone, structure) and **"writing" questions** that ask students to evaluate/revise a stimulus text (this is a distinct, newer AP question style — don't only write comprehension questions).
- **Distractor design:** wrong answers should reflect common misreadings (e.g., confusing the author's stated claim with a claim they're refuting), not random unrelated options.

## 5.2 Free-response (Section II — 3 questions, 2h15m incl. 15-min reading period, 55% of score)

- **Synthesis:** provide 6 original short sources (mix of text, and ideally one visual/quantitative source) on a single issue; prompt asks students to build an argument citing at least 3.
- **Rhetorical Analysis:** one original nonfiction passage; prompt asks students to analyse how the writer's choices build their argument/effect.
- **Argument:** a general prompt/claim students argue for or against using their own knowledge and evidence — no source text required, but must be answerable without specialist knowledge.
- Write a **range of scored sample responses** (not just top-scoring ones) for each prompt — high, middle, and low — with annotations, since these are what make feedback calibration possible later.

## 5.3 AP rubric skeleton (original wording, reflecting known assessed constructs)

Each FRQ is scored 0–6 across three dimensions (write fresh descriptive language, don't copy official rubric text):

- **Thesis** (0–1): is there a defensible, clear central claim?
- **Evidence & Commentary** (0–4): quality and specificity of evidence, and depth of the writer's own analytical commentary connecting evidence to the argument.
- **Sophistication** (0–1): stylistic and rhetorical sophistication beyond competent execution — nuance, complexity, effective register.

Composite AP score (1–5) is derived from combined MCQ + FRQ performance — phase 1 can use a simple original conversion table (documented and versioned) rather than replicating the College Board's actual (non-public, curve-based) conversion.

---

# 6. Difficulty calibration and tagging

- Tag every item with: skill, sub-skill, question type, and a difficulty label (Foundation/Easy/Moderate/Difficult/Advanced).
- Calibrate difficulty by **pilot response data where possible** (even informal: have 5–10 people at known ability levels attempt items before publishing), not just writer judgement.
- For IELTS, difficulty should map roughly to band range it best discriminates (e.g., an item most useful for separating Band 5 from Band 6 students).
- For AP, difficulty should map to the MCQ correct-response-rate bands used internally for review (rough proxy: easy >75% expected correct, moderate 50–75%, hard <50%).

---

# 7. Review / QA checklist (every item, before publish)

- [ ] Provenance recorded (original / adapted / AI-drafted-then-edited) with source if applicable
- [ ] No resemblance to known real exam content (reviewer should recognise the exam well enough to catch this)
- [ ] Factually accurate (especially data in charts, quoted-style content, historical/scientific claims)
- [ ] Answer key verified independently by someone other than the writer
- [ ] Explanation present and substantive for every item
- [ ] Difficulty tag assigned and justified
- [ ] Accessibility: alt text, transcripts, caption files present for all media
- [ ] Timing is realistic (test it yourself under timed conditions before publishing a full mock)
- [ ] Language/tone matches style guide (§3)
- [ ] For constructed-response items: rubric attached, versioned, and reviewed

Nothing moves from "In review" to "Approved" without every box checked — this is what the Content Reviewer role in the Phase 1 PRD is actually for.

---

# 8. Illustrative original examples

These are original samples written for this brief, meant to model tone/format only — not production-ready content, and not derived from any real test.

### 8.1 IELTS Academic Reading — item type example (True/False/Not Given)

*Sample passage excerpt (original, illustrative only):*

> Urban beekeeping has grown rapidly in cities over the past decade, driven partly by concern over declining pollinator populations. Municipal governments in several countries have relaxed zoning restrictions that once prohibited hives within city limits, and community groups now run beekeeping courses aimed at first-time hobbyists. Researchers remain divided, however, on whether concentrating large numbers of managed honeybee colonies in small urban areas actually benefits wild pollinator species or instead increases competition for limited forage.

*Sample item:*
"Researchers agree that urban beekeeping helps wild pollinator populations."
→ Answer: **False** (the passage states researchers are divided, i.e. explicitly do not agree)

*Explanation model:* "The passage states researchers 'remain divided' on this question — this directly contradicts the claim of agreement, making the statement False rather than Not Given."

### 8.2 IELTS Writing Task 2 — prompt example

> Some people believe that governments should invest primarily in public transportation rather than road infrastructure for private vehicles. To what extent do you agree or disagree?
> Give reasons for your answer and include relevant examples from your own knowledge or experience.
> Write at least 250 words.

### 8.3 IELTS Speaking Part 2 — cue card example

> Describe a skill you learned that you found difficult at first.
> You should say:
> - what the skill was
> - how you learned it
> - why it was difficult
> and explain how you felt once you had learned it.

### 8.4 AP English Language — MCQ passage-based item example

*Sample excerpt (original, illustrative only, ~120 words shown of a longer passage):*

> It has become fashionable to speak of attention as a scarce resource, something to be "spent" or "protected" like a household budget. This metaphor is useful, but it obscures an important difference between money and attention: money, once spent, is simply gone, while attention shapes the very mind that must decide how to spend it next...

*Sample item:*
"The author's use of the household budget comparison primarily serves to"
(A) establish an analogy that the passage will later complicate
(B) mock a viewpoint the author considers naive
(C) provide statistical evidence for the passage's claim
(D) transition to an unrelated discussion of finance

→ Answer: **(A)** — the passage explicitly extends and then complicates the metaphor in the following sentence.

### 8.5 AP English Language — Argument FRQ prompt example

> Public figures — including politicians, celebrities, and business leaders — are increasingly expected to state personal opinions on social and political issues unrelated to their profession.
>
> Write an essay that argues your position on the extent to which public figures should be expected to publicly share their opinions on such issues. Use appropriate evidence to support your argument.

---

# 9. Workflow tie-in

This brief feeds directly into the Phase 1 content pipeline (§13, §19 of the Phase 1 PRD):

1. Writer drafts item/lesson/prompt with provenance note → status: **Draft**
2. Writer self-checks against §7 checklist → submits → status: **In review**
3. Content reviewer applies §7 checklist independently, plus an originality check against known exam content → **Approved** or sent back with notes
4. Content admin schedules/publishes → status: **Published**, version number locked
5. Any later edit creates a new version — published versions used in live attempts are never silently overwritten (per the Phase 1 PRD's architecture rules)

---

# 10. What this brief deliberately does not solve

- It does not replace a subject-matter expert's judgement — someone with real IELTS or AP teaching/examining experience should still spot-check calibration, especially for rubric scoring, before launch.
- It does not cover IELTS General Training, TOEFL, or PTE — this brief extends the same way the platform does, exam by exam, when those are added.
- It does not set volume/deadline targets — that's a production-planning question, not a content-quality one; the Phase 1 PRD's content targets (§7.4, §8.4) set the volume bar.
