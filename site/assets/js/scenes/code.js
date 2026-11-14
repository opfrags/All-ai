/* Scene: website development. Code editor, file explorer, terminal and a browser preview.
   The visible code matches what the preview shows (same text, colours, prices). */
(function () {
  var L = function (n, html, attrs) { return '<div class="c-l"' + (attrs || '') + '><i>' + n + '</i><span>' + html + '</span></div>'; };
  var t = function (s) { return '<b class="k">' + s + '</b>'; }, a = function (s) { return '<b class="at">' + s + '</b>'; }, q = function (s) { return '<b class="s">' + s + '</b>'; }, n = function (s) { return '<b class="n">' + s + '</b>'; };
  ALLAI.register({
    id: 'code',
    frame: '.c-prev',
    start: '.c-term',
    html: function (ui) {
      return ui.bar({ file: 'bakery-site', app: 'Code editor', letter: '&lt;/&gt;', ico: 'c-ico' }) +
        '<div class="a-body">' +
          '<div class="a-side a-side--s c-exp"><div class="a-h">Explorer<span class="a-grow"></span><span class="c-new" data-sel="new,html">+</span></div>' +
            ui.rows([{ t: 'bakery-site' }, { t: 'index.html', inn: 1, show: 'new', c: 'c-f-html', sel: 'new,css' }, { t: 'styles.css', inn: 1, show: 'new', c: 'c-f-css dl1', sel: 'css,menu' }, { t: 'menu.js', inn: 1, show: 'new', c: 'c-f-js dl2', sel: 'menu,resp' }, { t: 'menu.txt', inn: 1 }, { t: 'logo.svg', inn: 1 }]) +
          '</div>' +
          '<div class="a-main c-ed">' +
            '<div class="c-tabs"><span class="c-tab c-tab--html" data-show="new" data-sel="new,css">index.html</span><span class="c-tab c-tab--css dl1" data-show="new" data-sel="css,menu">styles.css</span><span class="c-tab c-tab--js dl2" data-show="new" data-sel="menu">menu.js</span></div>' +
            '<div class="c-code">' +
              '<div class="c-pane c-pane--html">' +
                L(1, '&lt;' + t('header') + ' ' + a('class') + '=' + q('"hero"') + '&gt;', ' data-show="html" class="c-l t-type"') +
                L(2, '  &lt;' + t('h1') + '&gt;Fresh bread, baked every morning.&lt;/' + t('h1') + '&gt;', ' data-show="html" class="c-l t-type dl2"') +
                L(3, '  &lt;' + t('p') + '&gt;Baobab Bakery, open 6am to 6pm.&lt;/' + t('p') + '&gt;', ' data-show="html" class="c-l t-type dl4"') +
                L(4, '  &lt;' + t('a') + ' ' + a('class') + '=' + q('"btn"') + '&gt;Order on WhatsApp&lt;/' + t('a') + '&gt;', ' data-show="html" class="c-l t-type dl6"') +
                L(5, '&lt;/' + t('header') + '&gt;', ' data-show="html" class="c-l t-type dl7"') +
                L(6, '&lt;' + t('section') + ' ' + a('id') + '=' + q('"menu"') + '&gt;&lt;/' + t('section') + '&gt;', ' data-show="html" class="c-l t-type dl8"') +
              '</div>' +
              '<div class="c-pane c-pane--css">' +
                L(1, a('.hero') + ' { background: ' + n('#14233f') + '; color: ' + n('#fff') + '; }', ' data-show="css" class="c-l t-type"') +
                L(2, a('h1') + ' { font: ' + n('700 20px') + ' ' + q('"DM Sans"') + '; }', ' data-show="css" class="c-l t-type dl2"') +
                L(3, a('.btn') + ' { background: ' + n('#2563ff') + '; border-radius: ' + n('8px') + '; }', ' data-show="css" class="c-l t-type dl4"') +
                L(4, a('.card') + ' { border: 1px solid ' + n('#e3e7f0') + '; }', ' data-show="css" class="c-l t-type dl6"') +
              '</div>' +
              '<div class="c-pane c-pane--js">' +
                L(1, t('const') + ' menu = [', ' data-show="menu" class="c-l t-type"') +
                L(2, '  { name: ' + q('"Farm loaf"') + ', price: ' + n('1.20') + ' },', ' data-show="menu" class="c-l t-type dl2"') +
                L(3, '  { name: ' + q('"Meat pie"') + ', price: ' + n('2.50') + ' },<u class="c-bug" data-hide="fix">,</u>', ' data-show="menu" class="c-l c-l--bug t-type dl4"') +
                L(4, '  { name: ' + q('"Scones x6"') + ', price: ' + n('3.00') + ' },', ' data-show="menu" class="c-l t-type dl6"') +
                L(5, '];', ' data-show="menu" class="c-l t-type dl7"') +
                L(6, 'render(menu);', ' data-show="menu" class="c-l t-type dl8"') +
              '</div>' +
            '</div>' +
            '<div class="c-term"><div class="a-h">Terminal</div><div class="c-term__b mono">' +
              '<p data-show="build">$ npm run build</p>' +
              '<p class="c-err dl3" data-show="build">✖ menu.js:3:36 Unexpected token \',\'</p>' +
              '<p class="c-okl" data-show="fix">✓ built in 412 ms · 3 files</p>' +
            '</div></div>' +
          '</div>' +
          '<div class="c-prev">' +
            '<div class="c-url"><span class="c-dots"><i></i><i></i><i></i></span><span class="c-addr mono">localhost:5173</span><span class="c-dev c-dev--d" data-sel="done"><svg viewBox="0 0 12 12"><rect x="1" y="2" width="10" height="6.5" rx="1" fill="none" stroke="currentColor"/><path d="M4 10.5h4" stroke="currentColor"/></svg></span><span class="c-dev c-dev--m" data-sel="resp,done"><svg viewBox="0 0 12 12"><rect x="3.5" y="1" width="5" height="10" rx="1.2" fill="none" stroke="currentColor"/></svg></span></div>' +
            '<div class="c-stage"><div class="c-page">' +
              '<div class="c-hero" data-show="html"><span class="c-brand">Baobab Bakery</span><h5>Fresh bread, baked every morning.</h5><p>Baobab Bakery, open 6am to 6pm.</p><span class="c-btn">Order on WhatsApp</span></div>' +
              '<div class="c-menu" data-show="fix"><div class="c-card"><i></i><b>Farm loaf</b><span>$1.20</span></div><div class="c-card"><i></i><b>Meat pie</b><span>$2.50</span></div><div class="c-card"><i></i><b>Scones x6</b><span>$3.00</span></div></div>' +
            '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="a-status"><span>main</span><span><b>0</b> problems</span><span class="a-grow"></span><span>Sample data: fictional business</span></div>';
    },
    steps: [
      { id: 'new', label: 'Creating the project files', cur: '.c-new', click: true, d: 1200 },
      { id: 'html', label: 'Writing the page structure', cur: '.c-code', at: [.3, .2], click: true, d: 1700 },
      { id: 'css', label: 'Styling the page', cur: '.c-tab--css', click: true, d: 1600 },
      { id: 'menu', label: 'Adding the menu data', cur: '.c-tab--js', click: true, d: 1600 },
      { id: 'build', label: 'Running the build', cur: '.c-term__b', at: [.3, .4], click: true, d: 1500, frame: '.c-ed' },
      { id: 'fix', label: 'Fixing the build error', cur: '.c-bug', click: true, d: 1500 },
      { id: 'resp', label: 'Checking the mobile layout', cur: '.c-dev--m', click: true, d: 1500, frame: '.c-prev' },
      { id: 'done', label: 'Website ready to review', cur: '.c-dev--d', click: true, d: 1500 }
    ]
  });
})();
