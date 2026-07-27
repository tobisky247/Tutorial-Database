# Exam Mastery Platform — Design System & Prototype Reference

**Purpose:** Reference for the build agent. Defines the visual design system (tokens, type, layout patterns, components) and provides a working HTML/CSS/JS reference implementation of three core screens. Apply this system to every screen in the product, not just the three shown here.

**Companion docs:** `exam_mastery_platform_prd_phase1.md` (product/technical spec), `content_brief_ielts_ap.md` (content guidelines).

---

## 1. Design direction

The product's subject is language under scrutiny — passages that get read closely, essays that get marked, speech that gets scored. The design leans into that directly rather than defaulting to a generic SaaS dashboard look.

**Feel:** calm, precise, quietly encouraging — like a good tutor's handwriting in the margin. Not gamified, not clinical.

**Signature pattern — the margin rail:** a slim persistent column beside main content carrying context (timer, skill tag, progress) — like annotating a real page. Reused across lesson, practice, and dashboard screens.

**Signature pattern — the mark:** correct/incorrect feedback uses a hand-drawn-style underline (correct) or strikethrough (incorrect) stroke instead of generic check/cross icons, evoking a teacher's pen. Used sparingly — not on every UI element, only where a response is being evaluated.

---

## 2. Design tokens

### Color

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F6F5F1` | App background |
| `--paper-raised` | `#FFFFFF` | Cards, inputs |
| `--ink` | `#1C2B45` | Primary text, headings |
| `--ink-soft` | `#55627A` | Secondary text |
| `--ink-faint` | `#8A93A6` | Tertiary/meta text |
| `--rule` | `#DEDACE` | Borders, dividers |
| `--rule-soft` | `#EAE7DD` | Subtle fills (progress tracks, explanation boxes) |
| `--forest` | `#2F6B57` | Primary accent — progress, correctness, primary actions |
| `--forest-soft` | `#E4EEE9` | Forest tint for backgrounds/tags |
| `--clay` | `#A8652E` | Secondary accent — flags, highlights, "needs work" states |
| `--clay-soft` | `#F3E7D8` | Clay tint |
| `--brick` | `#A8402F` | Error/incorrect states only |
| `--brick-soft` | `#F5E3DF` | Brick tint |

Do not introduce new accent colors without checking against this palette first. Do not use `--brick` for anything other than genuine errors/incorrect answers — it should stay rare enough to carry weight when it appears.

### Type

| Role | Family | Notes |
|---|---|---|
| Display / headings / passage text | **Fraunces** (serif, variable) | Weight 400–600. Used for anything the student reads as content — lesson text, reading passages, essay prompts, headings. |
| UI / body | **Public Sans** | Weight 400–700. All interface chrome — buttons, labels, navigation, form text. |
| Utility / data | **IBM Plex Mono** | Weight 400–500. Timers, scores, band numbers, tags, IDs — anything numeric or system-like. |

Google Fonts import used in the prototype:
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Layout

- Base radius: `10px` for cards/inputs, `8px` for buttons, `999px` for pills/tags.
- Shadow: `0 1px 2px rgba(28,43,69,0.04), 0 4px 16px rgba(28,43,69,0.05)` — used sparingly, only on raised cards.
- Content max-width: `1080px` for dashboard-style screens, `720px` for reading/writing-focused screens (narrower measure for long-form text).
- The margin rail is `220px` wide, right-hand side, separated by a `1px solid var(--rule)` divider — not a shadow or card boundary.

### Motion & accessibility floor

- Respect `prefers-reduced-motion`.
- All interactive elements need visible `:focus-visible` outlines (`2px solid var(--forest)`, `2px` offset) — already implemented in the prototype's base styles.
- Responsive breakpoint at `720px`: margin rail collapses to a horizontal strip above/below content; card grids go to single column.

---

## 3. Component patterns

- **Tags/pills** — mono font, small caps-style uppercase for labels (`rail-label`), pill-shaped for status/skill tags (`.tag`, `.pill`).
- **Progress bars** — `6px` height, `4px` radius, forest fill by default, clay fill when a skill needs attention (see dashboard skill rows).
- **Cards** — white on paper background, `1px solid var(--rule)` border, `10px` radius, subtle shadow only.
- **Primary action** — solid forest button, white text, `8px` radius.
- **Secondary/ghost action** — transparent, `1px` rule border, ink text.
- **Correct/incorrect answer options** — correct gets forest border + forest-soft fill + underline stroke; incorrect (if shown, e.g. after submission) gets a strikethrough stroke; unselected options stay neutral.
- **Timers** — always mono font, always ink color by default (not alarming). Reserve red/brick treatment for the final ~2 minutes of a timed section only — the calm default is deliberate, this is an anxiety-prone context.

