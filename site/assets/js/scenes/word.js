/* Scene: Word-style document creation. Rough notes become a formatted three-page proposal. */
ALLAI.register({
  id: 'word',
  frame: '.w-page--1@w',
  start: '.w-notes',
  html: function (ui) {
    return ui.bar({ file: 'Roofing proposal.docx', app: 'Document editor', letter: 'W', ico: 'w-ico' }) +
      ui.menu(['File', 'Home', 'Insert', 'Layout', 'Review', 'View']) +
      '<div class="a-tools">' +
        '<span class="a-t a-t--txt">DM Sans</span><span class="a-sep"></span>' +
        '<span class="a-t"><b>B</b></span><span class="a-t"><i>I</i></span><span class="a-t"><u>U</u></span><span class="a-sep"></span>' +
        '<span class="a-t a-t--txt w-st" data-sel="select,h1">Normal</span><span class="a-t a-t--txt w-st w-st--h1" data-sel="h1,table">Heading 1</span><span class="a-sep"></span>' +
        '<span class="a-t a-t--txt w-tool-table" data-sel="table,logo">Table</span><span class="a-t a-t--txt w-tool-pic" data-sel="logo,space">Picture</span><span class="a-t a-t--txt w-tool-space" data-sel="space,pages">Spacing</span>' +
        '<span class="a-grow"></span><span class="a-t a-t--txt w-tool-view" data-sel="pages">Pages</span>' +
      '</div>' +
      '<div class="a-body">' +
        '<div class="a-side a-side--l w-side"><div class="a-h">Rough notes</div>' +
          '<div class="w-notes" data-sel="select,title"><p>roof job - sunrise primary</p><p>3 classrooms, 240 sqm</p><p>IBR sheets 0.5mm x 96</p><p>timber + fixings 1 lot</p><p>labour 6 days</p><p>total about 4,860</p><p>start after school closes</p></div>' +
        '</div>' +
        '<div class="a-main w-desk"><div class="w-pages">' +
          '<div class="w-page w-page--1">' +
            '<div class="w-logo" data-show="logo"><i></i><span>KUDU<br>HARDWARE</span></div>' +
            '<div class="w-raw" data-hide="title"><p>roof job - sunrise primary</p><p>3 classrooms, 240 sqm</p><p>IBR sheets 0.5mm x 96 ...</p></div>' +
            '<h3 class="w-title" data-type="title">Roofing Proposal</h3>' +
            '<p class="w-sub" data-show="title">Prepared for Sunrise Primary School</p>' +
            '<h4 class="w-h" data-show="h1">1. Scope of work</h4>' +
            '<p class="w-p" data-show="h1">Re-roof three classroom blocks (240 m²) with 0.5 mm IBR sheeting on new timber purlins.</p>' +
            '<h4 class="w-h" data-show="table">2. Costs</h4>' +
            '<table class="w-table" data-show="table"><tr><th>Item</th><th>Qty</th><th>Amount</th></tr>' +
              '<tr><td>IBR roof sheets 0.5 mm</td><td>96</td><td>$2,880.00</td></tr><tr><td>Timber and fixings</td><td>1 lot</td><td>$780.00</td></tr>' +
              '<tr><td>Labour (6 days)</td><td>1</td><td>$1,200.00</td></tr><tr class="w-total"><td>Total</td><td></td><td>$4,860.00</td></tr></table>' +
          '</div>' +
          '<div class="w-page w-page--2" data-show="pages"><h4 class="w-h">3. Timeline</h4>' + ui.lines([100, 90, 70], 'ln--d') + '<h4 class="w-h">4. Materials</h4>' + ui.lines([100, 80, 95, 60], 'ln--d') + '</div>' +
          '<div class="w-page w-page--3 dl1" data-show="pages"><h4 class="w-h">5. Terms</h4>' + ui.lines([100, 85, 90], 'ln--d') + '<h4 class="w-h">6. Acceptance</h4>' + ui.lines([70, 50], 'ln--d') + '<div class="w-sign"></div></div>' +
        '</div></div>' +
      '</div>' +
      '<div class="a-status"><span>Page <b class="w-pg">1</b> of <span class="w-pgn">1</span></span><span>English (Zimbabwe)</span><span class="a-grow"></span><span>Sample data: fictional business</span></div>';
  },
  steps: [
    { id: 'select', label: 'Reading the rough notes', cur: '.w-notes', at: [.5, .3], click: true, d: 1300 },
    { id: 'title', label: 'Writing the proposal title', cur: '.w-title', at: [.2, .5], click: true, d: 1500 },
    { id: 'h1', label: 'Applying heading styles', cur: '.w-st--h1', click: true, d: 1400 },
    { id: 'table', label: 'Inserting the cost table', cur: '.w-tool-table', click: true, d: 1500 },
    { id: 'logo', label: 'Placing the company logo', cur: '.w-tool-pic', click: true, d: 1300 },
    { id: 'space', label: 'Adjusting spacing and margins', cur: '.w-tool-space', click: true, d: 1200 },
    { id: 'pages', label: 'Proposal ready: three pages', cur: '.w-tool-view', click: true, d: 1700, frame: '.w-desk' }
  ]
});
