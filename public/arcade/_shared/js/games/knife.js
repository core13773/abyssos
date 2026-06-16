/* =========================================================
 * 게임: Knife Hit (칼 던지기)
 * 회전하는 통에 칼을 던져 꽂는다. 겹치면 실패. 레벨 진행.
 * 각도 기준: 북(위)이 0, 시계방향 양수. 아래(남)=π.
 * ========================================================= */
(function () {
  'use strict';

  var THROW = 1500, TOL = 0.20;

  var api, ctx, W, H;
  var cx, cy, R, rot, omega, stuck, apples, knivesLeft, level, throwing, dead, score, flash, particles;

  function norm(a) { a %= 2 * Math.PI; if (a < 0) a += 2 * Math.PI; return a; }
  function angDiff(a, b) { var d = Math.abs(a - b) % (2 * Math.PI); if (d > Math.PI) d = 2 * Math.PI - d; return d; }

  function reset() {
    R = Math.min(W, H) * 0.16;
    cx = W / 2; cy = H * 0.42;
    rot = 0; stuck = []; apples = []; throwing = null; dead = false; score = 0; flash = 0; particles = [];
    level = 1; startLevel(); api.setScore(0);
  }
  function startLevel() {
    stuck = []; apples = []; throwing = null; flash = 0.5;
    knivesLeft = Math.min(5 + level, 12);
    omega = (0.7 + level * 0.14) * (level % 2 ? 1 : -1);
    var pre = Math.min(level - 1, 5);
    for (var i = 0; i < pre; i++) stuck.push(Math.random() * Math.PI * 2);
    if (Math.random() < 0.6) apples.push({ a: Math.random() * Math.PI * 2, got: false });
  }

  function throwKnife() {
    if (dead || throwing) return;
    throwing = { y: H - 30 };
    api.sound.beep(700, 0.04, 'square', 0.08);
  }
  function resolveHit() {
    var local = norm(Math.PI - rot);
    for (var i = 0; i < apples.length; i++) { if (!apples[i].got && angDiff(apples[i].a, local) < 0.25) { apples[i].got = true; score += 5; api.sound.beep(900, 0.08, 'triangle', 0.14); } }
    for (var s = 0; s < stuck.length; s++) { if (angDiff(stuck[s], local) < TOL) { die(); return; } }
    stuck.push(local); score++; knivesLeft--; throwing = null;
    api.sound.beep(500, 0.05, 'square', 0.1); api.setScore(score);
    for (var p = 0; p < 8; p++) { var a = Math.random() * Math.PI * 2; particles.push({ x: cx, y: cy + R, vx: Math.cos(a) * 80, vy: Math.sin(a) * 80 - 40, life: 1 }); }
    if (knivesLeft <= 0) { level++; api.sound.beep(660, 0.1, 'triangle', 0.14); startLevel(); }
  }
  function die() { if (dead) return; dead = true; throwing = null; api.sound.fail(); api.finish({ score: score, revive: true }); }

  function drawKnife(x, y, up) {
    ctx.save(); ctx.translate(x, y); if (!up) ctx.rotate(Math.PI);
    ctx.fillStyle = '#cfd8ea'; ctx.fillRect(-4, 0, 8, 38);          // 날
    ctx.fillStyle = '#9aa6c0'; ctx.fillRect(-4, 0, 8, 6);
    ctx.fillStyle = '#5b4a3a'; ctx.fillRect(-6, 38, 12, 16);         // 손잡이
    ctx.restore();
  }

  Engine.register({
    id: 'knife', icon: '🔪', nameKey: 'g_knife_name', descKey: 'g_knife_desc',
    enter: function (a) { api = a; W = Engine.W; H = Engine.H; reset(); },
    onResize: function (w, h) { W = w; H = h; },
    update: function (dt) {
      rot += omega * dt;
      if (throwing) { throwing.y -= THROW * dt; if (throwing.y <= cy + R) { throwing.y = cy + R; resolveHit(); } }
      if (flash > 0) flash -= dt;
      for (var i = particles.length - 1; i >= 0; i--) { var p = particles[i]; p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 2; if (p.life <= 0) particles.splice(i, 1); }
    },
    render: function (c) {
      ctx = c;
      // 통 (회전)
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      var g = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R);
      g.addColorStop(0, '#8a5a33'); g.addColorStop(1, '#5e3a1e');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2;
      for (var k = 0; k < 6; k++) { ctx.beginPath(); ctx.rotate(Math.PI / 6); ctx.moveTo(0, 0); ctx.lineTo(R, 0); ctx.stroke(); }
      // 꽂힌 칼(통 안쪽으로)
      for (var s = 0; s < stuck.length; s++) {
        ctx.save(); ctx.rotate(stuck[s]); ctx.translate(0, -R);
        ctx.fillStyle = '#cfd8ea'; ctx.fillRect(-3, -30, 6, 30); ctx.fillStyle = '#5b4a3a'; ctx.fillRect(-5, 0, 10, 14);
        ctx.restore();
      }
      // 사과
      for (var a = 0; a < apples.length; a++) { if (apples[a].got) continue; ctx.save(); ctx.rotate(apples[a].a); ctx.translate(0, -R); ctx.fillStyle = '#ef476f'; ctx.beginPath(); ctx.arc(0, -8, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      ctx.restore();
      // 날아가는 칼
      if (throwing) drawKnife(cx, throwing.y, true);
      // 파티클
      for (var pi = 0; pi < particles.length; pi++) { var pp = particles[pi]; ctx.globalAlpha = Math.max(0, pp.life); ctx.fillStyle = '#ffd54a'; ctx.beginPath(); ctx.arc(pp.x, pp.y, 3, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      // 남은 칼 표시
      ctx.fillStyle = '#cfd8ea'; ctx.textAlign = 'center'; ctx.font = '700 14px sans-serif';
      var bx = cx - (knivesLeft - 1) * 11;
      for (var n = 0; n < knivesLeft; n++) { ctx.fillRect(bx + n * 22 - 1, H - 26, 3, 16); ctx.fillRect(bx + n * 22 - 3, H - 12, 7, 6); }
      if (level === 1 && stuck.length === 0 && !throwing) { ctx.fillStyle = '#fff'; ctx.font = '800 20px sans-serif'; ctx.fillText(I18n.t('tapThrow'), cx, H * 0.8); }
      if (flash > 0) { ctx.globalAlpha = Math.min(0.4, flash); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    },
    down: function () { throwKnife(); },
    key: function () { throwKnife(); },
    exit: function () {},
    resume: function () {
      // 충돌한 칼을 그냥 꽂아주고 계속
      var local = norm(Math.PI - rot);
      stuck.push(local); score++; knivesLeft--; dead = false;
      api.sound.reward(); api.setScore(score);
      if (knivesLeft <= 0) { level++; startLevel(); }
    }
  });
})();
