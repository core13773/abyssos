/* =========================================================
 * 게임: Color Switch (컬러 스위치)
 * 탭으로 공의 색을 순환(4색)하고, 다가오는 벽 색에 맞춘다.
 * ========================================================= */
(function () {
  'use strict';

  var WALL_W = 26, BALL_R = 16;
  var HUES = [0, 220, 48, 135]; // red, blue, yellow, green
  var COLORS = HUES.length;

  var api, ctx, W, H;
  var ball, walls, speed, spawnT, score, dead, started, grace;

  function reset() {
    ball = { x: W * 0.28, y: H * 0.5, c: 0 };
    walls = [];
    speed = 170; spawnT = 0.6; score = 0; dead = false; started = false; grace = 0;
    api.setScore(0);
  }
  function addWall() { walls.push({ x: W + 10, c: (Math.random() * COLORS) | 0, scored: false }); }
  function cycle() {
    started = true;
    ball.c = (ball.c + 1) % COLORS;
    api.sound.beep(420 + ball.c * 90, 0.05, 'square', 0.1);
  }
  function die() { if (dead) return; dead = true; api.sound.fail(); api.finish({ score: score, revive: true }); }

  function colorStr(ci, l) { return 'hsl(' + HUES[ci] + ',75%,' + (l || 58) + '%)'; }

  Engine.register({
    id: 'color', icon: '🎨', nameKey: 'g_color_name', descKey: 'g_color_desc',
    enter: function (a) { api = a; W = Engine.W; H = Engine.H; reset(); },
    onResize: function (w, h) { W = w; H = h; },
    update: function (dt) {
      if (!started) return;
      if (grace > 0) grace -= dt;
      speed = 170 + score * 4;
      spawnT -= dt;
      if (spawnT <= 0) { spawnT = Math.max(0.95, 1.7 - score * 0.02); addWall(); }
      for (var i = walls.length - 1; i >= 0; i--) {
        var w = walls[i];
        w.x -= speed * dt;
        if (!dead && grace <= 0 && w.x < ball.x + BALL_R && w.x + WALL_W > ball.x - BALL_R) {
          if (w.c !== ball.c) die();
        }
        if (!w.scored && w.x + WALL_W < ball.x) { w.scored = true; score++; api.setScore(score); api.sound.beep(760, 0.05, 'triangle', 0.1); }
        if (w.x + WALL_W < -10) walls.splice(i, 1);
      }
    },
    render: function (c) {
      ctx = c;
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1c1740'); g.addColorStop(1, '#0f1226');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // 벽
      for (var i = 0; i < walls.length; i++) {
        var w = walls[i];
        ctx.fillStyle = colorStr(w.c, 55); ctx.fillRect(w.x, 0, WALL_W, H);
        ctx.fillStyle = colorStr(w.c, 72); ctx.fillRect(w.x, 0, WALL_W, 6);
      }
      // 공
      var blink = grace > 0 && Math.floor(grace * 12) % 2 === 0;
      if (!blink) {
        ctx.fillStyle = colorStr(ball.c, 55); ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R + 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = colorStr(ball.c, 60); ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(ball.x - 5, ball.y - 5, 5, 0, Math.PI * 2); ctx.fill();
      }
      // 색 범례(현재 색 강조)
      for (var k = 0; k < COLORS; k++) {
        ctx.fillStyle = colorStr(k, k === ball.c ? 60 : 35);
        ctx.beginPath(); ctx.arc(W - 26, 60 + k * 30, k === ball.c ? 11 : 8, 0, Math.PI * 2); ctx.fill();
      }
      if (!started) { ctx.fillStyle = '#fff'; ctx.font = '800 22px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(I18n.t('tapSwitch'), W / 2, H * 0.3); }
    },
    down: function () { cycle(); },
    key: function () { cycle(); },
    exit: function () {},
    resume: function () { dead = false; grace = 1.0; walls = walls.filter(function (w) { return w.x > ball.x + 80; }); api.sound.reward(); }
  });
})();
