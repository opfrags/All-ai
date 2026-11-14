/* Scene: Blender-style 3D workspace. A product model is adjusted, lit, framed and rendered.
   The 3D view is an original CSS/SVG simulation; the site is not running Blender. */
(function () {
  var bottle = function (cls) {
    return '<svg class="b-bottle ' + cls + '" viewBox="0 0 120 230" aria-hidden="true">' +
      '<defs><linearGradient id="bg-solid" x1="0" x2="1"><stop offset="0" stop-color="#5d6676"/><stop offset=".45" stop-color="#aab2c2"/><stop offset="1" stop-color="#4a5262"/></linearGradient>' +
      '<linearGradient id="bg-mat" x1="0" x2="1"><stop offset="0" stop-color="#0d2f9a"/><stop offset=".3" stop-color="#3f7bff"/><stop offset=".48" stop-color="#b9d0ff"/><stop offset=".62" stop-color="#2563ff"/><stop offset="1" stop-color="#0a1f66"/></linearGradient>' +
      '<linearGradient id="bg-cap" x1="0" x2="1"><stop offset="0" stop-color="#1b1f29"/><stop offset=".5" stop-color="#565f73"/><stop offset="1" stop-color="#12151c"/></linearGradient></defs>' +
      '<g class="b-shape"><rect x="44" y="6" width="32" height="20" rx="4" fill="url(#bg-cap)"/>' +
      '<path class="b-body b-body--solid" d="M48 26v14c0 20-23 22-23 46v112q0 12 12 12h46q12 0 12-12V86c0-24-23-26-23-46V26z" fill="url(#bg-solid)"/>' +
      '<path class="b-body b-body--mat" d="M48 26v14c0 20-23 22-23 46v112q0 12 12 12h46q12 0 12-12V86c0-24-23-26-23-46V26z" fill="url(#bg-mat)"/>' +
      '<g class="b-wire" fill="none" stroke="rgba(255,255,255,.28)" stroke-width=".8"><path d="M25 110h70M25 140h70M25 170h70M27 86h66M40 60h40M60 26v184M42 70v138M78 70v138"/></g>' +
      '<g class="b-label"><rect x="25" y="118" width="70" height="46" fill="#f4f6fb"/><text x="60" y="140" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="800" font-size="13" fill="#0b1a4a">AQUA</text><text x="60" y="153" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="6.5" fill="#4a5368">still water 500 ml</text></g>' +
      '<path class="b-spec" d="M36 92c0-12 6-18 10-22v128c-6 0-10-2-10-8z" fill="rgba(255,255,255,.55)"/></g>' +
      '<path class="b-outline" d="M44 6h32v20h-4v14c0 20 23 22 23 46v112q0 12-12 12H37q-12 0-12-12V86c0-24 23-26 23-46V26h-4z" fill="none" stroke="#7da2ff" stroke-width="2.4" stroke-linejoin="round"/>' +
      '</svg>';
  };
  ALLAI.register({
    id: 'blender',
    frame: '.b-view',
    start: '.b-tl',
    html: function (ui) {
      return ui.bar({ file: 'bottle_product.blend', app: '3D workspace (Blender-style)', letter: '3D', ico: 'b-ico' }) +
        '<div class="a-menu"><span>File</span><span>Edit</span><span>Render</span><span>Window</span><span class="a-grow"></span><span class="b-tab is-on">Layout</span><span class="b-tab">Modeling</span><span class="b-tab">Shading</span><span class="b-tab b-tab--render" data-sel="render">Rendering</span></div>' +
        '<div class="a-body">' +
          '<div class="b-tools"><span class="a-t is-on">' + '<svg viewBox="0 0 12 12"><path d="M2 1l8 5-3.4 1L5 10.5z" fill="currentColor"/></svg></span><span class="a-t b-t-move" data-sel="geo,mat"><svg viewBox="0 0 12 12"><path d="M6 1v10M1 6h10M6 1L4.5 2.8M6 1l1.5 1.8M6 11l-1.5-1.8M6 11l1.5-1.8" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg></span><span class="a-t"><svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="1.1"/></svg></span><span class="a-t"><svg viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.1"/></svg></span></div>' +
          '<div class="a-main b-view">' +
            '<div class="b-vhead"><span>User Perspective</span><span class="b-vmode">Solid</span></div>' +
            '<div class="b-world"><div class="b-floor"></div><div class="b-shadow"></div>' + bottle('b-bottle--work') +
              '<div class="b-gizmo" data-show="geo"><i></i></div>' +
              '<div class="b-light"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><b>Key light</b></div>' +
            '</div>' +
            '<div class="b-camframe" data-show="cam"><span>Camera · 50 mm</span></div>' +
            '<div class="b-render"><div class="b-studio"></div><div class="b-rshadow"></div>' + bottle('b-bottle--final') + '<div class="b-refl"></div></div>' +
            '<div class="b-scan"></div>' +
            '<div class="b-rinfo" data-show="render"><span>Samples <b data-count="render" data-to="128" data-from="0"></b>/128</span><span data-show="done">bottle_hero.png · 1920 × 1080</span></div>' +
          '</div>' +
          '<div class="a-side a-side--r a-side--l b-side">' +
            '<div class="a-h">Outliner</div>' + ui.rows([{ t: 'Scene collection' }, { t: 'Camera', inn: 1, c: 'b-row-cam', sel: 'cam,render' }, { t: 'Key light', inn: 1, c: 'b-row-light', sel: 'light,cam' }, { t: 'Bottle', inn: 1, c: 'b-row-obj', sel: 'sel,light' }, { t: 'Floor', inn: 1 }]) +
            '<div class="a-h">Properties</div>' +
            '<div class="a-kv"><span>Scale Z</span><b class="b-kv-z" data-count="geo" data-from="1" data-to="1.3" data-fmt="dec1"></b></div>' +
            '<div class="a-kv"><span>Material</span><span class="b-swatch" data-sel="mat,light"></span></div>' +
            '<div class="a-kv"><span>Roughness</span><b data-count="mat" data-from="0.5" data-to="0.2" data-fmt="dec1"></b></div>' +
            '<div class="a-kv"><span>Light power</span><b data-count="light" data-from="0" data-to="850" data-suf=" W"></b></div>' +
            '<div class="a-kv"><span>Focal length</span><b data-count="cam" data-from="35" data-to="50" data-suf=" mm"></b></div>' +
            '<div class="b-renderbtn"><span class="a-btn" data-sel="render">Render image</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="b-tl"><span class="b-tl__lab">Timeline</span><div class="b-tl__track"><i class="b-tl__head"></i></div><span class="b-tl__f mono">1 / 120</span></div>';
    },
    steps: [
      { id: 'sel', label: 'Selecting the product model', cur: '.b-bottle--work', at: [.5, .55], click: true, d: 1200 },
      { id: 'geo', label: 'Adjusting the geometry', cur: '.b-gizmo', click: true, drag: '.b-view', dragAt: [.5, .2], d: 1500 },
      { id: 'mat', label: 'Applying materials', cur: '.b-swatch', click: true, d: 1400 },
      { id: 'light', label: 'Positioning the lights', cur: '.b-light', click: true, drag: '.b-view', dragAt: [.24, .26], d: 1500 },
      { id: 'cam', label: 'Framing the camera', cur: '.b-row-cam', click: true, d: 1400 },
      { id: 'render', label: 'Rendering the product shot', cur: '.b-renderbtn .a-btn', click: true, d: 2100 },
      { id: 'done', label: 'Render complete', d: 1300 }
    ]
  });
})();
