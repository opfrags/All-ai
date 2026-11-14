/* ALLAI task-scene engine.
 *
 * A scene is a small module: application markup + an ordered list of steps.
 * State is CUMULATIVE: when step k has run, every step <= k is "on". That makes the
 * same scene playable on a clock (hero, gallery), seekable by scroll in both directions
 * (story) and scrubbable (gallery), with no drift: seek(k) always yields the same DOM.
 *
 * Markup hooks inside a scene (value = step id):
 *   data-show="id"      fades in once the step has run          (.is-on)
 *   data-on="id"        same class, no default styling          (.is-on)
 *   data-hide="id"      fades out once the step has run         (.is-off)
 *   data-sel="a[,b]"    selected from step a until step b       (.is-sel)
 *   data-type="id"      text is typed during the step
 *   data-count="id"     number counts to data-to (data-from, data-fmt, data-pre, data-suf)
 * The scene root also gets .on-<id> for every step that has run (end states), .at-<id> for the
 * step that is playing right now (keyframe animations), and .is-done on the last one.
 *
 * Step: { id, label, d (ms), cur (selector), at ([fx,fy]), click, drag (selector), frame (selector|'full') }
 * CSP: markup is injected with innerHTML but never contains style attributes; all dynamic
 * values are custom properties set through CSSOM.
 */
