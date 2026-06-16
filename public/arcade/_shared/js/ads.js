/* =========================================================
 * 광고 모듈 (Ads)
 * ---------------------------------------------------------
 * 지금은 STUB=true 로 "가짜 광고" 동작을 합니다.
 *  - showRewarded: 0.6초 뒤 자동으로 보상 지급 (개발/테스트용)
 *  - showInterstitial: 아무 동작 없음
 *
 * 실제 광고 연동 시:
 *  1) STUB = false 로 변경
 *  2) 아래 주석의 연동 예시(AdinPlay / CrazyGames)를 활성화
 * ========================================================= */
window.Ads = (function () {
  'use strict';

  var STUB = true; // ← 실제 SDK 연동 시 false

  function log() { try { console.log.apply(console, ['[Ads]'].concat([].slice.call(arguments))); } catch {} }

  return {
    isStub: function () { return STUB; },

    init: function () {
      log('init (STUB=' + STUB + ')');
      // 여기에 SDK 초기화 스크립트를 넣습니다.
    },

    // 보상형 광고: 시청 완료 → onGrant(), 건너뜀/실패 → onSkip()
    showRewarded: function (onGrant, onSkip) {
      log('showRewarded');
      if (STUB) {
        setTimeout(function () { log('reward granted (stub)'); if (onGrant) onGrant(); }, 600);
        return;
      }
      void onSkip; // 실제 SDK 연동 시 사용 (아래 주석 예시 참고)
      // === AdinPlay 연동 예시 ===
      // if (window.aiptag && window.aiptag.cmd) {
      //   window.aiptag.cmd.display.push(function () {
      //     window.aiptag.showRewarded({ callback: function (status) {
      //       if (status === 'rewarded') { if (onGrant) onGrant(); }
      //       else { if (onSkip) onSkip(); }
      //     }});
      //   });
      // }
      //
      // === CrazyGames SDK 예시 ===
      // if (window.CrazyGames) {
      //   window.CrazyGames.SDK.ad.requestAd('rewarded', {
      //     adFinished: function () { if (onGrant) onGrant(); },
      //     adError: function () { if (onSkip) onSkip(); }
      //   });
      // }
    },

    // 전면 광고 (게임 사이 등)
    showInterstitial: function () {
      log('showInterstitial');
      if (STUB) return;
      // === AdinPlay ===
      // if (window.aiptag) {
      //   window.aiptag.cmd.display.push(function () { window.aiptag.show(); });
      // }
      //
      // === CrazyGames ===
      // if (window.CrazyGames) {
      //   window.CrazyGames.SDK.ad.requestAd('midgame');
      // }
    }
  };
})();
