import type { MonsterCard } from '@/types/game';

/**
 * Monster Cards — 18 types (2 per circle: A=하급, B=상급)
 * Based on PRODUCT_PLAN.md Section 4.3
 */
export const MONSTERS: MonsterCard[] = [
  // ── 9층 배반 ❄️ ──
  {
    id: 'monster-9a', circleId: 9, tier: 'A',
    name: '얼음 망자', nameEn: 'Frost Wraith',
    element: 'ice', power: 3,
    ability: '없음', abilityEn: 'None',
    rewardHp: 6, penaltyHp: 3,
  },
  {
    id: 'monster-9b', circleId: 9, tier: 'B',
    name: '동상 골렘', nameEn: 'Cryo-Golem',
    element: 'ice', power: 6,
    ability: '빙벽: 받는 피해 -2', abilityEn: 'Ice Wall: -2 damage taken',
    rewardHp: 14, penaltyHp: 9,
    specialEffect: 'defense_up',
  },
  // ── 8층 사기 🎭 ──
  {
    id: 'monster-8a', circleId: 8, tier: 'A',
    name: '가면 악마', nameEn: 'Mask Fiend',
    element: 'illusion', power: 4,
    ability: '가면 바꾸기: 30% 확률로 D6 눈 변경', abilityEn: 'Mask Swap: 30% D6 reroll',
    rewardHp: 8, penaltyHp: 5,
  },
  {
    id: 'monster-8b', circleId: 8, tier: 'B',
    name: '그림자 밀매자', nameEn: 'Shadow Trafficker',
    element: 'illusion', power: 7,
    ability: '계약서: HP 5 지불 → 전투력 -2', abilityEn: 'Contract: Pay 5 HP → Power -2',
    rewardHp: 16, penaltyHp: 10,
    specialEffect: 'buff_loss',
  },
  // ── 7층 폭력 🩸 ──
  {
    id: 'monster-7a', circleId: 7, tier: 'A',
    name: '피의 병사', nameEn: 'Blood Soldier',
    element: 'blood', power: 4,
    ability: '없음', abilityEn: 'None',
    rewardHp: 8, penaltyHp: 4,
  },
  {
    id: 'monster-7b', circleId: 7, tier: 'B',
    name: '켄타우로스 궁수', nameEn: 'Centaur Archer',
    element: 'blood', power: 7,
    ability: '원거리 저격: 전투 전 3 데미지', abilityEn: 'Snipe: 3 pre-damage',
    rewardHp: 18, penaltyHp: 12,
    specialEffect: 'pre_damage_3',
  },
  // ── 6층 이단 🔥 ──
  {
    id: 'monster-6a', circleId: 6, tier: 'A',
    name: '불꽃 교리관', nameEn: 'Flame Dogmatist',
    element: 'fire', power: 4,
    ability: '심문 퀴즈: 정답 시 전투력 -1', abilityEn: 'Quiz: Correct → Power -1',
    rewardHp: 10, penaltyHp: 5,
  },
  {
    id: 'monster-6b', circleId: 6, tier: 'B',
    name: '이단 재판관', nameEn: 'Heresy Inquisitor',
    element: 'fire', power: 8,
    ability: '화형 선고: 매 턴 전투력 +1 (최대+3)', abilityEn: 'Pyre: Power +1/turn (max +3)',
    rewardHp: 18, penaltyHp: 14,
    specialEffect: 'buff_extend',
  },
  // ── 5층 분노 😡 ──
  {
    id: 'monster-5a', circleId: 5, tier: 'A',
    name: '진흙 익사자', nameEn: 'Mud Drowner',
    element: 'mud', power: 4,
    ability: '발목 붙잡기: 패배 시 다음 D6 -1', abilityEn: 'Grasp: Lose → Next D6 -1',
    rewardHp: 10, penaltyHp: 5,
    specialEffect: 'next_dice_down',
  },
  {
    id: 'monster-5b', circleId: 5, tier: 'B',
    name: '스틱스 히드라', nameEn: 'Styx Hydra',
    element: 'mud', power: 8,
    ability: '재생: 패배 시 +2 강화 재대결', abilityEn: 'Regen: Lose → Rematch at +2',
    rewardHp: 22, penaltyHp: 10,
    specialEffect: 'rematch',
  },
  // ── 4층 탐욕 💰 ──
  {
    id: 'monster-4a', circleId: 4, tier: 'A',
    name: '인색한 망령', nameEn: 'Miser Wraith',
    element: 'gold', power: 4,
    ability: '구두쇠: 50% 확률로 보상/페널티 없음', abilityEn: 'Miser: 50% no effect',
    rewardHp: 10, penaltyHp: 5,
  },
  {
    id: 'monster-4b', circleId: 4, tier: 'B',
    name: '황금 탐식자', nameEn: 'Gold Devourer',
    element: 'gold', power: 8,
    ability: '삼키기: 패배 시 수호카드 1장 비활성', abilityEn: 'Devour: Lose → 1 Guardian disabled',
    rewardHp: 20, penaltyHp: 11,
    specialEffect: 'guardian_disable',
  },
  // ── 3층 식탐 🤢 ──
  {
    id: 'monster-3a', circleId: 3, tier: 'A',
    name: '악취 구더기', nameEn: 'Stench Maggot',
    element: 'poison', power: 5,
    ability: '독 안개: 전투 후 2턴 HP-2', abilityEn: 'Toxic Fog: 2t HP-2 after',
    rewardHp: 10, penaltyHp: 5,
    specialEffect: 'poison_2turns',
  },
  {
    id: 'monster-3b', circleId: 3, tier: 'B',
    name: '식인 식물', nameEn: 'Maneater Plant',
    element: 'poison', power: 8,
    ability: '포식: 전투 전 HP-5, 승리+10', abilityEn: 'Devour: Pre-5HP, Win+10',
    rewardHp: 20, penaltyHp: 12,
    specialEffect: 'pre_damage_5',
  },
  // ── 2층 색욕 🌪 ──
  {
    id: 'monster-2a', circleId: 2, tier: 'A',
    name: '바람 망령', nameEn: 'Wind Wraith',
    element: 'wind', power: 5,
    ability: '돌풍: 전투 후 1칸 강제 전진', abilityEn: 'Gust: Force +1 tile after',
    rewardHp: 12, penaltyHp: 6,
  },
  {
    id: 'monster-2b', circleId: 2, tier: 'B',
    name: '허리케인 와이번', nameEn: 'Hurricane Wyvern',
    element: 'wind', power: 9,
    ability: '강풍: 전투 후 2칸 무작위 이동', abilityEn: 'Gale: Random 2-tile move after',
    rewardHp: 22, penaltyHp: 14,
  },
  // ── 1층 미망 ✨ ──
  {
    id: 'monster-1a', circleId: 1, tier: 'A',
    name: '고대 철학자', nameEn: 'Ancient Sage',
    element: 'holy', power: 5,
    ability: '지혜의 시험: 퀴즈로 전투 대체 가능', abilityEn: 'Wisdom Test: Quiz instead of fight',
    rewardHp: 14, penaltyHp: 5,
  },
  {
    id: 'monster-1b', circleId: 1, tier: 'B',
    name: '플라톤의 이데아', nameEn: "Plato's Ideal",
    element: 'holy', power: 10,
    ability: '완전한 형상: 패배해도 진행 가능', abilityEn: 'Perfect Form: Progress even on loss',
    rewardHp: 25, penaltyHp: 16,
  },
];

/** Get monster by ID */
export function getMonster(id: string): MonsterCard | undefined {
  return MONSTERS.find((m) => m.id === id);
}

/** Get monsters for a specific circle */
export function getCircleMonsters(circleId: number): MonsterCard[] {
  return MONSTERS.filter((m) => m.circleId === circleId);
}
