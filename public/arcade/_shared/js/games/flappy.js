/* =========================================================
 * 게임: Flappy Dodge (플래피)
 * 탭으로 날개짓하여 새를 띄우고, 파이프 틈새를 통과한다.
 * ========================================================= */
(function () {
  'use strict';

  var GRAV = 1500, FLAP = -430;
  var PIPE_W = 74, SPAWN_DX = 220, SPEED_BASE = 150;

  var api, ctx, W, H;
  var bird, pipes, baseY, groundY, gap;
  var score, speed, spawnDX, started, dead, invuln, t;

  function reset() {
    groundY = H - Math.max(56, H * 0.10);
    gap = Math.max(150, Math.min(240, H * 0.30));
    baseY = (groundY) * 0.45;
    bird = { x: W * 0.30, y: baseY, vy: 0, r: 16, rot: 0 };
    pipes = [];
    score = 0; speed = SPEED_BASE; spawnDX = 0;
    started = false; dead = false; invuln = 0; t = 0;
    addPipe(W * 1.0); // 첫 파이프
    api.setScore(0);
  }

  function addPipe(x) {
    var margin = 60;
    var gapY = margin + Math.random() * Math.max(40, groundY - gap - margin * 2);
    pipes.push({ x: (x == null ? W + PIPE_W : x), gapY: gapY, scored: false });
  }

  function flap() {
    if (dead) return;
    api.sound.beep(620, 0.05, 'square', 0.1);
    started = true;
    bird.vy = FLAP;
  }

  function die() {
    if (dead) return;
    dead = true;
    api.sound.fail();
    api.finish({ score: score, revive: true });
  }

  function drawPipe(p) {
    var x = p.x;
    var topH = p.gapY;
    var botY = p.gapY + gap;
    ctx.fillStyle = '#5cb85c';
    ctx.fillRect(x, 0, PIPE_W, topH);
    ctx.fillRect(x, botY, PIPE_W, groundY - botY);
    // 캡(어두운 테두리)
    ctx.fillStyle = '#3d8b3d';
    ctx.fillRect(x - 3, topH - 18, PIPE_W + 6, 18);
    ctx.fillRect(x - 3, botY, PIPE_W + 6, 18);
  }

  Engine.register({
    id: 'flappy', icon: '🐤', nameKey: 'g_flappy_name', descKey: 'g_flappy_desc',
    enter: function (a) { api = a; W = Engine.W; H = Engine.H; reset(); },
    onResize: function (w, h) { W = w; H = h; },
    update: function (dt) {
      if (!started) { t += dt; bird.y = baseY + Math.sin(t * 4) * 10; bird.rot = 0; return; }
      if (invuln > 0) invuln -= dt;

      bird.vy += GRAV * dt;
      bird.y += bird.vy * dt;
      bird.rot = Math.max(-0.5, Math.min(1.2, bird.vy / 600));
      if (bird.y - bird.r < 0) { bird.y = bird.r; bird.vy = 0; } // 천장 클램프

      speed = SPEED_BASE + score * 3;
      spawnDX += speed * dt;
      if (spawnDX >= SPAWN_DX) { spawnDX -= SPAWN_DX; addPipe(); }

      for (var i = pipes.length - 1; i >= 0; i--) {
        var p = pipes[i];
        p.x -= speed * dt;
        if (!p.scored && p.x + PIPE_W < bird.x) {
          p.scored = true; score++; api.setScore(score);
          api.sound.beep(820, 0.06, 'triangle', 0.12);
        }
        // 충돌
        if (!dead && invuln <= 0) {
          var inX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_W;
          if (inX && (bird.y - bird.r < p.gapY || bird.y + bird.r > p.gapY + gap)) die();
        }
        if (p.x + PIPE_W < -10) pipes.splice(i, 1);
      }
      if (!dead && bird.y + bird.r >= groundY) { bird.y = groundY - bird.r; die(); }
    },
    render: function (c) {
      ctx = c;
      // 하늘 그라데이션
      var g = ctx.createLinearGradient(0, 0, 0, groundY);
      g.addColorStop(0, '#243a6b'); g.addColorStop(1, '#172046');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, groundY);

      for (var i = 0; i < pipes.length; i++) drawPipe(pipes[i]);

      // 땅
      ctx.fillStyle = '#2a2f55'; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.fillStyle = '#3a4170'; ctx.fillRect(0, groundY, W, 4);

      // 새
      if (!(invuln > 0 && Math.floor(invuln * 12) % 2 === 0)) {
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(bird.rot);
        ctx.fillStyle = '#ffd54a';
        ctx.beginPath(); ctx.arc(0, 0, bird.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e6a800'; ctx.beginPath(); ctx.arc(0, 0, bird.r, 0.3, 1.2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(6, -5, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(7, -5, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff7a45'; ctx.beginPath(); ctx.moveTo(bird.r - 2, 0); ctx.lineTo(bird.r + 8, -3); ctx.lineTo(bird.r + 8, 4); ctx.closePath(); ctx.fill();
        ctx.restore();
      }

      if (!started) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#fff';
        ctx.font = '800 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(I18n.t('tapFly'), W / 2, H * 0.30);
        ctx.globalAlpha = 1;
      }
    },
    down: function () { flap(); },
    key: function () { flap(); },
    exit: function () {},
    resume: function () {
      dead = false; invuln = 1.2;
      bird.x = W * 0.30; bird.y = baseY; bird.vy = 0;
      pipes = pipes.filter(function (p) { return p.x > bird.x + 90; });
      api.sound.reward();
    }
  });
})();