(function () {
  'use strict';
  var A = window.ALLAI = window.ALLAI || {};
  var W = 640, H = 400;
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  A.reduced = function () { return !!mqReduce.matches; };
  A.base = A.base || '/assets/';
  A.scenes = A.scenes || {};
  var waiting = {}, loading = {}, players = [];

  A.register = function (def) {
    A.scenes[def.id] = def;
    (waiting[def.id] || []).forEach(function (fn) { fn(def); });
    delete waiting[def.id];
  };
  A.meta = function (id) {
    var m = A.manifest || [];
    for (var i = 0; i < m.length; i++) if (m[i].id === id) return m[i];
    return null;
  };
  /* Lazy-load a scene (its stylesheet + script). Scenes already on the page resolve at once. */
  A.load = function (id) {
    if (loading[id]) return loading[id];
    var v = A.v ? '?v=' + A.v : '';
    var css = new Promise(function (res) {
      if (document.querySelector('link[data-scene="' + id + '"]')) return res();
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = A.base + 'css/scenes/' + id + '.css' + v; l.setAttribute('data-scene', id);
      l.onload = l.onerror = function () { res(); };
      document.head.appendChild(l);
    });
    var js = new Promise(function (res, rej) {
      if (A.scenes[id]) return res(A.scenes[id]);
      (waiting[id] = waiting[id] || []).push(res);
      if (document.querySelector('script[data-scene="' + id + '"]')) return;
      var s = document.createElement('script');
      s.src = A.base + 'js/scenes/' + id + '.js' + v; s.async = true; s.setAttribute('data-scene', id);
      s.onerror = function () { delete loading[id]; rej(new Error('Scene failed to load: ' + id)); };
      document.head.appendChild(s);
    });
    loading[id] = Promise.all([js, css]).then(function (r) { return r[0]; });
    return loading[id];
  };

  /* ---------- small markup helpers shared by scenes ---------- */
  var IC = {
    cursor: '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2.5 1.8l12.2 6.4-5.3 1.5-2 5.2z" fill="#2563ff" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3l2.3 2.3 4.7-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play: '<svg class="i-play" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.2v9.6L13 8z" fill="currentColor"/></svg>',
    pause: '<svg class="i-pause" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 3h2.6v10H4.5zM8.9 3h2.6v10H8.9z" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.6v2.6h2.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  A.ui = {
    ic: IC,
    /* window title bar with the agent indicator */
    bar: function (o) {
      return '<div class="win__bar"><span class="win__dots"><i></i><i></i><i></i></span>' +
        '<span class="win__title"><span class="win__ico ' + (o.ico || '') + '">' + (o.letter || '') + '</span><b>' + o.file + '</b><span>' + o.app + '</span></span>' +
        '<span class="agent"><i></i><span class="agent__work">ALLAI agent <em>working</em></span><span class="agent__done">ALLAI agent · done</span></span></div>';
    },
    menu: function (items) { return '<div class="a-menu">' + items.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>'; },
    lines: function (ws, cls) { return ws.map(function (w) { return '<i class="ln ' + (cls || '') + ' w' + w + '"></i>'; }).join(''); },
    rows: function (items) {
      return items.map(function (it) {
        var o = typeof it === 'string' ? { t: it } : it;
        return '<div class="a-row' + (o.inn ? ' a-row--in' : '') + (o.c ? ' ' + o.c : '') + '"' + (o.sel ? ' data-sel="' + o.sel + '"' : '') + (o.show ? ' data-show="' + o.show + '"' : '') + '><i></i>' + o.t + '</div>';
      }).join('');
    }
  };

  function fmt(v, f) {
    if (f === 'money') return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (f === 'int') return Math.round(v).toLocaleString('en-US');
    if (f === 'dec1') return v.toFixed(1);
    return String(Math.round(v));
  }

  /* ---------- Player ---------- */
  function Player(host, opts) {
    var self = this;
    this.host = host;
    this.o = { speed: 1, loop: false, hold: 2600, badge: false, zoom: 'auto' };
    for (var key in (opts || {})) this.o[key] = opts[key];
    this.k = 0; this.n = 0; this.state = 'idle'; this.def = null; this.id = null;
    this._ev = {}; this._timer = 0; this._rem = 0; this._fn = null; this._t0 = 0; this._held = false; this._vis = true; this._gen = 0;
    host.classList.add('scr');
    host.setAttribute('role', 'img');
    this.cam = el('div', 'scr__cam');
    this.canvas = el('div', 'scr__canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.cam.appendChild(this.canvas);
    host.appendChild(this.cam);
    host.appendChild(el('div', 'scr__sweep'));
    if (this.o.badge) { var b = el('div', 'scr__badge'); b.textContent = 'Simulated demonstration'; host.appendChild(b); }
    this.scale = 1;
    var fit = function () {
      var w = host.clientWidth; if (!w) return;
      self.scale = w / W; host.style.setProperty('--k', self.scale.toFixed(5));
      self._reframe(true);
    };
    if ('ResizeObserver' in window) { this._ro = new ResizeObserver(fit); this._ro.observe(host); }
    fit();
    players.push(this);
    if (io) io.observe(host);
  }
  var P = Player.prototype;
  P.on = function (name, fn) { (this._ev[name] = this._ev[name] || []).push(fn); return this; };
  P._emit = function (name, a, b) { var l = this._ev[name] || []; for (var i = 0; i < l.length; i++) l[i](a, b, this); };
  P._setState = function (s) { if (this.state !== s) { this.state = s; this._emit('state', s); } };

  /* mount a scene; returns a promise */
  P.load = function (id) {
    var self = this, gen = ++this._gen;
    this._clear();
    this.host.classList.add('is-loading');
    return A.load(id).then(function (def) {
      if (gen !== self._gen) return def;
      self._mount(def);
      self.host.classList.remove('is-loading');
      self._emit('load', def);
      return def;
    });
  };
  P._mount = function (def) {
    var self = this, meta = A.meta(def.id) || {};
    var old = this.layer;
    if (this._hook && this._hook.destroy) this._hook.destroy();
    this._hook = null;
    this.def = def; this.id = def.id; this.steps = def.steps; this.n = def.steps.length; this.k = 0;
    this.idx = {}; def.steps.forEach(function (s, i) { self.idx[s.id] = i + 1; });
    var layer = el('div', 'scr__layer is-in');
    var root = el('div', 'sc sc-' + def.id);
    root.innerHTML = typeof def.html === 'function' ? def.html(A.ui) : def.html;
    var cur = el('div', 'cur');
    cur.innerHTML = IC.cursor + '<span class="cur__ring"></span><span class="cur__tag">ALLAI</span>';
    var toast = el('div', 'toast');
    toast.innerHTML = '<i>' + IC.check + '</i><b>Done</b><span></span>';
    toast.lastChild.textContent = meta.result || '';
    layer.appendChild(root); layer.appendChild(cur); layer.appendChild(toast);
    this.canvas.appendChild(layer);
    this.layer = layer; this.root = root; this.cur = cur;
    this.host.setAttribute('aria-label', 'Simulated demonstration: ' + (meta.name || def.id) + '. Request: ' + (meta.request || '') + ' Result: ' + (meta.result || ''));
    /* collect step-driven elements */
    var need = function (id, node) { var i = self.idx[id]; if (!i && window.console) console.warn('[ALLAI] unknown step "' + id + '" in scene ' + def.id, node); return i || 0; };
    var grab = function (attr) {
      return [].slice.call(root.querySelectorAll('[' + attr + ']')).map(function (node) {
        var v = node.getAttribute(attr).split(',');
        return { el: node, a: need(v[0].trim(), node), b: v[1] ? need(v[1].trim(), node) : 0 };
      });
    };
    this._show = grab('data-show').concat(grab('data-on'));
    this._hide = grab('data-hide');
    this._sel = grab('data-sel');
    this._type = grab('data-type'); this._type.forEach(function (t) { t.full = t.el.textContent; t.el.textContent = ''; });
    this._count = grab('data-count');
    this._count.forEach(function (c) {
      c.to = parseFloat(c.el.getAttribute('data-to')); c.from = parseFloat(c.el.getAttribute('data-from') || '0');
      c.fmt = c.el.getAttribute('data-fmt') || ''; c.pre = c.el.getAttribute('data-pre') || ''; c.suf = c.el.getAttribute('data-suf') || '';
    });
    root.style.setProperty('--spd', this.o.speed);
    if (def.setup) this._hook = def.setup(root, this) || null;
    this._apply(0, false);
    if (def.start) this._moveTo(def.start, [.5, .5], 0);
    this._reframe(true);
    /* layered transition between scenes */
    if (old) {
      old.classList.add('is-out');
      this.host.classList.remove('is-swap'); void this.host.offsetWidth; this.host.classList.add('is-swap');
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 560);
    }
    requestAnimationFrame(function () { requestAnimationFrame(function () { layer.classList.remove('is-in'); }); });
    this._setState('ready');
    this._emit('step', 0, this.n);
  };

  /* apply the cumulative state for step k; animate=true plays step k's typing/counters */
  P._apply = function (k, animate) {
    var root = this.root, steps = this.steps, i;
    if (!root) return;
    /* on-<id>: cumulative end states. at-<id>: only the live step, for keyframe animations. */
    for (i = 0; i < steps.length; i++) { root.classList.toggle('on-' + steps[i].id, i < k); root.classList.toggle('at-' + steps[i].id, !!animate && i === k - 1); }
    root.classList.toggle('is-done', k >= this.n && this.n > 0);
    root.setAttribute('data-step', k);
    this._show.forEach(function (s) { s.el.classList.toggle('is-on', s.a > 0 && s.a <= k); });
    this._hide.forEach(function (s) { s.el.classList.toggle('is-off', s.a > 0 && s.a <= k); });
    this._sel.forEach(function (s) { s.el.classList.toggle('is-sel', s.a > 0 && s.a <= k && !(s.b && s.b <= k)); });
    var self = this, d = k > 0 ? (steps[k - 1].d || 1200) / this.o.speed : 0;
    this._type.forEach(function (t) {
      stopAnim(t);
      t.el.classList.remove('caret');
      if (t.a < k || (t.a === k && !animate)) t.el.textContent = t.full;
      else if (t.a > k) t.el.textContent = '';
      else self._typeOut(t, Math.min(d * .62, Math.max(380, t.full.length * 34)));
    });
    this._count.forEach(function (c) {
      stopAnim(c);
      var put = function (v) { c.el.textContent = c.pre + fmt(v, c.fmt) + c.suf; };
      if (c.a < k || (c.a === k && !animate)) put(c.to);
      else if (c.a > k) put(c.from);
      else self._countUp(c, put, Math.min(d * .55, 900));
    });
    if (this._hook && this._hook.step) this._hook.step(k > 0 ? steps[k - 1].id : null, k, !!animate);
  };
  function stopAnim(o) { if (o.raf) { cancelAnimationFrame(o.raf); o.raf = 0; } }
  P._typeOut = function (t, dur) {
    var t0 = 0, full = t.full, node = t.el;
    node.textContent = ''; node.classList.add('caret');
    var tick = function (now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / dur);
      node.textContent = full.slice(0, Math.round(full.length * p));
      if (p < 1) t.raf = requestAnimationFrame(tick); else { t.raf = 0; node.classList.remove('caret'); }
    };
    t.raf = requestAnimationFrame(tick);
  };
  P._countUp = function (c, put, dur) {
    var t0 = 0;
    var tick = function (now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      put(c.from + (c.to - c.from) * e);
      if (p < 1) c.raf = requestAnimationFrame(tick); else c.raf = 0;
    };
    c.raf = requestAnimationFrame(tick);
  };

  /* geometry in canvas (design) units, independent of scale and camera */
  P._rect = function (sel) {
    var node = typeof sel === 'string' ? this.root.querySelector(sel) : sel;
    if (!node) { if (window.console) console.warn('[ALLAI] target not found: ' + sel + ' in ' + this.id); return null; }
    var r = node.getBoundingClientRect(), c = this.canvas.getBoundingClientRect();
    if (!c.width || (!r.width && !r.height)) return null;
    var s = c.width / W;
    return { x: (r.left - c.left) / s, y: (r.top - c.top) / s, w: r.width / s, h: r.height / s };
  };
  P._moveTo = function (sel, at, ms) {
    var r = this._rect(sel); if (!r) return;
    at = at || [.5, .5];
    this.cur.style.setProperty('--mt', (ms / 1000).toFixed(3) + 's');
    this.cur.style.setProperty('--x', (r.x + r.w * at[0]).toFixed(1) + 'px');
    this.cur.style.setProperty('--y', (r.y + r.h * at[1]).toFixed(1) + 'px');
  };
  P._click = function () {
    var c = this.cur; c.classList.remove('is-click'); void c.offsetWidth; c.classList.add('is-click');
    setTimeout(function () { c.classList.remove('is-click'); }, 420);
  };
  /* camera: on small screens the view frames the scene's work area so text stays readable */
  P._zoomOn = function () { return this.o.zoom === true || (this.o.zoom === 'auto' && this.host.clientWidth < 520); };
  P._frameFor = function (k) {
    if (!this.def) return 'full';
    var i = k;
    while (i > 0) { var s = this.steps[i - 1]; if (s.frame) return s.frame; i--; }
    return k === 0 ? 'full' : (this.def.frame || 'full');
  };
  P._reframe = function (instant) {
    if (!this.root) return;
    var sel = this._zoomOn() ? this._frameFor(this.k) : 'full', cam = this.cam, k = this.scale;
    if (this._forceFrame) sel = this._forceFrame;
    var z = 1, cx = 0, cy = 0, r = sel !== 'full' ? this._rect(sel) : null;
    if (r) {
      var pad = 10;
      z = Math.max(1, Math.min(this.o.maxZoom || 1.75, W / (r.w + pad * 2), H / (r.h + pad * 2)));
      cx = Math.min(0, Math.max(W * k - W * k * z, W * k / 2 - (r.x + r.w / 2) * k * z));
      cy = Math.min(0, Math.max(H * k - H * k * z, H * k / 2 - (r.y + r.h / 2) * k * z));
    }
    if (instant) { cam.style.transition = 'none'; }
    cam.style.setProperty('--cz', z.toFixed(4)); cam.style.setProperty('--cx', cx.toFixed(1) + 'px'); cam.style.setProperty('--cy', cy.toFixed(1) + 'px');
    if (instant) { void cam.offsetWidth; cam.style.transition = ''; }
  };
  /* force a framing from outside (scroll story); null returns to automatic */
  P.frame = function (sel) { this._forceFrame = sel || null; this._reframe(false); };

  /* pausable single timer */
  P._after = function (ms, fn) {
    var self = this;
    this._fn = fn; this._rem = ms; this._t0 = Date.now();
    if (this._held) return;
    this._timer = setTimeout(function () { self._timer = 0; self._fn = null; fn(); }, ms);
  };
  P._hold = function () {
    if (this._held) return; this._held = true;
    if (this._timer) { clearTimeout(this._timer); this._timer = 0; this._rem = Math.max(0, this._rem - (Date.now() - this._t0)); }
  };
  P._release = function () {
    if (!this._held) return; this._held = false;
    if (this._fn) this._after(this._rem, this._fn);
  };
  P._clear = function () { if (this._timer) clearTimeout(this._timer); this._timer = 0; this._fn = null; this._rem = 0; };
  P._sync = function () {
    var blocked = !this._vis || document.hidden;
    if (blocked) this._hold(); else this._release();
  };

  /* run step k: move the cursor first, then (on arrival) the click and its effect */
  P._enter = function (k, chain) {
    var self = this, st = this.steps[k - 1], d = (st.d || 1200) / this.o.speed;
    var mt = st.cur ? Math.min(620 / Math.max(1, this.o.speed * .8), d * .42) : 0;
    if (A.reduced()) mt = Math.min(mt, 60);
    this.k = k;
    if (st.cur) this._moveTo(st.cur, st.at, mt);
    this._reframe(false);
    this._emit('step', k, this.n);
    this._after(mt, function () {
      if (st.click) self._click();
      self._apply(k, true);
      var rest = d - mt;
      if (st.drag) {
        self.cur.classList.add('is-drag');
        self._moveTo(st.drag, st.dragAt, rest * .7);
        setTimeout(function () { self.cur.classList.remove('is-drag'); }, rest * .75);
      }
      if (chain) self._after(rest, function () { self._next(); });
      else if (k >= self.n) self._emit('done');
    });
  };
  P._next = function () {
    var self = this;
    if (this.state !== 'playing') return;
    if (this.k >= (this.o.to || this.n)) {
      this._setState('done'); this._emit('done');
      if (this.o.loop) this._after(this.o.hold, function () { self.replay(); });
      else if (this.o.onEnd) this._after(this.o.hold, function () { self.o.onEnd(self); });
      return;
    }
    this._enter(this.k + 1, true);
  };
  P.play = function () {
    if (!this.def) return;
    if (this.k >= (this.o.to || this.n)) this.seek(this.o.from || 0);
    this._clear();
    this._setState('playing');
    this._sync();
    var self = this;
    this._after(this.k === 0 ? 450 / this.o.speed : 80, function () { self._next(); });
  };
  P.pause = function () {
    if (this.state !== 'playing') return;
    this._clear();
    this._apply(this.k, false);
    this._setState('paused');
  };
  P.toggle = function () { if (this.state === 'playing') this.pause(); else this.play(); };
  P.replay = function () { this.seek(this.o.from || 0); this.play(); };
  /* jump to step k without animation (idempotent, any direction) */
  P.seek = function (k) {
    if (!this.def) return;
    var self = this, host = this.host, was = this.state === 'playing';
    k = Math.max(0, Math.min(this.n, Math.round(k)));
    this._clear();
    host.classList.add('is-snap');
    this.k = k;
    this._apply(k, false);
    var j = k; while (j > 0 && !this.steps[j - 1].cur) j--;
    if (j > 0) { var st = this.steps[j - 1]; this._moveTo(st.drag || st.cur, st.drag ? st.dragAt : st.at, 0); }
    else if (this.def.start) this._moveTo(this.def.start, [.5, .5], 0);
    this._reframe(true);
    void host.offsetWidth;
    requestAnimationFrame(function () { host.classList.remove('is-snap'); });
    this._emit('step', k, this.n);
    if (was) { if (k >= this.n) this._setState('done'); else this._after(500, function () { self._next(); }); }
    else if (this.state !== 'ready' || k > 0) this._setState(k >= this.n ? 'done' : 'paused');
  };
  /* scroll driver: one step forward plays that step, anything else snaps */
  P.goto = function (k) {
    if (!this.def) return;
    k = Math.max(0, Math.min(this.n, Math.round(k)));
    if (k === this.k) return;
    if (k === this.k + 1 && !A.reduced()) { this._clear(); this._apply(this.k, false); this._setState('scrub'); this._enter(k, false); }
    else { this.seek(k); this._setState('scrub'); }
  };
  P.duration = function () { var t = 0; (this.steps || []).forEach(function (s) { t += s.d || 1200; }); return t; };
  P.destroy = function () {
    this._clear(); this._gen++;
    if (this._hook && this._hook.destroy) this._hook.destroy();
    if (this._ro) this._ro.disconnect();
    if (io) io.unobserve(this.host);
    var i = players.indexOf(this); if (i >= 0) players.splice(i, 1);
    this.host.textContent = '';
  };

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      for (var i = 0; i < players.length; i++) if (players[i].host === e.target) { players[i]._vis = e.isIntersecting; players[i]._sync(); players[i]._emit('visible', e.isIntersecting); }
    });
  }, { rootMargin: '80px 0px' }) : null;
  document.addEventListener('visibilitychange', function () { players.forEach(function (p) { p._sync(); }); });

  function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
  A.el = el;
  A.Player = Player;
  A.players = players;

  /* ---------- player controls (pause/play, replay, step label, scrubber) ---------- */
  A.controls = function (player, box, o) {
    o = o || {};
    box.classList.add('pl');
    box.innerHTML =
      '<button type="button" class="pl__btn" data-act="toggle" aria-label="Pause demonstration">' + IC.play + IC.pause + '</button>' +
      '<button type="button" class="pl__btn" data-act="replay" aria-label="Replay demonstration">' + IC.replay + '</button>' +
      (o.stepper ? '<button type="button" class="pl__btn" data-act="prev" aria-label="Previous step">' + IC.prev + '</button><button type="button" class="pl__btn" data-act="next" aria-label="Next step">' + IC.next + '</button>' : '') +
      '<div class="pl__meta"><div class="pl__step" aria-live="off"><span class="pl__n"></span><b></b></div>' +
      (o.scrub ? '<input class="pl__scrub" type="range" min="0" max="1" step="1" value="0" aria-label="Scrub through the demonstration steps">' : '') + '</div>';
    var tgl = box.querySelector('[data-act="toggle"]'), lab = box.querySelector('.pl__step b'), num = box.querySelector('.pl__n'), scrub = box.querySelector('.pl__scrub');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var act = b.getAttribute('data-act');
      if (o.onUser) o.onUser(act);
      if (o.handlers && o.handlers[act]) { o.handlers[act](); return; }
      if (act === 'toggle') player.toggle();
      else if (act === 'replay') player.replay();
      else if (act === 'prev') { player.pause(); player.seek(player.k - 1); }
      else if (act === 'next') { player.pause(); player.seek(player.k + 1); }
    });
    if (scrub) scrub.addEventListener('input', function () { if (o.onUser) o.onUser('scrub'); if (player.state === 'playing') player.pause(); player.seek(+scrub.value); });
    player.on('state', function (s) {
      var playing = s === 'playing';
      box.classList.toggle('is-playing', playing);
      tgl.setAttribute('aria-label', playing ? 'Pause demonstration' : 'Play demonstration');
    });
    player.on('step', function (k, n) {
      var st = k > 0 ? player.steps[k - 1] : null;
      num.textContent = (k < 10 ? '0' : '') + k + ' / ' + (n < 10 ? '0' : '') + n;
      lab.textContent = st ? st.label : 'Starting state';
      if (scrub) { scrub.max = n; scrub.value = k; scrub.style.setProperty('--fill', (n ? k / n * 100 : 0) + '%'); scrub.setAttribute('aria-valuetext', 'Step ' + k + ' of ' + n + (st ? ': ' + st.label : '')); }
    });
  };

  /* ---------- companion screens ---------- */
  /* left: the job (request, files, step checklist) */
  A.jobPanel = function (host) {
    host.innerHTML = '<div class="side"><div class="side__h"><i></i>Job</div><div class="side__b">' +
      '<div class="side__req"><span class="side__from">Request</span><span class="side__txt"></span></div>' +
      '<div class="side__files"></div><ol class="side__steps"></ol></div><div class="side__bar"><i></i></div></div>';
    var txt = host.querySelector('.side__txt'), files = host.querySelector('.side__files'), list = host.querySelector('.side__steps'), bar = host.querySelector('.side__bar i'), raf = 0;
    return {
      set: function (meta, def, typed) {
        cancelAnimationFrame(raf);
        var full = meta.request, t0 = 0;
        files.innerHTML = (meta.files || []).map(function (f) { return '<span class="side__file">' + f + '</span>'; }).join('');
        list.innerHTML = def.steps.map(function (s) { return '<li>' + s.label + '</li>'; }).join('');
        bar.style.setProperty('--p', 0);
        var showFiles = function () { [].forEach.call(files.children, function (f, i) { setTimeout(function () { f.classList.add('is-on'); }, typed ? 120 * i : 0); }); };
        if (!typed || A.reduced()) { txt.textContent = full; txt.classList.remove('caret'); showFiles(); return; }
        txt.textContent = ''; txt.classList.add('caret');
        var tick = function (now) {
          if (!t0) t0 = now;
          var p = Math.min(1, (now - t0) / Math.min(1500, full.length * 26));
          txt.textContent = full.slice(0, Math.round(full.length * p));
          if (p < 1) raf = requestAnimationFrame(tick); else { txt.classList.remove('caret'); showFiles(); }
        };
        raf = requestAnimationFrame(tick);
      },
      step: function (k, n) {
        [].forEach.call(list.children, function (li, i) { li.classList.toggle('is-ok', i < k - 1 || k >= n); li.classList.toggle('is-now', i === k - 1 && k < n); });
        bar.style.setProperty('--p', n ? (k / n).toFixed(3) : 0);
        var now = list.children[Math.max(0, k - 1)];
        if (now && list.scrollHeight > list.clientHeight) list.scrollTop = Math.max(0, now.offsetTop - list.offsetTop - list.clientHeight / 2);
      }
    };
  };
  /* right: finished work tray */
  A.trayPanel = function (host, ids) {
    host.innerHTML = '<div class="side"><div class="side__h"><i></i>Finished work</div><div class="side__b"><div class="side__tray">' +
      ids.map(function (id) { var m = A.meta(id) || {}; return '<div class="side__out" data-id="' + id + '"><img alt="" loading="lazy" decoding="async" width="640" height="400" src="' + A.base + 'img/posters/' + id + '.jpg"><b>' + (m.out || m.name || id) + '</b></div>'; }).join('') +
      '</div><p class="side__note">Sample outputs from the demonstrations.</p></div></div>';
    return {
      reset: function () { [].forEach.call(host.querySelectorAll('.side__out'), function (o) { o.classList.remove('is-on'); }); },
      add: function (id) { var o = host.querySelector('.side__out[data-id="' + id + '"]'); if (o) o.classList.add('is-on'); },
      all: function () { [].forEach.call(host.querySelectorAll('.side__out'), function (o) { o.classList.add('is-on'); }); }
    };
  };

  /* build a workstation: one main monitor, optionally two companions */
  A.workstation = function (host, o) {
    o = o || {};
    host.classList.add('ws'); if (!o.sides) host.classList.add('ws--solo');
    var mon = function (cls) { return '<div class="mon ' + cls + '"><div class="mon__frame"><div class="mon__screen"></div><span class="mon__chin">Simulated demonstration</span></div><div class="mon__neck"></div><div class="mon__base"></div></div>'; };
    host.innerHTML = '<div class="ws__glow"></div><div class="ws__row">' + (o.sides ? mon('mon--side mon--l') : '') + mon('mon--main') + (o.sides ? mon('mon--side mon--r') : '') + '</div><div class="ws__desk"></div>';
    var q = function (s) { var m = host.querySelector(s); return m ? m.querySelector('.mon__screen') : null; };
    return { main: q('.mon--main'), left: q('.mon--l'), right: q('.mon--r') };
  };
})();
