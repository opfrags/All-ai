/* Scene: research. A browser beside organised notes. Sources are clearly illustrative placeholders
   (example.com is a reserved documentation domain); no real citation is implied. */
(function () {
  var page = function (k, name, kva, price, warranty) {
    return '<div class="r-page r-page--' + k + '"><h5>' + name + '</h5><p class="r-sub">Illustrative supplier page</p>' +
      '<div class="r-spec"><span>Rating</span><b data-sel="src' + k + '">' + kva + '</b></div><div class="r-spec"><span>Price</span><b data-sel="src' + k + '">' + price + '</b></div><div class="r-spec"><span>Warranty</span><b data-sel="src' + k + '">' + warranty + '</b></div>' +
      '<i class="ln w90"></i><i class="ln w70"></i><i class="ln w80"></i></div>';
  };
  ALLAI.register({
    id: 'research',
    frame: '.r-notes',
    start: '.r-url',
    html: function (ui) {
      return ui.bar({ file: 'Inverter options', app: 'Browser and research notes', letter: 'R', ico: 'r-ico' }) +
        '<div class="a-body">' +
          '<div class="a-main r-browser">' +
            '<div class="r-tabs"><span class="r-tab r-tab--1" data-sel="src1,src2">Option A</span><span class="r-tab r-tab--2" data-sel="src2,src3">Option B</span><span class="r-tab r-tab--3" data-sel="src3">Option C</span></div>' +
            '<div class="r-url mono"><i></i><span class="r-u r-u1">example.com/inverter-a</span><span class="r-u r-u2">example.com/inverter-b</span><span class="r-u r-u3">example.com/inverter-c</span></div>' +
            '<div class="r-view">' + page(1, 'Inverter A', '3 kVA', '$420', '2 years') + page(2, 'Inverter B', '5 kVA', '$690', '3 years') + page(3, 'Inverter C', '5 kVA', '$640', '2 years') + '</div>' +
          '</div>' +
          '<div class="a-side a-side--r r-notes"><div class="a-h">Research notes</div>' +
            '<table class="r-table"><tr><th>Option</th><th>Rating</th><th>Price</th><th>Warranty</th></tr>' +
              '<tr data-show="src1"><td>A</td><td>3 kVA</td><td>$420</td><td>2 yr</td></tr>' +
              '<tr data-show="src2"><td>B</td><td>5 kVA</td><td>$690</td><td class="r-best" data-on="compare">3 yr</td></tr>' +
              '<tr data-show="src3"><td>C</td><td>5 kVA</td><td class="r-best" data-on="compare">$640</td><td>2 yr</td></tr></table>' +
            '<div class="r-brief" data-show="brief"><b>Brief</b><p data-type="brief">B and C both give 5 kVA. C costs $50 less. B has the longer 3-year warranty. A is too small for the shop.</p></div>' +
            '<div class="r-src" data-show="links"><b>Sources <em>illustrative</em></b><p class="mono">1. example.com/inverter-a</p><p class="mono">2. example.com/inverter-b</p><p class="mono">3. example.com/inverter-c</p></div>' +
          '</div>' +
        '</div>' +
        '<div class="a-status"><span>3 sources open</span><span class="a-grow"></span><span>Illustrative sources and figures</span></div>';
    },
    steps: [
      { id: 'src1', label: 'Reading the first source', cur: '.r-tab--1', click: true, d: 1400, frame: 'full' },
      { id: 'src2', label: 'Reading the second source', cur: '.r-tab--2', click: true, d: 1400 },
      { id: 'src3', label: 'Reading the third source', cur: '.r-tab--3', click: true, d: 1400 },
      { id: 'compare', label: 'Comparing price and warranty', cur: '.r-table', at: [.7, .8], click: true, d: 1400, frame: '.r-notes' },
      { id: 'brief', label: 'Writing the brief', cur: '.r-brief', at: [.3, .5], click: true, d: 2000 },
      { id: 'links', label: 'Brief ready, with source links', cur: '.r-src', at: [.3, .5], d: 1500 }
    ]
  });
})();
