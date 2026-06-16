/* =========================================================
 * 게임: Lane Dodge (레인 닷지)
 * 좌/우 탭으로 차선을 바꿔 떨어지는 장애물을 피한다.
 * ========================================================= */
(function () {
  'use strict';

  var LANES = 3;
  var BALL_R = 18;

  var api, ctx, W, H;
  var ball, obstacles, obSize;
  var score, speed, spawnT, spawnInterval, started, dead, invuln;

  function laneCenter(i) { return (i + 0.5) * (W / LANES); }

  function reset() {
    obSize = Math.min(W / LANES * 0.62, 64);
    ball = { lane: 1, x: laneCenter(1), tx: laneCenter(1), y: H * 0.80 };
    obstacles = [];
    score = 0;
    speed = Math.max(190, H * 0.5);
    spawnInterval = 0.95; spawnT = 0.7;
    started = false; dead = false; invuln = 0;
    api.setScore(0);
  }

  function move(dir) {
    started = true;
    var nl = Math.max(0, Math.min(LANES - 1, ball.lane + dir));
    if (nl !== ball.lane) {
      ball.lane = nl; ball.tx = laneCenter(nl);
      api.sound.beep(480, 0.04, 'square', 0.08);
    }
  }

  function addObstacle() {
    var lane = Math.floor(Math.random() * LANES);
    obstacles.push({ lane: lane, y: -obSize, scored: false });
    if (score > 8 && Math.random() < 0.3) { // 항상 1차선은 비움
      var lane2 = (lane + 1 + Math.floor(Math.random() * (LANES - 1))) % LANES;
      obstacles.push({ lane: lane2, y: -obSize - obSize * 1.4, scored: false });
    }
  }

  function die() {
    if (dead) return;
    dead = true;
    api.sound.fail();
    api.finish({ score: score, revive: true });
  }

  function roundRectPath(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  Engine.register({
    id: 'lane', icon: '🛣️', nameKey: 'g_lane_name', descKey: 'g_lane_desc',
    enter: function (a) { api = a; W = Engine.W; H = Engine.H; reset(); },
    onResize: function (w, h) { W = w; H = h; },
    update: function (dt) {
      ball.x += (ball.tx - ball.x) * Math.min(1, dt * 16);
      if (!started) return;
      if (invuln > 0) invuln -= dt;

      speed = Math.max(190, H * 0.5) + score * 8;
      spawnInterval = Math.max(0.45, 0.95 - score * 0.012);
      spawnT -= dt;
      if (spawnT <= 0) { spawnT += spawnInterval; addObstacle(); }

      var thr = obSize / 2 + BALL_R;
      for (var i = obstacles.length - 1; i >= 0; i--) {
        var o = obstacles[i];
        o.y += speed * dt;
        if (!dead && invuln <= 0 && Math.abs(o.y - ball.y) < thr && laneCenter(o.lane) === ball.tx) {
          die();
        }
        if (!o.scored && o.y - obSize / 2 > ball.y + BALL_R) {
          o.scored = true; score++; api.setScore(score);
          api.sound.beep(740, 0.05, 'triangle', 0.1);
        }
        if (o.y > H + obSize) obstacles.splice(i, 1);
      }
    },
    render: function (c) {
      ctx = c;
      // 배경 그라데이션
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#1c1740'); g.addColorStop(1, '#0f1226');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // 차선 구분선
      ctx.strokeStyle = 'rgba(255,255,255,.08)';
      ctx.lineWidth = 2;
      for (var i = 1; i < LANES; i++) {
        var lx = i * (W / LANES);
        ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
      }

      // 장애물
      for (var j = 0; j < obstacles.length; j++) {
        var o = obstacles[j];
        var cx = laneCenter(o.lane);
        ctx.fillStyle = '#ef476f';
        roundRectPath(cx - obSize / 2, o.y - obSize / 2, obSize, obSize, 10);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.18)';
        roundRectPath(cx - obSize / 2, o.y - obSize / 2, obSize, 8, 6);
        ctx.fill();
      }

      // 공
      if (!(invuln > 0 && Math.floor(invuln * 12) % 2 === 0)) {
        ctx.fillStyle = 'rgba(6,214,160,.35)';
        ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R + 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#06d6a0';
        ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(ball.x - 4, ball.y - 4, 5, 0, Math.PI * 2); ctx.fill();
      }

      if (!started) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#fff';
        ctx.font = '800 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(I18n.t('tapLane'), W / 2, H * 0.30);
        ctx.globalAlpha = 1;
      }
    },
    down: function (x) { move(x < W / 2 ? -1 : 1); },
    key: function (code) {
      if (code === 'ArrowLeft') move(-1);
      else if (code === 'ArrowRight') move(1);
    },
    exit: function () {},
    resume: function () {
      dead = false; invuln = 1.2;
      obstacles = obstacles.filter(function (o) { return o.y < ball.y - obSize; });
      api.sound.reward();
    }
  });
})();
