# Reference animation checklist

Observed on jockey.stuudio.xyz at 1440x900 and on an iPhone 13 viewport (56 desktop and 33 mobile
scroll frames plus the load sequence). The reference is Next.js with Lenis smooth scrolling and
WebGL image tiles. Its media host was not reachable from the build environment, so video content
inside its panels could not be seen; layout, timing and behaviour could.

| # | Reference animation | Trigger | Movement and timing observed | ALLAI translation | Status |
|---|---|---|---|---|---|
| 1 | Opening sequence | Page load | About 2.5 s black, tiles assemble into a 3D room, prompt bar types | Monitors power on (screen wipe 0.7 s), side screens swing in from 64 to 26 degrees over 1.2 s, glow fades in, headline words rise 45 ms apart, then the request types | Done |
| 2 | Typing and changing prompts | Load, then per chapter | Prompt retypes for each chapter | Request types in the Job screen for each hero task; story prompt bar types with scroll | Done |
| 3 | Hero headline with CTA | Load | Headline bottom-left, pill button | Headline, sub-line and both CTAs left of the workstation, inside the first screen | Done |
| 4 | Dismissible announcement card | Load | Glowing card, docks to a slim bar | FitCheck kept as a slim dismissible strip (existing component) | Done |
| 5 | Pinned scroll chapters | Scroll, about 12 viewports | Left title slides up, centre object recolours, right text and chips fade in | Four pinned stages (470vh): title and description cross-slide 46 px, workstation scales 0.84 to 1.05, scene steps follow scroll, progress rail | Done |
| 6 | Centre object transformation | Scroll | Tile cube changes colour and shape | The application screen itself changes: starting state, tools in use, progress, finished result | Done (original equivalent) |
| 7 | Reverse scrolling | Scroll up | Chapters rewind | Idempotent seek with hysteresis; verified forwards and backwards | Done |
| 8 | Chapter picker | Click | n/a | Chips switch the story between document, render, website and game | Added |
| 9 | Giant outlined text shrinking to a headline | Scroll | Oversized stroke text scales down | Not reproduced: it depends on the display face. Section headlines use masked word reveals instead | Substituted |
| 10 | Use-case blocks with sticky title | Scroll | Left title sticks, media panel, four features | Four service blocks: sticky copy, large screen demo, four features | Done |
| 11 | Looping media panels | In view | Video loops | Scene loops with pause and replay (video is blocked by the site CSP) | Done (substituted) |
| 12 | Tracking labels on media | In view | Labels such as "Good hook" appear over footage | Labels tied to real scene state: "Totals checked" appears at the checking step, "Your OK before sending" at completion | Done |
| 13 | Mobile feature carousel | Swipe | Prev and next arrows | Gallery task list becomes a swipeable row; stepper buttons | Done |
| 14 | Background transition dark to light | Scroll | Section flips to white, nav recolours | Business-memory section is an inverse "sheet" in both themes | Done |
| 15 | Chat window with typed prompt and answer | Scroll | Prompt types, answer appears word by word | Customer support scene: enquiry, knowledge-base search, typed reply draft | Done |
| 16 | Processing and completion states | Timed | "Analyzing", "Summarizing", "Done" | Agent indicator (working, done), step checklist with ticks, completion toast, run log | Done |
| 17 | Floating interface panels | Scroll | Side panels fade around the chat | Companion screens (Job, Finished work) and in-scene panels | Done |
| 18 | Workflow visualisation | n/a in reference as such | n/a | Enquiry packet travels form, contact, quote, follow-up with ticks | Done |
| 19 | Model visualisation (cube to scatter to floor) | Pinned scroll | Tiles regroup | Business-memory visual: stored facts light up and pulse along wires into three outputs; closing floor of output tiles | Done (original equivalent) |
| 20 | Section reveals | Scroll | Fade and rise | `.rv` rise 22 px over 0.9 s, 70 ms stagger; headline word masks | Done |
| 21 | Card and button interactions | Hover | Lift, arrow shift | Cards lift 3 px, arrows slide 4 px, chips and tabs recolour | Done |
| 22 | Pricing toggle | Click | Monthly and annual with sliding thumb, price change | Sliding thumb reveals the separately billed add-on line. ALLAI has no annual price, so none is invented | Done (adapted) |
| 23 | FAQ accordion | Click | Plus rotates to a cross, height animates | Same, 420 ms open and 320 ms close | Done |
| 24 | Closing section | Scroll | Large headline over scrubbed video | Large headline over a slowly moving perspective floor of finished outputs | Done (substituted) |
| 25 | Smooth scrolling (Lenis) | Scroll | Inertial scroll | Native scrolling kept: no scroll hijacking, better accessibility | Intentionally not copied |
| 26 | Navigation | Scroll | Fixed slim bar | Slim glass bar, hides on scroll down and returns on scroll up | Done |

Easing used throughout: `cubic-bezier(.22,.61,.36,1)` for entrances (also found in the reference
stylesheet) and `cubic-bezier(.4,0,.2,1)` for moves.

Could not be verified: the content and exact timing of the reference's videos, and its WebGL
shader details. Original equivalents are listed above.
