import type { GatekeeperCard } from '@/types/game';

/**
 * Gatekeeper Cards — 9 bosses, each with a UNIQUE battle mini-game.
 * Based on PRODUCT_PLAN.md V0.1a Section 3.2
 */
export const GATEKEEPERS: GatekeeperCard[] = [
  // ── 9층: 타이밍 슬라이더 (빙결) ──
  {
    id: 'gk-9', circleId: 9,
    name: '얼음 거인', nameEn: 'Ice Goliath',
    title: '코퀴토스의 파수꾼', titleEn: 'Warden of Cocytus',
    element: 'ice', power: 5, battleType: 'timing',
    mechanic: '빙결 슬라이더: 녹색 존 매우 좁음(8%), 인디케이터 0.5초 간격 깜빡임',
    mechanicEn: 'Frozen Slider: Very narrow green (8%), indicator flickers every 0.5s',
    rewardHp: 15, rewardMove: 1, penaltyHp: 8, pushback: 2,
    guardianId: 'guardian-9',
    narrative: '루치페르의 눈물로 빚어진 얼음 거인이 관문을 막아섰다. 얼음 장막 너머로 인디케이터가 희미하게 깜빡인다.',
    narrativeEn: "A giant of ice forged from Lucifer's tears blocks the gate. The indicator flickers dimly through the frost.",
  },
  // ── 8층: 카드 찾기 ──
  {
    id: 'gk-8', circleId: 8,
    name: '위장의 군주', nameEn: 'Lord of Masks',
    title: '말레볼제의 감시자', titleEn: 'Overseer of Malebolge',
    element: 'illusion', power: 5, battleType: 'cardmatch',
    mechanic: '가면 게임: 3~5장 카드 중 정답(👑)을 기억했다가 섞인 후 찾기',
    mechanicEn: 'Mask Game: Memorize the key card (👑) among 3-5 cards, then find it after shuffle',
    rewardHp: 15, rewardMove: 1, penaltyHp: 9, pushback: 2,
    guardianId: 'guardian-8',
    narrative: '열 개의 얼굴을 가진 사기꾼 군주. 진짜 가면을 찾아내야 관문이 열린다.',
    narrativeEn: 'A deceiver lord of ten faces. Find the real mask to open the gate.',
  },
  // ── 7층: 연속 탭 ──
  {
    id: 'gk-7', circleId: 7,
    name: '피의 파수꾼', nameEn: 'Blood Sentinel',
    title: '플레게톤의 수호자', titleEn: 'Guardian of Phlegethon',
    element: 'blood', power: 5, battleType: 'rapidtap',
    mechanic: '피의 속도전: 제한시간 5초 내에 목표 횟수만큼 탭! 전투 전 HP-2',
    mechanicEn: 'Blood Rush: Tap the target count within 5 seconds! Pre-damage HP-2',
    rewardHp: 18, rewardMove: 2, penaltyHp: 10, pushback: 3,
    guardianId: 'guardian-7',
    narrative: '끓는 피의 강에서 솟아오른 파수꾼. 피가 끓는 속도로 탭하라!',
    narrativeEn: 'A sentinel from the boiling blood river. Tap at the speed of boiling blood!',
  },
  // ── 6층: 퀴즈 ──
  {
    id: 'gk-6', circleId: 6,
    name: '불꽃 심문관', nameEn: 'Flame Inquisitor',
    title: '이단자 도시의 문지기', titleEn: 'Gatekeeper of the Heretic City',
    element: 'fire', power: 6, battleType: 'quiz',
    mechanic: '진실의 시험: 단테 신곡 O/X 퀴즈 3문제! 2문제 이상 정답 시 승리',
    mechanicEn: 'Trial of Truth: 3 Dante lore O/X questions! Answer 2+ correctly to win',
    rewardHp: 18, rewardMove: 2, penaltyHp: 8, pushback: 2,
    guardianId: 'guardian-6',
    narrative: '불타는 석관의 도시에서 심문관이 묻는다 — "진실을 아는가?"',
    narrativeEn: 'The inquisitor from the burning city asks — "Do you know the truth?"',
  },
  // ── 5층: 타이밍 슬라이더 (광폭화) ──
  {
    id: 'gk-5', circleId: 5,
    name: '분노의 화신', nameEn: 'Avatar of Wrath',
    title: '스틱스 늪의 지배자', titleEn: 'Master of the Styx Marsh',
    element: 'mud', power: 6, battleType: 'timing',
    mechanic: '광폭화: 실패(미스)할 때마다 슬라이더 속도 +15% 누적 증가',
    mechanicEn: 'Enrage: Slider speed increases +15% cumulatively on each miss',
    rewardHp: 20, rewardMove: 2, penaltyHp: 12, pushback: 3,
    guardianId: 'guardian-5',
    narrative: '스틱스 늪에서 분노가 형체를 얻었다. 실패할수록 더 빨라지는 공포.',
    narrativeEn: 'Wrath incarnate from the Styx marsh. The more you fail, the faster it gets.',
  },
  // ── 4층: 도박 선택 ──
  {
    id: 'gk-4', circleId: 4,
    name: '황금 골렘', nameEn: 'Golden Golem',
    title: '탐욕의 파수꾼', titleEn: 'Sentinel of Avarice',
    element: 'gold', power: 6, battleType: 'choice',
    mechanic: '탐욕의 시험: 🛡 안전(70% 승리, 기본 보상) vs ⚡ 도박(30% 승리, 3배 보상)',
    mechanicEn: 'Trial of Greed: 🛡 Safe (70% win, normal) vs ⚡ Gamble (30% win, 3x reward)',
    rewardHp: 20, rewardMove: 3, penaltyHp: 12, pushback: 3,
    guardianId: 'guardian-4',
    narrative: '황금 골렘이 속삭인다 — "더 많은 것을 걸어라, 더 큰 것을 얻으리라."',
    narrativeEn: 'The Golden Golem whispers — "Wager more, gain more."',
  },
  // ── 3층: 멀티 탭 타이밍 ──
  {
    id: 'gk-3', circleId: 3,
    name: '케르베로스', nameEn: 'Cerberus',
    title: '식탐의 문지기', titleEn: 'Gatekeeper of Gluttony',
    element: 'poison', power: 7, battleType: 'multitap',
    mechanic: '세 머리의 시험: 타이밍 슬라이더 3회 연속! 2회 이상 성공해야 승리',
    mechanicEn: 'Trial of Three Heads: 3 timing slider attempts! Need 2+ successes to win',
    rewardHp: 25, rewardMove: 3, penaltyHp: 15, pushback: 3,
    guardianId: 'guardian-3',
    narrative: '하데스의 파수견 케르베로스가 세 머리로 으르렁댄다. 세 번 모두 증명하라.',
    narrativeEn: "Hades' hound Cerberus snarls with all three heads. Prove yourself three times.",
  },
  // ── 2층: 타이밍 슬라이더 (돌풍) ──
  {
    id: 'gk-2', circleId: 2,
    name: '폭풍의 정령', nameEn: 'Storm Wraith',
    title: '영원한 허리케인', titleEn: 'The Eternal Hurricane',
    element: 'wind', power: 7, battleType: 'timing',
    mechanic: '돌풍 변속: 슬라이더 속도 ±40% 무작위 변동, 예측 불가!',
    mechanicEn: 'Gust Shift: Slider speed randomly varies ±40%, unpredictable!',
    rewardHp: 25, rewardMove: 3, penaltyHp: 15, pushback: 4,
    guardianId: 'guardian-2',
    narrative: '폭풍 그 자체가 관문을 지킨다. 바람의 의지에 몸을 맡겨라.',
    narrativeEn: "The hurricane itself guards the gate. Surrender to the wind's will.",
  },
  // ── 1층: 종합 시험 ──
  {
    id: 'gk-1', circleId: 1,
    name: '베르길리우스의 그림자', nameEn: 'Shadow of Virgil',
    title: '최종 시험관', titleEn: 'The Final Examiner',
    element: 'holy', power: 8, battleType: 'final',
    mechanic: '종합 시험: O/X 퀴즈 1문제 + 극한 타이밍 슬라이더 — 둘 다 성공해야 탈출!',
    mechanicEn: 'Final Trial: 1 quiz question + extreme timing slider — both must succeed to escape!',
    rewardHp: 30, rewardMove: 5, penaltyHp: 20, pushback: 5,
    guardianId: 'guardian-1',
    narrative: '"너는 지옥을 통과할 자격이 있는가?" — 안내자의 마지막 물음.',
    narrativeEn: '"Are you worthy to leave Hell?" — the guide\'s final question.',
  },
];

/** Get gatekeeper by circle ID */
export function getGatekeeper(circleId: number): GatekeeperCard | undefined {
  return GATEKEEPERS.find((gk) => gk.circleId === circleId);
}
