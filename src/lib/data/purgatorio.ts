import type { TerraceId, SinProjectionCard, AngelGuardianCard, PurificationCard } from '@/types/game';

// ============================================================
// Purgatorio Terraces
// ============================================================

export interface TerraceInfo {
  id: TerraceId; name: string; nameEn: string;
  sin: string; sinEn: string;
  description: string; descriptionEn: string;
  purificationMethod: string; purificationMethodEn: string;
  color: string; tileCount: number;
  sinAId: string; sinBId: string;
  /** Environmental effect that modifies gameplay on this terrace */
  terraceEffect: string; terraceEffectEn: string;
}

export const TERRACES: TerraceInfo[] = [
  { id: 1, name: '교만', nameEn: 'Pride', sin: '무거운 돌', sinEn: 'Heavy stones', description: '대리석 조각상들이 늘어선 길. 교만한 영혼들이 무거운 돌을 짊어지고 허리를 굽혀 걷는다.', descriptionEn: 'A path lined with marble sculptures. Proud souls walk bent under massive boulders.', purificationMethod: '무거운 돌을 짊어지며 겸손을 배운다', purificationMethodEn: 'Learn humility by carrying heavy stones', color: '#8b7355', tileCount: 8, sinAId: 'sin-1a', sinBId: 'sin-1b', terraceEffect: '선택 실패 시 D6 -1', terraceEffectEn: 'Failed choice → D6 -1' },
  { id: 2, name: '시기', nameEn: 'Envy', sin: '꿰매진 눈', sinEn: 'Sewn eyes', description: '회색 절벽 길. 시기하는 자들의 눈이 실로 꿰매어져 서로를 부축하며 걷는다.', descriptionEn: 'Grey cliff paths. The envious have eyes sewn shut, leaning on one another.', purificationMethod: '눈을 실로 꿰매어 남의 것을 보지 않는다', purificationMethodEn: 'Eyes sewn shut so as not to covet', color: '#9ca3af', tileCount: 8, sinAId: 'sin-2a', sinBId: 'sin-2b', terraceEffect: '카드 비활성 위험 있음', terraceEffectEn: 'Risk of card disable' },
  { id: 3, name: '분노', nameEn: 'Wrath', sin: '검은 연기', sinEn: 'Black smoke', description: '짙은 검은 연기가 협곡을 가득 메웠다. 분노한 영혼들이 연기 속에서 온유를 배운다.', descriptionEn: 'Thick black smoke fills the gorge. Wrathful souls learn gentleness within.', purificationMethod: '검은 연기 속을 걸으며 온유를 배운다', purificationMethodEn: 'Walk through black smoke to learn gentleness', color: '#374151', tileCount: 8, sinAId: 'sin-3a', sinBId: 'sin-3b', terraceEffect: '분노 게이지: 실패 시 다음 선택 더 어려워짐', terraceEffectEn: 'Rage gauge: Failure makes next choice harder' },
  { id: 4, name: '나태', nameEn: 'Sloth', sin: '쉬지 않는 달리기', sinEn: 'Ceaseless running', description: '끝없이 이어지는 돌계단. 나태했던 영혼들이 쉬지 않고 달리며 열정을 되찾는다.', descriptionEn: 'Endless stone steps. Slothful souls run without rest, reclaiming zeal.', purificationMethod: '쉬지 않고 달리며 열정을 되찾는다', purificationMethodEn: 'Run ceaselessly to reclaim zeal', color: '#6366f1', tileCount: 8, sinAId: 'sin-4a', sinBId: 'sin-4b', terraceEffect: '이동력 보너스 기회', terraceEffectEn: 'Move bonus opportunities' },
  { id: 5, name: '탐욕', nameEn: 'Greed', sin: '땅에 엎드림', sinEn: 'Face-down', description: '수정처럼 빛나는 바닥에 탐욕스러운 영혼들이 엎드려 통곡한다.', descriptionEn: 'Greedy souls lie face-down on crystal floors, weeping.', purificationMethod: '땅에 엎드려 재물에 대한 집착을 놓는다', purificationMethodEn: 'Release attachment to wealth', color: '#a78bfa', tileCount: 8, sinAId: 'sin-5a', sinBId: 'sin-5b', terraceEffect: '보상 2배 또는 0', terraceEffectEn: 'Double reward or nothing' },
  { id: 6, name: '식탐', nameEn: 'Gluttony', sin: '굶주림과 갈증', sinEn: 'Hunger & thirst', description: '향기로운 과일나무가 늘어섰지만 아무도 손을 뻗지 않는다. 굶주림 속에서 절제를 배운다.', descriptionEn: 'Fragrant fruit trees line the path, yet none reach for them.', purificationMethod: '향기나는 과일을 보며 굶주림을 견딘다', purificationMethodEn: 'Endure hunger while gazing upon fragrant fruit', color: '#84cc16', tileCount: 8, sinAId: 'sin-6a', sinBId: 'sin-6b', terraceEffect: '회복량 변동 큼', terraceEffectEn: 'High variance in healing' },
  { id: 7, name: '색욕', nameEn: 'Lust', sin: '정화의 불', sinEn: 'Purifying fire', description: '거대한 불기둥이 테라스를 가로막는다. 불 속을 걸으며 순결을 되찾는다.', descriptionEn: 'A massive wall of fire blocks the terrace. Walk through to reclaim purity.', purificationMethod: '불의 벽을 통과하며 순결을 되찾는다', purificationMethodEn: 'Pass through the wall of fire to reclaim purity', color: '#ef4444', tileCount: 8, sinAId: 'sin-7a', sinBId: 'sin-7b', terraceEffect: '선택 난이도 최상', terraceEffectEn: 'Maximum choice difficulty' },
];

