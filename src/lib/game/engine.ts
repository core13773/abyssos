import type { GameState, Player } from '@/types/game';
import { buildBoardV4 } from './board-v4';
import { createRNG, timeSeed } from '@/lib/utils/random';
import { t, getActiveLocale } from '@/lib/i18n/translations';

/** Create a new player starting at Circle 9, tile 0 */
export function createPlayerV4(): Player {
  return {
    name: 'Wanderer',
    hp: 100,
    maxHp: 100,
    currentTileId: 'c9-t0',
    currentCircleId: 9,
    guardianCards: [],
    moveBonus: 0,
    battleStreak: 0,
    isStunned: false,
    buffs: [],
    era: 'inferno',
    purificationCards: [],
    totalCardCount: 0,
    virtue: 0,
    grace: 0,
    celestialRelics: [],
  };
}

/** Create a fresh game */
export function createNewGameV4(): GameState {
  const rng = createRNG(timeSeed());
  const board = buildBoardV4(rng);

  return {
    phase: 'rolling',
    player: createPlayerV4(),
    board,
    dice: null,
    demonDice: null,
    isDouble: false,
    doubleCount: 0,
    turnNumber: 1,
    log: [
      { turn: 0, message: t('system.gameIntro1', getActiveLocale()), type: 'system' },
      { turn: 0, message: t('system.gameIntro2', getActiveLocale()), type: 'system' },
    ],
    activeMonster: null,
    activeGatekeeper: null,
    activeGuardianReward: null,
    pendingEventKind: null,
    battleRoll: null,
    defeatGatekeeperOnArrival: null,
    shakeScreen: false,
    showSparkles: false,
    escaped: false,
    totalTurns: 0,
    purgatorioBoard: [],
    activeSinProjection: null,
    activeAngelGuardian: null,
    activePurificationReward: null,
    purgatorioDice: null,
    purgatorioIsDouble: false,
    purgatorioDoubleCount: 0,
    paradisoBoard: [],
    activeLightSpirit: null,
    activeArchangel: null,
    activeCelestialReward: null,
    paradisoDice: null,
    paradisoIsDouble: false,
    paradisoDoubleCount: 0,
  };
}

/** Check if player has escaped (defeated circle 1's gatekeeper) */
export function checkEscapeV4(player: Player): boolean {
  return player.currentCircleId === 1 && player.guardianCards.some((g) => g.id === 'guardian-1');
}
