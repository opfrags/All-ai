/* Scene: Excel-style spreadsheet. A messy sales sheet is cleaned, totalled, formatted and charted.
   Figures are consistent: 120x11.50 + 45x30.00 + 38x18.00 + 210x2.40 + 26x14.50 = 4,295.00. */
(function () {
  var rows = [
    ['cement 50KG ', 'Cement 50 kg', '120', '11.50', '1,380.00'],
    ['ROOF sheets', 'Roof sheets', '45', '30.00', '1,350.00'],
    ['paint 5l', 'Paint 5 L', '38', '18.00', '684.00'],
    ['Nails 1kg  ', 'Nails 1 kg', '210', '2.40', '504.00'],
    ['door LOCKS', 'Door locks', '26', '14.50', '377.00']
  ];
  var bars = [[100, 'Cement'], [97.8, 'Roof'], [49.6, 'Paint'], [36.5, 'Nails'], [27.3, 'Locks']];
  ALLAI.register({
    id: 'excel',
    frame: '.x-grid',
    start: '.x-fx',
    html: function (ui) {
      var grid = '<div class="x-row x-row--h"><i></i><b>A</b><b>B</b><b>C</b><b>D</b></div>' +
        '<div class="x-row x-row--head"><i>1</i><span>Product</span><span>Units</span><span>Unit price</span><span>Total</span></div>' +
        rows.map(function (r, n) {
          return '<div class="x-row"><i>' + (n + 2) + '</i><span class="x-name"><em data-hide="clean">' + r[0] + '</em><em class="x-clean" data-show="clean">' + r[1] + '</em></span><span>' + r[2] + '</span><span>' + r[3] + '</span>' +
            '<span class="x-tot' + (n === 0 ? ' x-d2' : ' x-fill dl' + n) + '" data-show="' + (n === 0 ? 'formula' : 'fill') + '">' + r[4] + '</span></div>';
        }).join('') +
        '<div class="x-row x-row--blank" data-hide="clean"><i>7</i><span></span><span></span><span></span><span></span></div>' +
        '<div class="x-row x-row--sum"><i class="x-n7">7</i><span data-show="sum">Total</span><span data-show="sum">439</span><span></span><span class="x-d7"><b data-show="sum" data-count="sum" data-from="0" data-to="4295" data-fmt="money"></b></span></div>';
      var chart = '<svg class="x-chart" viewBox="0 0 200 120" aria-hidden="true"><path d="M24 12H196M24 46H196M24 80H196" stroke="rgba(255,255,255,.07)"/><path d="M24 104H196" stroke="rgba(255,255,255,.25)"/>' +
        bars.map(function (b, i) {
          var h = Math.round(b[0] * .88), x = 32 + i * 33;
          return '<g class="x-bar dl' + i + '"><rect x="' + x + '" y="' + (104 - h) + '" width="18" height="' + h + '" rx="3" fill="#3f7bff"/></g><text x="' + (x + 9) + '" y="115" text-anchor="middle" class="x-ax">' + b[1] + '</text>';
        }).join('') + '<text x="4" y="15" class="x-ax">$1.4k</text><text x="4" y="83" class="x-ax">$0.4k</text></svg>';
      return ui.bar({ file: 'sales-october.xlsx', app: 'Spreadsheet', letter: 'X', ico: 'x-ico' }) +
        ui.menu(['File', 'Home', 'Insert', 'Formulas', 'Data', 'View']) +
        '<div class="a-tools"><span class="a-t a-t--txt x-t-clean" data-sel="clean,formula">Clean data</span><span class="a-t a-t--txt x-t-table" data-sel="table,chart">Format as table</span><span class="a-t a-t--txt x-t-chart" data-sel="chart,summary">Insert chart</span><span class="a-grow"></span><span class="a-t a-t--txt x-t-sum" data-sel="summary">Summary</span></div>' +
        '<div class="x-fx"><b class="x-ref mono">D2</b><i>fx</i><span class="mono x-f1" data-type="formula">=B2*C2</span><span class="mono x-f2" data-type="sum">=SUM(D2:D6)</span></div>' +
        '<div class="a-body">' +
          '<div class="a-main x-grid">' + grid + '<i class="x-handle" data-show="formula"></i></div>' +
          '<div class="a-side a-side--r x-side">' +
            '<div class="x-card" data-show="chart"><div class="a-h">Sales by product (USD)</div>' + chart + '</div>' +
            '<div class="x-card x-sum" data-show="summary"><div class="a-h">Summary</div><p><span>Best seller</span><b>Cement 50 kg</b></p><p><span>Its sales</span><b>$1,380.00 (32%)</b></p><p><span>Total sales</span><b>$4,295.00</b></p><p><span>Units sold</span><b>439</b></p></div>' +
          '</div>' +
        '</div>' +
        '<div class="a-status"><span>Sheet1</span><span class="x-st">Ready</span><span class="a-grow"></span><span>Sample data: fictional business</span></div>';
    },
    steps: [
      { id: 'clean', label: 'Cleaning names and blank rows', cur: '.x-t-clean', click: true, d: 1500 },
      { id: 'formula', label: 'Adding the total formula', cur: '.x-d2', click: true, d: 1500 },
      { id: 'fill', label: 'Filling the formula down', cur: '.x-handle', click: true, drag: '.x-fill.dl4', d: 1500 },
      { id: 'sum', label: 'Checking the grand total', cur: '.x-d7', click: true, d: 1500 },
      { id: 'table', label: 'Formatting as a table', cur: '.x-t-table', click: true, d: 1300 },
      { id: 'chart', label: 'Charting sales by product', cur: '.x-t-chart', click: true, d: 1700, frame: '.x-side' },
      { id: 'summary', label: 'Summary ready', cur: '.x-t-sum', click: true, d: 1500 }
    ]
  });
})();
