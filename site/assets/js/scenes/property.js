/* Scene: 3D property walkthrough. An illustrative model is prepared from a SUPPLIED floor plan,
   navigation points are placed and a walkthrough is previewed. It is labelled as illustrative:
   nothing here suggests that ordinary photos produce a dimensionally accurate reconstruction. */
(function () {
  var plan = '<svg class="h-plan" viewBox="0 0 200 150" aria-hidden="true">' +
    '<g class="h-walls" fill="none" stroke="#dfe5f2" stroke-width="2.4" stroke-linejoin="round"><path pathLength="1" d="M10 10H190V140H10Z"/><path pathLength="1" d="M110 10V78M10 78H78M96 78H190M110 78V140M60 78V140"/></g>' +
    '<g class="h-labels" font-family="DM Sans, sans-serif" font-size="8" fill="#8e97aa"><text x="60" y="46" text-anchor="middle">Lounge</text><text x="150" y="46" text-anchor="middle">Kitchen</text><text x="35" y="112" text-anchor="middle">Bath</text><text x="85" y="112" text-anchor="middle">Bed 2</text><text x="150" y="112" text-anchor="middle">Bed 1</text></g>' +
    '<path class="h-path" pathLength="1" d="M60 58C90 70 120 60 150 58C150 80 150 96 150 100C120 96 100 92 85 100" fill="none" stroke="#7da2ff" stroke-width="1.6" stroke-dasharray="1" stroke-dashoffset="1"/>' +
    [[60, 58, 1], [150, 58, 2], [150, 100, 3], [85, 100, 4]].map(function (p) { return '<g class="h-pt h-pt' + p[2] + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" fill="#2563ff" stroke="#fff" stroke-width="1.4"/><text x="' + p[0] + '" y="' + (p[1] + 3) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="8" font-weight="700" fill="#fff">' + p[2] + '</text></g>'; }).join('') + '</svg>';
  var room = function (cls, wall, floor, extra) {
    return ALLAI.ui.media(cls === 'h-r1' ? 'property-lounge' : 'property-kitchen', '<svg class="h-room ' + cls + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="320" height="200" fill="' + wall + '"/><path d="M0 0L90 44V150L0 200Z" fill="rgba(0,0,0,.14)"/><path d="M320 0L230 44V150L320 200Z" fill="rgba(0,0,0,.2)"/><path d="M0 200L90 150H230L320 200Z" fill="' + floor + '"/><path d="M0 0L90 44H230L320 0Z" fill="rgba(255,255,255,.1)"/><rect x="130" y="62" width="60" height="46" fill="#bcd6ff"/><path d="M160 62V108M130 85H190" stroke="#fff" stroke-width="2"/>' + extra + '</svg>', 'h-room ' + cls);
  };
  ALLAI.register({
    id: 'property',
    frame: '.h-view',
    start: '.h-side',
    html: function (ui) {
      return ui.bar({ file: 'Unit 4 walkthrough', app: '3D floor-plan viewer', letter: '3D', ico: 'h-ico' }) +
        '<div class="a-tools"><span class="a-t a-t--txt h-t-plan" data-sel="plan,walls">Import plan</span><span class="a-t a-t--txt h-t-walls" data-sel="walls,points">Raise walls</span><span class="a-t a-t--txt h-t-pts" data-sel="points,path">Add points</span><span class="a-t a-t--txt h-t-path" data-sel="path,preview">Connect</span><span class="a-grow"></span><span class="a-btn h-t-prev" data-sel="preview">Preview</span></div>' +
        '<div class="a-body">' +
          '<div class="a-side a-side--l h-side"><div class="a-h">Floor plan (supplied)</div><div class="h-planbox">' + plan + '</div>' +
            '<div class="a-h">Stops</div>' + ui.rows([{ t: '1 · Lounge', show: 'points', sel: 'preview,walk' }, { t: '2 · Kitchen', show: 'points', c: 'dl1', sel: 'walk' }, { t: '3 · Bedroom 1', show: 'points', c: 'dl2' }, { t: '4 · Bedroom 2', show: 'points', c: 'dl3' }]) + '</div>' +
          '<div class="a-main h-view">' +
            '<div class="h-iso"><div class="h-floor"><i class="h-w h-w1"></i><i class="h-w h-w2"></i><i class="h-w h-w3"></i><i class="h-w h-w4"></i><i class="h-w h-w5"></i><i class="h-w h-w6"></i></div></div>' + ui.media('property-model', '', 'h-model') +
            '<div class="h-walk">' + room('h-r1', '#d9d2c5', '#b08a5f', '<rect x="96" y="124" width="92" height="30" rx="5" fill="#3d5a9e"/><rect x="100" y="112" width="84" height="18" rx="5" fill="#4a69b3"/>') + room('h-r2', '#cfd8dc', '#9aa4ad', '<rect x="92" y="118" width="136" height="36" fill="#f3f4f7"/><rect x="92" y="114" width="136" height="6" fill="#5b6478"/><rect x="200" y="70" width="26" height="44" fill="#e9ecf2"/>') +
              '<div class="h-hud"><span class="h-stop"><em class="h-s1">1 · Lounge</em><em class="h-s2">2 · Kitchen</em></span><span class="h-dots"><i></i><i></i><i></i><i></i></span></div></div>' +
            '<div class="h-note">Illustrative model from the supplied plan. Not a survey.</div>' +
          '</div>' +
        '</div>' +
        '<div class="a-status"><span>Scale: as drawn on the plan</span><span class="a-grow"></span><span>Illustrative property</span></div>';
    },
    steps: [
      { id: 'plan', label: 'Importing the supplied floor plan', cur: '.h-t-plan', click: true, d: 1600, frame: 'full' },
      { id: 'walls', label: 'Raising the walls into a model', cur: '.h-t-walls', click: true, d: 1600 },
      { id: 'points', label: 'Placing four navigation points', cur: '.h-t-pts', click: true, drag: '.h-planbox', dragAt: [.72, .62], d: 1700 },
      { id: 'path', label: 'Connecting the walkthrough path', cur: '.h-t-path', click: true, d: 1400 },
      { id: 'preview', label: 'Previewing the walkthrough', cur: '.h-t-prev', click: true, d: 1500, frame: '.h-view' },
      { id: 'walk', label: 'Moving to the next stop', cur: '.h-dots', d: 2000 },
      { id: 'done', label: 'Walkthrough ready: four stops', d: 1300 }
    ]
  });
})();
