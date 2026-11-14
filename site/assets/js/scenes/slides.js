/* Scene: presentation creation. Meeting notes become a five-slide deck in one consistent style. */
(function () {
  var thumb = function (n, step, kind) { return '<div class="p-th p-th--' + kind + '" data-show="' + step + '" data-sel="' + step + '"><i>' + n + '</i><span></span></div>'; };
  var bars = '<svg class="p-chart" viewBox="0 0 120 60" aria-hidden="true"><path d="M8 52H116" stroke="rgba(255,255,255,.3)"/>' +
    [[31, 'Aug'], [38, 'Sep'], [44, 'Oct']].map(function (b, i) { var h = b[0], x = 22 + i * 32; return '<rect class="p-bar dl' + (i * 2) + '" x="' + x + '" y="' + (52 - h) + '" width="16" height="' + h + '" rx="2.5" fill="#5b8cff"/><text x="' + (x + 8) + '" y="59" text-anchor="middle" class="p-ax">' + b[1] + '</text><text x="' + (x + 8) + '" y="' + (48 - h) + '" text-anchor="middle" class="p-val">' + b[0] + '</text>'; }).join('') + '</svg>';
  ALLAI.register({
    id: 'slides',
    frame: '.p-slide',
    start: '.p-notes',
    html: function (ui) {
      return ui.bar({ file: 'Supplier review.pptx', app: 'Slide deck editor', letter: 'P', ico: 'p-ico' }) +
        '<div class="a-tools"><span class="a-t a-t--txt p-t-new" data-sel="title,chart">New slide</span><span class="a-t a-t--txt p-t-chart" data-sel="chart,image">Chart</span><span class="a-t a-t--txt p-t-img" data-sel="image,style">Picture</span><span class="a-t a-t--txt p-t-theme" data-sel="style,more">Theme</span><span class="a-grow"></span><span class="a-btn p-t-present" data-sel="present">Present</span></div>' +
        '<div class="a-body">' +
          '<div class="a-side a-side--s p-strip">' + thumb(1, 'title', 'title') + thumb(2, 'chart', 'chart') + thumb(3, 'image', 'img') + thumb(4, 'more', 'text') + thumb(5, 'more', 'text') + '</div>' +
          '<div class="a-main p-stage"><div class="p-slide">' +
            '<div class="p-s p-s1"><span class="p-kicker" data-show="title">Kudu Hardware</span><h4 data-type="title">Supplier review</h4><p data-show="title">October results and next steps</p></div>' +
            '<div class="p-s p-s2"><h5>Orders per month</h5>' + bars + '<p class="p-cap">Orders rose from 31 in August to 44 in October.</p></div>' +
            '<div class="p-s p-s3"><h5>Our shop</h5><div class="p-photo"><i></i><i></i><i></i></div><ul><li>Open six days a week</li><li>Same-day delivery in town</li></ul></div>' +
            '<div class="p-bar-accent"></div><span class="p-pg">1 / 5</span>' +
          '</div></div>' +
          '<div class="a-side a-side--r p-notes"><div class="a-h">Meeting notes</div><div class="p-note mono"><p>supplier mtg fri</p><p>orders aug 31 sep 38 oct 44</p><p>show the shop</p><p>delivery times</p><p>next steps</p></div></div>' +
        '</div>' +
        '<div class="a-status"><span class="p-count">Slide deck</span><span class="a-grow"></span><span>Sample data: fictional business</span></div>';
    },
    steps: [
      { id: 'title', label: 'Creating the title slide', cur: '.p-t-new', click: true, d: 1500 },
      { id: 'chart', label: 'Adding a chart from the notes', cur: '.p-t-chart', click: true, d: 1600 },
      { id: 'image', label: 'Adding the shop picture', cur: '.p-t-img', click: true, d: 1500 },
      { id: 'style', label: 'Applying one consistent style', cur: '.p-t-theme', click: true, d: 1400 },
      { id: 'more', label: 'Finishing the remaining slides', cur: '.p-strip', at: [.5, .78], click: true, d: 1300 },
      { id: 'present', label: 'Deck ready: presentation mode', cur: '.p-t-present', click: true, d: 1800, frame: 'full' }
    ]
  });
})();
