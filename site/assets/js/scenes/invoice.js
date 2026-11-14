/* Scene: invoices and quotations. Fictional client details become a branded quote.
   Totals are consistent: 40 x 11.50 = 460.00, 2 x 95.00 = 190.00, delivery 35.00, total 685.00. */
ALLAI.register({
  id: 'invoice',
  frame: '.q-paper',
  start: '.q-form',
  html: function (ui) {
    var line = function (cls, step, name, qty, price, amt) {
      return '<tr class="' + cls + '" data-show="' + step + '"><td>' + name + '</td><td>' + qty + '</td><td>' + price + '</td><td>' + amt + '</td></tr>';
    };
    return ui.bar({ file: 'Quotation Q-0148', app: 'Quote builder', letter: 'Q', ico: 'q-ico' }) +
      '<div class="a-tools"><span class="a-t a-t--txt">New quote</span><span class="a-t a-t--txt q-t-check" data-sel="check,brand">Check details</span><span class="a-t a-t--txt q-t-brand" data-sel="brand,export">Apply branding</span><span class="a-grow"></span><span class="a-btn q-t-export" data-sel="export">Export PDF</span></div>' +
      '<div class="a-body">' +
        '<div class="a-side a-side--l q-form"><div class="a-h">Client</div>' +
          '<label class="q-f"><span>Name</span><b class="q-in q-in--name" data-type="client">Mrs T. Dube</b></label>' +
          '<label class="q-f"><span>Address</span><b class="q-in" data-type="client">Plot 14, Riverside</b></label>' +
          '<div class="a-h">Items from the request</div>' +
          '<div class="q-item q-item--1" data-sel="item1,item2"><b>Cement 50 kg</b><span>40 bags</span></div>' +
          '<div class="q-item q-item--2" data-sel="item2,total"><b>River sand</b><span>2 loads</span></div>' +
          '<div class="q-item q-item--3" data-sel="item2,total"><b>Delivery</b><span>1 trip</span></div>' +
          '<div class="q-checks" data-show="check"><p class="dl1" data-show="check">Prices match the price list</p><p class="dl3" data-show="check">Quantities match the request</p><p class="dl5" data-show="check">460 + 190 + 35 = 685</p></div>' +
        '</div>' +
        '<div class="a-main q-desk"><div class="q-paper">' +
          '<div class="q-head"><div class="q-logo" data-show="brand"><i></i><span>KUDU<br>HARDWARE</span></div><div class="q-title"><b>QUOTATION</b><span class="mono">Q-0148 · 14 Nov 2026</span></div></div>' +
          '<div class="q-to" data-show="client"><span>Quote for</span><b>Mrs T. Dube</b><span>Plot 14, Riverside</span></div>' +
          '<table class="q-table"><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr>' +
            line('q-l1', 'item1', 'Cement 50 kg', '40', '$11.50', '$460.00') + line('q-l2', 'item2', 'River sand (load)', '2', '$95.00', '$190.00') + line('q-l3 dl2', 'item2', 'Delivery', '1', '$35.00', '$35.00') +
          '</table>' +
          '<div class="q-total" data-show="total"><span>Total</span><b data-count="total" data-from="0" data-to="685" data-fmt="money" data-pre="$"></b></div>' +
          '<p class="q-note" data-show="total">Valid for 7 days. Prices in USD.</p>' +
          '<div class="q-stamp" data-show="check">Totals checked</div>' +
        '</div>' +
        '<div class="q-export" data-show="export"><div class="q-pdf"><i></i><b>Q-0148.pdf</b><span>1 page · 84 kB</span></div><div class="a-ok">Waiting for your OK to send</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="a-status"><span>Draft</span><span class="a-grow"></span><span>Sample data: fictional client and business</span></div>';
  },
  steps: [
    { id: 'client', label: 'Entering the client details', cur: '.q-in--name', click: true, d: 1500 },
    { id: 'item1', label: 'Adding the first line item', cur: '.q-item--1', click: true, d: 1300 },
    { id: 'item2', label: 'Adding sand and delivery', cur: '.q-item--2', click: true, d: 1500 },
    { id: 'total', label: 'Calculating the total', cur: '.q-table', at: [.86, 1.25], click: true, d: 1400 },
    { id: 'check', label: 'Checking prices and quantities', cur: '.q-t-check', click: true, d: 1700 },
    { id: 'brand', label: 'Applying the company branding', cur: '.q-t-brand', click: true, d: 1300 },
    { id: 'export', label: 'Quote ready: waiting for your OK', cur: '.q-t-export', click: true, d: 1700 }
  ]
});
