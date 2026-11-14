/* Scene: graphic design. Product artwork, type, brand colours and a call to action become one advert
   in square and vertical sizes. Artwork is original. Figures: farm loaf 2 for $2.00. */
(function () {
  var loaf = '<svg class="g-loaf" viewBox="0 0 120 80" aria-hidden="true"><ellipse cx="60" cy="70" rx="46" ry="6" fill="rgba(0,0,0,.25)"/><path d="M14 52c0-22 20-36 46-36s46 14 46 36c0 10-8 16-18 16H32c-10 0-18-6-18-16z" fill="#c98a3d"/><path d="M22 46c2-16 18-24 38-24s36 8 38 24" fill="none" stroke="#e8b673" stroke-width="5" stroke-linecap="round"/><path d="M44 30l8 14M60 26l6 16M76 30l4 14" stroke="#8a5a22" stroke-width="3" stroke-linecap="round"/></svg>';
  var board = function (cls) {
    return '<div class="g-board ' + cls + '"><div class="g-bg"></div><div class="g-prod" data-show="product">' + loaf + '</div><h5 class="g-h"' + (cls === 'g-board--sq' ? ' data-type="type"' : '') + '>Weekend special</h5><p class="g-p"' + (cls === 'g-board--sq' ? ' data-show="type"' : '') + '>Farm loaf, 2 for $2.00</p><span class="g-cta"' + (cls === 'g-board--sq' ? ' data-show="cta"' : '') + '>Order on WhatsApp</span><span class="g-brand"' + (cls === 'g-board--sq' ? ' data-show="brand"' : '') + '>Baobab Bakery</span></div>';
  };
  ALLAI.register({
    id: 'design',
    frame: '.g-canvas',
    start: '.g-layers',
    html: function (ui) {
      return ui.bar({ file: 'Weekend special', app: 'Design canvas', letter: 'D', ico: 'g-ico' }) +
        '<div class="a-tools"><span class="a-t a-t--txt g-t-img" data-sel="product,type">Image</span><span class="a-t a-t--txt g-t-text" data-sel="type,brand">Text</span><span class="a-t a-t--txt g-t-btn" data-sel="cta,align">Button</span><span class="a-t a-t--txt g-t-align" data-sel="align,variants">Align</span><span class="a-grow"></span><span class="a-btn g-t-size" data-sel="variants">Resize</span></div>' +
        '<div class="a-body">' +
          '<div class="a-side a-side--s g-layers"><div class="a-h">Layers</div>' + ui.rows([{ t: 'Button', show: 'cta' }, { t: 'Brand name', show: 'brand' }, { t: 'Offer text', show: 'type' }, { t: 'Headline', show: 'type' }, { t: 'Loaf photo', show: 'product', sel: 'product,type' }, { t: 'Background' }]) + '</div>' +
          '<div class="a-main g-canvas"><div class="g-boards">' + board('g-board--sq') + '<div class="g-vwrap" data-show="variants">' + board('g-board--v') + '</div></div>' +
            '<i class="g-guide g-guide--v" data-on="align"></i><i class="g-guide g-guide--h" data-on="align"></i>' +
            '<div class="g-sizes" data-show="variants"><span>Square 1080 x 1080</span><span>Vertical 1080 x 1920</span></div></div>' +
          '<div class="a-side a-side--r g-props"><div class="a-h">Brand colours</div><div class="g-sw"><i class="g-c1" data-sel="brand,cta"></i><i class="g-c2"></i><i class="g-c3"></i><i class="g-c4"></i></div><div class="a-h">Type</div><div class="a-kv"><span>Headline</span><b>DM Sans 700</b></div><div class="a-kv"><span>Size</span><b>64</b></div><div class="a-h">Export</div><div class="a-kv"><span>Formats</span><b data-count="variants" data-from="1" data-to="2"></b></div></div>' +
        '</div>' +
        '<div class="a-status"><span>2 artboards</span><span class="a-grow"></span><span>Original artwork: fictional business</span></div>';
    },
    steps: [
      { id: 'product', label: 'Placing the product image', cur: '.g-t-img', click: true, drag: '.g-board--sq', dragAt: [.5, .32], d: 1500 },
      { id: 'type', label: 'Setting the headline and offer', cur: '.g-t-text', click: true, d: 1600 },
      { id: 'brand', label: 'Applying the brand colours', cur: '.g-c1', click: true, d: 1400 },
      { id: 'cta', label: 'Adding the call to action', cur: '.g-t-btn', click: true, d: 1300 },
      { id: 'align', label: 'Aligning the layout', cur: '.g-t-align', click: true, d: 1300 },
      { id: 'variants', label: 'Advert ready in square and vertical', cur: '.g-t-size', click: true, d: 1800 }
    ]
  });
})();
