/* ALLAI scene library: metadata for the 16 task scenes (loaded up front; scene code is lazy-loaded).
 *
 * status
 *   'listed' : the type of work appears in ALLAI's published services or plan features.
 *   'ask'    : an example of computer work. Shown as a demonstration only, with an "ask us" call to
 *              action, until the owner confirms it as an available service.
 * All business names, people, figures and sources inside the scenes are fictional sample data.
 */
(function () {
  'use strict';
  var A = window.ALLAI = window.ALLAI || {};
  A.v = '1';
  A.cats = [
    { id: 'office', name: 'Office' },
    { id: 'creative', name: 'Creative' },
    { id: 'dev', name: 'Development' },
    { id: 'ops', name: 'Operations' }
  ];
  A.manifest = [
    { id: 'word', cat: 'office', status: 'listed', name: 'Document creation', app: 'Word-style document editor', out: 'Proposal',
      request: 'Turn my rough notes into a proposal for the school roofing job.',
      result: 'A formatted three-page proposal, ready for you to review.', files: ['notes.txt', 'logo.png'] },
    { id: 'excel', cat: 'office', status: 'listed', name: 'Spreadsheets and analysis', app: 'Excel-style spreadsheet', out: 'Sales summary',
      request: 'Clean up this month’s sales sheet and show me what sold best.',
      result: 'A clean table, checked totals and a chart of sales by product.', files: ['sales-october.xlsx'] },
    { id: 'slides', cat: 'office', status: 'ask', name: 'Presentation creation', app: 'Slide deck editor', out: 'Slide deck',
      request: 'Make a short deck from my notes for Friday’s supplier meeting.',
      result: 'A five-slide deck with a chart, in one consistent style.', files: ['meeting-notes.txt', 'shop-front.jpg'] },
    { id: 'invoice', cat: 'office', status: 'listed', name: 'Invoices and quotations', app: 'Quote builder', out: 'Quotation',
      request: 'Quote Mrs Dube for 40 bags of cement, 2 loads of river sand and delivery.',
      result: 'A branded quotation with checked totals, waiting for your OK to send.', files: ['price-list.xlsx'] },
    { id: 'blender', cat: 'creative', status: 'ask', name: '3D modelling and rendering', app: 'Blender-style 3D workspace', out: 'Product render',
      request: 'Model our new water bottle and render a clean product shot.',
      result: 'A lit, framed product render exported as an image.', files: ['bottle-sketch.jpg'] },
    { id: 'video', cat: 'creative', status: 'ask', name: 'Video editing', app: 'Video editor timeline', out: 'Advert cut',
      request: 'Cut these clips into a 15-second advert with captions and music.',
      result: 'A captioned, colour-corrected 15-second advert.', files: ['clip-01.mp4', 'clip-02.mp4', 'clip-03.mp4'] },
    { id: 'design', cat: 'creative', status: 'ask', name: 'Graphic design', app: 'Design canvas', out: 'Advert artwork',
      request: 'Design a weekend special advert for the bakery, square and vertical.',
      result: 'One advert in square and vertical sizes, in your brand colours.', files: ['brand-colours.txt'] },
    { id: 'property', cat: 'creative', status: 'ask', name: '3D property walkthrough', app: '3D floor-plan viewer', out: 'Walkthrough',
      request: 'Prepare a walkthrough of the two-bedroom unit from the supplied floor plan.',
      result: 'An illustrative walkthrough with four navigation points.', files: ['unit-4-floorplan.pdf'] },
    { id: 'social', cat: 'creative', status: 'listed', name: 'Social content planning', app: 'Content calendar', out: 'Content plan',
      request: 'Plan next week’s posts for the back-to-school promotion.',
      result: 'A week of draft posts in three formats, ready for your review.', files: ['promo-brief.txt'] },
    { id: 'code', cat: 'dev', status: 'listed', name: 'Website development', app: 'Code editor and browser preview', out: 'Website',
      request: 'Build a one-page website for the bakery with a menu and an order button.',
      result: 'A responsive one-page website, built and ready to review.', files: ['menu.txt', 'logo.svg'] },
    { id: 'game', cat: 'dev', status: 'ask', name: 'Game development', app: 'Game editor', out: 'Playable level',
      request: 'Build a simple platform game level for the school open day.',
      result: 'A playable level with movement, collectibles and a score.', files: ['sprites.png'] },
    { id: 'android', cat: 'dev', status: 'listed', name: 'Android app development', app: 'Code editor and Android emulator', out: 'Booking app',
      request: 'Build a small booking app for the salon.',
      result: 'A working booking flow: services, a booking form and a confirmation.', files: ['services.txt'] },
    { id: 'research', cat: 'ops', status: 'listed', name: 'Research', app: 'Browser and research notes', out: 'Research brief',
      request: 'Compare three solar inverter options for the shop and give me a short brief.',
      result: 'A one-page brief with a comparison and links to each source.', files: [] },
    { id: 'support', cat: 'ops', status: 'listed', name: 'Customer support', app: 'Customer inbox', out: 'Reply draft',
      request: 'Reply to this delivery enquiry using our knowledge base.',
      result: 'A drafted reply with the right details, waiting for your OK.', files: ['knowledge-base'] },
    { id: 'workflow', cat: 'ops', status: 'listed', name: 'Workflow automation', app: 'Automation builder', out: 'Automation',
      request: 'When someone fills in the enquiry form, record them, prepare a quote and remind me to follow up.',
      result: 'An enquiry carried from form to contact, quote and follow-up.', files: [] },
    { id: 'memory', cat: 'ops', status: 'listed', name: 'Business memory', app: 'Shared business memory', out: 'Price list',
      request: 'Update the price list. Use the cement price I gave you last week.',
      result: 'A new price list using the stored price, with nothing asked twice.', files: [] }
  ];
  A.heroOrder = ['word', 'blender', 'code', 'game'];
})();
