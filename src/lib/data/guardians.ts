import type { GuardianCard } from '@/types/game';

/**
 * Guardian Cards — 9 types (earned by defeating gatekeepers)
 * Based on PRODUCT_PLAN.md Section 6.2
 */
export const GUARDIANS: GuardianCard[] = [
  // ── 9층 배반 → 얼음 거인 처치 ──
  {
    id: 'guardian-9', circleId: 9,
    name: '얼음 거인의 심장', nameEn: 'Heart of the Ice Goliath',
    element: 'ice', effectType: 'passive',
    mainEffect: '받는 모든 피해 -2', mainEffectEn: 'All damage taken -2',
    subEffect: '함정 피해 -50%', subEffectEn: 'Trap damage -50%',
    narrative: '얼음 거인의 심장이 그대 가슴속에서 뛰기 시작했다. 살갗 아래 단단한 얼음 갑주가 형성된다.',
    narrativeEn: "The Ice Goliath's heart beats within your chest. Frost armor forms beneath your skin.",
  },
  // ── 8층 사기 → 위장의 군주 처치 ──
  {
    id: 'guardian-8', circleId: 8,
    name: '가면술사의 비밀', nameEn: 'Secret of the Mask Caster',
    element: 'illusion', effectType: 'active',
    mainEffect: '전투 1회 스킵 가능 (1회용)', mainEffectEn: 'Skip 1 battle (one-time use)',
    subEffect: '20% 확률로 적 특수능력 무효', subEffectEn: '20% chance to negate enemy ability',
    narrative: '위장의 군주의 비밀이 그대의 것이 되었다. 필요할 때 가면을 쓰고 위험을 통과하라.',
    narrativeEn: 'The secret of the Lord of Masks is now yours. Don the mask and pass through danger.',
  },
  // ── 7층 폭력 → 피의 파수꾼 처치 ──
  {
    id: 'guardian-7', circleId: 7,
    name: '피의 축복', nameEn: 'Blessing of Blood',
    element: 'blood', effectType: 'passive',
    mainEffect: '전투 승리 시 초과 피해만큼 HP 회복', mainEffectEn: 'Heal excess damage on battle victory',
    subEffect: 'HP 30% 이하일 때 전투 D6 +1', subEffectEn: 'D6 +1 when HP ≤ 30%',
    narrative: '플레게톤의 피가 그대의 혈관에 스며들었다. 적을 쓰러뜨릴 때마다 그 생명력이 흘러든다.',
    narrativeEn: "Phlegethon's blood seeps into your veins. With each fallen foe, vitality flows into you.",
  },
  // ── 6층 이단 → 불꽃 심문관 처치 ──
  {
    id: 'guardian-6', circleId: 6,
    name: '심문관의 등불', nameEn: "Inquisitor's Lantern",
    element: 'fire', effectType: 'passive',
    mainEffect: '적의 특수 능력 전투 전 열람 가능', mainEffectEn: 'See enemy ability before battle',
    subEffect: '퀴즈/시련 성공률 +30%', subEffectEn: 'Quiz/trial success +30%',
    narrative: '심문관의 등불이 그대의 앞길을 밝힌다. 더 이상 숨겨진 위험은 없다.',
    narrativeEn: "The inquisitor's lantern illuminates your path. No danger remains hidden.",
  },
  // ── 5층 분노 → 분노의 화신 처치 ──
  {
    id: 'guardian-5', circleId: 5,
    name: '분노의 투구', nameEn: 'Helm of Wrath',
    element: 'mud', effectType: 'passive',
    mainEffect: '전투 D6 +1', mainEffectEn: 'Battle D6 +1',
    subEffect: '⚠ HP 회복량 -30% (트레이드오프)', subEffectEn: '⚠ HP healing -30% (tradeoff)',
    narrative: '스틱스의 분노가 투구가 되어 그대 이마를 감싼다. 적을 향한 분노는 강력한 무기.',
    narrativeEn: "Styx's wrath becomes a helm upon your brow. Fury is a powerful weapon.",
  },
  // ── 4층 탐욕 → 황금 골렘 처치 ──
  {
    id: 'guardian-4', circleId: 4,
    name: '황금의 날개', nameEn: 'Golden Wings',
    element: 'gold', effectType: 'active',
    mainEffect: '최대 3칸 비행 이동 (3턴 쿨다운)', mainEffectEn: 'Fly up to 3 tiles (3-turn cooldown)',
    subEffect: '이동력 +1 (영구)', subEffectEn: 'Move +1 (permanent)',
    narrative: '다이달로스도 부러워할 황금 날개가 그대의 등에 돋았다.',
    narrativeEn: 'Golden wings that even Daedalus would envy sprout from your back.',
  },
  // ── 3층 식탐 → 케르베로스 처치 ──
  {
    id: 'guardian-3', circleId: 3,
    name: '케르베로스의 목줄', nameEn: 'Collar of Cerberus',
    element: 'poison', effectType: 'passive',
    mainEffect: '전투 D6 2회 굴려 유리한 쪽 선택', mainEffectEn: 'Roll D6 twice, choose better result',
    subEffect: '몬스터 특수능력 발동 확률 -25%', subEffectEn: 'Monster ability trigger chance -25%',
    narrative: '케르베로스가 그대에게 길들여졌다. 지옥의 파수견이 이제 그대 편이다.',
    narrativeEn: 'Cerberus has been tamed by you. The hellhound now fights at your side.',
  },
  // ── 2층 색욕 → 폭풍의 정령 처치 ──
  {
    id: 'guardian-2', circleId: 2,
    name: '폭풍의 은총', nameEn: 'Grace of the Storm',
    element: 'wind', effectType: 'passive',
    mainEffect: '이동 주사위 최소값 +1', mainEffectEn: 'Min dice value +1 (1-2→3)',
    subEffect: '강제 이동 효과 완전 면역', subEffectEn: 'Immune to forced movement',
    narrative: '폭풍이 이제는 등 뒤에서 그대를 밀어줄 뿐이다.',
    narrativeEn: 'The storm now only pushes you forward, never back.',
  },
  // ── 1층 미망 → 베르길리우스 처치 ──
  {
    id: 'guardian-1', circleId: 1,
    name: '베르길리우스의 지팡이', nameEn: 'Staff of Virgil',
    element: 'holy', effectType: 'both',
    mainEffect: '모든 수호카드 효과 50% 강화', mainEffectEn: 'All Guardian effects +50%',
    subEffect: '획득 즉시 탈출 게이트 개방', subEffectEn: 'Opens escape gate on acquisition',
    narrative: '지옥 전체를 통과한 증표. 진정한 자유가 그대를 기다린다.',
    narrativeEn: 'Proof of traversing all Hell. True freedom awaits.',
  },
];

/** Get guardian by ID */
export function getGuardian(id: string): GuardianCard | undefined {
  return GUARDIANS.find((g) => g.id === id);
}