// ============================================================
// Sin Projections — with narrative choice dilemmas
// ============================================================

export const SIN_PROJECTIONS: SinProjectionCard[] = [
  // ── 1층 교만 🪨 ──
  {
    id: 'sin-1a', terraceId: 1, tier: 'A', name: '돌 거인', nameEn: 'Stone Giant',
    element: 'earth', challengeType: 'narrative_choice',
    narrative: '거대한 돌 거인이 길을 막고 묻는다: "네가 짊어진 돌 중 가장 무거운 것은 무엇이냐?"',
    narrativeEn: 'A giant of stone blocks the path and asks: "What is the heaviest stone you carry?"',
    choices: [
      { label: '자만심', labelEn: 'My pride', desc: '솔직히 인정한다. 돌의 무게를 느낀다.', descEn: 'Admit it honestly. Feel the weight.', outcome: { hp: -5, virtue: 3, move: 0 } },
      { label: '아무것도 아니다', labelEn: 'Nothing at all', desc: '부인하고 지나가려 한다. 돌이 더 무거워진다.', descEn: 'Deny and try to pass. The stone grows heavier.', outcome: { hp: -10, virtue: -1, move: -1 } },
    ],
    rewardHp: 10, penaltyHp: 5,
  },
  {
    id: 'sin-1b', terraceId: 1, tier: 'B', name: '나르키소스의 거울', nameEn: 'Mirror of Narcissus',
    element: 'earth', challengeType: 'virtue_test',
    narrative: '거울 속에서 완벽한 자신의 모습이 반짝인다. "이 모습을 영원히 간직하겠는가?"',
    narrativeEn: 'Your perfect reflection glimmers in the mirror. "Will you keep this image forever?"',
    choices: [
      { label: '거울을 깨뜨린다', labelEn: 'Shatter the mirror', desc: '완벽함은 환상임을 인정한다.', descEn: 'Accept that perfection is an illusion.', outcome: { hp: 8, virtue: 5, move: 0 } },
      { label: '거울을 바라본다', labelEn: 'Gaze into it', desc: '잠시 취한다. 거울의 파편이 되어버린다.', descEn: 'Be mesmerized. Become a shard of the mirror.', outcome: { hp: -8, virtue: -3, move: 0 } },
    ],
    rewardHp: 18, penaltyHp: 10,
  },
  // ── 2층 시기 👁 ──
  {
    id: 'sin-2a', terraceId: 2, tier: 'A', name: '질투의 뱀', nameEn: 'Serpent of Envy',
    element: 'sight', challengeType: 'narrative_choice',
    narrative: '뱀이 쉿쉿거리며 속삭인다: "저기 더 빛나는 영혼이 있다. 그 빛을 빼앗겠느냐?"',
    narrativeEn: 'The serpent hisses: "There goes a brighter soul. Will you steal its light?"',
    choices: [
      { label: '내 길을 간다', labelEn: 'Walk my own path', desc: '비교하지 않고 나아간다.', descEn: 'Move forward without comparison.', outcome: { hp: 5, virtue: 3, move: 1 } },
      { label: '그 빛을 탐한다', labelEn: 'Covet the light', desc: '순간 시야가 어두워지고 길을 잃는다.', descEn: 'Vision darkens. You lose your way.', outcome: { hp: -12, virtue: -2, move: -2 } },
    ],
    rewardHp: 10, penaltyHp: 5,
  },
  {
    id: 'sin-2b', terraceId: 2, tier: 'B', name: '회색 망령', nameEn: 'Grey Specter',
    element: 'sight', challengeType: 'virtue_test',
    narrative: '회색 망령이 네 주변을 맴돈다: "너는 왜 저들보다 못한가?" 의심이 스민다.',
    narrativeEn: 'A grey specter circles you: "Why are you less than them?" Doubt creeps in.',
    choices: [
      { label: '감사함을 떠올린다', labelEn: 'Remember gratitude', desc: '이미 가진 것에 감사하며 망령을 떨친다.', descEn: 'Be grateful for what you have. The specter fades.', outcome: { hp: 10, virtue: 4, move: 0 } },
      { label: '스스로를 의심한다', labelEn: 'Doubt yourself', desc: '망령의 말에 휩싸여 자신감을 잃는다.', descEn: 'Consumed by the specter\'s words. Confidence shatters.', outcome: { hp: -10, virtue: -4, move: 0 } },
    ],
    rewardHp: 18, penaltyHp: 10,
  },
  // ── 3층 분노 🌫 ──
  {
    id: 'sin-3a', terraceId: 3, tier: 'A', name: '연기 망자', nameEn: 'Smoke Wraith',
    element: 'smoke', challengeType: 'narrative_choice',
    narrative: '연기 속에서 누군가 그대를 모욕한다. 분노가 치밀어 오른다. 어떻게 할 것인가?',
    narrativeEn: 'Someone insults you from within the smoke. Rage surges. What will you do?',
    choices: [
      { label: '숨을 깊이 들이쉰다', labelEn: 'Take a deep breath', desc: '연기와 함께 분노를 내쉰다.', descEn: 'Exhale the smoke and your anger together.', outcome: { hp: 6, virtue: 3, move: 0 } },
      { label: '소리친다', labelEn: 'Shout back', desc: '분노를 표출한다. 연기가 더 짙어진다.', descEn: 'Vent your rage. The smoke thickens.', outcome: { hp: -8, virtue: -2, move: 0 } },
    ],
    rewardHp: 12, penaltyHp: 6,
  },
  {
    id: 'sin-3b', terraceId: 3, tier: 'B', name: '분노의 폭풍', nameEn: 'Tempest of Rage',
    element: 'smoke', challengeType: 'meditation',
    narrative: '분노의 폭풍이 몰아친다. 이 한가운데서 고요를 찾을 수 있는가?',
    narrativeEn: 'A tempest of rage rages around you. Can you find stillness within?',
    choices: [
      { label: '눈을 감고 명상한다', labelEn: 'Close eyes and meditate', desc: '내면의 고요를 찾는다. 폭풍이 잦아든다.', descEn: 'Find inner stillness. The storm subsides.', outcome: { hp: 15, virtue: 5, move: 0 } },
      { label: '폭풍과 맞선다', labelEn: 'Fight the storm', desc: '더 큰 힘으로 저항한다. 지쳐 쓰러진다.', descEn: 'Resist with greater force. Exhaustion takes over.', outcome: { hp: -15, virtue: -3, move: 0 } },
    ],
    rewardHp: 20, penaltyHp: 12,
  },
  // ── 4층 나태 ⚡ ──
  {
    id: 'sin-4a', terraceId: 4, tier: 'A', name: '나태의 안개', nameEn: 'Mist of Sloth',
    element: 'lightning', challengeType: 'narrative_choice',
    narrative: '나른한 안개가 온몸을 감싼다. "잠시 쉬어도 되지 않을까?" 달콤한 유혹이 밀려온다.',
    narrativeEn: 'A lethargic mist envelops you. "Why not rest a while?" A sweet temptation washes over you.',
    choices: [
      { label: '번개처럼 일어난다', labelEn: 'Rise like lightning', desc: '안개를 뚫고 질주한다.', descEn: 'Burst through the mist and sprint.', outcome: { hp: 3, virtue: 3, move: 3 } },
      { label: '잠시 눕는다', labelEn: 'Lie down briefly', desc: '안개의 포근함에 빠져버린다. 시간을 잃는다.', descEn: 'Sink into the mist\'s comfort. Lose time.', outcome: { hp: 5, virtue: -3, move: -2 } },
    ],
    rewardHp: 8, penaltyHp: 4,
  },
  {
    id: 'sin-4b', terraceId: 4, tier: 'B', name: '무기력의 그림자', nameEn: 'Shadow of Apathy',
    element: 'lightning', challengeType: 'sequence',
    narrative: '그림자가 속삭인다: "노력해도 소용없어." 번개가 하늘을 갈라 의지를 시험한다.',
    narrativeEn: 'The shadow whispers: "Effort is futile." Lightning splits the sky, testing your will.',
    choices: [
      { label: '번개를 따라 달린다', labelEn: 'Run with the lightning', desc: '의지를 불태워 전속력으로 나아간다.', descEn: 'Burn with will and sprint at full speed.', outcome: { hp: 10, virtue: 4, move: 4 } },
      { label: '그림자를 바라본다', labelEn: 'Stare at the shadow', desc: '무기력에 빠져 멈춰 선다.', descEn: 'Fall into apathy and come to a halt.', outcome: { hp: -5, virtue: -4, move: -3 } },
    ],
    rewardHp: 16, penaltyHp: 8,
  },
  // ── 5층 탐욕 💎 ──
  {
    id: 'sin-5a', terraceId: 5, tier: 'A', name: '황금 벌레', nameEn: 'Gold Worm',
    element: 'crystal', challengeType: 'memory',
    narrative: '반짝이는 황금 벌레가 손바닥 위를 기어 다닌다: "이건 네 것이다. 가져가라."',
    narrativeEn: 'A glittering gold worm crawls on your palm: "This is yours. Take it."',
    choices: [
      { label: '놓아준다', labelEn: 'Let it go', desc: '벌레는 날아오르고 마음이 가벼워진다.', descEn: 'The worm flies away. Your heart feels lighter.', outcome: { hp: 5, virtue: 4, move: 2 } },
      { label: '움켜쥔다', labelEn: 'Clench your fist', desc: '벌레가 손을 물고 도망친다. 상처만 남는다.', descEn: 'The worm bites and escapes. Only wounds remain.', outcome: { hp: -12, virtue: -3, move: -1 } },
    ],
    rewardHp: 10, penaltyHp: 5,
  },
  {
    id: 'sin-5b', terraceId: 5, tier: 'B', name: '탐욕의 손아귀', nameEn: 'Grasp of Avarice',
    element: 'crystal', challengeType: 'narrative_choice',
    narrative: '수정 바닥에 금화가 흩어져 있다. "더 많이 가질수록 더 무거워질 뿐인데도..."',
    narrativeEn: 'Gold coins scatter across the crystal floor. "The more you take, the heavier you become..."',
    choices: [
      { label: '한 줌만 줍는다', labelEn: 'Take just a handful', desc: '필요한 만큼만. 무게를 견딜 수 있다.', descEn: 'Only what you need. The weight is bearable.', outcome: { hp: 15, virtue: 3, move: 1 } },
      { label: '모두 담는다', labelEn: 'Take everything', desc: '주머니가 터져나갈 듯하다. 한 걸음도 움직일 수 없다.', descEn: 'Pockets bursting. You cannot take a single step.', outcome: { hp: 5, virtue: -5, move: -4 } },
    ],
    rewardHp: 24, penaltyHp: 14,
  },
  // ── 6층 식탐 🌳 ──
  {
    id: 'sin-6a', terraceId: 6, tier: 'A', name: '굶주린 들개', nameEn: 'Starved Hound',
    element: 'wood', challengeType: 'narrative_choice',
    narrative: '먹음직스러운 과일이 손 닿는 곳에 달려있다. 배고픔이 극심하다. 들개가 으르렁댄다.',
    narrativeEn: 'Delicious fruit hangs within reach. Hunger is overwhelming. A hound growls.',
    choices: [
      { label: '들개와 나눈다', labelEn: 'Share with the hound', desc: '과일을 반으로 나누자 들개가 길을 비켜준다.', descEn: 'Split the fruit. The hound yields the path.', outcome: { hp: 12, virtue: 3, move: 1 } },
      { label: '혼자 먹는다', labelEn: 'Eat it alone', desc: '들개가 물어뜯는다. 배는 부르지만 상처투성이다.', descEn: 'The hound bites. Full stomach but covered in wounds.', outcome: { hp: -10, virtue: -2, move: 0 } },
    ],
    rewardHp: 12, penaltyHp: 6,
  },
  {
    id: 'sin-6b', terraceId: 6, tier: 'B', name: '식인 나무', nameEn: 'Devouring Tree',
    element: 'wood', challengeType: 'virtue_test',
    narrative: '식인 나무의 가지가 달콤한 향기를 뿜는다. "가장 달콤한 열매는 독이 있다."',
    narrativeEn: 'The devouring tree emits a sweet fragrance. "The sweetest fruit bears poison."',
    choices: [
      { label: '향기만 맡고 지나친다', labelEn: 'Savor the scent and pass', desc: '절제의 미덕을 실천한다. 나무가 길을 연다.', descEn: 'Practice temperance. The tree opens the path.', outcome: { hp: 18, virtue: 5, move: 2 } },
      { label: '열매를 딴다', labelEn: 'Pluck the fruit', desc: '달콤함 뒤에 찾아오는 쓰라림. HP 절반 감소.', descEn: 'Sweetness followed by bitterness. HP halved.', outcome: { hp: -20, virtue: -5, move: 0 } },
    ],
    rewardHp: 22, penaltyHp: 16,
  },
  // ── 7층 색욕 🔥 ──
  {
    id: 'sin-7a', terraceId: 7, tier: 'A', name: '불꽃 환영', nameEn: 'Flame Phantasm',
    element: 'purgefire', challengeType: 'narrative_choice',
    narrative: '불꽃 속에서 아름다운 형상이 손짓한다. "이리 와, 두려워하지 마."',
    narrativeEn: 'A beautiful figure beckons within the flames. "Come closer, fear not."',
    choices: [
      { label: '눈을 감고 기도한다', labelEn: 'Close eyes and pray', desc: '불이 정화의 따스함으로 변한다.', descEn: 'The fire transforms into purifying warmth.', outcome: { hp: 14, virtue: 4, move: 1 } },
      { label: '손을 내민다', labelEn: 'Reach out', desc: '불길이 손을 태운다. 환영은 사라진다.', descEn: 'Flames sear your hand. The vision vanishes.', outcome: { hp: -14, virtue: -3, move: -1 } },
    ],
    rewardHp: 14, penaltyHp: 7,
  },
  {
    id: 'sin-7b', terraceId: 7, tier: 'B', name: '욕망의 화신', nameEn: 'Desire Incarnate',
    element: 'purgefire', challengeType: 'meditation',
    narrative: '모든 욕망이 형상화되어 불기둥 속에 선다. "이것이 진정한 너 자신이다. 받아들이겠느냐?"',
    narrativeEn: 'All desires incarnate stand within the fire. "This is your true self. Will you accept it?"',
    choices: [
      { label: '인정하고 통합한다', labelEn: 'Acknowledge and integrate', desc: '욕망을 부정하지 않고 승화시킨다.', descEn: 'Accept desires without being ruled by them.', outcome: { hp: 20, virtue: 6, move: 3 } },
      { label: '부정하고 도망친다', labelEn: 'Deny and flee', desc: '도망칠수록 불길이 거세진다.', descEn: 'The more you flee, the stronger the flames grow.', outcome: { hp: -18, virtue: -5, move: -3 } },
    ],
    rewardHp: 26, penaltyHp: 16,
  },
];

