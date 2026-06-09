import type { GameState, Player } from '@/types/game';
import { buildParadisoBoard } from './paradiso-board';
import { createRNG, timeSeed } from '@/lib/utils/random';
import { t, getActiveLocale } from '@/lib/i18n/translations';

/** Create a player for Paradiso, inheriting from a prior state */
export function createParadisoPlayer(priorPlayer: Player): Player {
  const isFromPurgatorio = priorPlayer.era === 'purgatorio';
  return {
    ...priorPlayer,
    era: 'paradiso',
    grace: isFromPurgatorio ? 50 : 30,
    currentTileId: 's1-q0',
    currentSphereId: 1,
    celestialRelics: [],
    totalCardCount: (priorPlayer.guardianCards?.length || 0) + (priorPlayer.purificationCards?.length || 0),
    moveBonus: 0,
    battleStreak: 0,
    isStunned: false,
    buffs: [],
  };
}

export function createParadisoGame(priorPlayer: Player): Partial<GameState> {
  const rng = createRNG(timeSeed());
  const board = buildParadisoBoard(rng);
  const player = createParadisoPlayer(priorPlayer);
  const loc = getActiveLocale();

  return {
    phase: 'paradiso_rolling',
    player,
    paradisoBoard: board,
    dice: null, isDouble: false, doubleCount: 0,
    purgatorioDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
    paradisoDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0,
    turnNumber: 1, totalTurns: 0,
    log: [
      { turn: 0, message: t('system.paradisoIntro1', loc), type: 'system' },
      { turn: 0, message: t('system.paradisoIntro2', loc), type: 'system' },
    ],
    activeMonster: null, activeGatekeeper: null, activeGuardianReward: null,
    activeSinProjection: null, activeAngelGuardian: null, activePurificationReward: null,
    activeLightSpirit: null, activeArchangel: null, activeCelestialReward: null,
    pendingEventKind: null, battleRoll: null, defeatGatekeeperOnArrival: null,
    shakeScreen: false, showSparkles: false,
    escaped: false,
  };
}

export function checkParadisoComplete(player: Player): boolean {
  return (player.currentSphereId === 9 && player.celestialRelics.some((c) => c.id === 'relic-9'));
}
