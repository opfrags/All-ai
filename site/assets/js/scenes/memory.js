/* Scene: business memory. A price supplied earlier is recalled and used correctly in a new task. */
ALLAI.register({
  id: 'memory',
  frame: '.m-doc@w',
  start: '.m-search',
  html: function (ui) {
    var row = function (cls, name, unit, price) { return '<tr class="' + cls + '"><td>' + name + '</td><td>' + unit + '</td><td class="m-pr">' + price + '</td></tr>'; };
    return ui.bar({ file: 'Price list.xlsx', app: 'Shared business memory', letter: 'M', ico: 'm-ico' }) +
      '<div class="a-body">' +
        '<div class="a-side a-side--l m-mem"><div class="a-h">Business memory</div>' +
          '<div class="m-search" data-sel="recall,link"><svg viewBox="0 0 12 12"><circle cx="5" cy="5" r="3.4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M7.6 7.6L11 11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg><span data-type="recall">cement price</span></div>' +
          '<div class="m-card m-card--hit" data-sel="recall,done"><span>Price · told to you on 6 Nov</span><b>Cement 50 kg: $11.50</b></div>' +
          '<div class="m-card"><span>Price</span><b>Delivery in town: $35.00</b></div>' +
          '<div class="m-card"><span>Customer</span><b>Mrs Dube, account 0148</b></div>' +
          '<div class="m-card"><span>The way you work</span><b>Quotes valid for 7 days</b></div>' +
        '</div>' +
        '<div class="a-main m-desk">' +
          '<svg class="m-wire" viewBox="0 0 490 370" aria-hidden="true"><path d="M-6 96C90 96 110 150 392 150" fill="none" stroke="#7da2ff" stroke-width="1.6" stroke-dasharray="520" stroke-dashoffset="520"/><circle cx="392" cy="150" r="4" fill="#7da2ff"/></svg>' +
          '<div class="m-doc"><div class="m-dhead"><b>Price list</b><span class="m-date"><em data-hide="done">Last updated 2 Oct</em><em class="m-new" data-show="done">Updated 14 Nov</em></span></div>' +
          '<table class="m-table"><tr><th>Product</th><th>Unit</th><th>Price</th></tr>' +
            '<tr class="m-row-cem" data-sel="open,done"><td>Cement 50 kg</td><td>bag</td><td class="m-pr"><s data-show="apply">$10.80</s><b class="m-old" data-hide="apply">$10.80</b><b class="m-newp" data-show="apply">$11.50</b><i class="m-tag" data-show="apply">from memory</i></td></tr>' +
            '<tr class="m-row-pack"><td>Cement, 10 bags</td><td>pack</td><td class="m-pr"><b class="m-old" data-hide="recalc">$108.00</b><b class="m-newp" data-show="recalc">$115.00</b></td></tr>' +
            row('', 'River sand', 'load', '$95.00') + row('', 'Roof sheets', 'sheet', '$30.00') + row('', 'Paint 5 L', 'tin', '$18.00') +
          '</table>' +
          '<p class="m-foot" data-show="done">Source: your message of 6 Nov. Nothing was asked twice.</p></div>' +
        '</div>' +
      '</div>' +
      '<div class="a-status"><span>Memory: 4 items</span><span class="a-grow"></span><span>Sample data: fictional business</span></div>';
  },
  steps: [
    { id: 'open', label: 'Opening the price list', cur: '.m-row-cem', at: [.3, .5], click: true, d: 1300 },
    { id: 'recall', label: 'Recalling the stored price', cur: '.m-search', click: true, d: 1600, frame: 'full' },
    { id: 'link', label: 'Linking memory to the document', cur: '.m-card--hit', click: true, drag: '.m-row-cem', dragAt: [.86, .5], d: 1700 },
    { id: 'apply', label: 'Applying the stored price', cur: '.m-row-cem', at: [.86, .5], click: true, d: 1400, frame: '.m-doc@w' },
    { id: 'recalc', label: 'Updating prices that depend on it', cur: '.m-row-pack', at: [.86, .5], click: true, d: 1300 },
    { id: 'done', label: 'Price list updated from memory', d: 1500 }
  ]
});
