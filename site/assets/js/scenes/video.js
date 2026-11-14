/* Scene: video editing. Clips are trimmed, captioned, colour corrected and scored into a 15-second advert.
   The "footage" is original illustrated artwork (no third-party media). */
(function () {
  var art = function (k) {
    var a = {
      oven: '<rect width="160" height="90" fill="#1c1410"/><rect x="34" y="18" width="92" height="56" rx="6" fill="#2b1d14"/><rect x="42" y="26" width="76" height="40" rx="4" fill="#ff9a3d"/><rect x="42" y="26" width="76" height="40" rx="4" fill="url(#vg)"/><ellipse cx="64" cy="54" rx="13" ry="7" fill="#b8742f"/><ellipse cx="96" cy="54" rx="13" ry="7" fill="#c98a3d"/><rect x="0" y="78" width="160" height="12" fill="#120c09"/>',
      shelf: '<rect width="160" height="90" fill="#e9dcc8"/><rect x="0" y="40" width="160" height="5" fill="#8a6a45"/><rect x="0" y="80" width="160" height="6" fill="#8a6a45"/><ellipse cx="34" cy="31" rx="20" ry="10" fill="#c98a3d"/><ellipse cx="80" cy="31" rx="20" ry="10" fill="#b8742f"/><ellipse cx="126" cy="31" rx="20" ry="10" fill="#d49a4f"/><ellipse cx="56" cy="71" rx="20" ry="10" fill="#d49a4f"/><ellipse cx="104" cy="71" rx="20" ry="10" fill="#c98a3d"/>',
      counter: '<rect width="160" height="90" fill="#24345c"/><rect x="0" y="58" width="160" height="32" fill="#a9825a"/><rect x="62" y="26" width="36" height="40" rx="3" fill="#f1e2c6"/><path d="M62 26l6-8h24l6 8z" fill="#dcc9a6"/><rect x="72" y="40" width="16" height="10" rx="2" fill="#2563ff"/><circle cx="130" cy="30" r="12" fill="#ffd9a0" opacity=".9"/>'
    };
    return ALLAI.ui.media('video-clip-' + { oven: 1, shelf: 2, counter: 3 }[k], '<svg class="v-art" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="vg" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="#ffe0a3"/><stop offset="1" stop-color="#ff7a1a" stop-opacity=".2"/></radialGradient></defs>' + a[k] + '</svg>');
  };
  var wave = '<svg class="v-wave" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10' + (function () { var s = ''; for (var i = 0; i < 100; i++) { var h = 2 + Math.abs(Math.sin(i * .7) * 6 + Math.sin(i * .23) * 3); s += 'M' + (i * 3 + 1) + ' ' + (10 - h).toFixed(1) + 'V' + (10 + h).toFixed(1); } return s; })() + '" stroke="#7da2ff" stroke-width="1.4" fill="none"/></svg>';
  ALLAI.register({
    id: 'video',
    frame: '.v-top',
    start: '.v-bin',
    html: function (ui) {
      return ui.bar({ file: 'bakery-advert', app: 'Video editor', letter: 'V', ico: 'v-ico' }) +
        '<div class="v-top">' +
          '<div class="v-bin"><div class="a-h">Media</div><div class="v-clips"><div class="v-clip" data-sel="import,trim">' + art('oven') + '<span>clip-01</span></div><div class="v-clip">' + art('shelf') + '<span>clip-02</span></div><div class="v-clip">' + art('counter') + '<span>clip-03</span></div></div></div>' +
          '<div class="v-mon"><div class="v-screen"><div class="v-f v-f1">' + art('oven') + '</div><div class="v-f v-f2">' + art('shelf') + '</div><div class="v-f v-f3">' + art('counter') + '</div>' +
            '<div class="v-cap v-cap1" data-show="captions">Fresh bread, baked every morning.</div><div class="v-cap v-cap2">Pies, scones and farm loaves.</div><div class="v-cap v-cap3">Baobab Bakery. Open 6am to 6pm.</div>' +
            '<div class="v-export" data-show="done"><b>bakery-advert.mp4</b><span>00:15 · 1080p · captions on</span></div></div>' +
            '<div class="v-tc mono"><span class="v-playb" data-sel="play,done"><svg viewBox="0 0 12 12"><path d="M3.5 2v8l7-4z" fill="currentColor"/></svg></span><span class="v-dur"><em data-hide="trim">00:21</em><em class="v-d15" data-show="trim">00:15</em></span></div></div>' +
          '<div class="v-insp"><div class="a-h">Colour</div><div class="v-sl" data-sel="color,music"><span>Warmth</span><i><b></b></i></div><div class="v-sl" data-sel="color,music"><span>Contrast</span><i><b></b></i></div><div class="a-h">Audio</div><div class="v-sl v-sl--m" data-sel="music,play"><span>Music</span><i><b></b></i></div><div class="v-tools"><span class="a-t a-t--txt v-t-trim" data-sel="trim,captions">Trim</span><span class="a-t a-t--txt v-t-cap" data-sel="captions,color">Captions</span></div></div>' +
        '</div>' +
        '<div class="v-tl"><div class="v-ruler mono"><span>0s</span><span>5s</span><span>10s</span><span>15s</span><span>20s</span></div>' +
          '<div class="v-track"><b>V1</b><div class="v-lane"><i class="v-seg v-seg1" data-show="import"></i><i class="v-seg v-seg2 dl1" data-show="import"></i><i class="v-seg v-seg3 dl2" data-show="import"></i></div></div>' +
          '<div class="v-track"><b>T1</b><div class="v-lane"><i class="v-cseg v-cseg1" data-show="captions"></i><i class="v-cseg v-cseg2 dl1" data-show="captions"></i><i class="v-cseg v-cseg3 dl2" data-show="captions"></i></div></div>' +
          '<div class="v-track"><b>A1</b><div class="v-lane"><div class="v-aseg" data-show="music">' + wave + '</div></div></div>' +
          '<i class="v-head"></i></div>';
    },
    steps: [
      { id: 'import', label: 'Placing the clips on the timeline', cur: '.v-clip', click: true, drag: '.v-seg2', d: 1500, frame: 'full' },
      { id: 'trim', label: 'Trimming to 15 seconds', cur: '.v-t-trim', click: true, d: 1500 },
      { id: 'captions', label: 'Adding captions', cur: '.v-t-cap', click: true, d: 1500 },
      { id: 'color', label: 'Adjusting the colour', cur: '.v-sl', at: [.7, .7], click: true, d: 1400 },
      { id: 'music', label: 'Adding music', cur: '.v-sl--m', at: [.7, .7], click: true, d: 1400 },
      { id: 'play', label: 'Playing back the advert', cur: '.v-playb', click: true, d: 3200, frame: '.v-top' },
      { id: 'done', label: 'Advert ready: 15 seconds', d: 1500 }
    ]
  });
})();
