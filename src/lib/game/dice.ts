import type { DiceRoll } from '@/types/game';
import type { RNG } from '@/lib/utils/random';

export interface DiceResult {
  dice: DiceRoll;
  sum: number;
  isDouble: boolean;
  isSnakeEyes: boolean;
  isBoxcar: boolean;
}

/**
 * Roll two D6 dice.
 */
export function rollDice(rng: RNG): DiceResult {
  const d1 = rng.nextInt(1, 6);
  const d2 = rng.nextInt(1, 6);
  const sum = d1 + d2;
  const isDouble = d1 === d2;
  return {
    dice: [d1, d2],
    sum,
    isDouble,
    isSnakeEyes: sum === 2,
    isBoxcar: sum === 12,
  };
}

/**
 * Roll a single D6 die.
 */
export function rollD6(rng: RNG): number {
  return rng.nextInt(1, 6);
}

/**
 * Manually create a dice result (used for forced/rigged rolls).
 */
export function forcedRoll(d1: number, d2: number): DiceResult {
  const sum = d1 + d2;
  return {
    dice: [d1 as DiceRoll[0], d2 as DiceRoll[1]],
    sum,
    isDouble: d1 === d2,
    isSnakeEyes: sum === 2,
    isBoxcar: sum === 12,
  };
}
