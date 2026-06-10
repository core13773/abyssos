import type { GameState, Player } from '@/types/game';
import { buildPurgatorioBoard } from './purgatorio-board';
import { createRNG, timeSeed } from '@/lib/utils/random';
import { t, getActiveLocale } from '@/lib/i18n/translations';

/**
 * Create a player for Purgatorio, inheriting from the Inferno clear state.
 */
export function createPurgatorioPlayer(infernoPlayer: Player): Player {
  return {
    ...infernoPlayer,
    era: 'purgatorio',
    currentTileId: 't1-p0',
    currentTerraceId: 1,
    purificationCards: [],
    totalCardCount: infernoPlayer.guardianCards.length,
    moveBonus: 0,
    battleStreak: 0,
    isStunned: false,
    buffs: [],
  };
}

/**
 * Create a fresh Purgatorio game state from an Inferno-clear player.
 */
export function createPurgatorioGame(infernoPlayer: Player): Partial<GameState> {
  const rng = createRNG(timeSeed());
  const purgatorioBoard = buildPurgatorioBoard(rng);
  const player = createPurgatorioPlayer(infernoPlayer);
  const loc = getActiveLocale();

  return {
    phase: 'purgatorio_rolling',
    player,
    purgatorioBoard,
    dice: null, demonDice: null,
    isDouble: false,
    doubleCount: 0,
    purgatorioDice: null,
    purgatorioIsDouble: false,
    purgatorioDoubleCount: 0,
    turnNumber: 1,
    totalTurns: 0,
    log: [
      { turn: 0, message: t('system.purgatorioIntro1', loc), type: 'system' },
      { turn: 0, message: t('system.purgatorioIntro2', loc), type: 'system' },
    ],
    activeMonster: null,
    activeGatekeeper: null,
    activeGuardianReward: null,
    activeSinProjection: null,
    activeAngelGuardian: null,
    activePurificationReward: null,
    pendingEventKind: null,
    battleRoll: null,
    defeatGatekeeperOnArrival: null,
    shakeScreen: false,
    showSparkles: false,
    escaped: false,
  };
}

/**
 * Check if the player has completed Purgatorio (defeated Angel-7 and acquired Flame of Purity).
 */
export function checkPurgatorioComplete(player: Player): boolean {
  return (
    player.currentTerraceId === 7 &&
    player.purificationCards.some((c) => c.id === 'purification-7')
  );
}
