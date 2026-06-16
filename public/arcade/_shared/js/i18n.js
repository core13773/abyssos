/* =========================================================
 * 다국어 모듈 (I18n) — 영문(en) 메인 / 한글(ko)
 *  - 모든 문구는 이 파일 하나에 분리 (완벽 분리).
 *  - 기본 언어: en. HTML은 data-i18n="키", 코드는 I18n.t('키',{vars}).
 * ========================================================= */
window.I18n = (function () {
  'use strict';

  var DEFAULT_LANG = 'en';

  var dict = {
    en: {
      menuTitle:     'Games',
      menuSub:       'Pick a game to play',
      bestLabel:     'BEST',
      menuBtn:       'Menu',
      gameOver:      'GAME OVER',
      score:         'Score',
      best:          'Best',
      revive:        '📺 Revive (Watch Ad)',
      restart:       'Restart',
      g_stack_name:  'Stack Tower',
      g_stack_desc:  'Stack the blocks precisely',
      g_flappy_name: 'Flappy Dodge',
      g_flappy_desc: 'Tap to fly through the gaps',
      g_lane_name:   'Lane Dodge',
      g_lane_desc:   'Switch lanes to dodge',
      g_suika_name:  'Merge Fruits',
      g_suika_desc:  'Drop & merge same fruits',
      g_2048_name:   '2048',
      g_2048_desc:   'Swipe to merge numbers',
      g_knife_name:  'Knife Hit',
      g_knife_desc:  'Throw knives at the log',
      g_color_name:  'Color Switch',
      g_color_desc:  'Tap to match the color',
      tapFly:        'TAP TO FLY',
      tapLane:       'TAP  ◀  /  ▶  TO MOVE',
      suikaHint:     'TAP to drop fruit',
      swipeHint:     'Swipe  /  Arrow keys',
      tapThrow:      'TAP to throw',
      tapSwitch:     'TAP to switch color',
      perfect:       'PERFECT!',
      perfectCombo:  'PERFECT x{n}',
      langLabel:     '한국어'
    },
    ko: {
      menuTitle:     '게임',
      menuSub:       '플레이할 게임을 선택하세요',
      bestLabel:     '최고',
      menuBtn:       '메뉴',
      gameOver:      'GAME OVER',
      score:         '점수',
      best:          '최고 기록',
      revive:        '📺 부활 (광고 시청)',
      restart:       '다시 시작',
      g_stack_name:  '스택 타워',
      g_stack_desc:  '블록을 정밀하게 쌓아올리세요',
      g_flappy_name: '플래피 닷지',
      g_flappy_desc: '탭해서 틈새를 통과하세요',
      g_lane_name:   '레인 닷지',
      g_lane_desc:   '차선을 바꿔 장애물을 피하세요',
      g_suika_name:  '과일 합치기',
      g_suika_desc:  '같은 과일을 떨어뜨려 합치세요',
      g_2048_name:   '2048',
      g_2048_desc:   '밀어서 같은 숫자 합치기',
      g_knife_name:  '칼 던지기',
      g_knife_desc:  '통에 칼을 던져 꽂으세요',
      g_color_name:  '컬러 스위치',
      g_color_desc:  '탭해서 색을 맞추세요',
      tapFly:        '탭해서 날아오르세요',
      tapLane:       '◀  /  ▶  탭해서 이동',
      suikaHint:     '탭해서 과일 떨어뜨리기',
      swipeHint:     '스와이프 / 방향키',
      tapThrow:      '탭해서 던지기',
      tapSwitch:     '탭해서 색 변경',
      perfect:       'PERFECT!',
      perfectCombo:  'PERFECT x{n}',
      langLabel:     'English'
    }
  };

  var lang = DEFAULT_LANG;

  function t(key, vars) {
    var s = (dict[lang] && dict[lang][key]) || dict.en[key] || key;
    if (vars) { for (var k in vars) { s = s.split('{' + k + '}').join(vars[k]); } }
    return s;
  }
  function applyDOM() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
  }
  function setLang(l) {
    if (!dict[l]) l = DEFAULT_LANG;
    lang = l;
    try { localStorage.setItem('stacktower_lang', l); } catch {}
    document.documentElement.lang = l;
    applyDOM();
  }
  function init() {
    var saved = null;
    try { saved = localStorage.getItem('stacktower_lang'); } catch {}
    setLang(saved || DEFAULT_LANG);
  }
  return {
    t: t, init: init, applyDOM: applyDOM, setLang: setLang,
    getLang: function () { return lang; },
    toggle: function () { setLang(lang === 'en' ? 'ko' : 'en'); }
  };
})();

I18n.init();
