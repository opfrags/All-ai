# Verification summary

Run with `node tools/serve.mjs` in one terminal and `node tools/verify.mjs` in another.
Result on 14 November 2026: **46 of 46 checks passed** (Chromium, production CSP enabled).

| Area | What was checked | Result |
|---|---|---|
| Console and CSP | 7 pages x 2 themes: no console errors, no CSP violations, no failed requests | Pass |
| Desktop layout | 1440x900: headline, sub-line and primary CTA inside the first screen; no horizontal overflow | Pass |
| Mobile layout | iPhone 13: one screen, CTA early, story unpinned, no overflow, work area framed at 2x | Pass |
| Hero | Autoplay, pause holds, replay restarts, task chip interrupts rotation; full sequence 33.9 s | Pass |
| Forward and reverse scrolling | Four stages advance and rewind to identical steps | Pass |
| Navigation anchors | Section after the pinned story lands on target | Pass |
| Task switching | All 16 scenes reachable in 4 categories; selection loads and plays; scrubber seeks | Pass |
| Scene integrity | Every scene returns the same DOM state for the same step after arbitrary seeks | Pass |
| Reduced motion | No autoplay, no pinning, finished states shown, controls still work | Pass |
| Theme switching | Toggle switches, persists, both themes load clean | Pass |
| Media fallbacks | Posters exist for all 16 scenes; `<noscript>` still in the hero; reveals disabled without JS | Pass |
| Pricing and onboarding | Prices, add-on amounts and `/plans?plan=` links match the live pricing | Pass |
| Account routes | `/plans`, `/login`, `/signup`, `/audit`, `/privacy`, `/terms`, `/refunds` linked; all returned 200 on the live host | Pass |
| Existing assistant | Hidden on arrival, opens with its introduction from the help button; bundle hash unchanged | Pass |
| FitCheck | Present, 38 px tall, dismissible | Pass |
| Performance | Off-screen demonstrations paused; below-the-fold scenes not downloaded on first view | Pass |

Not verified: behaviour on the production server itself (nothing was deployed), Safari and
Firefox, and the assistant's live chat replies (the preview has no backend, so it uses its
built-in answers).

Screenshots are in `docs/screenshots/`, the recording is `docs/walkthrough.webm`.
