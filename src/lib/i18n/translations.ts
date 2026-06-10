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
  'home.footer': { en: 'Abyssos V0.1a — Built with Next.js', ko: 'Abyssos V0.1a — Built with Next.js' },
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
  'system.purgatorioIntro1': {
    en: 'You emerge from Hell under a sky full of stars. Before you rises Mount Purgatory — seven terraces of purification.',
    ko: '당신은 별이 가득한 하늘 아래 지옥을 빠져나왔다. 눈앞에 정화의 산, 일곱 겹의 연옥이 솟아 있다.',
  },
  'system.purgatorioIntro2': {
    en: 'Climb the mountain. Overcome your sin projections. Pass the trials of the angels. Reach the Earthly Paradise.',
    ko: '산을 올라라. 죄의 투영을 극복하라. 천사의 시험을 통과하라. 지상낙원에 도달하라.',
  },
  'system.purgatorioComplete': {
    en: '🌹 You have reached the Earthly Paradise! Beatrice awaits...',
    ko: '🌹 지상낙원에 도달했습니다! 베아트리체가 기다리고 있습니다...',
  },

  // ===== Purgatorio: Continue from Inferno =====
  'purgatorio.continue': {
    en: '🌅 Continue to Purgatory',
    ko: '🌅 연옥으로 계속하기',
  },
  'purgatorio.continueDesc': {
    en: 'You escaped Hell with {hp} HP and {cards} guardian cards. The mountain of purification awaits.',
    ko: '{hp} HP와 {cards}장의 수호카드를 가지고 지옥을 탈출했습니다. 정화의 산이 기다립니다.',
  },

  // ===== Purgatorio: Board =====
  'purgatorio.terracePrefix': { en: 'Terrace {n}', ko: '제{n} 테라스' },
  'purgatorio.sin': { en: 'Sin', ko: '죄의 투영' },
  'purgatorio.angel': { en: 'Angel', ko: '수호천사' },
  'purgatorio.angelAppeared': { en: '😇 Angel Guardian Appeared!', ko: '😇 수호천사 등장!' },
  'purgatorio.angelArrive': { en: '😇 Angel "{name}" guards the purification gate!', ko: '😇 수호천사 "{name}"이(가) 정화의 문을 지킨다!' },
  'purgatorio.battleArrive': { en: '👤 Sin projection "{name}" emerges!', ko: '👤 죄의 투영 "{name}"이 나타났다!' },

  // ===== Purgatorio: Angel Battle =====
  'purgatorio.angelPower': { en: 'PURIFICATION', ko: '정화력' },
  'purgatorio.angelMechanic': { en: '⚡ TRIAL', ko: '⚡ 시험 방식' },
  'purgatorio.angelVictory': {
    en: '✅ Trial passed! HP+{hp} + Purification Card',
    ko: '✅ 시험 통과! HP+{hp} + 정화카드',
  },
  'purgatorio.angelDefeat': {
    en: '💫 The angel gazes mercifully. You may try again.',
    ko: '💫 천사가 자비롭게 바라본다. 다시 시도할 수 있습니다.',
  },
  'purgatorio.angelResultVictory': {
    en: '😇✨ Trial passed! D6={roll} ≥ {power} — "{name}" acknowledges your growth! (+{hp} HP)',
    ko: '😇✨ 시험 통과! D6={roll} ≥ {power} — "{name}"이 그대의 성장을 인정한다! (+{hp} HP)',
  },
  'purgatorio.angelResultDefeat': {
    en: '💫 Trial incomplete. D6={roll} < {power} — "{name}" waits patiently.',
    ko: '💫 시험 미완료. D6={roll} < {power} — "{name}"이 인내심을 가지고 기다린다.',
  },

  // ===== Purgatorio: Purification Card =====
  'purgatorio.purificationAcquired': {
    en: '✨ Purification Card Acquired!',
    ko: '✨ 정화카드 획득!',
  },
  'purgatorio.purificationContinue': {
    en: 'Continue Climbing',
    ko: '계속 등반',
  },
  'purgatorio.purificationBonus': {
    en: '🌟 PURIFICATION BONUS',
    ko: '🌟 정화 보너스',
  },

  // ===== Purgatorio: Events =====
  'purgatorio.eventPrayer': {
    en: '✧ Prayer: +{hp} HP restored',
    ko: '✧ 기도: +{hp} HP 회복',
  },
  'purgatorio.eventFeather': {
    en: '🕊 Angel Feather: Next battle can be skipped!',
    ko: '🕊 천사의 깃털: 다음 전투를 건너뛸 수 있습니다!',
  },
  'purgatorio.eventSinWeight': {
    en: '⚖ Weight of Sin: -{hp} HP',
    ko: '⚖ 죄의 무게: -{hp} HP',
  },
  'purgatorio.eventStarlight': {
    en: '✨ Starlight Vision: All enemies this terrace -1 power!',
    ko: '✨ 별빛 환영: 이번 층 모든 적 전투력 -1!',
  },
  'purgatorio.eventBeatriceWhisper': {
    en: '🌹 Beatrice whispers: Full HP restored + Move +3!',
    ko: '🌹 베아트리체의 속삭임: HP 완전 회복 + 이동력 +3!',
  },

  // ===== Purgatorio: Escape transition =====
  'purgatorio.earthlyParadise': {
    en: '🌹 EARTHLY PARADISE',
    ko: '🌹 지상낙원',
  },
  'purgatorio.earthlyParadiseDesc': {
    en: 'Beatrice appears. Virgil smiles and fades. A new journey beyond the stars awaits.',
    ko: '베아트리체가 나타났다. 베르길리우스는 미소 지으며 사라진다. 별 너머의 새로운 여정이 기다린다.',
  },

  // ===== Guardian Panel =====
  'guardian.owned': { en: '✨ {n}/9', ko: '✨ {n}/9' },

  // ===== Golden Wings =====
  'guardian.wingsUsed': { en: '💰 Golden Wings: Flew 3 tiles! (3-turn cooldown)', ko: '💰 황금의 날개: 3칸 비행! (3턴 쿨다운)' },

  // ===== Paradiso Translations =====
  'system.paradisoIntro1': {
    en: 'You rise beyond the Earthly Paradise into the celestial realm. Nine spheres of light await.',
    ko: '당신은 지상낙원 너머 천상의 영역으로 솟아올랐다. 아홉 개의 빛의 천구가 기다린다.',
  },
  'system.paradisoIntro2': {
    en: 'Collect grace from light spirits. Pass the trials of archangels. Gather celestial relics. Reach the Empyrean.',
    ko: '빛의 정령에게서 은총을 모아라. 대천사의 시험을 통과하라. 성물을 모아 엠피리오에 도달하라.',
  },
  'paradiso.spherePrefix': { en: 'Sphere {n}', ko: '제{n}천' },
  'paradiso.grace': { en: 'Grace', ko: '은총' },
  'paradiso.spirit': { en: 'Spirit', ko: '정령' },
  'paradiso.archangel': { en: 'Archangel', ko: '대천사' },
  'paradiso.relic': { en: 'Relic', ko: '성물' },
  'paradiso.blessing': { en: 'Blessing', ko: '축복' },
  'paradiso.archangelAppeared': { en: '👼 Archangel Appeared!', ko: '👼 대천사 등장!' },
  'paradiso.trial': { en: 'TRIAL', ko: '시험' },
  'paradiso.reward': { en: 'REWARD', ko: '보상' },
  'paradiso.relicAcquired': { en: '💠 Celestial Relic Acquired!', ko: '💠 성물 획득!' },
  'paradiso.continue': { en: 'Continue Ascending', ko: '계속 승천' },
  'paradiso.spiritBless': { en: '✨ {name} blesses you! +{n} Grace', ko: '✨ {name}의 축복! 은총 +{n}' },
  'paradiso.empyrean': { en: '☀ EMPYREAN', ko: '☀ 엠피리오' },
  'paradiso.empyreanDesc': { en: 'You have reached the source of all light. The journey is complete.', ko: '당신은 모든 빛의 근원에 도달했다. 여정이 완성되었다.' },

  // ===== Misc =====
  'generic.card': { en: 'card', ko: '장' },
  'generic.turn': { en: 'turn', ko: '턴' },
  'generic.empty': { en: '—', ko: '—' },
  'lang.label': { en: 'KO', ko: 'EN' },

  // ===== ColorSequence Mini-game =====
  'colorSeq.watch': { en: '👀 Memorize...', ko: '👀 기억하세요...' },
  'colorSeq.play': { en: '👆 Repeat ({n}/{total})', ko: '👆 따라하기 ({n}/{total})' },
  'colorSeq.success': { en: '✅ Perfect!', ko: '✅ 완벽!' },
  'colorSeq.fail': { en: '❌ Failed!', ko: '❌ 실패!' },

  // ===== PatternMemory Mini-game =====
  'pattern.memorize': { en: '👁 Memorize the pattern...', ko: '👁 패턴을 기억하세요...' },
  'pattern.recall': { en: '🤔 Which pattern was it?', ko: '🤔 어떤 패턴이었나요?' },
  'pattern.correct': { en: '✅ Correct!', ko: '✅ 정답!' },
  'pattern.wrong': { en: '❌ Wrong!', ko: '❌ 틀렸습니다!' },
  'pattern.answer': { en: 'Answer: {answer}', ko: '정답: {answer}' },

  // ===== RapidTap Mini-game =====
  'rapidtap.prompt': { en: '⚡ Tap {n} times!', ko: '⚡ {n}회 탭하세요!' },
  'rapidtap.timeLimit': { en: 'Time limit: {s}s', ko: '제한시간: {s}초' },
  'rapidtap.start': { en: '👆 START!', ko: '👆 시작!' },
  'rapidtap.tapAnywhere': { en: '👆 TAP ANYWHERE!', ko: '👆 아무데나 탭하세요!' },
  'rapidtap.success': { en: '✅ Success! {n}', ko: '✅ 성공! {n}' },
  'rapidtap.fail': { en: '❌ Failed... {n}/{target}', ko: '❌ 실패... {n}/{target}' },

  // ===== Event: Choice =====
  'event.choice.greatSuccess': { en: '🤔 Crossroads: Great success! +{hp} HP, Move +{move}', ko: '🤔 선택의 기로: 대성공! +{hp} HP, 이동력 +{move}' },
  'event.choice.fail': { en: '🤔 Crossroads: Failed... -{hp} HP', ko: '🤔 선택의 기로: 실패... -{hp} HP' },

  // ===== Purgatorio Events (detailed) =====
  'purgatorio.eventPrayerDetailed': { en: '✧ Prayer: +{hp} HP restored (HP: {curr}/{max})', ko: '✧ 기도: +{hp} HP 회복 (HP: {curr}/{max})' },
  'purgatorio.eventCrossroadsSuccess': { en: '🤔 Crossroads: Great success! +{hp} HP, Move +{move}', ko: '🤔 선택의 갈림길: 대성공! +{hp} HP, 이동력 +{move}' },
  'purgatorio.eventCrossroadsFail': { en: '🤔 Crossroads: Failed... -{hp} HP', ko: '🤔 선택의 갈림길: 실패... -{hp} HP' },
  'purgatorio.eventStarlightDetailed': { en: '✨ Starlight Vision: All enemies this terrace -1 power!', ko: '✨ 별빛 환영: 이번 층 모든 적 전투력 -1!' },
  'purgatorio.eventEyeOfMercy': { en: '👁 Eye of Mercy: Trap damage negated!', ko: '👁 자비의 눈: 함정 피해 무효화!' },
  'purgatorio.eventSinWeightDetailed': { en: '⚖ Weight of Sin: -{hp} HP (HP: {curr}/{max})', ko: '⚖ 죄의 무게: -{hp} HP (HP: {curr}/{max})' },
  'purgatorio.eventAngelFeather': { en: '🕊 Angel Feather: Next battle can be skipped!', ko: '🕊 천사의 깃털: 다음 전투를 건너뛸 수 있습니다!' },

  // ===== Purgatorio: Purification messages =====
  'purgatorio.purificationAcquiredDetailed': { en: '✨ Purification Card acquired: {name}!', ko: '✨ 정화카드 획득: {name}!' },
  'purgatorio.angelMercy': { en: '💫 The angel gazes mercifully. -{hp} HP. You may try again.', ko: '💫 천사가 자비롭게 바라본다. -{hp} HP. 다시 시도할 수 있습니다.' },

  // ===== Game Store: Step of Zeal =====
  'purgatorio.stepOfZeal': { en: '⚡ Step of Zeal: Can move up to 3 times!', ko: '⚡ 열정의 발걸음: 최대 3회 연속 이동 가능!' },

  // ===== Sin Choice: Skip =====
  'sinChoice.skipWithFeather': { en: '🕊 Use Angel Feather (skip)', ko: '🕊 천사의 깃털 사용 (건너뛰기)' },

  // ===== Gatekeeper GK-7 pre-damage =====
  'gk.preDamageBlood': { en: '🩸 Blood Sentinel: -2 HP pre-damage!', ko: '🩸 피의 파수꾼: 선제 -2 HP 피해!' },
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
