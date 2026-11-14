# ALLAI homepage redesign: what was built

Reference for motion and layout: jockey.stuudio.xyz. Everything here is original ALLAI work: no
code, copy, media or artwork was taken from the reference.

## Inspection findings (before building)

- The live site is static HTML, CSS and vanilla JS with a separate application backend
  (`/plans`, `/login`, `/signup`, `/audit`, legal pages, `/api/public/...`). The repository held
  only a README, so the public files were mirrored from the live site as the starting point.
- The server sends a strict Content-Security-Policy: `script-src 'self'`, `style-src 'self'`,
  `img-src 'self' data:`, `font-src 'self'`, `connect-src 'self'`, everything else `'none'`.
  Consequences: no inline scripts or styles, no CDNs, and **no `<video>` or `<audio>`** unless the
  server policy changes. The redesign is built to pass this policy unchanged.
- `static/pub/public-ui.js` (theme toggle, FitCheck strip, guide assistant) is a built bundle with
  no source here. It is used byte-for-byte unchanged.
- **Live bug found:** the current live pages link to `plans.html`, `login.html`, `signup.html` and
  `audit.html`, which return 404 (the real routes are `/plans`, `/login`, `/signup`, `/audit`).
  The redesign uses the working routes.

## The task-scene system

A scene is a small module: application markup plus an ordered list of steps
(`site/assets/js/scenes/<id>.js`, `site/assets/css/scenes/<id>.css`). State is cumulative: when
step *k* has run, every step up to *k* is on. One engine (`stage.js`) therefore serves three
drivers with no drift:

| Driver | Where | How |
|---|---|---|
| Clock | hero, gallery, service demos | `player.play()`: the agent cursor moves, clicks, and only then the effect appears |
| Scroll | four-stage story | `player.goto(k)` from scroll progress, forwards and backwards |
| Scrubber and stepper | gallery | `player.seek(k)`, idempotent |

Reusable parts: monitor frames and workstation (`ALLAI.workstation`), application window chrome
(`ui.bar`, `ui.menu`, `.a-*` classes), agent indicator, agent cursor with click and drag, task
progress (`ALLAI.controls`, `ALLAI.jobPanel`), scene transitions (layered swap with a light
sweep), finished outputs (`ALLAI.trayPanel`, posters, completion toast).

Scene library (all 16 are in the gallery): Word-style document, Excel-style spreadsheet, slide
deck, quotation, Blender-style 3D, video editing, graphic design, 3D property walkthrough, social
calendar, website development, game development, Android app, research, customer support, workflow
automation, business memory.

To add a scene: add its entry to `manifest.js`, create the two files, and it appears in the gallery.

## Honesty rules applied

- Every monitor carries a permanent "Simulated demonstration" label; every scene states that its
  data is fictional. Business names, people, prices and sources are invented.
- Two tiers, set per scene in `manifest.js`:
  - `listed`: the kind of work appears in ALLAI's published services or plan features. Call to
    action: Get started.
  - `ask`: shown as "Example of computer work. Ask us whether it fits your job" with a WhatsApp
    link. Applies to 3D modelling, game development, video editing, graphic design, presentations
    and the property walkthrough. **Please confirm or correct this list.**
- Scenes that would send or publish stop at "waiting for your OK" (quotation, customer reply,
  social schedule, automation), matching the published "It asks before anything important".
- Research uses `example.com` placeholder sources labelled illustrative. No citation is implied.
- The property scene works from a supplied floor plan and says "Illustrative model. Not a survey".
- No testimonials exist, so none are shown. "What finished work looks like" shows sample outputs
  labelled as such.
- Integrations lists only what the live site and its legal pages evidence: Google sign-in, the AI
  employee's own mailbox, WhatsApp, Google Meet for audits, hosting and encryption facts, and
  payments marked "not open yet".
- Pricing is unchanged: Helper $79, Teammate $200, Expert $300, with the same inclusions and links.

## Accessibility and performance

- Reduced motion: no autoplay and no pinning; scenes rest on the finished result; play, replay and
  step buttons still work.
- Pause, replay, task chips, tabs and the scrubber are real buttons and inputs with labels;
  gallery tabs support arrow keys; focus is visible.
- Simulated screens are `role="img"` with a text description; step labels are real text.
- Demonstrations pause when off screen and when the tab is hidden.
- Only the four hero scenes load up front. The other twelve load when first needed.
- Phones get one screen that frames the work area so text stays readable; the story is unpinned.
- No layout shift (fixed aspect boxes), no horizontal overflow, no audio.

## Open items for the owner

1. Photos: 15 named photo slots are ready (`docs/higgsfield-media-prompts.md`). Higgsfield refused
   generation from this session, so drawn artwork is in place until images are added.
2. Confirm the `listed` / `ask` split above.
3. If real application recordings are wanted, the server CSP needs `media-src 'self'`.
4. Customer evidence: add real stories to the work section when you have permission to publish.