// ============================================================
// Angel Guardians, Purification Cards (unchanged)
// ============================================================

export const ANGEL_GUARDIANS: AngelGuardianCard[] = [
  { id: 'angel-1', terraceId: 1, name: '겸손의 천사', nameEn: 'Angel of Humility', title: '첫 번째 정화의 문지기', titleEn: 'Keeper of the First Gate', element: 'earth', power: 5, battleType: 'timing_quiz', mechanic: '겸손의 시험: O/X 퀴즈 정답 시 녹색 존 +50%', mechanicEn: 'Trial: Correct quiz → green zone +50%', rewardHp: 20, purificationBonus: 'D6 최소값 +1', purificationBonusEn: 'Min dice +1', purificationId: 'purification-1', narrative: '겸손의 천사가 돌계단 위에서 미소 짓는다. "오만은 영혼의 가장 무거운 짐. 내려놓아라."', narrativeEn: 'The Angel of Humility smiles. "Pride is the heaviest burden. Set it down."' },
  { id: 'angel-2', terraceId: 2, name: '자비의 천사', nameEn: 'Angel of Mercy', title: '두 번째 정화의 문지기', titleEn: 'Keeper of the Second Gate', element: 'sight', power: 5, battleType: 'cardmatch', mechanic: '자비의 시선: 6장 카드 중 정답 찾기, 2회 기회', mechanicEn: 'Gaze of Mercy: Find correct among 6 cards, 2 tries', rewardHp: 22, purificationBonus: '함정 피해 -1', purificationBonusEn: 'Trap damage -1', purificationId: 'purification-2', narrative: '자비의 천사가 눈을 가린 채 속삭인다. "타인의 빛을 시기하지 말고, 네 안의 빛을 보아라."', narrativeEn: 'The Angel of Mercy whispers. "Envy not another\'s light — see your own."' },
  { id: 'angel-3', terraceId: 3, name: '온유의 천사', nameEn: 'Angel of Gentleness', title: '세 번째 정화의 문지기', titleEn: 'Keeper of the Third Gate', element: 'smoke', power: 6, battleType: 'timing_smoke', mechanic: '연기 속 시험: 타이밍 슬라이더 30%가 안개에 가려짐', mechanicEn: 'Trial in Smoke: 30% of slider obscured', rewardHp: 18, purificationBonus: '전투력 요구 -1', purificationBonusEn: 'Enemy power -1', purificationId: 'purification-3', narrative: '온유의 천사가 연기 속에서 손을 내민다. "분노는 너를 태우는 불. 연기처럼 흘려보내라."', narrativeEn: 'The Angel of Gentleness extends a hand. "Wrath burns you. Let it drift like smoke."' },
  { id: 'angel-4', terraceId: 4, name: '열정의 천사', nameEn: 'Angel of Zeal', title: '네 번째 정화의 문지기', titleEn: 'Keeper of the Fourth Gate', element: 'lightning', power: 6, battleType: 'rapidtap', mechanic: '열정의 질주: 8초 내에 30회 탭', mechanicEn: 'Sprint of Zeal: 30 taps in 8s', rewardHp: 24, purificationBonus: '이동력 +1', purificationBonusEn: 'Move +1', purificationId: 'purification-4', narrative: '열정의 천사가 번개처럼 달려온다. "나태는 영혼의 잠. 깨어나 앞으로 나아가라!"', narrativeEn: 'The Angel of Zeal rushes like lightning. "Sloth is soul-sleep. Awaken!"' },
  { id: 'angel-5', terraceId: 5, name: '청빈의 천사', nameEn: 'Angel of Poverty', title: '다섯 번째 정화의 문지기', titleEn: 'Keeper of the Fifth Gate', element: 'crystal', power: 6, battleType: 'choice', mechanic: '청빈의 선택: 🛡 확실한 보상(80%) vs ⚡ 비움(40%, 4배)', mechanicEn: 'Choice of Poverty: 🛡 Safe (80%) vs ⚡ Empty (40%, 4x)', rewardHp: 20, purificationBonus: '보상 HP +30%', purificationBonusEn: 'Reward HP +30%', purificationId: 'purification-5', narrative: '청빈의 천사가 빈 손을 보여준다. "탐욕은 채워도 채워지지 않는 우물. 비워야 얻는다."', narrativeEn: 'The Angel of Poverty shows empty hands. "Greed never fills. Empty to gain."' },
  { id: 'angel-6', terraceId: 6, name: '절제의 천사', nameEn: 'Angel of Temperance', title: '여섯 번째 정화의 문지기', titleEn: 'Keeper of the Sixth Gate', element: 'wood', power: 6, battleType: 'quiz', mechanic: '절제의 지혜: 5문제 중 3문제 정답', mechanicEn: 'Temperance: 3/5 correct', rewardHp: 22, purificationBonus: '전투 D6 +1', purificationBonusEn: 'Battle D6 +1', purificationId: 'purification-6', narrative: '절제의 천사가 과일나무 아래 서 있다. "식탐은 육체의 감옥. 절제는 영혼의 자유."', narrativeEn: 'The Angel of Temperance stands beneath a fruit tree. "Gluttony imprisons. Temperance frees."' },
  { id: 'angel-7', terraceId: 7, name: '순결의 천사', nameEn: 'Angel of Purity', title: '일곱 번째 정화의 문지기', titleEn: 'Keeper of the Seventh Gate', element: 'purgefire', power: 8, battleType: 'purification', mechanic: '정화의 불: 2회 타이밍 + 역방향', mechanicEn: 'Flame of Purity: 2 timing + reverse', rewardHp: 30, purificationBonus: '모든 보상 +50%', purificationBonusEn: 'All rewards +50%', purificationId: 'purification-7', narrative: '순결의 천사가 불기둥 앞에 선다. "사랑은 가장 뜨거운 불. 순수하게 타올라 하늘에 닿아라."', narrativeEn: 'The Angel of Purity stands before the fire. "Love is the hottest flame. Burn purely."' },
];

