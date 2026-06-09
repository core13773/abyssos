import type { Player, AngelGuardianCard, PurificationCard, LogEntry } from '@/types/game';
import { rollD6 } from './dice';
import type { RNG } from '@/lib/utils/random';
import { t, getActiveLocale } from '@/lib/i18n/translations';
import { getGuardianDiceBonus } from './guardian';

/**
 * Compute purification bonuses from owned purification cards.
 */
export function getPurificationDiceBonus(cards: PurificationCard[], hp: number, maxHp: number): number {
  let bonus = 0;

  // Hand of Poverty: +2 when HP ≤ 50%
  if (cards.some((c) => c.id === 'purification-5') && hp <= maxHp * 0.5) {
    bonus += 2;
  }

  // Kiss of Temperance sub: D6 2회 굴리기 — applied at roll time, not here

  // Flame of Purity: doubles all purification effects
  if (cards.some((c) => c.id === 'purification-7')) {
    bonus *= 2;
  }

  return bonus;
}

/**
 * Check if enemy power is reduced by Breath of Gentleness.
 */
export function getAngelPowerReduction(cards: PurificationCard[], hp: number, maxHp: number): number {
  let reduction = 0;

  if (cards.some((c) => c.id === 'purification-3')) {
    reduction += 1;
  }

  if (cards.some((c) => c.id === 'purification-7')) {
    reduction *= 2;
  }

  return reduction;
}

/**
 * Get min dice value (Stone of Humility bonus).
 */
export function getPurificationMinDice(cards: PurificationCard[]): number {
  if (cards.some((c) => c.id === 'purification-1')) return 2;
  return 1;
}

export interface AngelBattleResult {
  victory: boolean;
  updatedPlayer: Player;
  logs: LogEntry[];
  purificationCard: PurificationCard | null;
  crit: boolean;
  shake: boolean;
  sparkles: boolean;
}

/**
 * Resolve an Angel Guardian battle.
 * Includes Kiss of Temperance double-roll, all purification-modifier healing,
 * and purification card acquisition.
 *
 * Caller is responsible for terrace progression and completion checks.
 */
export function resolveAngelBattle(
  player: Player,
  angel: AngelGuardianCard,
  purification: PurificationCard,
  rng: RNG,
  forcedRoll?: number
): AngelBattleResult {
  const p = { ...player, buffs: [...player.buffs], purificationCards: [...player.purificationCards] };
  const loc = getActiveLocale();
  const angelName = loc === 'en' ? angel.nameEn : angel.name;
  const logs: LogEntry[] = [];

  // Total dice bonus from both guardian + purification cards
  const guardianBonus = getGuardianDiceBonus(p.guardianCards, p.hp, p.maxHp);
  const purificationBonus = getPurificationDiceBonus(p.purificationCards, p.hp, p.maxHp);
  const totalDiceBonus = guardianBonus + purificationBonus;

  // Reduce angel power from Breath of Gentleness
  const powerReduction = getAngelPowerReduction(p.purificationCards, p.hp, p.maxHp);
  const effectivePower = Math.max(1, angel.power - powerReduction);

  // Roll: apply Kiss of Temperance double-roll
  const baseRoll = forcedRoll ?? rollD6(rng);
  let finalRoll = baseRoll;
  if (p.purificationCards.some((c) => c.id === 'purification-6')) {
    const secondRoll = rollD6(rng);
    finalRoll = Math.max(baseRoll, secondRoll);
  }
  const total = finalRoll + totalDiceBonus;
  const victory = total >= effectivePower;
  const isCrit = finalRoll === 6 && victory;

  // Result message
  logs.push({
    turn: 0,
    message: victory
      ? t('battle.result.victory', loc, { name: angelName, power: effectivePower, roll: total })
      : t('purgatorio.angelResultDefeat', loc, { roll: total, power: effectivePower, name: angelName }),
    type: isCrit ? 'critical' : 'battle',
  });

  if (victory) {
    // Calculate reward HP — same stacking as gameStore
    let heal = angel.rewardHp;

    // Flame of Purity: +50%
    if (p.purificationCards.some((c) => c.id === 'purification-7')) heal = Math.floor(heal * 1.5);
    // Hand of Poverty: +50%
    if (p.purificationCards.some((c) => c.id === 'purification-5')) heal = Math.floor(heal * 1.5);
    // Kiss of Temperance: double
    if (p.purificationCards.some((c) => c.id === 'purification-6')) heal *= 2;

    if (isCrit) {
      heal *= 2;
      logs.push({ turn: 0, message: t('battle.result.crit', loc), type: 'critical' });
    }

    p.hp = Math.min(p.maxHp, p.hp + heal);
    if (heal > 0) {
      logs.push({
        turn: 0,
        message: t('battle.result.heal', loc, { hp: heal, curr: p.hp, max: p.maxHp }),
        type: 'heal',
      });
    }

    // Add purification card
    p.purificationCards = [...p.purificationCards, purification];
    p.totalCardCount = (p.totalCardCount || 0) + 1;

    logs.push({
      turn: 0,
      message: t('purgatorio.purificationAcquiredDetailed', loc, { name: purification.name }),
      type: 'guardian',
    });

    p.battleStreak = (p.battleStreak || 0) + 1;
  } else {
    // In Purgatorio, defeat does NOT push back. Player stays and can retry.
    const dmg = Math.floor(angel.rewardHp * 0.15);
    p.hp = Math.max(1, p.hp - dmg);

    logs.push({
      turn: 0,
      message: t('purgatorio.angelMercy', loc, { hp: dmg }),
      type: 'system',
    });

    p.battleStreak = 0;
  }

  return {
    victory,
    updatedPlayer: p,
    logs,
    purificationCard: victory ? purification : null,
    crit: isCrit,
    shake: !victory,
    sparkles: victory,
  };
}
