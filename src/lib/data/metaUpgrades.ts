export interface MetaUpgrade {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  maxLevel: number;
  costPerLevel: number;
  effectPerLevel: number;
}

export const META_UPGRADES: MetaUpgrade[] = [
  {
    id: 'meta-hp',
    name: '생명력 강화',
    nameEn: 'HP Boost',
    description: '게임 시작 시 최대 HP +10',
    descriptionEn: 'Start with +10 Max HP',
    maxLevel: 5,
    costPerLevel: 5,
    effectPerLevel: 10,
  },
  {
    id: 'meta-dice',
    name: '주사위 안정화',
    nameEn: 'Dice Stabilizer',
    description: '주사위 최소값 +1',
    descriptionEn: 'Minimum dice roll +1',
    maxLevel: 3,
    costPerLevel: 10,
    effectPerLevel: 1,
  },
  {
    id: 'meta-consumable',
    name: '시작 소모품',
    nameEn: 'Starting Consumable',
    description: '게임 시작 시 소모품 1개 추가',
    descriptionEn: 'Start with 1 extra consumable',
    maxLevel: 3,
    costPerLevel: 8,
    effectPerLevel: 1,
  },
  {
    id: 'meta-box',
    name: '별빛 상자 품질',
    nameEn: 'Starlight Box Quality',
    description: '별빛 상자에서 좋은 아이템 확률 증가',
    descriptionEn: 'Better items from starlight boxes',
    maxLevel: 3,
    costPerLevel: 12,
    effectPerLevel: 10,
  },
  {
    id: 'meta-revive',
    name: '부활의 축복',
    nameEn: 'Blessing of Revival',
    description: 'HP 0 시 1회 부활',
    descriptionEn: 'Revive once at 0 HP',
    maxLevel: 1,
    costPerLevel: 30,
    effectPerLevel: 1,
  },
];

export interface MetaProgress {
  soulStones: number;
  upgrades: Record<string, number>;
}

const META_KEY = 'abyssos_meta';

export function loadMetaProgress(): MetaProgress {
  if (typeof window === 'undefined') return { soulStones: 0, upgrades: {} };
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { soulStones: 0, upgrades: {} };
}

export function saveMetaProgress(progress: MetaProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(META_KEY, JSON.stringify(progress));
  } catch { /* ignore */ }
}

export function getUpgradeLevel(id: string): number {
  return loadMetaProgress().upgrades[id] || 0;
}

export function applyMetaUpgrades(player: {
  hp: number;
  maxHp: number;
  consumables: unknown[];
  buffs: { id: string; name: string; remainingTurns: number; value: number }[];
}) {
  const meta = loadMetaProgress();
  const hpLevel = meta.upgrades['meta-hp'] || 0;
  if (hpLevel > 0) {
    player.maxHp += hpLevel * 10;
    player.hp += hpLevel * 10;
  }
  const reviveLevel = meta.upgrades['meta-revive'] || 0;
  if (reviveLevel > 0) {
    player.buffs.push({ id: 'meta_revive', name: 'Revive', remainingTurns: 99, value: 1 });
  }
}
