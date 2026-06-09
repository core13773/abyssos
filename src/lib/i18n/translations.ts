export type Locale = 'en' | 'ko';

type TranslationMap = Record<string, Record<Locale, string>>;

const T: TranslationMap = {
  // ===== Top Bar =====
  'top.lobby': { en: '← Lobby', ko: '← 로비' },
  'top.newGame': { en: 'New', ko: '새 게임' },
  'top.title': { en: 'Abyssos', ko: 'Abyssos' },
  'top.loading': { en: 'Generating Hell...', ko: '지옥을 생성하는 중...' },

  // ===== Home Page =====
  'home.subtitle': { en: '9 Circles of Hell', ko: '아홉 지옥의 탈출' },
  'home.tagline': {
    en: 'A card battle game through the 9 circles of Hell.\nRoll the dice. Defeat monsters. Collect guardian cards.\nEscape the abyss.',
    ko: '9층 지옥을 통과하는 카드 배틀 게임.\n주사위를 굴려 몬스터를 물리치고\n수호카드를 모아 지옥을 탈출하라.',
  },
  'home.enter': { en: '🔥 Enter Hell', ko: '🔥 지옥에 입장하기' },
  'home.footer': { en: 'Abyssos v4.0 — Built with Next.js', ko: 'Abyssos v4.0 — Built with Next.js' },
  'home.footerDesc': { en: 'Card battle × Roguelike × Board game', ko: '카드 배틀 × 로그라이크 × 보드게임' },

  // ===== Dice Panel =====
  'dice.roll': { en: 'Roll Dice', ko: '주사위 굴리기' },
  'dice.move': { en: 'Move ▶', ko: '이동하기 ▶' },
  'dice.resolveEvent': { en: 'Resolve Event', ko: '이벤트 확인' },
  'dice.double': { en: 'Double! Roll again.', ko: '더블! 한 번 더 굴리세요.' },

  // ===== Player Panel =====
  'player.current': { en: 'Current', ko: '현재' },
  'player.hp': { en: 'HP', ko: 'HP' },
  'player.turn': { en: 'Turn', ko: '턴' },
  'player.guardians': { en: 'Guardians', ko: '수호' },
  'player.escapedTitle': { en: '✦✦ ESCAPED HELL! ✦✦', ko: '✦✦ 지옥 탈출 성공! ✦✦' },
  'player.escapedDesc': { en: 'You have traversed all 9 circles.', ko: '9층 지옥을 모두 통과했습니다.' },
  'player.escapedStats': { en: 'Turns: {turns} | HP: {hp}/{maxHp} | Guardians: {g}/9', ko: '턴: {turns} | HP: {hp}/{maxHp} | 수호카드: {g}/9' },
  'player.challengeAgain': { en: 'Challenge Again', ko: '다시 도전하기' },

  // ===== Board =====
  'board.circlePrefix': { en: 'Circle {n}', ko: '제{n}층' },
  'board.surfaceNear': { en: '✦ The surface is near ✦', ko: '✦ 지상이 가까워진다 ✦' },

  // ===== Tile Types =====
  'tile.monster': { en: 'Monster', ko: '몬스터' },
  'tile.event': { en: 'Event', ko: '이벤트' },
  'tile.gatekeeper': { en: 'Gatekeeper', ko: '수문장' },
  'tile.tier.minor': { en: 'Minor', ko: '하급' },
  'tile.tier.greater': { en: 'Greater', ko: '상급' },
  'tile.tier.boss': { en: 'BOSS', ko: '보스' },
  'tile.event.rest': { en: 'Rest', ko: '휴식' },
  'tile.event.trap': { en: 'Trap', ko: '함정' },
  'tile.event.blessing': { en: 'Blessing', ko: '축복' },
  'tile.event.curse': { en: 'Curse', ko: '저주' },

  // ===== Battle Modal =====
  'battle.power': { en: 'Power', ko: '전투력' },
  'battle.rollButton': { en: '🎲 Roll D6!', ko: '🎲 D6 굴려 전투!' },
  'battle.surrender': { en: 'Surrender', ko: '도망치기' },
  'battle.victory': { en: 'Victory: HP +{hp}', ko: '승리: HP +{hp}' },
  'battle.defeat': { en: 'Defeat: HP -{hp}', ko: '패배: HP -{hp}' },
  'battle.skipWithMask': { en: '🎭 Mask Secret: Skip battle (1 use)', ko: '🎭 가면술사의 비밀: 전투 건너뛰기 (1회)' },
  'battle.guardianBonus': { en: '✨ Guardian Bonus: D6 +{n}', ko: '✨ 수호카드 보너스: D6 +{n}' },
  'battle.arrive': { en: '👾 {name} appeared! Roll D6 to fight!', ko: '👾 {name} 등장! D6를 굴려 전투하라!' },

  // ===== Battle Results =====
  'battle.result.victory': { en: '⚔ {name} (Power {power}) defeated! D6={roll}', ko: '⚔ {name} (전투력 {power}) 처치! D6={roll}' },
  'battle.result.defeat': { en: '💀 Defeated by {name} (Power {power})! D6={roll}', ko: '💀 {name} (전투력 {power})에게 패배! D6={roll}' },
  'battle.result.crit': { en: '🌟 Critical Hit! Reward x2!', ko: '🌟 크리티컬 히트! 보상 2배!' },
  'battle.result.fumble': { en: '💀 Fumble! Damage x2!', ko: '💀 펌블! 피해 2배!' },
  'battle.result.heal': { en: '+{hp} HP restored (HP: {curr}/{max})', ko: '+{hp} HP 회복 (HP: {curr}/{max})' },
  'battle.result.damage': { en: '-{hp} HP lost (HP: {curr}/{max})', ko: '-{hp} HP 손실 (HP: {curr}/{max})' },
  'battle.result.streak': { en: '🔥 {n}-win streak!', ko: '🔥 {n}연승!' },
  'battle.result.bloodBlessing': { en: '🩸 Blood Blessing: excess +{n} HP', ko: '🩸 피의 축복: 초과 피해 +{n} HP' },
  'battle.result.iceHeart': { en: '❄️ Ice Heart: damage -{n}', ko: '❄️ 얼음 거인의 심장: 피해 -{n}' },
  'battle.result.buffExtended': { en: '🔥 Inquisitor: All buffs +1 turn!', ko: '🔥 이단 재판관: 모든 버프 +1턴 연장!' },
  'battle.result.maskSkip': { en: '🎭 Mask Secret: Battle skipped!', ko: '🎭 가면술사의 비밀: 전투를 건너뛰었다!' },
  'battle.result.hydraRegen': { en: '🐍 Hydra regrows! Rematch!', ko: '🐍 히드라의 머리가 다시 돋아난다! 재대결!' },
  'battle.result.poison': { en: '☠ Toxic Fog: HP -2 for 2 turns', ko: '☠ 독 안개: 2턴간 매 턴 HP -2' },
  'battle.result.buffLost': { en: '🎭 Buff lost: {name}', ko: '🎭 버프 소멸: {name}' },
  'battle.result.diceDown': { en: 'Grasp: Next D6 -1', ko: '발목 붙잡기: 다음 주사위 -1' },

  // ===== Gatekeeper Modal =====
  'gk.arrive': { en: '👹 Gatekeeper "{name}" blocks your path! Match the timing to pass!', ko: '👹 수문장 "{name}"이(가) 승천을 막았다! 타이밍을 맞춰 돌파하라!' },
  'gk.appeared': { en: '👹 Gatekeeper Appeared!', ko: '👹 수문장 등장!' },
  'gk.target': { en: '🎯 D6 Target: {n}+', ko: '🎯 D6 목표: {n} 이상' },
  'gk.challenge': { en: '🎯 Time your tap!', ko: '🎯 타이밍을 맞춰 탭하라!' },
  'gk.tapPrompt': { en: '👆 TAP TO START', ko: '👆 탭하여 시작' },
  'gk.victoryLabel': { en: '✅ Victory: HP+{hp} + Guardian Card', ko: '✅ 승리: HP+{hp} + 수호카드' },
  'gk.defeatLabel': { en: '❌ Defeat: HP-{hp} + Pushback {n} tiles', ko: '❌ 패배: HP-{hp} + {n}칸 후퇴' },
  'gk.result.victory': { en: '⚔✨ Victory! D6={roll} ≥ {power} — "{name}" defeated! Ascending to {circle}! (+{hp} HP)', ko: '⚔✨ 승리! D6={roll} ≥ {power} — "{name}" 처치! {circle} 승천! (+{hp} HP)' },
  'gk.result.defeat': { en: '💀 Defeat! D6={roll} < {power} — "{name}" repelled you! -{hp} HP + {push} tile pushback', ko: '💀 패배! D6={roll} < {power} — "{name}"에게 격퇴! -{hp} HP + {push}칸 후퇴' },
  'gk.gimmick': { en: '⚡ UNIQUE GIMMICK', ko: '⚡ 고유 기믹' },
  'gk.guardianBonus': { en: '✨ Guardians: Green zone +{n}%p', ko: '✨ 수호카드: 녹색 존 +{n}%p' },
  'gk.preDamage': { en: '🩸 Blood Sentinel: -2 HP pre-damage!', ko: '🩸 피의 파수꾼: 선제 -2 HP 피해!' },

  // ===== Guardian Reward =====
  'guardian.acquired': { en: '✨ Guardian Card Acquired!', ko: '✨ 수호카드 획득!' },
  'guardian.continue': { en: 'Continue', ko: '계속 진행' },
  'guardian.empty': { en: 'Defeat gatekeepers to earn guardian cards', ko: '수문장을 처치하면 수호카드를 얻습니다' },

  // ===== Events =====
  'event.rest': { en: '✧ Rest: +{hp} HP restored (HP: {curr}/{max})', ko: '✧ 휴식: +{hp} HP 회복 (HP: {curr}/{max})' },
  'event.trap': { en: '⚠ Trap! -{hp} HP (HP: {curr}/{max})', ko: '⚠ 함정 발동! -{hp} HP (HP: {curr}/{max})' },
  'event.trap.reduced': { en: '⚠ Trap! -{hp} HP (❄️ Ice Heart: 50% reduced) (HP: {curr}/{max})', ko: '⚠ 함정 발동! -{hp} HP (❄️ 얼음 심장: 50% 감소) (HP: {curr}/{max})' },
  'event.blessing.heal': { en: '★ Blessing: +{hp} HP restored!', ko: '★ 축복: +{hp} HP 회복!' },
  'event.blessing.move': { en: '★ Blessing: Move +{n}!', ko: '★ 축복: 이동력 +{n}!' },
  'event.curse.damage': { en: '☠ Curse: -{hp} HP!', ko: '☠ 저주: -{hp} HP!' },
  'event.curse.stun': { en: '☠ Curse: Stunned next turn!', ko: '☠ 저주: 다음 턴 스턴!' },
  'event.arrive': { en: 'Arrived: {label} (Circle {circle})', ko: '도착: {label} ({circle}층)' },

  // ===== Dice Roll Messages =====
  'dice.snakeEyes': { en: '💀 SNAKE EYES! [{d1}][{d2}] = {sum}, 3 damage!', ko: '💀 스네이크 아이즈! [{d1}][{d2}] = {sum}, 3 데미지!' },
  'dice.boxcar': { en: '🌟 BOXCAR! [{d1}][{d2}] = {sum}!', ko: '🌟 박스카! [{d1}][{d2}] = {sum}!' },
  'dice.normal': { en: '🎲 [{d1}][{d2}] = {raw} → {total} spaces', ko: '🎲 [{d1}][{d2}] = {raw} → {total}칸' },

  // ===== System Messages =====
  'system.stunned': { en: '😵 Recovering from stun. Turn passes.', ko: '😵 스턴에서 회복했다. 이번 턴은 넘어간다.' },
  'system.gameIntro1': {
    en: 'You awaken in the deepest pit of hell — the frozen lake of Cocytus. Ascend through all 9 circles to escape.',
    ko: '당신은 지옥의 가장 깊은 곳, 코퀴토스의 얼음 호수에서 눈을 뜬다. 9층 지옥을 통과해 탈출하라.',
  },
  'system.gameIntro2': {
    en: 'Roll the dice. Defeat monsters. Overcome gatekeepers. Collect guardian cards. Escape the abyss.',
    ko: '주사위를 굴려라. 몬스터를 물리쳐라. 수문장을 넘어서라. 수호카드를 모아 지옥을 탈출하라.',
  },
  'system.escape': { en: '✦✦ ESCAPED HELL! ✦✦', ko: '✦✦ 지옥 탈출 성공! ✦✦' },

  // ===== Guardian Panel =====
  'guardian.owned': { en: '✨ {n}/9', ko: '✨ {n}/9' },

  // ===== Golden Wings =====
  'guardian.wingsUsed': { en: '💰 Golden Wings: Flew 3 tiles! (3-turn cooldown)', ko: '💰 황금의 날개: 3칸 비행! (3턴 쿨다운)' },

  // ===== Misc =====
  'generic.card': { en: 'card', ko: '장' },
  'generic.turn': { en: 'turn', ko: '턴' },
  'generic.empty': { en: '—', ko: '—' },
  'lang.label': { en: 'KO', ko: 'EN' },
} as const;

export function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  const entry = T[key];
  let text = entry?.[locale] || entry?.en || key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }

  return text;
}

/** Get just the English or Korean version, ignoring params (for lookups) */
export function getRaw(key: string, locale: Locale): string {
  const entry = T[key];
  return entry?.[locale] || entry?.en || key;
}

// ---- Module-level locale for use in game logic (non-React) ----
let _activeLocale: Locale = 'en';

export function setActiveLocale(l: Locale) {
  _activeLocale = l;
}

export function getActiveLocale(): Locale {
  return _activeLocale;
}
