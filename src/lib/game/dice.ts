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

// ============================================================
// Demon vs User Dice Duel System
// ============================================================

export type DuelOutcome = 'player_crit' | 'player_win' | 'tie' | 'demon_win' | 'demon_crit';

export interface DiceDuelResult {
  playerRoll: DiceResult;
  demonRoll: DiceResult;
  outcome: DuelOutcome;
  /** The net move distance the player gets (0 if demon wins) */
  playerMove: number;
  demonMove: number;
  message: string;
  messageKo: string;
}

/**
 * Get the demon's dice bonus based on the current circle/terrace depth.
 * Deeper = stronger demon. Surface = weaker demon.
 */
export function getDemonBonus(circleId: number): number {
  if (circleId >= 9) return 3;  // Deepest hell: +3
  if (circleId >= 7) return 2;  // Deep: +2
  if (circleId >= 5) return 1;  // Mid: +1
  if (circleId >= 3) return 0;  // Upper: even
  return -1;                     // Near surface: player advantage
}

/**
 * Resolve a dice duel between the player and a demon.
 *
 * Rules:
 * - Double beats non-double (regardless of sum)
 * - If both double: higher double wins
 * - If neither double: higher sum wins
 * - Tie: demon wins (home advantage)
 * - Demon gets a power bonus based on depth
 */
export function resolveDiceDuel(
  playerRoll: DiceResult,
  demonRoll: DiceResult,
  demonBonus: number,
): DiceDuelResult {
  const demonTotal = demonRoll.sum + demonBonus;

  let outcome: DuelOutcome;

  const pDbl = playerRoll.isDouble;
  const dDbl = demonRoll.isDouble;

  if (pDbl && dDbl) {
    // Both doubles: higher double sum wins
    if (playerRoll.sum > demonRoll.sum) outcome = 'player_crit';
    else if (demonRoll.sum > playerRoll.sum) outcome = 'demon_crit';
    else outcome = 'tie';
  } else if (pDbl && !dDbl) {
    // Player double beats non-double
    outcome = 'player_crit';
  } else if (!pDbl && dDbl) {
    // Demon double beats non-double
    outcome = 'demon_crit';
  } else if (playerRoll.sum > demonTotal) {
    outcome = 'player_win';
  } else if (demonTotal > playerRoll.sum) {
    outcome = 'demon_win';
  } else {
    outcome = 'tie'; // Tie → demon wins by default
  }

  // Player gets their dice sum as move distance (0 if demon wins)
  const playerMove = (outcome === 'player_win' || outcome === 'player_crit') ? playerRoll.sum : 0;
  const demonMove = (outcome === 'demon_win' || outcome === 'demon_crit') ? demonRoll.sum : 0;

  // Build messages
  const pStr = `[${playerRoll.dice[0]}][${playerRoll.dice[1]}]`;
  const dStr = `[${demonRoll.dice[0]}][${demonRoll.dice[1]}]`;
  const dBonus = demonBonus !== 0 ? ` (+${demonBonus})` : '';

  let message: string;
  let messageKo: string;

  switch (outcome) {
    case 'player_crit':
      message = `🌟 YOU WIN! ${pStr} double beats ${dStr}${dBonus}! Move ${playerMove} spaces!`;
      messageKo = `🌟 승리! ${pStr} 더블이 ${dStr}${dBonus}를 이겼다! ${playerMove}칸 이동!`;
      break;
    case 'player_win':
      message = `⚔ You win! ${pStr} beats ${dStr}${dBonus} = ${demonTotal}. Move ${playerMove} spaces!`;
      messageKo = `⚔ 승리! ${pStr}이 ${dStr}${dBonus} = ${demonTotal}를 이겼다. ${playerMove}칸 이동!`;
      break;
    case 'tie':
      message = `⚡ Tie! ${pStr} vs ${dStr}${dBonus} = ${demonTotal}. Demon's home advantage — you stay!`;
      messageKo = `⚡ 무승부! ${pStr} vs ${dStr}${dBonus} = ${demonTotal}. 악마의 홈 어드밴티지 — 이동 불가!`;
      break;
    case 'demon_win':
      message = `💀 Demon wins! ${dStr}${dBonus} = ${demonTotal} beats your ${pStr}. No move + 3 damage!`;
      messageKo = `💀 악마 승리! ${dStr}${dBonus} = ${demonTotal}이 ${pStr}를 이겼다. 이동 불가 + 3 피해!`;
      break;
    case 'demon_crit':
      message = `💀💀 DEMON CRIT! ${dStr} double${dBonus} crushes your ${pStr}. No move + 5 damage!`;
      messageKo = `💀💀 악마 크리티컬! ${dStr} 더블${dBonus}이 ${pStr}를 짓밟았다. 이동 불가 + 5 피해!`;
      break;
  }

  return { playerRoll, demonRoll, outcome, playerMove, demonMove, message, messageKo };
}