---

## 4. Reference implementation

Full working HTML/CSS/JS for three screens — Dashboard, Reading Practice, and a Mock Exam Writing screen — is provided below. This demonstrates the system in use; extend the same tokens and patterns to Listening, Speaking, Lesson player, AP screens, and Admin, rather than inventing a new visual language per screen.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exam Mastery — Design Prototype</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --paper: #F6F5F1;
    --paper-raised: #FFFFFF;
    --ink: #1C2B45;
    --ink-soft: #55627A;
    --ink-faint: #8A93A6;
    --rule: #DEDACE;
    --rule-soft: #EAE7DD;
    --forest: #2F6B57;
    --forest-soft: #E4EEE9;
    --clay: #A8652E;
    --clay-soft: #F3E7D8;
    --brick: #A8402F;
    --brick-soft: #F5E3DF;
    --radius: 10px;
    --shadow: 0 1px 2px rgba(28,43,69,0.04), 0 4px 16px rgba(28,43,69,0.05);
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: 'Public Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, .display {
    font-family: 'Fraunces', serif;
    font-weight: 500;
    letter-spacing: -0.01em;
    margin: 0;
  }

  .mono {
    font-family: 'IBM Plex Mono', monospace;
  }

  a { color: inherit; }

  button {
    font-family: inherit;
    cursor: pointer;
  }
  button:focus-visible, a:focus-visible {
    outline: 2px solid var(--forest);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }

  /* ---------- Proto chrome (not part of the product UI) ---------- */
  .proto-note {
    background: var(--ink);
    color: var(--paper);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    padding: 8px 20px;
    text-align: center;
    letter-spacing: 0.02em;
  }
  .tabs {
    display: flex;
    justify-content: center;
    gap: 4px;
    padding: 14px;
    background: var(--paper-raised);
    border-bottom: 1px solid var(--rule);
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .tab {
    border: none;
    background: transparent;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ink-soft);
  }
  .tab.active {
    background: var(--forest-soft);
    color: var(--forest);
  }
  .screen { display: none; }
  .screen.active { display: block; }

  /* ---------- Shared app chrome ---------- */
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 28px;
    border-bottom: 1px solid var(--rule);
    background: var(--paper-raised);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Fraunces', serif;
    font-size: 19px;
    font-weight: 600;
  }
  .brand-mark {
    width: 26px; height: 26px;
    border-radius: 7px;
    background: var(--forest);
    color: var(--paper);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
    font-family: 'IBM Plex Mono', monospace;
  }
  .header-right { display: flex; align-items: center; gap: 18px; }
  .pill {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--ink-soft);
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: 4px 10px;
    border-radius: 999px;
  }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--clay-soft); color: var(--clay);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; font-family: 'IBM Plex Mono', monospace;
  }

  /* ---------- Margin rail (signature element) ---------- */
  .with-rail {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 32px;
    max-width: 1080px;
    margin: 0 auto;
    padding: 32px 28px 80px;
  }
  .rail {
    border-left: 1px solid var(--rule);
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .rail-block { font-size: 13px; }
  .rail-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ink-faint);
    margin-bottom: 6px;
  }
  .rail-value {
    font-family: 'Fraunces', serif;
    font-size: 15px;
    color: var(--ink);
  }
  .rail-note {
    background: var(--clay-soft);
    border-radius: var(--radius);
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.5;
    color: #6B4322;
    position: relative;
  }
  .rail-note::before {
    content: "";
    position: absolute;
    left: -21px; top: 16px;
    width: 20px; height: 1px;
    background: var(--rule);
  }

  /* ---------- Dashboard ---------- */
  .greeting { color: var(--ink-soft); font-size: 15px; margin-bottom: 4px; }
  .greeting-name { font-size: 26px; margin-bottom: 24px; }

  .exam-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
  .exam-card {
    background: var(--paper-raised);
    border: 1px solid var(--rule);
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);
  }
  .exam-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .exam-name { font-size: 15px; font-weight: 700; }
  .exam-sub { font-size: 12.5px; color: var(--ink-soft); }
  .band {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 28px;
    color: var(--forest);
    line-height: 1;
  }
  .band-label { font-size: 11px; color: var(--ink-faint); margin-top: 2px; }
  .bar-track { height: 6px; background: var(--rule-soft); border-radius: 4px; overflow: hidden; margin-top: 4px; }
  .bar-fill { height: 100%; background: var(--forest); border-radius: 4px; }
  .skill-row { display: flex; align-items: center; gap: 10px; font-size: 12.5px; margin-top: 8px; }
  .skill-row span:first-child { width: 64px; color: var(--ink-soft); }
  .skill-row .bar-track { flex: 1; }

  .continue-card {
    background: var(--ink);
    color: var(--paper);
    border-radius: var(--radius);
    padding: 22px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }
  .continue-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.06em; color: #9FB3A8; text-transform: uppercase; margin-bottom: 6px; }
  .continue-title { font-family: 'Fraunces', serif; font-size: 19px; margin-bottom: 3px; }
  .continue-sub { font-size: 13px; color: #B7BFCF; }
  .btn-primary {
    background: var(--forest);
    color: #fff;
    border: none;
    padding: 11px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
  }
  .btn-ghost {
    background: transparent;
    border: 1px solid var(--rule);
    color: var(--ink);
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
  }

  .section-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ink-faint);
    margin-bottom: 12px;
  }

  .rec-list { display: flex; flex-direction: column; gap: 10px; }
  .rec-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--paper-raised);
    border: 1px solid var(--rule);
    border-radius: var(--radius);
    padding: 14px 16px;
  }
  .rec-title { font-size: 14px; font-weight: 600; margin-bottom: 3px; }
  .rec-reason { font-size: 12.5px; color: var(--ink-soft); }

  /* ---------- Practice / Lesson screen ---------- */
  .passage-wrap { max-width: 680px; }
  .passage-meta { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; }
  .tag { font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 3px 9px; border-radius: 999px; background: var(--forest-soft); color: var(--forest); }
  .passage-title { font-size: 24px; margin-bottom: 14px; }
  .passage-text { font-family: 'Fraunces', serif; font-size: 17px; line-height: 1.7; color: var(--ink); }
  .passage-text p { margin: 0 0 16px; }

  .question-block {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--rule);
  }
  .q-number { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-faint); margin-bottom: 8px; }
  .q-text { font-size: 15.5px; font-weight: 600; margin-bottom: 14px; }
  .option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border: 1px solid var(--rule);
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 14.5px;
    background: var(--paper-raised);
  }
  .option-mark {
    width: 20px; height: 20px; border-radius: 50%;
    border: 1.5px solid var(--rule);
    flex-shrink: 0;
  }
  .option.correct { border-color: var(--forest); background: var(--forest-soft); }
  .option.correct .option-mark { border-color: var(--forest); background: var(--forest); position: relative; }
  .option.incorrect { position: relative; }
  .option.incorrect .option-mark { border-color: var(--brick); }
  .strike {
    position: absolute;
    left: 44px; right: 14px; top: 50%;
    height: 1.6px;
    background: var(--brick);
    opacity: 0.55;
    transform: rotate(-0.6deg);
  }
  .underline-mark {
    position: absolute;
    left: 44px; right: 14px; bottom: 8px;
    height: 2px;
    background: var(--forest);
    border-radius: 2px;
    transform: rotate(0.4deg);
  }
  .explanation {
    margin-top: 12px;
    font-size: 13.5px;
    color: var(--ink-soft);
    background: var(--rule-soft);
    padding: 12px 14px;
    border-radius: 8px;
    line-height: 1.55;
  }

  /* ---------- Mock exam screen ---------- */
  .exam-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 28px;
    background: var(--paper-raised);
    border-bottom: 1px solid var(--rule);
  }
  .exam-progress-dots { display: flex; gap: 6px; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--rule); }
  .dot.done { background: var(--forest); }
  .dot.now { background: var(--clay); }
  .timer-block { text-align: right; }
  .timer { font-family: 'IBM Plex Mono', monospace; font-size: 20px; color: var(--ink); }
  .timer-label { font-size: 10.5px; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.06em; }
  .exam-body { max-width: 720px; margin: 0 auto; padding: 40px 28px 100px; }
  .exam-instructions { font-size: 13px; color: var(--ink-soft); margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--rule); }
  .exam-footer {
    position: sticky; bottom: 0;
    background: var(--paper-raised);
    border-top: 1px solid var(--rule);
    padding: 14px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .word-count { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: var(--ink-faint); }
  textarea.essay {
    width: 100%;
    min-height: 260px;
    border: 1px solid var(--rule);
    border-radius: var(--radius);
    padding: 16px;
    font-family: 'Fraunces', serif;
    font-size: 16px;
    line-height: 1.7;
    color: var(--ink);
    resize: vertical;
    background: var(--paper-raised);
  }
  textarea.essay:focus-visible { outline: 2px solid var(--forest); outline-offset: 2px; }

  @media (max-width: 720px) {
    .with-rail { grid-template-columns: 1fr; }
    .rail { border-left: none; border-top: 1px solid var(--rule); padding-left: 0; padding-top: 20px; flex-direction: row; flex-wrap: wrap; }
    .exam-cards { grid-template-columns: 1fr; }
    .continue-card { flex-direction: column; align-items: flex-start; gap: 14px; }
  }
</style>
</head>
<body>

<div class="proto-note">DESIGN PROTOTYPE — reference for build agent, not production content</div>
<div class="tabs">
  <button class="tab active" onclick="showScreen('dashboard', this)">Dashboard</button>
  <button class="tab" onclick="showScreen('practice', this)">Reading Practice</button>
  <button class="tab" onclick="showScreen('mock', this)">Mock Exam — Writing</button>
</div>

<!-- ============ DASHBOARD ============ -->
<div class="screen active" id="dashboard">
  <div class="app-header">
    <div class="brand"><span class="brand-mark">E</span> Exam Mastery</div>
    <div class="header-right">
      <span class="pill">42-day streak</span>
      <div class="avatar">SN</div>
    </div>
  </div>

  <div class="with-rail">
    <div>
      <div class="greeting">Welcome back</div>
      <h1 class="greeting-name">Good morning, Sena</h1>

      <div class="exam-cards">
        <div class="exam-card">
          <div class="exam-card-top">
            <div>
              <div class="exam-name">IELTS Academic</div>
              <div class="exam-sub">Target: Band 7.0 · Exam in 34 days</div>
            </div>
            <div style="text-align:right">
              <div class="band">6.5</div>
              <div class="band-label">estimated overall</div>
            </div>
          </div>
          <div class="skill-row"><span>Listening</span><div class="bar-track"><div class="bar-fill" style="width:78%"></div></div></div>
          <div class="skill-row"><span>Reading</span><div class="bar-track"><div class="bar-fill" style="width:70%"></div></div></div>
          <div class="skill-row"><span>Writing</span><div class="bar-track"><div class="bar-fill" style="width:52%; background:var(--clay)"></div></div></div>
          <div class="skill-row"><span>Speaking</span><div class="bar-track"><div class="bar-fill" style="width:64%"></div></div></div>
        </div>

        <div class="exam-card">
          <div class="exam-card-top">
            <div>
              <div class="exam-name">AP English Language</div>
              <div class="exam-sub">Target: Score 4 · Exam in 112 days</div>
            </div>
            <div style="text-align:right">
              <div class="band">3</div>
              <div class="band-label">estimated composite</div>
            </div>
          </div>
          <div class="skill-row"><span>MCQ</span><div class="bar-track"><div class="bar-fill" style="width:66%"></div></div></div>
          <div class="skill-row"><span>Synthesis</span><div class="bar-track"><div class="bar-fill" style="width:48%; background:var(--clay)"></div></div></div>
          <div class="skill-row"><span>Rhet. analysis</span><div class="bar-track"><div class="bar-fill" style="width:58%"></div></div></div>
          <div class="skill-row"><span>Argument</span><div class="bar-track"><div class="bar-fill" style="width:61%"></div></div></div>
        </div>
      </div>

      <div class="continue-card">
        <div>
          <div class="continue-eyebrow">Continue learning</div>
          <div class="continue-title">Writing Task 2 — Opinion Essays</div>
          <div class="continue-sub">Module 3 of 6 · IELTS Academic · ~18 min left</div>
        </div>
        <button class="btn-primary">Continue →</button>
      </div>

      <div class="section-label">Recommended next</div>
      <div class="rec-list">
        <div class="rec-item">
          <div>
            <div class="rec-title">Coherence &amp; Cohesion drill — linking devices</div>
            <div class="rec-reason">Your last 3 Writing Task 2 attempts scored lowest on this criterion</div>
          </div>
          <button class="btn-ghost">Start</button>
        </div>
        <div class="rec-item">
          <div>
            <div class="rec-title">AP Synthesis: using visual sources</div>
            <div class="rec-reason">Diagnostic flagged this as a weak area, not yet practised</div>
          </div>
          <button class="btn-ghost">Start</button>
        </div>
      </div>
    </div>

    <div class="rail">
      <div class="rail-block">
        <div class="rail-label">Mock readiness</div>
        <div class="rail-value">Not yet ready</div>
      </div>
      <div class="rail-block">
        <div class="rail-label">This week</div>
        <div class="rail-value">3h 40m studied</div>
      </div>
      <div class="rail-note">
        Your Writing scores have moved fastest when practice is timed. Try one timed Task 2 this week.
      </div>
    </div>
  </div>
</div>

<!-- ============ PRACTICE / READING ============ -->
<div class="screen" id="practice">
  <div class="app-header">
    <div class="brand"><span class="brand-mark">E</span> Exam Mastery</div>
    <div class="header-right">
      <span class="pill">Untimed practice</span>
      <div class="avatar">SN</div>
    </div>
  </div>

  <div class="with-rail">
    <div class="passage-wrap">
      <div class="passage-meta">
        <span class="tag">Reading</span>
        <span class="tag" style="background:var(--clay-soft); color:var(--clay)">Moderate</span>
      </div>
      <h2 class="passage-title">Urban Beekeeping and Wild Pollinators</h2>
      <div class="passage-text">
        <p>Urban beekeeping has grown rapidly in cities over the past decade, driven partly by concern over declining pollinator populations. Municipal governments in several countries have relaxed zoning restrictions that once prohibited hives within city limits, and community groups now run beekeeping courses aimed at first-time hobbyists.</p>
        <p>Researchers remain divided, however, on whether concentrating large numbers of managed honeybee colonies in small urban areas actually benefits wild pollinator species or instead increases competition for limited forage. Some studies suggest that in floral-scarce districts, high hive density can measurably reduce the foraging success of native bee species.</p>
      </div>

      <div class="question-block">
        <div class="q-number">Question 4 of 13</div>
        <div class="q-text">Do the following statements agree with the claims of the writer? Researchers agree that urban beekeeping helps wild pollinator populations.</div>
        <div class="option incorrect"><div class="option-mark"></div> True<div class="strike"></div></div>
        <div class="option correct"><div class="option-mark"></div> False<div class="underline-mark"></div></div>
        <div class="option"><div class="option-mark"></div> Not Given</div>
        <div class="explanation">The passage states researchers "remain divided" on this question — this directly contradicts a claim of agreement, which makes the statement <strong>False</strong> rather than Not Given.</div>
      </div>
    </div>

    <div class="rail">
      <div class="rail-block">
        <div class="rail-label">Skill</div>
        <div class="rail-value">Reading — T/F/NG</div>
      </div>
      <div class="rail-block">
        <div class="rail-label">Progress</div>
        <div class="rail-value">4 / 13</div>
      </div>
      <div class="rail-block">
        <div class="rail-label">Accuracy so far</div>
        <div class="rail-value mono" style="font-family:'IBM Plex Mono',monospace;">75%</div>
      </div>
    </div>
  </div>
</div>

<!-- ============ MOCK EXAM — WRITING ============ -->
<div class="screen" id="mock">
  <div class="exam-header">
    <div>
      <div class="pill" style="margin-bottom:6px; display:inline-block;">IELTS Academic — Full Mock</div>
      <div class="exam-progress-dots">
        <div class="dot done"></div><div class="dot done"></div><div class="dot done"></div><div class="dot now"></div>
      </div>
    </div>
    <div class="timer-block">
      <div class="timer">32:14</div>
      <div class="timer-label">Writing Task 2</div>
    </div>
  </div>

  <div class="exam-body">
    <div class="exam-instructions">
      Write at least 250 words. You have 40 minutes for this task. This is a practice estimate — results are not an official IELTS score.
    </div>
    <h3 style="font-size:18px; margin-bottom:18px;">Some people believe that governments should invest primarily in public transportation rather than road infrastructure for private vehicles. To what extent do you agree or disagree? Give reasons for your answer and include relevant examples.</h3>

    <textarea class="essay" placeholder="Start writing your response here…"></textarea>
  </div>

  <div class="exam-footer">
    <span class="word-count">214 words</span>
    <button class="btn-primary">Submit Task 2 →</button>
  </div>
</div>

<script>
  function showScreen(id, btn) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
  }
</script>

</body>
</html>
```

---

## 5. Extension notes for screens not shown

- **Listening/Speaking screens** need an audio player component and a recording waveform component — style these with the same forest/clay/ink palette; a mono-font elapsed-time readout fits the existing timer pattern.
- **Lesson player** (multi-block content) should use the margin rail for "estimated time remaining" and bookmark state, matching the practice screen's rail usage.
- **Admin/CMS screens** can use a plainer, denser variant of the same tokens (tighter spacing, no need for the marginalia motif) — internal tooling doesn't need the same warmth as the student-facing product, but should still draw from the same palette and type roles for consistency.
- **AP-specific screens** (MCQ passage sets, essay FRQ writer) reuse the reading-practice and mock-exam-writing patterns shown here directly — no new pattern needed.
