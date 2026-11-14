/* Scene: game development. A level is arranged in an editor, then playtested.
   The play sequence is an original CSS animation (movement, collectibles, score). */
ALLAI.register({
  id: 'game',
  frame: '.g-view',
  start: '.g-assets',
  html: function (ui) {
    return ui.bar({ file: 'OpenDay.scene', app: 'Game editor', letter: 'G', ico: 'g-ico' }) +
      '<div class="a-tools"><span class="a-t a-t--txt">Scene</span><span class="a-t a-t--txt g-tab-game" data-sel="play">Game</span><span class="a-grow"></span><span class="g-play" data-sel="play"><svg viewBox="0 0 12 12"><path d="M3.5 2v8l7-4z" fill="currentColor"/></svg>Play</span><span class="a-grow"></span><span class="a-t a-t--txt">2D</span></div>' +
      '<div class="a-body">' +
        '<div class="a-side a-side--s g-left"><div class="a-h">Hierarchy</div>' +
          ui.rows([{ t: 'Main Camera' }, { t: 'Ground' }, { t: 'Platforms', show: 'plat', sel: 'plat,coins' }, { t: 'Coins (3)', show: 'coins', sel: 'coins,char' }, { t: 'Player', show: 'char', sel: 'char,play' }, { t: 'Score UI', show: 'logic' }]) +
          '<div class="a-h">Assets</div><div class="g-assets"><span class="g-as g-as--plat" data-sel="plat,coins"></span><span class="g-as g-as--coin" data-sel="coins,char"></span><span class="g-as g-as--char" data-sel="char,logic"></span><span class="g-as g-as--flag"></span></div>' +
        '</div>' +
        '<div class="a-main g-view">' +
          '<div class="g-sky"></div><div class="g-grid"></div>' +
          '<div class="g-hud"><span>SCORE <b class="g-score">000</b></span><span class="g-coins">Coins <b class="g-cn">0</b>/3</span></div>' +
          '<div class="g-plat g-plat--a" data-show="plat"></div><div class="g-plat g-plat--b dl2" data-show="plat"></div>' +
          '<i class="g-coin g-coin--1 t-pop" data-show="coins"></i><i class="g-coin g-coin--2 t-pop dl1" data-show="coins"></i><i class="g-coin g-coin--3 t-pop dl2" data-show="coins"></i>' +
          '<div class="g-player t-pop" data-show="char"><i></i></div>' +
          '<div class="g-ground"></div>' +
          '<div class="g-win" data-show="win"><b>Level complete</b><span>3 / 3 collected · Score 30</span></div>' +
        '</div>' +
        '<div class="a-side a-side--r g-right"><div class="a-h">Inspector</div>' +
          '<div class="a-kv"><span>Position X</span><b>1.5</b></div><div class="a-kv"><span>Position Y</span><b>0.0</b></div>' +
          '<div class="a-h">PlayerMove (script)</div>' +
          '<div class="a-kv g-kv-speed" data-sel="logic,play"><span>Speed</span><b data-count="logic" data-from="4" data-to="6.5" data-fmt="dec1"></b></div>' +
          '<div class="a-kv"><span>Jump force</span><b data-count="logic" data-from="7" data-to="9"></b></div>' +
          '<div class="g-code mono"><p data-show="logic" class="t-type">if (jump &amp;&amp; onGround)</p><p data-show="logic" class="t-type dl2">  vel.y = jumpForce;</p><p data-show="logic" class="t-type dl4">if (hit(coin)) score += 10;</p></div>' +
        '</div>' +
      '</div>' +
      '<div class="a-status"><span class="g-mode">Edit mode</span><span>60 fps</span><span class="a-grow"></span><span>Original sample game</span></div>';
  },
  steps: [
    { id: 'plat', label: 'Arranging the level', cur: '.g-as--plat', click: true, drag: '.g-plat--b', d: 1500 },
    { id: 'coins', label: 'Placing collectibles', cur: '.g-as--coin', click: true, drag: '.g-coin--2', d: 1400 },
    { id: 'char', label: 'Adding the character', cur: '.g-as--char', click: true, drag: '.g-player', d: 1400 },
    { id: 'logic', label: 'Updating movement logic', cur: '.g-kv-speed', click: true, d: 1600 },
    { id: 'play', label: 'Pressing Play', cur: '.g-play', click: true, d: 1100 },
    { id: 'run', label: 'Playtest: movement and jumping', d: 1700 },
    { id: 'run2', label: 'Playtest: collectibles and score', d: 2200 },
    { id: 'win', label: 'Playable level ready', d: 1300 }
  ],
  setup: function (root, player) {
    var score = root.querySelector('.g-score'), cn = root.querySelector('.g-cn'), timers = [];
    var put = function (c) { score.textContent = ('00' + c * 10).slice(-3); cn.textContent = c; };
    var clear = function () { timers.forEach(clearTimeout); timers = []; };
    var idx = { run: 5, run2: 6 };
    return {
      step: function (id, k, animate) {
        clear();
        var base = k >= 8 ? 3 : k === 7 ? 3 : k === 6 ? 1 : 0, sp = player.o.speed;
        if (!animate) return put(base);
        if (id === 'run') { put(0); timers.push(setTimeout(function () { put(1); }, 1150 / sp)); }
        else if (id === 'run2') { put(1); timers.push(setTimeout(function () { put(2); }, 1330 / sp)); timers.push(setTimeout(function () { put(3); }, 1850 / sp)); }
        else put(base);
      },
      destroy: clear
    };
  }
});
