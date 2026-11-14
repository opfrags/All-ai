/* ALLAI public site: shared behaviour for every page (navigation, reveals, FAQ, pricing toggle, guide button). */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };

  /* headline word masks */
  $('[data-split]').forEach(function (el) {
    var i = 0;
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { f.appendChild(d.createTextNode(' ')); return; }
            var w = d.createElement('span'); w.className = 'w';
            var s = d.createElement('span'); s.textContent = t; s.style.setProperty('--i', i++);
            w.appendChild(s); f.appendChild(w);
          });
          node.replaceChild(f, n);
        } else if (n.nodeType === 1 && n.tagName.toLowerCase() !== 'svg') walk(n);
      });
    })(el);
    el.classList.add('split');
  });

  /* reveal on view */
  var targets = $('.rv, .split');
  if (reduce || !('IntersectionObserver' in window)) targets.forEach(function (t) { t.classList.add('is-in'); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .08 });
    targets.forEach(function (t) { io.observe(t); });
  }
  /* page-load choreography starts once styles and fonts are in */
  var ready = function () { requestAnimationFrame(function () { root.classList.add('is-ready'); }); };
  if (d.fonts && d.fonts.ready) { var done = false, go = function () { if (!done) { done = true; ready(); } }; d.fonts.ready.then(go); setTimeout(go, 900); } else ready();

  /* slim nav: hides while scrolling down, returns on scroll up */
  var nav = $('[data-nav]')[0], lastY = window.scrollY || 0, ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || 0;
    if (nav && !reduce) {
      if (y > 420 && y > lastY + 6 && !d.querySelector('.drawer.is-open')) nav.classList.add('is-hidden');
      else if (y < lastY - 6 || y < 120) nav.classList.remove('is-hidden');
    }
    lastY = y;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* mobile drawer */
  var burger = $('.nv__burger')[0], drawer = $('#drawer')[0];
  if (burger && drawer) {
    var set = function (open, back) {
      burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      drawer.classList.toggle('is-open', open); drawer.setAttribute('aria-hidden', !open); d.body.style.overflow = open ? 'hidden' : '';
      if (open) { var f = $('a[href]', drawer)[0]; if (f) setTimeout(function () { f.focus(); }, 60); } else if (back) burger.focus();
    };
    burger.addEventListener('click', function () { set(burger.getAttribute('aria-expanded') !== 'true', true); });
    d.addEventListener('keydown', function (e) {
      if (burger.getAttribute('aria-expanded') !== 'true') return;
      if (e.key === 'Escape') { set(false, true); return; }
      if (e.key === 'Tab') {
        var f = [burger].concat($('a[href], button', drawer)), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 941px)').addEventListener('change', function () { set(false); });
  }

  /* FAQ: smooth expand and collapse (native <details> stays the source of truth) */
  $('details.qa').forEach(function (q) {
    var sum = q.querySelector('summary'), body = q.querySelector('.qa__a'), anim = null;
    if (!sum || !body || reduce || !body.animate) return;
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (anim) anim.cancel();
      var opening = !q.open || q.classList.contains('is-closing');
      if (opening) {
        q.classList.remove('is-closing'); q.open = true;
        anim = body.animate({ height: ['0px', body.scrollHeight + 'px'], opacity: [0, 1] }, { duration: 420, easing: 'cubic-bezier(.22,.61,.36,1)' });
        anim.onfinish = function () { anim = null; };
      } else {
        q.classList.add('is-closing');
        anim = body.animate({ height: [body.offsetHeight + 'px', '0px'], opacity: [1, 0] }, { duration: 320, easing: 'cubic-bezier(.4,0,.2,1)' });
        anim.onfinish = function () { q.open = false; q.classList.remove('is-closing'); anim = null; };
      }
    });
  });

  /* pricing: show or hide the separately billed add-on line */
  $('[data-price-toggle]').forEach(function (seg) {
    var plans = $('[data-plans]')[0], btns = $('button', seg);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var addon = b.getAttribute('data-v') === 'addon';
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        seg.classList.toggle('is-b', addon);
        if (plans) plans.classList.toggle('is-addon', addon);
      });
    });
  });

  /* guide assistant: the existing bundle builds .mm-dock; it stays hidden until this button is pressed */
  var help = $('[data-help]')[0];
  if (help) {
    var watch = null;
    var close = function () { root.classList.remove('guide-on'); help.focus(); };
    help.addEventListener('click', function () {
      var dock = d.querySelector('.mm-dock');
      if (!dock) { window.location.href = 'https://wa.me/263715096121'; return; }
      root.classList.add('guide-on');
      var avatar = dock.querySelector('.mm-avatar'), bubble = dock.querySelector('.mm-bubble');
      requestAnimationFrame(function () {
        if (bubble && bubble.hidden && avatar) avatar.click();   /* opens the guide's introduction */
        var first = dock.querySelector('.mm-primary, .mm-input, .mm-x'); if (first) first.focus();
      });
      if (!watch && bubble && 'MutationObserver' in window) {
        watch = new MutationObserver(function () { if (bubble.hidden) setTimeout(function () { if (bubble.hidden) close(); }, 250); });
        watch.observe(bubble, { attributes: true, attributeFilter: ['hidden'] });
      }
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('guide-on')) { var b = d.querySelector('.mm-bubble'); if (!b || b.hidden) close(); } });
  }
})();
