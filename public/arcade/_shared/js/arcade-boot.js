/* arcade-boot: 게임별 정적 페이지에서 사용.
 * - ?l= 로 초기 언어 강제 적용
 * - 메뉴 생략하고 window.ARCADE_GAME 게임을 바로 시작
 * - 상단 ← / 게임오버 Menu 버튼 → abyssos Arcade 허브로 이동 */
(function () {
  'use strict';

  try {
    var l = new URLSearchParams(location.search).get('l');
    if (l === 'ko' || l === 'en') I18n.setLang(l);
  } catch {}

  function toHub() {
    var l = 'en';
    try { l = I18n.getLang() || 'en'; } catch {}
    location.href = '/' + l + '/arcade/';
  }

  Engine.refreshMenu = function () {}; // 허브 메뉴는 사용 안 함
  Engine.init();

  var back = document.getElementById('back-btn');
  if (back) back.addEventListener('click', toHub);
  var menuBtn = document.getElementById('menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', toHub);

  var id = window.ARCADE_GAME;
  if (id) Engine.startGame(id);
})();
