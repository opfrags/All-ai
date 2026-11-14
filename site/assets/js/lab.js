/* Scene lab: opens any scene on its own (development and review aid). */
(function () {
  'use strict';
  var A = window.ALLAI, q = new URLSearchParams(location.search);
  var id = q.get('id') || 'word', step = q.get('step'), w = q.get('w');
  var nav = document.querySelector('.lab__nav');
  A.manifest.forEach(function (m) {
    var a = document.createElement('a'); a.href = '?id=' + m.id; a.textContent = m.name; if (m.id === id) a.setAttribute('aria-current', 'page');
    nav.appendChild(a);
  });
  var mon = document.querySelector('[data-lab]');
  if (w) mon.style.setProperty('--lab-w', (+w) + 'px');
  var ws = A.workstation(mon, { sides: false });
  var player = new A.Player(ws.main, { loop: step === null, zoom: q.get('zoom') === '1' ? true : 'auto' });
  window.__player = player;
  A.controls(player, document.querySelector('[data-lab-ctl]'), { scrub: true, stepper: true });
  var m = A.meta(id) || {};
  var meta = document.querySelector('[data-lab-meta]');
  [['Request', m.request], ['Application', m.app], ['Result', m.result], ['Status', m.status === 'listed' ? 'Listed ALLAI service' : 'Example of computer work (ask us)']].forEach(function (r) {
    var dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = r[0]; dd.textContent = r[1] || ''; meta.appendChild(dt); meta.appendChild(dd);
  });
  player.load(id).then(function () {
    document.documentElement.setAttribute('data-lab-ready', '1');
    if (step !== null) player.seek(step === 'end' ? player.n : +step);
    else if (!A.reduced()) player.play(); else player.seek(player.n);
  });
})();
