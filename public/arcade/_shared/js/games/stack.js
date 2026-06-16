/* =========================================================
 * 게임: Stack Tower (블록 쌓기)
 * 좌우로 움직이는 블록을 탭으로 떨어뜨려 탑을 쌓는다.
 * ========================================================= */
(function () {
  'use strict';

  var BLOCK_H = 30, PAD = 18;
  var BASE_SPEED = 230, SPEED_INC = 18, MAX_SPEED = 720;
  var PERFECT_TOL = 5, PERFECT_GROW = 5;
  var BASE_HUE = 210, HUE_STEP = 11, GRAV = 2000;

  var api, ctx, W, H, baseW, groundY;
  var tower, moving, topY, cameraY, bgDots, falling, particles, floats;
  var combo, score, shake, dead;

  function makeBgDots() {
    var arr = [];
    var n = Math.floor(W * H / 14000);
    for (var i = 0; i < n; i++) {
      arr.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.4, a: Math.random() * 0.4 + 0.1 });
    }
    return arr;
  }

  function reset() {
    baseW = Math.max(96, Math.min(180, W * 0.42));
    groundY = H - Math.max(40, H * 0.06);
    tower = [{ x: W / 2, y: groundY - BLOCK_H, w: baseW, h: BLOCK_H, hue: BASE_HUE }];
    topY = tower[0].y;
    cameraY = 0;
    falling = []; particles = []; floats = [];
    combo = 0; score = 0; shake = 0; dead = false;
    bgDots = makeBgDots();
    api.setScore(0);
    spawnMoving();
  }

  function spawnMoving() {
    var top = tower[tower.length - 1];
    var w = top.w;
    var hue = (BASE_HUE + (tower.length - 1) * HUE_STEP) % 360;
    var fromLeft = (tower.length % 2 === 0);
    var x = fromLeft ? (PAD + w / 2) : (W - PAD - w / 2);
    var level = tower.length - 1;
    var speed = Math.min(MAX_SPEED, BASE_SPEED + level * SPEED_INC);
    moving = { x: x, y: top.y - BLOCK_H, w: w, hue: hue, dir: fromLeft ? 1 : -1, speed: speed };
  }

  function placeBlock() {
    if (!moving || dead) return;
    var below = tower[tower.length - 1];
    var bL = below.x - below.w / 2, bR = below.x + below.w / 2;
    var mL = moving.x - moving.w / 2, mR = moving.x + moving.w / 2;
    var ox0 = Math.max(bL, mL), ox1 = Math.min(bR, mR);
    var overlap = ox1 - ox0;
    if (overlap <= 0) { gameOver(); return; }

    var diff = moving.w - overlap;
    var placed;
    if (diff <= PERFECT_TOL) {
      combo++;
      var newW = Math.min(baseW, moving.w + PERFECT_GROW);
      placed = { x: below.x, y: moving.y, w: newW, h: BLOCK_H, hue: moving.hue };
      api.sound.beep(600 + Math.min(combo, 10) * 45, 0.09, 'triangle', 0.16);
      burst(placed.x, placed.y + BLOCK_H / 2, moving.hue, combo);
      floats.push({ text: combo >= 2 ? I18n.t('perfectCombo', { n: combo }) : I18n.t('perfect'), x: placed.x, y: placed.y, life: 1, hue: moving.hue });
    } else {
      combo = 0;
      var newX = (ox0 + ox1) / 2;
      placed = { x: newX, y: moving.y, w: overlap, h: BLOCK_H, hue: moving.hue };
      var fx, fw, side;
      if (moving.x < below.x) { side = -1; fw = ox0 - mL; fx = (mL + ox0) / 2; }
      else { side = 1; fw = mR - ox1; fx = (ox1 + mR) / 2; }
      falling.push({ x: fx, y: moving.y, w: fw, h: BLOCK_H, vx: side * 80, vy: -60, hue: moving.hue, a: 1 });
      api.sound.beep(420, 0.05, 'square', 0.1);
    }

    tower.push(placed);
    topY = placed.y;
    score = tower.length - 1;
    api.setScore(score);
    spawnMoving();
  }

  function gameOver() {
    if (dead) return;
    dead = true; moving = null; shake = 14;
    api.sound.fail();
    api.finish({ score: score, revive: true });
  }

  function burst(x, y, hue, n) {
    var count = 8 + Math.min(n, 6) * 2;
    for (var i = 0; i < count; i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = 60 + Math.random() * 160;
      particles.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 40, life: 1, hue: hue, r: Math.random() * 3 + 1.5 });
    }
  }

  function drawBlock(b, sy) {
    var x = b.x - b.w / 2;
    ctx.fillStyle = 'hsl(' + b.hue + ', 65%, 55%)';
    ctx.fillRect(x, sy, b.w, b.h);
    ctx.fillStyle = 'hsl(' + b.hue + ', 60%, 42%)';
    ctx.fillRect(x, sy + b.h - 5, b.w, 5);
    ctx.fillStyle = 'hsl(' + b.hue + ', 70%, 66%)';
    ctx.fillRect(x, sy, b.w, 2);
  }

  Engine.register({
    id: 'stack', icon: '🧱', nameKey: 'g_stack_name', descKey: 'g_stack_desc',
    enter: function (a) { api = a; W = Engine.W; H = Engine.H; reset(); },
    onResize: function (w, h) { W = w; H = h; if (tower[0]) tower[0].x = w / 2; },
    update: function (dt) {
      var target = Math.max(0, H * 0.40 - topY);
      cameraY += (target - cameraY) * Math.min(1, dt * 6);
      if (!dead && moving) {
        moving.x += moving.dir * moving.speed * dt;
        var left = PAD + moving.w / 2, right = W - PAD - moving.w / 2;
        if (moving.x <= left) { moving.x = left; moving.dir = 1; }
        else if (moving.x >= right) { moving.x = right; moving.dir = -1; }
      }
      for (var i = falling.length - 1; i >= 0; i--) {
        var f = falling[i];
        f.vy += GRAV * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.a -= dt * 0.7;
        if (f.a <= 0 || f.y + cameraY > H + 300) falling.splice(i, 1);
      }
      for (var j = particles.length - 1; j >= 0; j--) {
        var p = particles[j];
        p.vy += GRAV * 0.5 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 1.8;
        if (p.life <= 0) particles.splice(j, 1);
      }
      for (var k = floats.length - 1; k >= 0; k--) {
        var fl = floats[k]; fl.y -= dt * 40; fl.life -= dt * 1.2;
        if (fl.life <= 0) floats.splice(k, 1);
      }
      if (shake > 0) { shake -= dt * 40; if (shake < 0) shake = 0; }
    },
    render: function (c) {
      ctx = c;
      // 배경 점(시차 스크롤)
      for (var d = 0; d < bgDots.length; d++) {
        var dot = bgDots[d];
        var yy = (dot.y + cameraY * 0.25) % H; if (yy < 0) yy += H;
        ctx.globalAlpha = dot.a; ctx.fillStyle = '#6f7bd6';
        ctx.beginPath(); ctx.arc(dot.x, yy, dot.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      var sx = 0, sy = 0;
      if (shake > 0) { sx = (Math.random() - 0.5) * shake; sy = (Math.random() - 0.5) * shake; }
      ctx.save(); ctx.translate(sx, sy);

      for (var i = 0; i < tower.length; i++) drawBlock(tower[i], tower[i].y + cameraY);
      if (moving) drawBlock(moving, moving.y + cameraY);
      for (var f2 = 0; f2 < falling.length; f2++) {
        var fb = falling[f2];
        ctx.globalAlpha = Math.max(0, fb.a);
        drawBlock(fb, fb.y + cameraY);
      }
      ctx.globalAlpha = 1;
      for (var p2 = 0; p2 < particles.length; p2++) {
        var pr = particles[p2];
        ctx.globalAlpha = Math.max(0, pr.life);
        ctx.fillStyle = 'hsl(' + pr.hue + ', 70%, 65%)';
        ctx.beginPath(); ctx.arc(pr.x, pr.y + cameraY, pr.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (var fl2 = 0; fl2 < floats.length; fl2++) {
        var ft = floats[fl2];
        ctx.globalAlpha = Math.max(0, Math.min(1, ft.life));
        ctx.fillStyle = 'hsl(' + ft.hue + ', 90%, 75%)';
        ctx.font = '800 ' + (combo >= 2 ? 30 : 24) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y + cameraY - 8);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    },
    down: function () { placeBlock(); },
    key: function () { placeBlock(); },
    exit: function () {},
    resume: function () { dead = false; combo = 0; spawnMoving(); api.sound.reward(); }
  });
})();
