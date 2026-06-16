/* =========================================================
 * 엔진 코어 (Engine)
 * ---------------------------------------------------------
 * 모든 게임이 공유하는 인프라를 담당합니다.
 *  - Canvas / 해상도 / 게임 루프
 *  - 입력 라우팅(포인터·키 → 현재 게임)
 *  - 메뉴 ↔ 게임 ↔ 게임오버 전환
 *  - HUD 점수 / 최고기록 저장 / 광고 훅 / 사운드
 *
 * 게임 모듈 인터페이스 (각 games/*.js 가 구현):
 *   { id, icon, nameKey, descKey,
 *     enter(api), update(dt), render(ctx),
 *     pointer(x,y), key(code), onResize(w,h), exit(), resume() }
 *
 * api = { sound, best, setScore(n), finish({score, revive}) }
 * ========================================================= */
(function () {
  'use strict';

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0, dpr = 1;
  var registry = [];
  var current = null, api = null;
  var bestStore = {};
  var finishCount = 0;
  var pendingRevive = null;

  // DOM
  var scoreEl = document.getElementById('score');
  var hudEl = document.getElementById('hud');
  var backBtn = document.getElementById('back-btn');
  var gameOverEl = document.getElementById('game-over');
  var finalScoreEl = document.getElementById('final-score');
  var bestScoreEl = document.getElementById('best-score');
  var reviveBtn = document.getElementById('revive-btn');
  var restartBtn = document.getElementById('restart-btn');
  var menuGoBtn = document.getElementById('menu-btn');
  var menuEl = document.getElementById('menu');
  var muteBtn = document.getElementById('mute-btn');
  var langBtn = document.getElementById('lang-btn');

  // ===================== 사운드 (공용) =====================
  var Sound = {
    ctx: null,
    on: (localStorage.getItem('stacktower_mute') !== '1'),
    init: function () {
      try {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') this.ctx.resume();
      } catch { /* ignore */ }
    },
    beep: function (freq, dur, type, vol) {
      if (!this.on || !this.ctx) return;
      var t = this.ctx.currentTime;
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(vol || 0.15, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.08));
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + (dur || 0.08) + 0.02);
    },
    fail: function () { this.beep(150, 0.28, 'sawtooth', 0.18); },
    reward: function () {
      [523, 659, 784, 1046].forEach(function (f, i) {
        setTimeout(function () { Sound.beep(f, 0.12, 'triangle', 0.14); }, i * 90);
      });
    }
  };

  // ===================== 레이아웃 =====================
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (current && current.onResize) { try { current.onResize(W, H); } catch (e) { console.error(e); } }
  }
  window.addEventListener('resize', resize);

  // ===================== 최고기록 =====================
  function loadBest(id) {
    var v = parseInt(localStorage.getItem('stg_hs_' + id) || '0', 10);
    bestStore[id] = isNaN(v) ? 0 : v;
    return bestStore[id];
  }
  function saveBest(id, v) { bestStore[id] = v; localStorage.setItem('stg_hs_' + id, String(v)); }

  function setScore(n) { if (scoreEl) scoreEl.textContent = String(n); }

  // ===================== 전환 =====================
  function showMenu() {
    if (current && current.exit) { try { current.exit(); } catch (e) { console.error(e); } }
    current = null; api = null; pendingRevive = null;
    gameOverEl.classList.add('hidden');
    menuEl.classList.remove('hidden');
    hudEl.classList.add('hidden');
    backBtn.classList.add('hidden');
    if (Engine.refreshMenu) Engine.refreshMenu();
  }

  function startGame(id) {
    var g = null;
    for (var i = 0; i < registry.length; i++) { if (registry[i].id === id) { g = registry[i]; break; } }
    if (!g) return;
    if (current && current.exit) { try { current.exit(); } catch (e) { console.error(e); } }
    current = g;
    api = {
      sound: Sound,
      best: loadBest(id),
      setScore: setScore,
      finish: function (opts) { finish(g, opts); }
    };
    menuEl.classList.add('hidden');
    gameOverEl.classList.add('hidden');
    hudEl.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    setScore(0);
    try { g.enter(api); } catch (e) { console.error(e); }
  }

  function finish(g, opts) {
    opts = opts || {};
    var score = opts.score || 0;
    var best = bestStore[g.id] || 0;
    if (score > best) { best = score; saveBest(g.id, best); }
    finalScoreEl.textContent = String(score);
    bestScoreEl.textContent = String(best);
    var canRevive = !!opts.revive && typeof g.resume === 'function';
    reviveBtn.style.display = canRevive ? '' : 'none';
    gameOverEl.classList.remove('hidden');
    finishCount++;
    if (finishCount % 3 === 0) Ads.showInterstitial();
    pendingRevive = canRevive ? g : null;
  }

  // ===================== 버튼 =====================
  reviveBtn.addEventListener('click', function () {
    if (!pendingRevive) return;
    gameOverEl.classList.add('hidden');
    var g = pendingRevive; pendingRevive = null;
    Ads.showRewarded(function () {
      try { g.resume(); } catch (e) { console.error(e); }
    }, function () { /* 광고 건너뜀 */ });
  });
  restartBtn.addEventListener('click', function () { if (current) startGame(current.id); });
  menuGoBtn.addEventListener('click', showMenu);
  backBtn.addEventListener('click', showMenu);

  function refreshMute() { muteBtn.textContent = Sound.on ? '🔊' : '🔇'; }
  refreshMute();
  muteBtn.addEventListener('click', function () {
    Sound.init(); Sound.on = !Sound.on;
    localStorage.setItem('stacktower_mute', Sound.on ? '0' : '1');
    refreshMute();
  });
  langBtn.addEventListener('click', function () { I18n.toggle(); });

  // ===================== 입력 =====================
  canvas.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    if (!current) return;
    Sound.init();
    try { if (current.down) current.down(e.clientX, e.clientY); } catch (err) { console.error(err); }
  }, { passive: false });
  canvas.addEventListener('pointermove', function (e) {
    if (!current || !current.move) return;
    e.preventDefault();
    try { current.move(e.clientX, e.clientY); } catch (err) { console.error(err); }
  }, { passive: false });
  canvas.addEventListener('pointerup', function (e) {
    if (!current || !current.up) return;
    try { current.up(e.clientX, e.clientY); } catch (err) { console.error(err); }
  }, { passive: false });
  canvas.addEventListener('pointercancel', function (e) {
    if (!current || !current.up) return;
    try { current.up(e.clientX, e.clientY); } catch (err) { console.error(err); }
  }, { passive: false });

  window.addEventListener('keydown', function (e) {
    if (e.code === 'Escape') { showMenu(); return; }
    if (!current) return;
    if (['Space', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) >= 0) {
      e.preventDefault(); Sound.init();
      try { if (current.key) current.key(e.code); } catch (err) { console.error(err); }
    }
  });

  // ===================== 메뉴 배경 애니메이션 =====================
  var bgShapes = [];
  function initBg() {
    bgShapes = [];
    for (var i = 0; i < 10; i++) {
      bgShapes.push({ x: Math.random(), y: Math.random(), s: 30 + Math.random() * 80, vy: 0.02 + Math.random() * 0.05, hue: Math.random() * 360, a: 0.05 + Math.random() * 0.08 });
    }
  }
  initBg();

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function renderMenuBg(dt) {
    ctx.fillStyle = '#0f1226';
    ctx.fillRect(0, 0, W, H);
    for (var i = 0; i < bgShapes.length; i++) {
      var s = bgShapes[i];
      s.y += s.vy * dt * 60;
      if (s.y > 1.25) s.y = -0.25;
      ctx.globalAlpha = s.a;
      ctx.fillStyle = 'hsl(' + s.hue + ', 70%, 60%)';
      roundRect(s.x * W, s.y * H, s.s, s.s, 14);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ===================== 루프 =====================
  var lastTs = 0;
  function loop(ts) {
    if (!lastTs) lastTs = ts;
    var dt = (ts - lastTs) / 1000; lastTs = ts;
    if (dt > 0.05) dt = 0.05;
    if (current) {
      try { current.update(dt); } catch (e) { console.error(e); }
      ctx.fillStyle = '#0f1226';
      ctx.fillRect(0, 0, W, H);
      try { current.render(ctx); } catch (e) { console.error(e); }
    } else {
      renderMenuBg(dt);
    }
    requestAnimationFrame(loop);
  }

  // ===================== 공개 API =====================
  var Engine = {
    register: function (g) { registry.push(g); },
    list: function () { return registry; },
    showMenu: showMenu,
    startGame: startGame,
    refreshMenu: null,
    get W() { return W; },
    get H() { return H; },
    init: function () { resize(); Ads.init(); showMenu(); requestAnimationFrame(loop); }
  };
  window.Engine = Engine;
})();
