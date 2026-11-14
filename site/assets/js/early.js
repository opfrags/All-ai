/* Runs before first paint (synchronous, same-origin, CSP-safe).
   - marks the document as scripted, so reveal animations only hide content when JS can show it again
   - keeps the existing guide assistant (static/pub/public-ui.js) from opening by itself: it now opens
     only when the visitor presses the help button. The guide stores "welcomed" state under this key. */
(function () {
  var d = document.documentElement;
  d.classList.remove('no-js'); d.classList.add('js');
  var KEY = 'allai-mascot';
  [window.sessionStorage, window.localStorage].forEach(function (store) {
    try {
      var s = JSON.parse(store.getItem(KEY) || '{}');
      if (!s.welcomedAt) { s.welcomedAt = Date.now(); store.setItem(KEY, JSON.stringify(s)); }
    } catch (e) { /* storage blocked: the guide may greet once */ }
  });
})();
