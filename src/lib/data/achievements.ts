export interface Achievement {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  secret?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'hell-survivor',
    name: '지옥의 생존자',
    nameEn: 'Hell Survivor',
    description: '지옥편을 클리어하라',
    descriptionEn: 'Clear the Inferno chapter',
    icon: '🔥',
  },
  {
    id: 'purgator',
    name: '연옥의 정화자',
    nameEn: 'Purgator',
    description: '연옥편을 클리어하라',
    descriptionEn: 'Clear the Purgatorio chapter',
    icon: '🌅',
  },
  {
    id: 'celestial',
    name: '천국의 증인',
    nameEn: 'Celestial Witness',
    description: '천국편을 클리어하라',
    descriptionEn: 'Clear the Paradiso chapter',
    icon: '✨',
  },
  {
    id: 'divine-pilgrim',
    name: '완전한 순례자',
    nameEn: 'Divine Pilgrim',
    description: '3부작을 모두 클리어하라',
    descriptionEn: 'Clear all three chapters',
    icon: '👑',
  },
  {
    id: 'undefeated',
    name: '노련한 전사',
    nameEn: 'Undefeated Warrior',
    description: '지옥편을 한 번도 패배하지 않고 클리어하라',
    descriptionEn: 'Clear Inferno without a single defeat',
    icon: '⚔️',
  },
  {
    id: 'card-master',
    name: '수집가',
    nameEn: 'Card Master',
    description: '전체 카드 25장을 획득하라',
    descriptionEn: 'Collect all 25 cards',
    icon: '🃏',
  },
  {
    id: 'speed-demon',
    name: '속도의 화신',
    nameEn: 'Speed Demon',
    description: '30턴 이내에 지옥을 클리어하라',
    descriptionEn: 'Clear Inferno within 30 turns',
    icon: '💨',
  },
  {
    id: 'cursed-one',
    name: '저주의 주인',
    nameEn: 'Cursed One',
    description: '저주카드 5장을 동시에 보유하라',
    descriptionEn: 'Hold 5 curse cards at once',
    icon: '💀',
  },
  {
    id: 'perfectionist',
    name: '완벽주의자',
    nameEn: 'Perfectionist',
    description: '모든 보스를 퍼펙트 클리어하라',
    descriptionEn: 'Perfect clear all bosses',
    icon: '⭐',
  },
  {
    id: 'demon-hunter',
    name: '악마 사냥꾼',
    nameEn: 'Demon Hunter',
    description: '몬스터 50마리를 처치하라',
    descriptionEn: 'Defeat 50 monsters',
    icon: '👹',
  },
  {
    id: 'soul-collector',
    name: '영혼석 수집가',
    nameEn: 'Soul Collector',
    description: '영혼석 30개를 수집하라',
    descriptionEn: 'Collect 30 soul stones',
    icon: '💎',
  },
  {
    id: 'wheel-gambler',
    name: '도박왕',
    nameEn: 'Wheel Gambler',
    description: '욕망의 바퀴에서 대박 3회 당첨',
    descriptionEn: 'Hit the jackpot 3 times on the Wheel of Desire',
    icon: '🎰',
  },
  {
    id: 'hidden-boss',
    name: '심연의 도전자',
    nameEn: 'Abyss Challenger',
    description: '히든 보스를 발견하라',
    descriptionEn: 'Discover the hidden boss',
    icon: '🌑',
    secret: true,
  },
  {
    id: 'ng-plus',
    name: '순환의 시작',
    nameEn: 'Cycle Beginner',
    description: '새 게임+를 시작하라',
    descriptionEn: 'Start a New Game+',
    icon: '♾️',
  },
];

const ACHIEVEMENT_KEY = 'abyssos_achievements';

export function loadAchievements(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACHIEVEMENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function saveAchievements(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
}

export function unlockAchievement(id: string) {
  const current = loadAchievements();
  if (!current.includes(id)) {
    current.push(id);
    saveAchievements(current);
    // Dispatch event for cross-tab sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
    return true;
  }
  return false;
}

export function checkAchievement(id: string): boolean {
  return loadAchievements().includes(id);
}
