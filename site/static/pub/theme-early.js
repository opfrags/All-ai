/* All AI public pages: set the colour theme BEFORE first paint (loaded synchronously in <head>, same-origin, CSP-safe).
   Dark is the default for new visitors; a saved choice ("allai-theme" = "light" | "dark") wins. Public (pre-login) pages only. */
(function () {
  var t = 'dark';
  try { var s = localStorage.getItem('allai-theme'); if (s === 'light' || s === 'dark') t = s; } catch (e) { /* storage blocked: default */ }
  var d = document.documentElement;
  d.setAttribute('data-theme', t);
  d.style.colorScheme = t;
  // FitCheck strip: reserve its space before paint unless the visitor dismissed it (public-ui.js builds it)
  try { if (localStorage.getItem('allai-fitcheck-banner') !== 'dismissed') d.classList.add('fc-on'); } catch (e) { d.classList.add('fc-on'); }
})();
