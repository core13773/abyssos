import type { GuardianCard } from '@/types/game';

/**
 * Compute combat dice bonus from all owned guardian cards.
 */
export function getGuardianDiceBonus(guardians: GuardianCard[], hp: number, maxHp: number): number {
  let bonus = 0;

  // Accumulate base bonuses first
  if (guardians.some((g) => g.id === 'guardian-5')) bonus += 1;  // 분노의 투구
  if (guardians.some((g) => g.id === 'guardian-7') && hp <= maxHp * 0.3) bonus += 1; // 피의 축복 (low HP)

  // Staff of Virgil: 50% boost applied AFTER other bonuses
  if (guardians.some((g) => g.id === 'guardian-1')) {
    bonus = Math.floor(bonus * 1.5);
  }

  return bonus;
}

/**
 * Compute damage reduction from guardian cards.
 */
export function getGuardianDamageReduction(guardians: GuardianCard[]): number {
  let reduction = 0;
  if (guardians.some((g) => g.id === 'guardian-9')) reduction += 2;  // 얼음 거인의 심장
  if (guardians.some((g) => g.id === 'guardian-1')) reduction = Math.floor(reduction * 1.5); // 지팡이
  return reduction;
}

/**
 * Check if guardian negates enemy ability (가면술사의 비밀 passive).
 */
export function guardianNegatesAbility(guardians: GuardianCard[], rng: { next(): number }): boolean {
  if (guardians.some((g) => g.id === 'guardian-8')) {
    return rng.next() < 0.2; // 20% chance
  }
  return false;
}

/**
 * Get move bonus from guardian cards.
 */
export function getGuardianMoveBonus(guardians: GuardianCard[]): number {
  let bonus = 0;
  if (guardians.some((g) => g.id === 'guardian-4')) bonus += 1;     // 황금의 날개
  if (guardians.some((g) => g.id === 'guardian-1')) bonus = Math.floor(bonus * 1.5); // 지팡이
  return bonus;
}

/**
 * Check if guardian provides minimum dice roll boost (폭풍의 은총).
 */
export function getGuardianMinDice(guardians: GuardianCard[]): number {
  let minVal = 1;
  if (guardians.some((g) => g.id === 'guardian-2')) minVal = 3; // 1-2 → 3
  return minVal;
}

/**
 * Check if guardian makes monster ability less likely (케르베로스의 목줄).
 */
export function getGuardianAbilityReduction(guardians: GuardianCard[]): number {
  let reduction = 0;
  if (guardians.some((g) => g.id === 'guardian-3')) reduction = 0.25;
  if (guardians.some((g) => g.id === 'guardian-1')) reduction *= 1.5;
  return Math.min(reduction, 0.5);
}

/**
 * Check if guardian provides trap damage reduction (얼음 거인의 심장 sub).
 */
export function getGuardianTrapReduction(guardians: GuardianCard[]): number {
  if (guardians.some((g) => g.id === 'guardian-9')) return 0.5;
  return 0;
}

/**
 * Check if guardian provides immunity to forced movement (폭풍의 은총 sub).
 */
export function isImmuneToForcedMovement(guardians: GuardianCard[]): boolean {
  return guardians.some((g) => g.id === 'guardian-2');
}

/**
 * Check if golden wings (황금의 날개) is available.
 */
export function canUseGoldenWings(guardians: GuardianCard[], cooldownTurns: number): boolean {
  return guardians.some((g) => g.id === 'guardian-4') && cooldownTurns <= 0;
}

/**
 * Check if mask secret (가면술사의 비밀) is available.
 */
export function canSkipBattle(guardians: GuardianCard[], used: boolean): boolean {
  return guardians.some((g) => g.id === 'guardian-8') && !used;
}
