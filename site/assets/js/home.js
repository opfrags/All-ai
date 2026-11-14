/* ALLAI homepage: hero sequence, scroll story, task gallery, service demos, memory visual, closing floor.
   Every block reuses the same scene modules through ALLAI.Player (assets/js/stage.js). */
(function () {
  'use strict';
  var A = window.ALLAI, d = document, root = d.documentElement;
  if (!A || !A.Player) return;
  var q = function (s, c) { return (c || d).querySelector(s); };
  var qa = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };
  var WA = 'https://wa.me/263715096121?text=Hi%2C%20I%27m%20interested%20in%20an%20AI%20employee%20for%20my%20business.';
  var near = function (el, fn, margin) {
    if (!('IntersectionObserver' in window)) return fn();
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); } }, { rootMargin: margin || '500px 0px' });
    io.observe(el);
  };
  var inView = function (el, fn) {
    if (!('IntersectionObserver' in window)) return fn(true);
    new IntersectionObserver(function (es) { es.forEach(function (e) { fn(e.isIntersecting); }); }, { rootMargin: '0px' }).observe(el);
  };
  var chip = function (label, extra) { var b = A.el('button', 'chip'); b.type = 'button'; b.innerHTML = '<span></span>' + (extra || ''); b.firstChild.textContent = label; return b; };

  /* ================= hero: 4 jobs in sequence, then the finished outputs ================= */
  (function hero() {
    var host = q('[data-ws="hero"]'); if (!host) return;
    var order = A.heroOrder, SPEED = A.heroSpeed = 1.75;
    var ws = A.workstation(host, { sides: true });
    var player = new A.Player(ws.main, { speed: SPEED, hold: 900 });
    var job = A.jobPanel(ws.left), tray = A.trayPanel(ws.right, order);
    var reqEl = q('[data-hero-req]'), chipsBox = q('[data-hero-chips]');
    var mode = 'auto', idx = -1, userPaused = false, asmTimer = 0, started = false;

    var asm = A.el('div', 'hero__assemble');
    asm.setAttribute('aria-hidden', 'true');
    asm.innerHTML = '<p>4 jobs finished. Ready for review.</p>' + order.map(function (id, i) {
      var m = A.meta(id);
      return '<figure class="i' + i + '"><img alt="" width="640" height="400" loading="lazy" decoding="async" src="' + A.base + 'img/posters/' + id + '.jpg"><figcaption>' + m.out + '</figcaption></figure>';
    }).join('');
    ws.main.appendChild(asm);

    var chips = order.map(function (id, i) {
      var b = chip(A.meta(id).out, '<i class="chip__bar"></i>');
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { mode = 'single'; userPaused = false; stopAsm(); show(i, true); });
      chipsBox.appendChild(b); return b;
    });
    var mark = function () { chips.forEach(function (c, i) { c.classList.toggle('is-live', i === idx); c.setAttribute('aria-pressed', String(mode === 'single' && i === idx)); if (i !== idx) c.style.setProperty('--p', i < idx && mode === 'auto' ? 1 : 0); }); };
    function stopAsm() { clearTimeout(asmTimer); asmTimer = 0; asm.classList.remove('is-on'); }
    function show(i, typed) {
      idx = i; var id = order[i], meta = A.meta(id);
      player.o.speed = mode === 'auto' ? SPEED : 1;
      player.o.hold = mode === 'auto' ? 900 : 2400;
      mark();
      return player.load(id).then(function (def) {
        if (order[idx] !== id) return;
        job.set(meta, def, typed); if (reqEl) reqEl.textContent = meta.request;
        if (A.reduced() && !started) { player.seek(player.n); tray.all(); return; }
        if (!userPaused) player.play();
      });
    }
    function assemble() {
      idx = -1; mark(); tray.all(); asm.classList.add('is-on');
      asmTimer = setTimeout(function () { stopAsm(); tray.reset(); show(0, true); }, 3800);
    }
    player.o.onEnd = function () {
      tray.add(order[idx]);
      if (mode === 'single') return;
      if (idx < order.length - 1) show(idx + 1, true); else assemble();
    };
    player.on('step', function (k, n) { job.step(k, n); if (chips[idx]) chips[idx].style.setProperty('--p', n ? (k / n).toFixed(3) : 0); });
    A.controls(player, q('[data-hero-ctl]'), {
      handlers: {
        toggle: function () {
          started = true;
          if (asmTimer) { stopAsm(); tray.reset(); mode = 'auto'; show(0, true); return; }
          if (player.state === 'playing') { userPaused = true; player.pause(); } else { userPaused = false; if (player.state === 'done' && mode === 'auto') player.o.onEnd(); else player.play(); }
        },
        replay: function () { started = true; userPaused = false; stopAsm(); tray.reset(); mode = 'auto'; show(0, true); }
      }
    });
    var watch = q('[data-hero-watch]');
    if (watch) watch.addEventListener('click', function () {
      started = true;
      var r = host.getBoundingClientRect();
      if (r.top < 60 || r.bottom > window.innerHeight) host.scrollIntoView({ behavior: A.reduced() ? 'auto' : 'smooth', block: 'center' });
      stopAsm();
      if (userPaused || player.state !== 'playing') { userPaused = false; if (player.k >= player.n) { mode = 'auto'; show((idx + 1 + order.length) % order.length, true); } else player.play(); }
      else { mode = 'auto'; show((idx + 1) % order.length, true); }
    });
    var begin = function () { if (idx < 0 && !asmTimer) show(0, true); };
    if (root.classList.contains('is-ready')) setTimeout(begin, 700);
    else { var t = setInterval(function () { if (root.classList.contains('is-ready')) { clearInterval(t); setTimeout(begin, 900); } }, 80); setTimeout(function () { clearInterval(t); begin(); }, 2600); }
  })();

  /* ================= scroll story: four pinned stages driven by scroll progress ================= */
  (function story() {
    var sec = q('[data-story]'); if (!sec) return;
    var track = q('.story__track', sec), order = A.heroOrder, sceneId = order[0];
    var flatMQ = window.matchMedia('(max-width: 1023px), (max-height: 599px), (prefers-reduced-motion: reduce)');
    var pinned = null, flats = null;
    var split = function (n) { var m = Math.max(1, Math.ceil(n * .45)); return { m: m, cnt: Math.max(0, n - 1 - m) }; };

    function buildPinned() {
      var ws = A.workstation(q('[data-ws="story"]', sec), { sides: false });
      var player = new A.Player(ws.main, { zoom: false });
      var reqEl = q('[data-story-req]', sec), filesEl = q('[data-story-files]', sec), wsBox = q('.story__ws', sec), reqBar = q('.story__req', sec);
      var ts = qa('.story__t', sec), ds = qa('.story__d', sec), rail = qa('.story__rail i', sec), pick = q('[data-story-pick]', sec);
      var meta = null, loaded = false, last = -1;
      var chips = order.map(function (id) {
        var b = chip(A.meta(id).out); b.setAttribute('aria-pressed', String(id === sceneId));
        b.addEventListener('click', function () { sceneId = id; chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); }); load(); });
        pick.appendChild(b); return b;
      });
      function load() {
        loaded = false; meta = A.meta(sceneId);
        filesEl.innerHTML = (meta.files || []).map(function (f, i) { return '<span class="i' + i + '">' + f + '</span>'; }).join('');
        player.load(sceneId).then(function () { loaded = true; last = -1; update(); });
      }
      function update() {
        var r = track.getBoundingClientRect(), span = r.height - window.innerHeight;
        var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        var stage = Math.min(3, Math.floor(p * 4)), t = p * 4 - stage;
        ts.forEach(function (el, i) { el.classList.toggle('is-on', i === stage); el.classList.toggle('is-past', i < stage); });
        ds.forEach(function (el, i) { el.classList.toggle('is-on', i === stage); el.classList.toggle('is-past', i < stage); });
        rail.forEach(function (el, i) { el.style.setProperty('--p', Math.min(1, Math.max(0, p * 4 - i)).toFixed(3)); });
        wsBox.style.setProperty('--s', [.84, .95, 1, 1.05][stage]);
        if (!meta) return;
        var full = meta.request;
        reqEl.textContent = stage === 0 ? full.slice(0, Math.round(full.length * Math.min(1, t / .55))) : full;
        reqBar.style.opacity = stage >= 2 ? 0 : 1;
        reqBar.style.transform = stage === 1 ? 'translateY(-6px) scale(.94)' : stage >= 2 ? 'translateY(-18px) scale(.9)' : '';
        filesEl.classList.toggle('is-on', stage === 0 && t > .55);
        filesEl.classList.toggle('is-in', stage > 0);
        if (!loaded) return;
        var n = player.n, s = split(n), g;
        if (stage === 0) g = 0; else if (stage === 1) g = 1 + t * s.m; else if (stage === 2) g = s.m + 1 + t * s.cnt; else g = n;
        var k = Math.max(0, Math.min(stage === 1 ? s.m : stage === 2 ? Math.max(s.m, n - 1) : n, Math.floor(g)));
        if (stage === 3) k = n;
        if (k < last && g > last - .2 && stage !== 0) k = last;     /* hysteresis when scrubbing back */
        if (k !== last) { last = k; player.goto(k); }
      }
      var ticking = false, onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); } };
      window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
      load(); update();
      return { destroy: function () { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); player.destroy(); pick.textContent = ''; } };
    }

    function buildFlat() {
      var players = [];
      qa('[data-ws="flat"]', sec).forEach(function (host) {
        var stage = +host.getAttribute('data-stage');
        near(host, function () {
          var ws = A.workstation(host, { sides: false });
          var player = new A.Player(ws.main, { loop: stage === 1 || stage === 2, hold: 1800 });
          players.push(player);
          player.load(sceneId).then(function () {
            var n = player.n, s = split(n);
            if (stage === 0) return player.seek(0);
            if (stage === 3) return player.seek(n);
            player.o.from = stage === 1 ? 0 : s.m; player.o.to = stage === 1 ? s.m : Math.max(s.m, n - 1);
            player.seek(A.reduced() ? player.o.to : player.o.from);
            if (!A.reduced()) player.play();
          });
        });
      });
      return { destroy: function () { players.forEach(function (p) { p.destroy(); }); } };
    }
    function apply() {
      var flat = flatMQ.matches;
      sec.classList.toggle('is-flat', flat);
      if (flat) { if (pinned) { pinned.destroy(); pinned = null; } if (!flats) flats = buildFlat(); }
      else { if (flats) { flats.destroy(); flats = null; } if (!pinned) near(sec, function () { if (!flatMQ.matches && !pinned) pinned = buildPinned(); }, '900px 0px'); }
    }
    if (flatMQ.addEventListener) flatMQ.addEventListener('change', apply);
    apply();
  })();

  /* ================= task gallery ================= */
  (function gallery() {
    var box = q('[data-gallery]'); if (!box) return;
    var tabsBox = q('[data-gal-tabs]', box), listBox = q('[data-gal-list]', box);
    var f = { request: q('[data-gal-request]', box), app: q('[data-gal-app]', box), result: q('[data-gal-result]', box), status: q('[data-gal-status]', box), cta: q('[data-gal-cta]', box) };
    var cat = A.cats[0].id, current = null, player = null, shown = false;
    var arrows = function (els, e, vertical) {
      var i = els.indexOf(d.activeElement); if (i < 0) return;
      var next = e.key === (vertical ? 'ArrowDown' : 'ArrowRight') ? 1 : e.key === (vertical ? 'ArrowUp' : 'ArrowLeft') ? -1 : e.key === 'ArrowRight' && vertical ? 1 : e.key === 'ArrowLeft' && vertical ? -1 : 0;
      if (e.key === 'Home') next = -i; if (e.key === 'End') next = els.length - 1 - i;
      if (!next) return;
      e.preventDefault(); var t = els[(i + next + els.length) % els.length]; t.focus(); t.click();
    };
    var tabs = A.cats.map(function (c) {
      var b = chip(c.name); b.setAttribute('role', 'tab'); b.id = 'gal-tab-' + c.id; b.setAttribute('aria-controls', 'gal-panel');
      b.addEventListener('click', function () { cat = c.id; drawTabs(); drawList(true); });
      tabsBox.appendChild(b); return b;
    });
    tabsBox.addEventListener('keydown', function (e) { arrows(tabs, e, false); });
    listBox.addEventListener('keydown', function (e) { arrows(qa('.task', listBox), e, true); });
    function drawTabs() { tabs.forEach(function (b, i) { var on = A.cats[i].id === cat; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; }); }
    function drawList(selectFirst) {
      var items = A.manifest.filter(function (m) { return m.cat === cat; });
      listBox.textContent = '';
      items.forEach(function (m, i) {
        var b = A.el('button', 'task'); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'gal-panel'); b.setAttribute('data-id', m.id);
        b.innerHTML = '<span class="task__n"></span><b></b><span></span>';
        b.children[0].textContent = ('0' + (A.manifest.indexOf(m) + 1)).slice(-2); b.children[1].textContent = m.name; b.children[2].textContent = m.app;
        b.addEventListener('click', function () { select(m.id, true); });
        listBox.appendChild(b);
      });
      if (selectFirst || !items.some(function (m) { return m.id === current; })) select(items[0].id, shown);
      else markList();
    }
    function markList() { qa('.task', listBox).forEach(function (b) { var on = b.getAttribute('data-id') === current; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; }); }
    function select(id, play) {
      current = id; markList();
      var m = A.meta(id);
      f.request.textContent = m.request; f.app.textContent = m.app; f.result.textContent = m.result;
      if (m.status === 'listed') { f.status.innerHTML = '<b>Listed service.</b> This kind of work is part of what All AI offers today.'; f.cta.href = '/plans'; f.cta.firstChild.textContent = 'Get started '; f.cta.removeAttribute('target'); f.cta.removeAttribute('rel'); }
      else { f.status.innerHTML = '<b>Example of computer work.</b> Shown as a demonstration. Ask us whether it fits your job.'; f.cta.href = WA; f.cta.firstChild.textContent = 'Ask on WhatsApp '; f.cta.target = '_blank'; f.cta.rel = 'noopener noreferrer'; }
      if (!player) return;
      player.load(id).then(function () { if (current !== id) return; if (A.reduced() || !play) player.seek(A.reduced() ? player.n : 0); else player.play(); });
    }
    drawTabs(); drawList(true);
    near(box, function () {
      var ws = A.workstation(q('[data-ws="gallery"]', box), { sides: false });
      player = new A.Player(ws.main, { loop: true, hold: 3200 });
      A.controls(player, q('[data-gal-ctl]', box), { scrub: true, stepper: true });
      shown = true; select(current, true);
    }, '300px 0px');
  })();

  /* ================= service demos and the memory scene: lazy, looping, pausable ================= */
  qa('[data-ws="svc"]').forEach(function (host) {
    near(host, function () {
      var id = host.getAttribute('data-scene'), panel = host.closest('.svc__panel');
      var ws = A.workstation(host, { sides: false });
      var player = new A.Player(ws.main, { loop: true, hold: 3000 });
      var ctl = A.el('div', 'svc__ctl'); host.parentNode.insertBefore(ctl, host.nextSibling);
      A.controls(player, ctl, {});
      var la = panel && q('.svc__label--a', panel), lb = panel && q('.svc__label--b', panel);
      player.on('step', function (k, n) { if (la) la.classList.toggle('is-on', k >= Math.ceil(n * .5)); if (lb) lb.classList.toggle('is-on', k >= n); });
      player.load(id).then(function () { if (A.reduced()) player.seek(player.n); else player.play(); });
    }, '250px 0px');
  });

  /* ================= memory visual: stored facts light up as they are used ================= */
  (function mem() {
    var viz = q('[data-memviz]'); if (!viz) return;
    var items = qa('.memviz__item', viz), pairs = [[0, 3], [0, 4], [0, 5], [1, 3], [2, 3]], i = 0, timer = 0;
    var tick = function () { items.forEach(function (el, n) { el.classList.toggle('is-hot', pairs[i].indexOf(n) >= 0); }); i = (i + 1) % pairs.length; };
    if (A.reduced()) { tick(); return; }
    inView(viz, function (on) {
      viz.classList.toggle('is-run', on);
      clearInterval(timer); if (on) { tick(); timer = setInterval(tick, 1800); }
    });
  })();

  /* ================= closing: a floor of finished outputs ================= */
  (function closing() {
    var sec = q('[data-close]'), tiles = q('[data-close-tiles]'); if (!sec || !tiles) return;
    near(sec, function () {
      var ids = A.manifest.map(function (m) { return m.id; }), html = '';
      for (var n = 0; n < 24; n++) html += '<img alt="" width="640" height="400" loading="lazy" decoding="async" src="' + A.base + 'img/posters/' + ids[(n * 5) % ids.length] + '.jpg">';
      tiles.innerHTML = html;
    }, '600px 0px');
    inView(sec, function (on) { sec.classList.toggle('is-paused', !on); });
    d.addEventListener('visibilitychange', function () { if (d.hidden) sec.classList.add('is-paused'); });
  })();
})();
