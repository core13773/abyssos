/* =========================================================
 * 게임: Merge Fruits (수박 게임)
 * 과일을 떨어뜨려 같은 걸 합쳐 더 큰 과일(→수박)을 만든다.
 * 단순 원형 물리(중력/벽/분리) + 합체 테이블.
 * ========================================================= */
(function () {
  'use strict';

  var GRAV = 1500;
  // tier: 이모지, 반지름(boxW 비율)
  var TIERS = [
    { e: '🍒', r: 0.045 }, { e: '🍓', r: 0.060 }, { e: '🍇', r: 0.078 },
    { e: '🍊', r: 0.098 }, { e: '🍎', r: 0.120 }, { e: '🍏', r: 0.144 },
    { e: '🍐', r: 0.170 }, { e: '🍑', r: 0.200 }, { e: '🍍', r: 0.232 },
    { e: '🍈', r: 0.266 }, { e: '🍉', r: 0.300 }
  ];
  var MAX_TIER = TIERS.length - 1;
  var MERGE_PTS = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55];

  var api, ctx, W, H;
  var boxX, boxW, boxTop, boxBottom, dropperY;
  var fruits, nextTier, overTimer, dead, grace, score, particles;

  function radius(t) { return TIERS[t].r * boxW; }

  function reset() {
    boxW = Math.min(W * 0.92, 380);
    var boxH = Math.min(H * 0.60, 520);
    boxX = (W - boxW) / 2;
    boxBottom = H - 18;
    boxTop = boxBottom - boxH;
    dropperY = Math.max(40, boxTop - 34);
    fruits = [];
    particles = [];
    nextTier = (Math.random() * 4) | 0;
    overTimer = 0; grace = 0; dead = false; score = 0;
    api.setScore(0);
  }

  function drop(x) {
    if (dead) return;
    var r = radius(nextTier);
    var cx = Math.max(boxX + r, Math.min(boxX + boxW - r, x));
    fruits.push({ x: cx, y: dropperY, vx: 0, vy: 140, t: nextTier });
    api.sound.beep(300, 0.05, 'square', 0.1);
    nextTier = (Math.random() * 4) | 0;
  }

  function gameOver() {
    if (dead) return;
    dead = true; api.sound.fail();
    api.finish({ score: score, revive: true });
  }

  function burst(x, y, t) {
    var hue = (t * 30) % 360;
    for (var i = 0; i < 12; i++) {
      var a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 140;
      particles.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 30, life: 1, hue: hue });
    }
  }

  Engine.register({
    id: 'suika', icon: '🍉', nameKey: 'g_suika_name', descKey: 'g_suika_desc',
    enter: function (a) { api = a; W = Engine.W; H = Engine.H; reset(); },
    onResize: function (w, h) { W = w; H = h; reset(); },
    update: function (dt) {
      if (grace > 0) grace -= dt;
      // 적분
      for (var i = 0; i < fruits.length; i++) {
        var f = fruits[i];
        f.vy += GRAV * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.vx *= 0.99;
      }
      // 벽/바닥
      for (var i2 = 0; i2 < fruits.length; i2++) {
        var f2 = fruits[i2], r2 = radius(f2.t);
        if (f2.x - r2 < boxX) { f2.x = boxX + r2; f2.vx = Math.abs(f2.vx) * 0.3; }
        if (f2.x + r2 > boxX + boxW) { f2.x = boxX + boxW - r2; f2.vx = -Math.abs(f2.vx) * 0.3; }
        if (f2.y + r2 > boxBottom) { f2.y = boxBottom - r2; if (f2.vy > 0) f2.vy = -f2.vy * 0.22; f2.vx *= 0.86; }
      }
      // 합체(연쇄)
      for (var pass = 0; pass < 6; pass++) {
        var removed = {}, news = [], any = false;
        for (var a = 0; a < fruits.length; a++) {
          if (removed[a]) continue;
          for (var b = a + 1; b < fruits.length; b++) {
            if (removed[b]) continue;
            var fa = fruits[a], fb = fruits[b];
            if (fa.t !== fb.t) continue;
            var dx = fb.x - fa.x, dy = fb.y - fa.y, d = Math.hypot(dx, dy), rs = radius(fa.t) + radius(fb.t);
            if (d < rs * 0.85) {
              var nt = fa.t + 1, mx = (fa.x + fb.x) / 2, my = (fa.y + fb.y) / 2;
              if (nt > MAX_TIER) { score += 200; burst(mx, my, nt); api.sound.beep(880, 0.14, 'triangle', 0.18); }
              else { news.push({ x: mx, y: my, vx: 0, vy: 0, t: nt }); score += MERGE_PTS[nt] || 20; burst(mx, my, nt); api.sound.beep(520 + nt * 40, 0.09, 'triangle', 0.14); }
              removed[a] = true; removed[b] = true; any = true; break;
            }
          }
        }
        if (!any) break;
        var nxt = [];
        for (var k = 0; k < fruits.length; k++) if (!removed[k]) nxt.push(fruits[k]);
        fruits = nxt.concat(news);
        api.setScore(score);
      }
      // 분리
      for (var it = 0; it < 3; it++) {
        for (var p = 0; p < fruits.length; p++) {
          for (var q = p + 1; q < fruits.length; q++) {
            var A = fruits[p], B = fruits[q], ddx = B.x - A.x, ddy = B.y - A.y, dd = Math.hypot(ddx, ddy) || 0.001, rr = radius(A.t) + radius(B.t);
            if (dd < rr) { var ov = (rr - dd) / 2, nx = ddx / dd, ny = ddy / dd; A.x -= nx * ov; A.y -= ny * ov; B.x += nx * ov; B.y += ny * ov; }
          }
        }
        for (var c = 0; c < fruits.length; c++) { var fc = fruits[c], rc = radius(fc.t); if (fc.x - rc < boxX) fc.x = boxX + rc; if (fc.x + rc > boxX + boxW) fc.x = boxX + boxW - rc; if (fc.y + rc > boxBottom) fc.y = boxBottom - rc; }
      }
      // 게임오버 판정(위험선 위에 안착)
      if (grace <= 0) {
        var danger = false;
        for (var g = 0; g < fruits.length; g++) { var fg = fruits[g], rg = radius(fg.t); if (fg.y - rg < boxTop && Math.abs(fg.vy) < 90) { danger = true; break; } }
        if (danger) overTimer += dt; else overTimer = 0;
        if (overTimer > 1.5) gameOver();
      }
      // 파티클
      for (var pi = particles.length - 1; pi >= 0; pi--) { var pp = particles[pi]; pp.vy += 600 * dt; pp.x += pp.vx * dt; pp.y += pp.vy * dt; pp.life -= dt * 1.8; if (pp.life <= 0) particles.splice(pi, 1); }
    },
    render: function (c) {
      ctx = c;
      // 상자
      ctx.fillStyle = 'rgba(255,255,255,.05)';
      ctx.fillRect(boxX, boxTop, boxW, boxBottom - boxTop);
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(boxX, boxTop); ctx.lineTo(boxX, boxBottom); ctx.lineTo(boxX + boxW, boxBottom); ctx.lineTo(boxX + boxW, boxTop); ctx.stroke();
      // 위험선
      ctx.strokeStyle = 'rgba(239,71,111,.6)'; ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.moveTo(boxX, boxTop); ctx.lineTo(boxX + boxW, boxTop); ctx.stroke(); ctx.setLineDash([]);
      // 과일
      for (var i = 0; i < fruits.length; i++) {
        var f = fruits[i], r = radius(f.t), hue = (f.t * 30) % 360;
        ctx.fillStyle = 'hsl(' + hue + ',70%,60%)';
        ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.font = 'bold ' + Math.round(r * 1.5) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(TIERS[f.t].e, f.x, f.y + r * 0.04);
      }
      // 파티클
      for (var pi2 = 0; pi2 < particles.length; pi2++) { var p2 = particles[pi2]; ctx.globalAlpha = Math.max(0, p2.life); ctx.fillStyle = 'hsl(' + p2.hue + ',80%,65%)'; ctx.beginPath(); ctx.arc(p2.x, p2.y, 4, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      // 다음 과일 미리보기
      var nr = radius(nextTier);
      ctx.globalAlpha = 0.5; ctx.fillStyle = 'hsl(' + (nextTier * 30) + ',70%,60%)';
      ctx.beginPath(); ctx.arc(W / 2, dropperY, nr, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      ctx.font = 'bold ' + Math.round(nr * 1.5) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(TIERS[nextTier].e, W / 2, dropperY + nr * 0.04);
      // 힌트
      if (fruits.length === 0) { ctx.fillStyle = '#fff'; ctx.font = '800 18px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(I18n.t('suikaHint'), W / 2, H * 0.5); }
    },
    down: function (x) { drop(x); },
    key: function () { drop(W / 2); },
    exit: function () {},
    resume: function () {
      dead = false; grace = 1.5; overTimer = 0;
      fruits = fruits.filter(function (f) { return f.y - radius(f.t) >= boxTop - 4; });
      // 위험선 위 과일 제거
      fruits = fruits.filter(function (f) { return f.y - radius(f.t) >= boxTop; });
      api.sound.reward();
    }
  });
})();
