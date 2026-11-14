# Substitutions and missing assets

| Wanted | Why not | What is in place |
|---|---|---|
| Authentic application recordings | The live Content-Security-Policy blocks `<video>`; no recordings were supplied | Original HTML, CSS and SVG interface simulations with coherent actions and results, labelled as demonstrations |
| Photographic footage and product imagery | Higgsfield refused generation from this session (unlimited generations are only available in Claude chat, Cowork or ChatGPT; the balance was 0.13 credits against 0.25 per image) | Original drawn artwork in 15 named photo slots. Prompts and file names: `higgsfield-media-prompts.md` |
| WebGL workstation | Not needed for the effect and costly on phones | CSS 3D monitors with perspective, glow and reflection |
| Monthly and annual pricing toggle | ALLAI has no annual price | Toggle reveals the separately billed Grok Bot add-on; nothing is summed or invented |
| Customer testimonials | None exist to verify | Sample outputs labelled as samples, plus the published "Who it is for" list |
| Third-party integration logos | None are evidenced | Only what the live site and legal pages state |
| Real application names and logos | Trademarks, and no claim of partnership | Generic look-alike chrome described as "Word-style", "Blender-style" and so on |
| Higgsfield website builder | It creates a separate React site on Higgsfield hosting, which conflicts with implementing inside the existing static project and its backend routes | Its pre-deploy review rubric was applied as a quality gate (no placeholders, one label per call to action, reduced-motion guards, copy audit) |
| Old first-visit intro (coloured pills) | Replaced by the workstation load sequence | Removed from the new pages |
| Background arcade canvas | Competed with the screens | Turned off with the bundle's own `data-no-arcade` switch |

Not done: production deployment (not authorised). The work is on the branch
`claude/allai-website-redesign-1h9f7q`; no pull request has been opened.
