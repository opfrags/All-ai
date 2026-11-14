# Photo slots and Higgsfield prompt pack

The demo scenes use original drawn artwork wherever a photograph would normally appear. Each of
those places is a **named photo slot**. Drop an image with the right file name into
`site/assets/img/media/`, run `node tools/build.mjs`, and the scene uses the photo instead of the
drawing. Nothing else has to change. (`.jpg`, `.png` or `.webp` all work.)

Why the slots are empty today: Higgsfield refused generation from this Claude Code session
("unlimited generations are not available from Claude Code; available in Claude chat, Claude Cowork,
ChatGPT"), and the account held 0.13 credits against 0.25 per image. Run the prompts below in Claude
chat or Cowork with unlimited generations, or add credits and ask for them to be generated here.

Suggested model: GPT Image 2.6, quality medium or higher. Keep the images free of readable text,
logos and identifiable faces (the scenes add their own captions).

| File name (no extension) | Used in | Ratio | Prompt |
|---|---|---|---|
| `video-clip-1` | Video editing: clip 1, preview | 16:9 | Photorealistic cinematic still from a bakery advert: golden crusty farm loaves baking inside a glowing deck oven, warm orange light, a baker's hands in a flour-dusted apron sliding a wooden peel into the oven, shallow depth of field, small neighbourhood bakery in southern Africa, no text, no logos, no watermark |
| `video-clip-2` | Video editing: clip 2 | 16:9 | Photorealistic cinematic still from a bakery advert: rustic wooden shelves filled with fresh farm loaves, meat pies and scones in a small bright neighbourhood bakery, soft morning window light, shallow depth of field, warm inviting colours, no people, no text, no logos, no watermark |
| `video-clip-3` | Video editing: clip 3 | 16:9 | Photorealistic cinematic still from a bakery advert: close-up of a shopkeeper's hands passing a brown paper bag of fresh bread across a wooden counter to a customer's hands, small African neighbourhood bakery, warm natural light, shallow depth of field, no faces visible, no text, no logos, no watermark |
| `design-loaf` | Graphic design: product image (PNG with transparent background works best) | 1:1 | Studio product photograph of a single rustic farm loaf of bread with a dusting of flour, isolated on a transparent background, soft diffused light, appetising, high detail, no text, no props, no logos |
| `shop-front` | Slides: "Our shop" picture. Social calendar thumbnails | 4:3 | Photorealistic photo of the front of a small tidy hardware shop on a sunny street in a southern African town, single-storey building with a blue painted fascia with no lettering, open doorway, bags of cement and roofing sheets stacked neatly outside, clear blue sky, no readable text, no logos, no people |
| `property-lounge` | Property walkthrough: stop 1 | 16:9 | Photorealistic wide-angle interior photograph of a modern two-bedroom apartment lounge, light walls, wooden floor, a blue sofa, a large window with daylight, doorway on the right leading to a kitchen, clean real-estate photography style, eye-level view, no people, no text |
| `property-kitchen` | Property walkthrough: stop 2 | 16:9 | Photorealistic wide-angle interior photograph of a compact modern apartment kitchen, white cabinets, dark countertop, small window with daylight, tiled floor, clean real-estate photography style, eye-level view, no people, no text |
| `property-model` | Property walkthrough: the raised 3D model | 16:9 | High quality 3D architectural render of a two-bedroom apartment floor plan seen from above at an isometric angle with the roof removed, white walls with thickness, wooden floors, furnished lounge with blue sofa, kitchen, two bedrooms and a bathroom, soft studio lighting, dark charcoal background, clean dollhouse cutaway view, no text, no labels |
| `blender-render` | 3D modelling: the finished product render | 16:9 | Photorealistic studio product render of a sleek matte cobalt blue aluminium water bottle with a black screw cap and a clean white label band reading AQUA in bold dark navy letters, standing centred on a glossy dark reflective surface, dramatic blue rim lighting, dark navy studio background, soft reflection below, advertising product shot, ultra sharp |
| `social-books` | Social calendar: post visuals | 1:1 | Photorealistic flat-lay photograph of back-to-school supplies: a neat stack of exercise books, pencils, a ruler and a blue school backpack on a clean light desk, bright soft daylight, tidy composition, no text, no logos |
| `social-shoes` | Social calendar: post visual | 1:1 | Photorealistic product photograph of a pair of polished black leather school shoes beside a neatly folded white shirt and grey school jersey on a wooden shop shelf, soft natural light, clean retail look, no text, no logos, no people |
| `web-loaf` | Website preview: menu card 1 | 4:3 | Photorealistic food photograph of a crusty farm loaf on a wooden board in a warm bakery, soft daylight, appetising, no text, no logos |
| `web-pie` | Website preview: menu card 2 | 4:3 | Photorealistic food photograph of a golden baked meat pie on a small plate on a wooden table in a warm bakery, soft daylight, appetising, no text, no logos |
| `web-scones` | Website preview: menu card 3 | 4:3 | Photorealistic food photograph of six fresh scones on a wooden board in a warm bakery, soft daylight, appetising, no text, no logos |
| `game-bg` | Game editor: level background | 16:9 | Stylised painted 2D platformer game background at dusk, deep blue sky with stars, distant baobab tree silhouettes and rolling hills in layered parallax, no characters, no platforms, no text, clean game art |

After adding images, regenerate the scene posters so the hero tray, the work examples and the closing
section pick them up: `node tools/posters.mjs`.
