/* =========================================================
 * 메인 메뉴(허브) — 게임 카드를 생성하고 엔진을 부팅한다.
 * ========================================================= */
(function () {
  'use strict';

  var listEl = document.getElementById('game-list');

  function bestOf(id) {
    var v = parseInt(localStorage.getItem('stg_hs_' + id) || '0', 10);
    return isNaN(v) ? 0 : v;
  }

  function refresh() {
    listEl.innerHTML = '';
    var games = Engine.list();
    for (var i = 0; i < games.length; i++) {
      (function (g) {
        var card = document.createElement('button');
        card.className = 'game-card';
        card.innerHTML =
          '<span class="gc-icon">' + g.icon + '</span>' +
          '<span class="gc-meta">' +
            '<span class="gc-name" data-i18n="' + g.nameKey + '">' + I18n.t(g.nameKey) + '</span>' +
            '<span class="gc-desc" data-i18n="' + g.descKey + '">' + I18n.t(g.descKey) + '</span>' +
          '</span>' +
          '<span class="gc-best"><span data-i18n="bestLabel">' + I18n.t('bestLabel') + '</span> ' + bestOf(g.id) + '</span>';
        card.addEventListener('click', function () { Engine.startGame(g.id); });
        listEl.appendChild(card);
      })(games[i]);
    }
    I18n.applyDOM(); // 새로 추가된 노드까지 번역 적용
  }

  Engine.refreshMenu = refresh;
  refresh();
  Engine.init(); // 모든 게임 등록 후 부팅
})();
