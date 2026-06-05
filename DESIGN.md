# DESIGN.md — Gingermood Demo Design System
*Goal: the demo must look like a product built by a senior team — OpenUp-calibre — while being unmistakably Gingermood. The brand colours stay; the APPLICATION changes. The whole system hangs on one rule.*

---

## 0. The governing rule: 90 / 7 / 3

- **~90% neutral:** white surfaces on a warm off-white page. Whitespace is the main design material.
- **~7% purple:** as *tints* (pale lavender surfaces) and as a near-black aubergine **ink** for text — the brand lives quietly inside the neutrals.
- **~3% orange:** reserved EXCLUSIVELY for action — primary buttons, progress fill, the match-reveal moment. If orange appears anywhere that isn't an action or progress, remove it.

Violating these proportions recreates the dated service-company look. When in doubt: more white, less colour.

---

## 1. Color tokens (CSS variables / Tailwind config)

```css
/* Brand (estimated from brand assets — optionally verify against the
   Elementor kit in gingermood.com global.css and update in ONE place) */
--gm-orange-500: #F18A00;   /* brand orange — actions only */
--gm-orange-600: #D97300;   /* hover/pressed */
--gm-orange-100: #FDEEDC;   /* rare warm tint (e.g. highlight chip) */
--gm-purple-500: #5E3B8E;   /* brand purple — links, selected states, fit bars */
--gm-purple-700: #46286E;   /* hover on purple elements */
--gm-purple-100: #EFEAF7;   /* lavender tint surface (cards/sections) */
--gm-purple-50:  #F7F4FB;   /* faintest lavender wash */

/* Neutrals & text */
--gm-ink:        #2B2140;   /* headings + primary text: near-black aubergine, NOT #000 */
--gm-text-2:     #6B6380;   /* secondary text */
--gm-bg:         #FAF8F5;   /* page background: warm off-white */
--gm-surface:    #FFFFFF;   /* cards */
--gm-border:     #E9E4F0;   /* hairlines, lavender-tinted */

/* Semantic (sparing) */
--gm-success: #2E7D45;  --gm-error: #C73A2B;
--gm-focus-ring: rgba(241,138,0,0.35);
```

Hard rules: never pure black text; orange never used for body text; orange as text only ≥18px semibold.

---

## 2. Typography

- **Display:** Fraunces — h1/h2/h3 and the coach name. Weight 500–600, letter-spacing −0.01em. Never on buttons, labels, or UI controls.
- **Body/UI:** Source Sans 3 — everything else. 400 body, 600 emphasis/buttons.
- **Scale (iPad-first):** h1 36–40 / h2 28 / h3 22 / body 17–18 / small 15 / micro 13. Line-height 1.2 display, 1.55 body. Body never below 17px — this gets read across a dinner table.

---

## 3. Space, radius, elevation

- 4px grid. Screen padding 24px (portrait) / 32px (landscape). Content column max-width 640px, centered.
- Radius: cards 20px · inputs 14px · buttons & chips fully pill.
- Elevation: borders over shadows. Default card = `--gm-surface` + 1px `--gm-border`. ONE shadow allowed, on the matched-coach card only: `0 8px 24px rgba(43,33,64,0.08)`.

---

## 4. Components

**Primary button** — pill, 52px height, `--gm-orange-500` background, **`--gm-ink` text** (modern, ~7:1 contrast; not white-on-orange), Source Sans 600 17px, hover `--gm-orange-600`, press scale(0.98). Exactly ONE primary button per screen.

**Secondary button** — white, 1.5px `--gm-border`, ink text. **Text link** — `--gm-purple-500`, no underline until hover.

**Answer chips** — pill, `--gm-purple-50` bg, `--gm-purple-700` text; selected = `--gm-purple-500` bg, white text. (Selection is purple; orange stays reserved for the primary action.)

**Input / textarea** — white, 14px radius, 1.5px `--gm-border`; focus = purple border + `--gm-focus-ring`. Placeholder `--gm-text-2`.

**Progress bar** — 6px, track `--gm-purple-100`, fill `--gm-orange-500`, rounded; step count in micro text above.

**Recognition block** (leads the result screen — the emotional moment): `--gm-purple-50` card, 20px radius, 28px padding; text set in **Fraunces 22–24px, `--gm-ink`**, like a calm pull-quote; small caps Source Sans label "What we heard" above in `--gm-text-2`. No icons, no decoration — the words are the design.

**Coach card** — white card; circular avatar (initials on `--gm-purple-100`, never stock photos); name in Fraunces 24; one-line role/experience in `--gm-text-2`; supply tags as small lavender chips; fit score as a number in Fraunces with a thin purple bar.

**Fit breakdown** — thin 4px bars, `--gm-purple-500` fill on `--gm-purple-100` track, micro labels. **Runner-up** — same card at reduced visual weight (no shadow, smaller).

**Behind-the-scenes data view** — collapsed by default; monospace (ui-monospace stack) 13px on `--gm-bg`, syntax-free, subdued. It should look like an engineer's drawer, deliberately contrasting the warm front.

**Icons** — lucide, 1.5px stroke, `--gm-ink` or `--gm-text-2`, 20px. Never emoji, never filled blobs, never orange icons.

---

## 5. Screen patterns

- **Welcome:** generous whitespace, Fraunces h1, one sentence, one primary button, persona quick-picks as secondary cards, mode toggle as micro text bottom corner. No hero image, no illustration.
- **Question screens:** one question per screen. Question in Fraunces h2, centered column; input/chips below; primary button bottom-right; back as text link. Micro-acknowledgement (when present) in `--gm-text-2` italic above the question.
- **Processing:** plain `--gm-bg`, a single calm pulsing dot-trio in purple, one rotating line of micro text. No spinner clichés, no sparkle icons.
- **Result:** order is fixed — recognition block → matched coach card (the only shadow on the page) → fit breakdown → runner-up → behind-the-scenes toggle → reset link. The reveal may use a `--gm-purple-50` page wash; this is the one allowed full-width tint.

---

## 6. Motion

- 200–250ms, ease-out, transform+opacity only. Question transitions: 12px slide + fade.
- Result screen: staggered reveal, 80ms per block, recognition first.
- Match moment: fit bars animate from 0 once; score counts up 400ms. No looping animations. Respect `prefers-reduced-motion`.

---

## 7. Voice & microcopy

Second person, warm, plain, Dutch-direct. No hype ("supercharge", "unlock"), no exclamation marks, no "AI magic" framing — the system is quietly competent. Buttons are verbs ("Continue", "Meet your coach").

---

## 8. Anti-slop list (hard bans)

No gradients (especially purple-on-white heroes). No glassmorphism. No emoji as icons. No Inter/Roboto/system display fonts. No uniform grids of identical cards. No shadow-on-everything. No full-saturation purple or orange section backgrounds. No sparkles/wand iconography. No stock photography. No centered body paragraphs. No more than one primary button per screen.

---

## 9. Acceptance check (eyeball test on iPad)

1. Squint test: the screen is ~90% neutral; orange appears only where you'd tap.
2. The result screen's emotional weight sits on the recognition block, not on decoration.
3. Screenshot next to OpenUp: comparable restraint and polish, but warmer and unmistakably not them.
4. Body text readable at arm's length across a table.
5. Nothing on the anti-slop list survives.
