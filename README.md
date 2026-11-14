# All AI public site (2026 redesign)

The marketing site for [allai.co.zw](https://allai.co.zw/): static HTML, CSS and vanilla JavaScript, no
framework and no bundler. The homepage shows ALLAI agents working inside computer applications
through 16 reusable, simulated task scenes.

```
site/                 deployable static files (same paths the live server already serves)
  index.html …        built pages (do not edit by hand, edit src/pages and rebuild)
  assets/css/allai.css        design system and page sections
  assets/css/stage.css        workstation, monitors, app window primitives, agent cursor
  assets/js/stage.js          the scene engine (Player, controls, companion screens)
  assets/js/home.js           hero sequence, scroll story, gallery, service demos
  assets/js/scenes/*.js       the 16 scene modules + manifest.js (metadata) + media.js (generated)
  assets/css/scenes/*.css     one stylesheet per scene, lazy-loaded with its script
  assets/img/posters/         finished-state stills of every scene
  assets/img/media/           optional photos that replace drawn artwork (see docs)
  static/pub/                 existing guide assistant, FitCheck strip, theme script (unchanged)
  scene-lab.html              development view of any scene: /scene-lab?id=excel&step=3
src/pages/            page bodies
tools/build.mjs       assembles pages (shared head, nav, footer)   node tools/build.mjs
tools/serve.mjs       preview server with the production CSP        node tools/serve.mjs
tools/posters.mjs     re-renders scene posters                      node tools/posters.mjs
tools/verify.mjs      46 automated checks + screenshots             node tools/verify.mjs
docs/                 animation checklist, substitutions, verification, screenshots, walkthrough
```

## Preview

```
node tools/build.mjs && node tools/serve.mjs      # http://localhost:4173
```

The preview server sends the same Content-Security-Policy as production, so anything the live site
would block is blocked locally too. Backend routes (`/plans`, `/login`, `/signup`, `/audit`,
`/privacy`, `/terms`, `/refunds`) are served by the ALLAI application, not by this repository; the
preview answers them with a placeholder.

## Deploying

Nothing has been published. To go live, copy the contents of `site/` over the marketing files the
server serves today (keep `static/pub/public-ui.js` as it is). The old `style.css`,
`assets/js/site.js` of the previous design, `assets/js/agent-build.js`, `assets/css/agent-build.css`
and the Instrument Serif fonts are no longer referenced.

See `docs/REDESIGN.md` for the full write-up.
