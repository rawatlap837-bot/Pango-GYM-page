# Agent instructions (landing page builder with self-learning memory)

You build landing pages for me with React, Vite and Tailwind CSS v4.
You also keep my memory notebook up to date AUTOMATICALLY. I should never have to paste a prompt to make you save a lesson.

## Memory vault

My memory lives in the folder `LandingPageBrain`.

- Normal location: `../LandingPageBrain` (a sibling folder of this project).
- If that path is not readable, look for a copy in `./agent-memory/`.
- If neither can be read, STOP and tell me. Do not build without memory.

## 1. Before writing any code (always)

1. Read every file in `LandingPageBrain/playbook/`.
2. Read `LandingPageBrain/mistakes.md`. Do not repeat anything logged there.
3. Review the entire design library automatically on every build. Read every Markdown note in `LandingPageBrain/references/`, inventory every PNG in `LandingPageBrain/references/Assets/`, and visually inspect every available reference PNG with the `view_image` tool before designing. Match screenshots to notes by their `Image:` paths; notes without a screenshot are text-only and must not be treated as visual evidence. For very tall screenshots, inspect the full page and readable crops of the hero, middle sections, and final CTA as needed. Compare all references, identify recurring design patterns and useful standout ideas, then create one coherent page direction using the patterns that fit this client’s audience, offer, brand, and goal. Do not cram every section or style from every reference into one page. A named reference note in the brief is an optional emphasis, not required to trigger reference review. Never copy reference business wording, logos, statistics, or proprietary photos. Do this automatically; do not ask the user to analyze screenshots or run a separate prompt.
4. Look in `LandingPageBrain/components/` for reusable sections before writing new ones.
5. Reply with a 5-line summary of the rules you will follow, then build.

## 2. Project rules

- Follow `playbook/stack.md` exactly. Tailwind is v4: styles come from `@import 'tailwindcss';` and `@theme` in `src/index.css`. Do NOT create `tailwind.config.js` or a PostCSS config.
- All text, links, prices, stats and image paths live in `src/content.js`. Components only read from it.
- One file per section in `src/components/`. Use `Button.jsx` for every button.
- Do not add libraries unless the brief asks for them.
- Never invent facts (prices, phone numbers, testimonials, stats). Use clear placeholders.

## 3. AUTOMATIC LEARNING (do this without being asked)

### 3a. Log mistakes the moment they happen

A mistake is any of these:

- I correct or complain about something ("button too small", "wrong color", "text is cut off").
- `npm run build` fails, or you find and fix your own bug.
- A checklist item is FAIL and you had to fix it.

After you FIX it, immediately update `LandingPageBrain/mistakes.md`:

1. Search the file for the same mistake first.
2. If it already exists: increase "Times repeated" by 1. Do not add a duplicate.
3. If it is new: append a new entry at the bottom (before "Pending promotions") using the format in `LandingPageBrain/templates/mistake-entry.md`: What happened, Why it happened, Rule to prevent it, Times repeated: 1. Source: BUILD. Status: ACTIVE. Use the next number in the quick index and add a row to the index table.
4. Make the entry specific and checkable. No vague rules like "be careful".
5. Only log mistakes that could happen on ANY page. Client-specific taste ("this client likes blue") goes in the project note, NOT in mistakes.md.

### 3b. Promote repeated mistakes

When "Times repeated" reaches 2 or more:

1. Add ONE short rule line to the best playbook file (`stack.md`, `design-rules.md`, `responsive-rules.md`, `copy-rules.md` or `checklist.md`).
2. Set the entry's Status to PROMOTED.
3. Tell me which file you changed.

### 3c. Save good work

When I say a section is good ("great", "perfect", "love this", "keep this"):

1. Save its code in `LandingPageBrain/components/` as a note named after the section (for example `hero-split-image.md`).
2. Include: what it is, when to use it, the code, and the `content.js` shape it expects.
3. Skip if a note for the same section already exists; update it only if the new version is clearly better.

### 3d. When I say "done" (also "finish", "wrap up", "deliver")

1. Run `npm run build` and the checklist in `playbook/checklist.md`; report PASS or FAIL for each item.
2. Search the project for leftover placeholders (`Brand Name`, `Feature one`, `Question one`, `0000000000`, `hero-placeholder`) and list them.
3. Update the project note in `LandingPageBrain/projects/` (create it from `templates/project-note.md` if missing): brief summary, reference used, key decisions, what went wrong, what was learned, and the placeholders still open.
4. Make sure every mistake from this session is in `mistakes.md` (step 3a) and every praised section is saved (step 3c).
5. Finish with a short "Memory updated" report (see below).

### 3e. Report every memory change

After any memory change, print ONE short line, for example:
`Memory updated: mistakes.md (+1 new: hero image gap), playbook/responsive-rules.md (promoted rule), components/hero-split-image.md (saved)`
Never change memory silently.

## 4. Memory safety rules

- Only add or edit what steps 3a to 3d describe. Never delete notes, entries or files.
- Do not rewrite or reformat whole files. Add or edit the smallest part needed.
- Keep entries short (under about 10 lines). Do not paste long code into mistakes.md.
- If you are unsure whether something is a real, repeatable mistake, ask me in one short question before logging it.
- If a memory file cannot be written, tell me and continue the work.
- The monthly cleanup is only done when I say "cleanup memory": then list duplicates and outdated notes and wait for my approval before changing anything.

## 5. When you finish any build (always)

1. Run `npm run build` and fix every error.
2. Go through `playbook/checklist.md`. Report each item as PASS or FAIL with a short reason.
3. List any assumptions you made and anything you could not check.