export const PURIFICATION_CARDS: PurificationCard[] = [
  { id: 'purification-1', terraceId: 1, name: '겸손의 돌', nameEn: 'Stone of Humility', element: 'earth', mainEffect: '전투 패배해도 후퇴하지 않음', mainEffectEn: 'No pushback on defeat', subEffect: '받는 피해 -50% (크리티컬 제외)', subEffectEn: 'Damage taken -50% (non-crit)', narrative: '작은 돌 하나가 손에 놓였다. 무거운 돌을 짊어진 자만이 가벼움의 가치를 안다.', narrativeEn: 'A small stone rests in your palm. Only those who carry heavy stones know the value of lightness.' },
  { id: 'purification-2', terraceId: 2, name: '자비의 눈', nameEn: 'Eye of Mercy', element: 'sight', mainEffect: '나쁜 선택 결과 50% 확률 무효', mainEffectEn: '50% negate bad choices', subEffect: '함정 피해 완전 면역', subEffectEn: 'Immune to trap damage', narrative: '자비의 눈이 열렸다. 다른 영혼의 빛을 보고도 평화로울 수 있다.', narrativeEn: 'The Eye of Mercy opened. See another\'s light and remain at peace.' },
  { id: 'purification-3', terraceId: 3, name: '온유의 숨결', nameEn: 'Breath of Gentleness', element: 'smoke', mainEffect: '덕목 획득량 +50%', mainEffectEn: 'Virtue gains +50%', subEffect: '분노 이벤트 피해 면역', subEffectEn: 'Immune to wrath event damage', narrative: '온유의 숨결이 감싼다. 분노는 연기처럼 흩어지고 평온이 자리 잡는다.', narrativeEn: 'A gentle breath surrounds you. Wrath disperses like smoke.' },
  { id: 'purification-4', terraceId: 4, name: '열정의 발걸음', nameEn: 'Step of Zeal', element: 'lightning', mainEffect: '더블 시 3연속 이동 가능', mainEffectEn: 'Double → 3 consecutive moves', subEffect: '스턴 완전 면역', subEffectEn: 'Immune to stun', narrative: '번개가 발끝을 스친다. 더 이상 멈추지 않을 열정이 온몸에 흐른다.', narrativeEn: 'Lightning grazes your feet. Unstoppable zeal courses through you.' },
  { id: 'purification-5', terraceId: 5, name: '청빈의 손', nameEn: 'Hand of Poverty', element: 'crystal', mainEffect: 'HP 50% 이하 시 D6 +2', mainEffectEn: 'D6 +2 when HP ≤ 50%', subEffect: '선택 보상 +50%', subEffectEn: 'Choice rewards +50%', narrative: '빈 손이 가장 큰 부임을 깨달았다. 가진 것이 적을수록, 얻는 것은 크다.', narrativeEn: 'Empty hands are the greatest wealth. The less you have, the more you gain.' },
  { id: 'purification-6', terraceId: 6, name: '절제의 입맞춤', nameEn: 'Kiss of Temperance', element: 'wood', mainEffect: '모든 회복 효과 2배', mainEffectEn: 'All healing doubled', subEffect: '선택 전 결과 미리보기', subEffectEn: 'Preview choice outcomes', narrative: '절제의 입맞춤이 이마에 닿았다. 진정한 풍요는 절제에서 온다.', narrativeEn: 'The Kiss of Temperance touches your forehead. True abundance comes from restraint.' },
  { id: 'purification-7', terraceId: 7, name: '순결의 불꽃', nameEn: 'Flame of Purity', element: 'purgefire', mainEffect: '모든 정화카드 효과 2배', mainEffectEn: 'All purification effects doubled', subEffect: '지상낙원 개방 + 베아트리체 재회', subEffectEn: 'Opens Earthly Paradise + Beatrice', narrative: '불의 벽을 통과한 그대 앞에 순수의 여인이 나타났다. "잘 왔다, 나의 사랑하는 영혼이여."', narrativeEn: 'Through the fire, the Lady of Purity appears. "Well come, my beloved soul."' },
];

// ============================================================
// Lookup utilities
// ============================================================

export function getTerrace(id: number): TerraceInfo | undefined { return TERRACES.find((t) => t.id === id); }
export function getSinProjection(id: string): SinProjectionCard | undefined { return SIN_PROJECTIONS.find((s) => s.id === id); }
export function getAngelGuardian(terraceId: number): AngelGuardianCard | undefined { return ANGEL_GUARDIANS.find((a) => a.terraceId === terraceId); }
export function getPurificationCard(id: string): PurificationCard | undefined { return PURIFICATION_CARDS.find((p) => p.id === id); }
