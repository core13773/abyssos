/* =========================================================
 * 게임: 2048
 * 4x4 숫자 타일. 스와이프/방향키로 밀어 같은 숫자를 합친다.
 * ========================================================= */
(function () {
  'use strict';

  var api, ctx, W, H;
  var grid, score, dead, swipe0;

  function emptyCells() { var e = []; for (var i = 0; i < 16; i++) if (grid[i] === 0) e.push(i); return e; }
  function addTile() { var e = emptyCells(); if (!e.length) return; grid[e[(Math.random() * e.length) | 0]] = Math.random() < 0.9 ? 2 : 4; }
  function reset() { grid = new Array(16).fill(0); score = 0; dead = false; swipe0 = null; addTile(); addTile(); api.setScore(0); }

  function slide(line) {
    var n = line.filter(function (v) { return v; });
    var out = [], i = 0;
    while (i < n.length) {
      if (i + 1 < n.length && n[i] === n[i + 1]) { out.push(n[i] * 2); score += n[i] * 2; i += 2; }
      else { out.push(n[i]); i++; }
    }
    while (out.length < 4) out.push(0);
    return out;
  }
  function cellOf(dir, idx, k) {
    if (dir === 'left') return idx * 4 + k;
    if (dir === 'right') return idx * 4 + (3 - k);
    if (dir === 'up') return k * 4 + idx;
    return (3 - k) * 4 + idx;
  }
  function move(dir) {
    if (dead) return;
    var before = grid.slice();
    for (var idx = 0; idx < 4; idx++) {
      var line = []; for (var k = 0; k < 4; k++) line.push(grid[cellOf(dir, idx, k)]);
      var nl = slide(line); for (var k2 = 0; k2 < 4; k2++) grid[cellOf(dir, idx, k2)] = nl[k2];
    }
    var changed = false; for (var i = 0; i < 16; i++) if (before[i] !== grid[i]) changed = true;
    if (changed) { addTile(); api.sound.beep(440, 0.04, 'square', 0.08); api.setScore(score); if (!canMove()) gameOver(); }
  }
  function canMove() {
    if (emptyCells().length) return true;
    for (var r = 0; r < 4; r++) for (var cc = 0; cc < 4; cc++) {
      var v = grid[r * 4 + cc];
      if (cc < 3 && v === grid[r * 4 + cc + 1]) return true;
      if (r < 3 && v === grid[(r + 1) * 4 + cc]) return true;
    }
    return false;
  }
  function gameOver() { dead = true; api.sound.fail(); api.finish({ score: score, revive: true }); }

  function tileColor(v) {
    var map = { 2: ['#eee4da', '#776e65'], 4: ['#ede0c8', '#776e65'], 8: ['#f2b179', '#fff'], 16: ['#f59563', '#fff'], 32: ['#f67c5f', '#fff'], 64: ['#f65e3b', '#fff'], 128: ['#edcf72', '#fff'], 256: ['#edcc61', '#fff'], 512: ['#edc850', '#fff'], 1024: ['#edc53f', '#fff'], 2048: ['#edc22e', '#fff'] };
    return map[v] || ['#3c3a32', '#fff'];
  }

  Engine.register({
    id: '2048', icon: '🔢', nameKey: 'g_2048_name', descKey: 'g_2048_desc',
    enter: function (a) { api = a; W = Engine.W; H = Engine.H; reset(); },
    onResize: function (w, h) { W = w; H = h; },
    update: function () {},
    render: function (c) {
      ctx = c;
      var size = Math.min(W * 0.9, H * 0.62, 440);
      var bx = (W - size) / 2, by = (H - size) / 2;
      var gap = size * 0.025, cell = (size - gap * 5) / 4;
      ctx.fillStyle = '#1b2046'; roundRect(bx, by, size, size, 14); ctx.fill();
      for (var i = 0; i < 16; i++) {
        var r = (i / 4) | 0, col = i % 4;
        var x = bx + gap + col * (cell + gap), y = by + gap + r * (cell + gap);
        ctx.fillStyle = 'rgba(255,255,255,.05)'; roundRect(x, y, cell, cell, 8); ctx.fill();
        var v = grid[i];
        if (v) {
          var tc = tileColor(v);
          ctx.fillStyle = tc[0]; roundRect(x, y, cell, cell, 8); ctx.fill();
          ctx.fillStyle = tc[1]; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.font = '800 ' + (v < 100 ? cell * 0.42 : v < 1000 ? cell * 0.34 : cell * 0.26) + 'px sans-serif';
          ctx.fillText(String(v), x + cell / 2, y + cell / 2 + 2);
        }
      }
      if (grid.join('').replace(/0/g, '').length === 0) {
        ctx.fillStyle = '#aab3e0'; ctx.font = '700 16px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(I18n.t('swipeHint'), W / 2, by + size + 28);
      }
    },
    down: function (x, y) { swipe0 = { x: x, y: y }; },
    up: function (x, y) {
      if (!swipe0) return; var dx = x - swipe0.x, dy = y - swipe0.y; swipe0 = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
      else move(dy > 0 ? 'down' : 'up');
    },
    key: function (code) {
      if (code === 'ArrowLeft' || code === 'KeyA') move('left');
      else if (code === 'ArrowRight' || code === 'KeyD') move('right');
      else if (code === 'ArrowUp' || code === 'KeyW') move('up');
      else if (code === 'ArrowDown' || code === 'KeyS') move('down');
    },
    exit: function () {},
    resume: function () {
      // 가장 작은 타일 2개 제거하여 막힘 해소
      var list = []; for (var i = 0; i < 16; i++) if (grid[i] > 0) list.push({ i: i, v: grid[i] });
      list.sort(function (a, b) { return a.v - b.v; });
      for (var k = 0; k < Math.min(2, list.length); k++) grid[list[k].i] = 0;
      dead = false; api.sound.reward();
    }
  });

  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
})();
