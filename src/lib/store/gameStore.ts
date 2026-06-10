'use client';

import { create } from 'zustand';
import type { GameState } from '@/types/game';
import { createNewGameV4 } from '@/lib/game/engine';
import { createPurgatorioGame, checkPurgatorioComplete } from '@/lib/game/purgatorio-engine';

// ── Realm completion tracking ──
function saveRealmCompletion(realm: 'inferno' | 'purgatorio' | 'paradiso', turns: number) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('abyssos_realms');
    const data = raw ? JSON.parse(raw) : { inferno: { completed: false, bestTurns: null }, purgatorio: { completed: false, bestTurns: null }, paradiso: { completed: false } };
    if (realm === 'inferno' || realm === 'purgatorio') {
      const prev = data[realm];
      data[realm] = {
        completed: true,
        bestTurns: prev.bestTurns ? Math.min(prev.bestTurns, turns) : turns,
      };
    } else {
      data[realm] = { completed: true };
    }
    localStorage.setItem('abyssos_realms', JSON.stringify(data));
    // Dispatch storage event for same-tab listeners
    window.dispatchEvent(new Event('storage'));
  } catch { /* ignore */ }
}

// ── Card collection persistence ──
export interface CollectedCards {
  inferno: string[];      // guardian IDs
  purgatorio: string[];   // purification IDs
  paradiso: string[];     // relic IDs
}

const DEFAULT_COLLECTED: CollectedCards = { inferno: [], purgatorio: [], paradiso: [] };

export function loadCollectedCards(): CollectedCards {
  if (typeof window === 'undefined') return DEFAULT_COLLECTED;
  try {
    const raw = localStorage.getItem('abyssos_cards');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        inferno: parsed.inferno || [],
        purgatorio: parsed.purgatorio || [],
        paradiso: parsed.paradiso || [],
      };
    }
  } catch { /* ignore */ }
  return DEFAULT_COLLECTED;
}

function saveCollectedCards(realm: 'inferno' | 'purgatorio' | 'paradiso', cardIds: string[]) {
  if (typeof window === 'undefined') return;
  try {
    const current = loadCollectedCards();
    // Merge: keep existing cards + add new ones (deduplicate)
    const merged = [...new Set([...current[realm], ...cardIds])];
    current[realm] = merged;
    localStorage.setItem('abyssos_cards', JSON.stringify(current));
    window.dispatchEvent(new Event('storage'));
  } catch { /* ignore */ }
}

import { rollDice, resolveDiceDuel, getDemonBonus } from '@/lib/game/dice';
import { getNextTileV4, remainingTilesInCircle } from '@/lib/game/board-v4';
import { buildPurgatorioBoard, getNextPurgatorioTile, remainingTilesInTerrace } from '@/lib/game/purgatorio-board';
import { resolveMonsterBattle } from '@/lib/game/battle';
import { resolveEventV4 } from '@/lib/game/events-v4';
import { resolvePurgatorioEvent } from '@/lib/game/purgatorio-events';
import { resolveAngelBattle } from '@/lib/game/purgatorio-angel';
import { getGuardianDiceBonus, getGuardianDamageReduction } from '@/lib/game/guardian';
import { getMonster } from '@/lib/data/monsters';
import { getGatekeeper } from '@/lib/data/gatekeepers';
import { getGuardian } from '@/lib/data/guardians';
import { getSinProjection, getAngelGuardian, getPurificationCard } from '@/lib/data/purgatorio';
import { getLightSpirit, getArchangel, getRelic } from '@/lib/data/paradiso';
import { createParadisoGame, checkParadisoComplete } from '@/lib/game/paradiso-engine';
import { buildParadisoBoard, getNextParadisoTile, remainingTilesInSphere } from '@/lib/game/paradiso-board';
import { createRNG, timeSeed } from '@/lib/utils/random';
import { t, getActiveLocale } from '@/lib/i18n/translations';

interface GameActions {
  initGame: () => void;
  rollDiceAction: () => void;
  movePlayerAction: () => void;
  setBattleRoll: (roll: number) => void;
  resolveBattleAction: () => void;
  resolveEventAction: () => void;
  resolveGatekeeperAction: () => void;
  skipBattleAction: () => void;
  useGuardianAction: (guardianId: string) => void;
  nextTurn: () => void;
  clearEffects: () => void;

  // ---- Purgatorio actions ----
  startPurgatorio: () => void;
  rollPurgatorioDice: () => void;
  movePurgatorioPlayer: () => void;
  resolveSinChoice: (choiceIndex: 0 | 1) => void;
  resolvePurgatorioEvent: () => void;
  resolvePurgatorioAngel: () => void;
  skipPurgatorioBattle: () => void;
  nextPurgatorioTurn: () => void;

  // ---- Paradiso actions ----
  startParadiso: () => void;
  rollParadisoDice: () => void;
  moveParadisoPlayer: () => void;
  resolveParadisoBlessing: () => void;
  resolveParadisoArchangel: () => void;
  nextParadisoTurn: () => void;
}

export type GameStore = GameState & GameActions;

let _rng = createRNG(timeSeed());

export const useGameStore = create<GameStore>((set, get) => {
  const loc = () => getActiveLocale();

  return {
    phase: 'rolling',
    player: {
      name: 'Wanderer', hp: 100, maxHp: 100,
      currentTileId: 'c9-t0', currentCircleId: 9,
      guardianCards: [], moveBonus: 0, battleStreak: 0,
      isStunned: false, buffs: [],
      era: 'inferno', purificationCards: [], totalCardCount: 0,
      virtue: 0, grace: 0, celestialRelics: [],
    },
    board: [],
    dice: null, demonDice: null, isDouble: false, doubleCount: 0,
    turnNumber: 1, log: [],
    activeMonster: null, activeGatekeeper: null, activeGuardianReward: null,
    pendingEventKind: null, battleRoll: null, defeatGatekeeperOnArrival: null,
    shakeScreen: false, showSparkles: false,
    escaped: false, totalTurns: 0,
    purgatorioBoard: [],
    activeSinProjection: null, activeAngelGuardian: null, activePurificationReward: null,
    purgatorioDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
    paradisoBoard: [], activeLightSpirit: null, activeArchangel: null, activeCelestialReward: null,
    paradisoDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0,

    initGame: () => {
      _rng = createRNG(timeSeed());
      const newGame = createNewGameV4();
      set({
        ...newGame,
        phase: 'rolling',
        purgatorioBoard: [],
        activeSinProjection: null, activeAngelGuardian: null, activePurificationReward: null,
        purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
        player: {
          ...newGame.player,
          era: 'inferno' as const,
          purificationCards: [],
          totalCardCount: 0,
          virtue: 0,
        },
      });
    },

    rollDiceAction: () => {
      const state = get();
      if (state.phase !== 'rolling') return;
      const p = { ...state.player, buffs: [...state.player.buffs] };

      if (p.isStunned) {
        p.isStunned = false;
        set({
          player: p, phase: 'rolling',
          turnNumber: state.turnNumber + 1, totalTurns: state.totalTurns + 1,
          log: [...state.log, { turn: state.turnNumber, message: t('system.stunned', loc()), type: 'system' }],
        });
        return;
      }

      p.buffs = p.buffs.map((b) => ({ ...b, remainingTurns: b.remainingTurns - 1 })).filter((b) => b.remainingTurns > 0);
      const poison = p.buffs.find((b) => b.id === 'poison');
      if (poison) p.hp = Math.max(0, p.hp + poison.value);

      // ── Demon vs User Dice Duel + Auto-Move ──
      const playerRoll = rollDice(_rng);
      const demonRoll = rollDice(_rng);
      const demonBonus = getDemonBonus(p.currentCircleId);
      const duelResult = resolveDiceDuel(playerRoll, demonRoll, demonBonus);

      const msgs: string[] = [];
      let showSparkles = false;
      let shakeScreen = false;

      if (duelResult.outcome === 'player_crit' || duelResult.outcome === 'player_win') {
        showSparkles = duelResult.outcome === 'player_crit';
        msgs.push(loc() === 'en' ? duelResult.message : duelResult.messageKo);
        p.moveBonus = (p.moveBonus || 0);

        const isDouble = duelResult.playerRoll.isDouble;
        const doubleCount = isDouble ? state.doubleCount + 1 : 0;
        const totalMove = Math.max(1, duelResult.playerRoll.sum + (p.moveBonus || 0));
        p.moveBonus = 0;

        try {
          // Execute auto-move
          const remaining = remainingTilesInCircle(state.board, p.currentTileId);
          const prevTileId = p.currentTileId;
          if (totalMove >= remaining) {
            const lastTile = state.board.find((t) => t.circleId === p.currentCircleId && t.index === 11);
            if (lastTile) p.currentTileId = lastTile.id;
            const gk = getGatekeeper(p.currentCircleId);
            set({
              player: p, phase: 'gatekeeper', activeGatekeeper: gk || null,
              dice: null, demonDice: null, isDouble: false, doubleCount: 0,
              log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
            });
          } else {
            let currentTile = state.board.find((t) => t.id === p.currentTileId);
            for (let i = 0; i < totalMove; i++) {
              if (!currentTile) break;
              const next = getNextTileV4(state.board, currentTile.id);
              if (!next) break;
              currentTile = next;
            }
            if (currentTile && currentTile.id !== prevTileId) {
              p.currentTileId = currentTile.id;
              p.currentCircleId = currentTile.circleId;
            } else if (currentTile) {
              const forced = getNextTileV4(state.board, prevTileId);
              if (forced) { p.currentTileId = forced.id; p.currentCircleId = forced.circleId; }
            }
            const tile = state.board.find((t) => t.id === p.currentTileId);
            if (tile?.type === 'monster' && tile.monsterId) {
              let monster = getMonster(tile.monsterId);
              if (tile.label === 'elite' && monster) monster = { ...monster, power: monster.power + 2, rewardHp: monster.rewardHp * 3 };
              set({
                player: p, phase: 'battle', activeMonster: monster || null,
                dice: null, demonDice: null, isDouble: false, doubleCount: 0,
                log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
              });
            } else if (tile?.type === 'event' && tile.eventKind) {
              set({
                player: p, phase: 'event', pendingEventKind: tile.eventKind,
                dice: null, demonDice: null, isDouble: false, doubleCount: 0,
                log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
              });
            } else {
              set({
                player: p, phase: 'rolling', totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
                dice: null, demonDice: null, isDouble: false, doubleCount: 0,
                log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
              });
            }
          }
        } catch {
          // Fallback: set phase to moving with dice visible
          set({
            player: p, dice: duelResult.playerRoll.dice, demonDice: duelResult.demonRoll.dice, isDouble, doubleCount,
            phase: 'moving', shakeScreen: false, showSparkles: true,
            log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
          });
        }
      } else {
        // Demon wins — take damage, can't move, turn passes
        shakeScreen = true;
        const dmg = duelResult.outcome === 'demon_crit' ? 5 : 3;
        p.hp = Math.max(0, p.hp - dmg);
        msgs.push(loc() === 'en' ? duelResult.message : duelResult.messageKo);
        msgs.push(loc() === 'en' ? `-${dmg} HP! Turn lost.` : `-${dmg} HP! 턴 소실.`);
        set({
          player: p, dice: duelResult.playerRoll.dice, demonDice: duelResult.demonRoll.dice,
          phase: 'rolling', totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          isDouble: false, doubleCount: 0, shakeScreen, showSparkles,
          log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
        });
      }
      if (showSparkles) setTimeout(() => set({ showSparkles: false }), 2000);
      if (shakeScreen) setTimeout(() => set({ shakeScreen: false }), 600);
    },

    movePlayerAction: () => {
      const state = get();
      if (state.phase !== 'moving') return;

      const moveBonus = state.player.moveBonus || 0;
      const diceVal0 = state.dice?.[0] ?? 0;
      const diceVal1 = state.dice?.[1] ?? 0;
      // Ensure minimum move of 1 tile forward (safety net)
      const totalMove = Math.max(1, diceVal0 + diceVal1 + moveBonus);
      const p = { ...state.player, moveBonus: 0 };
      const remaining = remainingTilesInCircle(state.board, p.currentTileId);

      if (totalMove >= remaining) {
        const lastTile = state.board.find(
          (t) => t.circleId === p.currentCircleId && t.index === 11
        );
        if (lastTile) p.currentTileId = lastTile.id;

        const gk = getGatekeeper(p.currentCircleId);
        const gkName = loc() === 'en' ? (gk?.nameEn || '') : (gk?.name || '');

        set({
          player: p, phase: 'gatekeeper', activeGatekeeper: gk || null, dice: null, demonDice: null, isDouble: false, doubleCount: 0,
          log: [...state.log, { turn: state.turnNumber, message: t('gk.arrive', loc(), { name: gkName }), type: 'critical' }],
        });
        return;
      }

      const previousTileId = p.currentTileId;
      let currentTile = state.board.find((t) => t.id === p.currentTileId);
      for (let i = 0; i < totalMove; i++) {
        if (!currentTile) break;
        const next = getNextTileV4(state.board, currentTile.id);
        if (!next) { p.currentCircleId = 1; break; }
        currentTile = next;
      }
      if (currentTile) {
        p.currentTileId = currentTile.id;
        p.currentCircleId = currentTile.circleId;
      }
      // Safety: if no movement occurred, force one tile forward
      if (p.currentTileId === previousTileId) {
        const forcedNext = getNextTileV4(state.board, previousTileId);
        if (forcedNext) {
          p.currentTileId = forcedNext.id;
          p.currentCircleId = forcedNext.circleId;
        }
      }

      const tile = state.board.find((t) => t.id === p.currentTileId);

      if (tile?.type === 'monster' && tile.monsterId) {
        let monster = getMonster(tile.monsterId);
        // Elite monster: +2 power, 3x rewards
        const isElite = tile.label === 'elite';
        if (isElite && monster) {
          monster = { ...monster, power: monster.power + 2, rewardHp: monster.rewardHp * 3 };
        }
        const monName = (loc() === 'en' ? monster?.nameEn : monster?.name) || '';
        const eliteTag = isElite ? (loc() === 'en' ? ' 👑ELITE!' : ' 👑엘리트!') : '';
        set({
          player: p, phase: 'battle', activeMonster: monster || null,
          log: [...state.log, { turn: state.turnNumber, message: t('battle.arrive', loc(), { name: monName }) + eliteTag, type: 'battle' }],
        });
      } else if (tile?.type === 'event' && tile.eventKind) {
        set({
          player: p, phase: 'event', pendingEventKind: tile.eventKind,
          log: [...state.log, { turn: state.turnNumber, message: t('event.arrive', loc(), { label: tile.label, circle: p.currentCircleId }), type: 'move' }],
        });
      } else {
        set({
          player: p, phase: 'rolling',
          totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          dice: null, demonDice: null, isDouble: false, doubleCount: 0,
          log: [...state.log, { turn: state.turnNumber, message: t('event.arrive', loc(), { label: tile?.label || '?', circle: p.currentCircleId }), type: 'move' }],
        });
      }
    },

    setBattleRoll: (roll: number) => set({ battleRoll: roll }),

    resolveBattleAction: () => {
      const state = get();
      if (state.phase !== 'battle' || !state.activeMonster) return;

      // Use timing slider result, fallback to random D6
      const sliderRoll = state.battleRoll ?? _rng.nextInt(1, 6);
      const result = resolveMonsterBattle(state.player, state.activeMonster, _rng, sliderRoll);
      const newLog = [...state.log, ...result.logs.map((l) => ({ ...l, turn: state.turnNumber }))];

      if (result.victory) {
        // Victory: advance turn, clear monster, go back to rolling
        set({
          player: result.updatedPlayer,
          phase: 'rolling', activeMonster: null, battleRoll: null,
          totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          dice: null, demonDice: null, isDouble: false, doubleCount: 0,
          shakeScreen: result.shake, showSparkles: result.sparkles,
          log: newLog,
        });
      } else {
        // Defeat: check for rematch first
        if (state.activeMonster.specialEffect === 'rematch' && result.updatedPlayer.hp > 0) {
          const stronger = { ...state.activeMonster, power: state.activeMonster.power + 2 };
          set({
            player: result.updatedPlayer,
            phase: 'battle', activeMonster: stronger, battleRoll: null,
            shakeScreen: result.shake, showSparkles: result.sparkles,
            log: newLog,
          });
        } else {
          set({
            player: result.updatedPlayer,
            phase: 'rolling', activeMonster: null, battleRoll: null,
            totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
            dice: null, demonDice: null, isDouble: false, doubleCount: 0,
            shakeScreen: result.shake, showSparkles: result.sparkles,
            log: newLog,
          });
        }
      }

      if (result.shake) setTimeout(() => set({ shakeScreen: false }), 600);
      if (result.sparkles) setTimeout(() => set({ showSparkles: false }), 2000);
    },

    resolveEventAction: () => {
      const state = get();
      if (state.phase !== 'event' || !state.pendingEventKind) return;

      const result = resolveEventV4(state.player, state.pendingEventKind, _rng);
      set({
        player: result.updatedPlayer, phase: 'rolling', pendingEventKind: null,
        totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
        dice: null, demonDice: null, isDouble: false, doubleCount: 0,
        shakeScreen: result.shake, showSparkles: result.sparkles,
        log: [...state.log, ...result.logs.map((l) => ({ ...l, turn: state.turnNumber }))],
      });
      if (result.shake) setTimeout(() => set({ shakeScreen: false }), 600);
      if (result.sparkles) setTimeout(() => set({ showSparkles: false }), 2000);
    },

    resolveGatekeeperAction: () => {
      const state = get();
      if (state.phase !== 'gatekeeper' || !state.activeGatekeeper) return;

      const gk = state.activeGatekeeper;
      const p = { ...state.player };
      const gkName = loc() === 'en' ? gk.nameEn : gk.name;
      const guardianDiceBonus = getGuardianDiceBonus(p.guardianCards, p.hp, p.maxHp);

      // GK-1 special: bonus from guardian cards held
      let extraBonus = 0;
      if (gk.id === 'gk-1') extraBonus = p.guardianCards.length;

      // Use timing slider result, fallback to random D6
      const roll = state.battleRoll ?? _rng.nextInt(1, 6);
      // GK-3 Cerberus Collar: if guardian-3 is owned, roll twice and take better
      let finalRoll = roll;
      if (p.guardianCards.some((g) => g.id === 'guardian-3')) {
        const secondRoll = _rng.nextInt(1, 6);
        finalRoll = Math.max(roll, secondRoll);
      }
      const total = finalRoll + guardianDiceBonus + extraBonus;

      if (total >= gk.power) {
        const newCircleId = (p.currentCircleId - 1) as 1|2|3|4|5|6|7|8|9;
        if (newCircleId >= 1) { p.currentCircleId = newCircleId; p.currentTileId = `c${newCircleId}-t0`; }
        // GK-4 Golden Golem: gamble win (D6=6) = 3x reward
        const rewardMult = (gk.id === 'gk-4' && state.battleRoll === 6) ? 3 : 1;
        p.hp = Math.min(p.maxHp, p.hp + gk.rewardHp * rewardMult);
        p.moveBonus = (p.moveBonus || 0) + gk.rewardMove;

        const guardian = getGuardian(gk.guardianId);
        if (guardian) p.guardianCards = [...p.guardianCards, guardian];

        const escaped = gk.id === 'gk-1';
        const circleName = loc() === 'en' ? `Circle ${newCircleId}` : `${newCircleId}층`;

        // Save Inferno completion
        if (escaped) {
          saveRealmCompletion('inferno', state.totalTurns);
          saveCollectedCards('inferno', p.guardianCards.map((g) => g.id));
        }

        set({
          player: p, activeGatekeeper: null, activeGuardianReward: guardian || null, showSparkles: true,
          phase: escaped ? 'gameOver' : 'guardianReward', escaped,
          log: [...state.log, { turn: state.turnNumber, message: t('gk.result.victory', loc(), { roll: total, power: gk.power, name: gkName, circle: circleName, hp: gk.rewardHp }), type: 'critical' }],
        });
      } else {
        const dmgReduction = getGuardianDamageReduction(p.guardianCards);
        const dmg = Math.max(1, gk.penaltyHp - dmgReduction);
        p.hp = Math.max(1, p.hp - dmg);

        // Pushback: move player back on the board
        for (let i = 0; i < gk.pushback; i++) {
          const cur = state.board.find((t) => t.id === p.currentTileId);
          if (!cur || cur.index === 0) break;
          const prev = state.board.find((t) => t.circleId === p.currentCircleId && t.index === cur.index - 1);
          if (prev) p.currentTileId = prev.id;
        }

        // Reset battle streak on gatekeeper defeat
        p.battleStreak = 0;

        set({
          player: p, phase: 'rolling', activeGatekeeper: null,
          totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          dice: null, demonDice: null, isDouble: false, doubleCount: 0, shakeScreen: true,
          log: [...state.log, { turn: state.turnNumber, message: t('gk.result.defeat', loc(), { roll: total, power: gk.power, name: gkName, hp: dmg, push: gk.pushback }), type: 'critical' }],
        });
        setTimeout(() => set({ shakeScreen: false }), 600);
      }
      setTimeout(() => set({ showSparkles: false }), 2000);
      // Reset battleRoll after use
      set({ battleRoll: null });
    },

    skipBattleAction: () => {
      const state = get();
      if (state.phase !== 'battle') return;
      const p = { ...state.player };
      p.guardianCards = p.guardianCards.filter((g) => g.id !== 'guardian-8');
      p.buffs.push({ id: 'mask_used', name: 'Mask Used', remainingTurns: 99, value: 0 });
      set({
        player: p, phase: 'rolling', activeMonster: null,
        totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
        dice: null, demonDice: null, isDouble: false, doubleCount: 0,
        log: [...state.log, { turn: state.turnNumber, message: t('battle.result.maskSkip', loc()), type: 'guardian' }],
      });
    },

    useGuardianAction: (guardianId: string) => {
      const state = get();
      const p = { ...state.player };
      if (guardianId === 'guardian-4') {
        const current = state.board.find((t) => t.id === p.currentTileId);
        if (current) {
          const target = state.board.find((t) => t.circleId === p.currentCircleId && t.index === Math.min(current.index + 3, 11));
          if (target) p.currentTileId = target.id;
        }
        p.buffs = p.buffs.filter((b) => b.id !== 'wings_cooldown');
        p.buffs.push({ id: 'wings_cooldown', name: 'Wings Cooldown', remainingTurns: 3, value: 0 });
        set({
          player: p,
          log: [...state.log, { turn: state.turnNumber, message: t('guardian.wingsUsed', loc()), type: 'guardian' }],
        });
      }
    },

    nextTurn: () => {
      const state = get();
      set({
        phase: 'rolling', turnNumber: state.turnNumber + 1, totalTurns: state.totalTurns + 1,
        dice: null, demonDice: null, isDouble: false, doubleCount: 0, battleRoll: null,
      });
    },

    clearEffects: () => set({ shakeScreen: false, showSparkles: false }),

    // ============================================================
    // Purgatorio Actions
    // ============================================================

    startPurgatorio: () => {
      const state = get();
      const purgatorioState = createPurgatorioGame(state.player);
      set({ ...purgatorioState } as Partial<GameState>);
    },

    rollPurgatorioDice: () => {
      const state = get();
      if (state.phase !== 'purgatorio_rolling') return;
      const p = { ...state.player, buffs: [...state.player.buffs] };

      if (p.isStunned) {
        p.isStunned = false;
        set({
          player: p, phase: 'purgatorio_rolling',
          turnNumber: state.turnNumber + 1, totalTurns: state.totalTurns + 1,
          log: [...state.log, { turn: state.turnNumber, message: t('system.stunned', loc()), type: 'system' }],
        });
        return;
      }

      p.buffs = p.buffs.map((b) => ({ ...b, remainingTurns: b.remainingTurns - 1 })).filter((b) => b.remainingTurns > 0);
      const poison = p.buffs.find((b) => b.id === 'poison');
      if (poison) p.hp = Math.max(0, p.hp + poison.value);

      // ── Demon vs User Dice Duel (Purgatorio) + Auto-Move ──
      const playerRoll = rollDice(_rng);
      const demonRoll = rollDice(_rng);
      const demonBonus = getDemonBonus(p.currentTerraceId ?? 7);
      const duel = resolveDiceDuel(playerRoll, demonRoll, demonBonus);

      const msgs: string[] = [];
      let showSparkles = false;
      let shakeScreen = false;

      if (duel.outcome === 'player_crit' || duel.outcome === 'player_win') {
        showSparkles = duel.outcome === 'player_crit';
        msgs.push(loc() === 'en' ? duel.message : duel.messageKo);
        if (playerRoll.isDouble && p.purificationCards.some((c) => c.id === 'purification-4')) {
          msgs.push(t('purgatorio.stepOfZeal', loc()));
        }

        const isDouble = playerRoll.isDouble;
        const doubleCount = isDouble ? state.purgatorioDoubleCount + 1 : 0;
        const totalMove = Math.max(1, playerRoll.sum + (p.moveBonus || 0));
        p.moveBonus = 0;

        // Auto-move
        const board = state.purgatorioBoard;
        const remaining = remainingTilesInTerrace(board, p.currentTileId);
        if (totalMove >= remaining) {
          const lastTile = board.find((t) => t.terraceId === p.currentTerraceId && t.index === 7);
          if (lastTile) p.currentTileId = lastTile.id;
          const angel = getAngelGuardian(p.currentTerraceId!);
          set({
            player: p, phase: 'purgatorio_angel', activeAngelGuardian: angel || null,
            purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
            log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
          });
        } else {
          let currentTile = board.find((t) => t.id === p.currentTileId);
          for (let i = 0; i < totalMove; i++) {
            if (!currentTile) break;
            const next = getNextPurgatorioTile(board, currentTile.id);
            if (!next) break;
            currentTile = next;
          }
          if (currentTile) { p.currentTileId = currentTile.id; p.currentTerraceId = currentTile.terraceId; }
          const tile = board.find((t) => t.id === p.currentTileId);
          if (tile?.type === 'sin' && tile.sinProjectionId) {
            const sinProj = getSinProjection(tile.sinProjectionId);
            set({
              player: p, phase: 'purgatorio_battle', activeSinProjection: sinProj || null,
              purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
              log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
            });
          } else if (tile?.type === 'event' && tile.eventKind) {
            set({
              player: p, phase: 'purgatorio_event', pendingEventKind: tile.eventKind,
              purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
              log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
            });
          } else {
            set({
              player: p, phase: 'purgatorio_rolling', totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
              purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
              log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
            });
          }
        }
      } else {
        shakeScreen = true;
        const dmg = duel.outcome === 'demon_crit' ? 5 : 3;
        p.hp = Math.max(0, p.hp - dmg);
        msgs.push(loc() === 'en' ? duel.message : duel.messageKo);
        set({
          player: p, purgatorioDice: playerRoll.dice, demonDice: demonRoll.dice,
          phase: 'purgatorio_rolling', totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          purgatorioIsDouble: false, purgatorioDoubleCount: 0, shakeScreen, showSparkles,
          log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
        });
      }
      if (showSparkles) setTimeout(() => set({ showSparkles: false }), 2000);
      if (shakeScreen) setTimeout(() => set({ shakeScreen: false }), 600);
    },

    movePurgatorioPlayer: () => {
      const state = get();
      if (state.phase !== 'purgatorio_moving') return;

      const totalMove = (state.purgatorioDice?.[0] ?? 0) + (state.purgatorioDice?.[1] ?? 0) + state.player.moveBonus;
      const p = { ...state.player, moveBonus: 0 };
      const board = state.purgatorioBoard;
      const remaining = remainingTilesInTerrace(board, p.currentTileId);

      // If overshoot → stop at angel gate
      if (totalMove >= remaining) {
        const lastTile = board.find(
          (t) => t.terraceId === p.currentTerraceId && t.index === 7
        );
        if (lastTile) p.currentTileId = lastTile.id;

        const angel = getAngelGuardian(p.currentTerraceId!);
        const angelName = loc() === 'en' ? (angel?.nameEn || '') : (angel?.name || '');

        set({
          player: p, phase: 'purgatorio_angel', activeAngelGuardian: angel || null,
          log: [...state.log, { turn: state.turnNumber, message: t('purgatorio.angelArrive', loc(), { name: angelName }), type: 'critical' }],
        });
        return;
      }

      // Move forward
      let currentTile = board.find((t) => t.id === p.currentTileId);
      for (let i = 0; i < totalMove; i++) {
        if (!currentTile) break;
        const next = getNextPurgatorioTile(board, currentTile.id);
        if (!next) break;
        currentTile = next;
      }
      if (currentTile) {
        p.currentTileId = currentTile.id;
        p.currentTerraceId = currentTile.terraceId;
      }

      const tile = board.find((t) => t.id === p.currentTileId);

      if (tile?.type === 'sin' && tile.sinProjectionId) {
        const sinProj = getSinProjection(tile.sinProjectionId);
        const sinName = (loc() === 'en' ? sinProj?.nameEn : sinProj?.name) || '';

        set({
          player: p, phase: 'purgatorio_battle', activeSinProjection: sinProj || null,
          log: [...state.log, { turn: state.turnNumber, message: t('purgatorio.battleArrive', loc(), { name: sinName }), type: 'battle' }],
        });
      } else if (tile?.type === 'event' && tile.eventKind) {
        set({
          player: p, phase: 'purgatorio_event', pendingEventKind: tile.eventKind,
          log: [...state.log, { turn: state.turnNumber, message: t('event.arrive', loc(), { label: tile.label, circle: p.currentTerraceId ?? 1 }), type: 'move' }],
        });
      } else {
        set({
          player: p, phase: 'purgatorio_rolling',
          totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
          log: [...state.log, { turn: state.turnNumber, message: t('event.arrive', loc(), { label: tile?.label || '?', circle: p.currentTerraceId ?? 1 }), type: 'move' }],
        });
      }
    },

    resolveSinChoice: (choiceIndex: 0 | 1) => {
      const state = get();
      if (state.phase !== 'purgatorio_battle' || !state.activeSinProjection) return;

      const sin = state.activeSinProjection;
      const p = { ...state.player };
      const choice = sin.choices[choiceIndex];
      const outcome = choice.outcome;

      // Apply Eye of Mercy: 50% negate bad outcomes
      let finalHp = outcome.hp;
      let finalMove = outcome.move;
      if (outcome.hp < 0 && p.purificationCards.some((c) => c.id === 'purification-2')) {
        if (_rng.next() < 0.5) { finalHp = 0; }
      }
      // Breath of Gentleness: +50% virtue
      let virtueGain = outcome.virtue;
      if (p.purificationCards.some((c) => c.id === 'purification-3') && virtueGain > 0) {
        virtueGain = Math.floor(virtueGain * 1.5);
      }
      // Flame of Purity: double all
      if (p.purificationCards.some((c) => c.id === 'purification-7')) {
        finalHp = finalHp > 0 ? finalHp * 2 : finalHp;
        virtueGain *= 2;
        finalMove *= 2;
      }
      // Hand of Poverty: +50% rewards
      if (p.purificationCards.some((c) => c.id === 'purification-5') && finalHp > 0) {
        finalHp = Math.floor(finalHp * 1.5);
      }

      p.hp = Math.max(0, Math.min(p.maxHp, p.hp + finalHp));
      p.moveBonus = Math.max(0, (p.moveBonus || 0) + finalMove);
      p.virtue = Math.max(-10, Math.min(10, (p.virtue || 0) + virtueGain));

      const choiceLabel = loc() === 'en' ? choice.labelEn : choice.label;
      const sinName = loc() === 'en' ? sin.nameEn : sin.name;
      const hpMsg = finalHp > 0 ? `+${finalHp} HP` : finalHp < 0 ? `${finalHp} HP` : '';
      const moveMsg = finalMove !== 0 ? ` 이동 ${finalMove > 0 ? '+' : ''}${finalMove}` : '';
      const virtueMsg = virtueGain !== 0 ? ` 덕목 ${virtueGain > 0 ? '+' : ''}${virtueGain}` : '';

      set({
        player: p, phase: 'purgatorio_rolling', activeSinProjection: null,
        totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
        purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
        showSparkles: finalHp > 0, shakeScreen: finalHp < -8,
        log: [...state.log, { turn: state.turnNumber, message: loc() === 'en' ? `🤔 "${sinName}": Chose "${choiceLabel}" → ${hpMsg}${moveMsg}${virtueMsg}` : `🤔 "${sinName}": "${choiceLabel}" 선택 → ${hpMsg}${moveMsg}${virtueMsg}`, type: finalHp >= 0 ? 'heal' : 'damage' }],
      });
      if (finalHp < -8) setTimeout(() => set({ shakeScreen: false }), 600);
      if (finalHp > 0) setTimeout(() => set({ showSparkles: false }), 2000);
    },

    resolvePurgatorioEvent: () => {
      const state = get();
      if (state.phase !== 'purgatorio_event' || !state.pendingEventKind) return;

      const result = resolvePurgatorioEvent(state.player, state.pendingEventKind, _rng);
      set({
        player: result.updatedPlayer, phase: 'purgatorio_rolling', pendingEventKind: null,
        totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
        purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
        shakeScreen: result.shake, showSparkles: result.sparkles,
        log: [...state.log, ...result.logs.map((l) => ({ ...l, turn: state.turnNumber }))],
      });
      if (result.shake) setTimeout(() => set({ shakeScreen: false }), 600);
      if (result.sparkles) setTimeout(() => set({ showSparkles: false }), 2000);
    },

    resolvePurgatorioAngel: () => {
      const state = get();
      if (state.phase !== 'purgatorio_angel' || !state.activeAngelGuardian) return;

      const angel = state.activeAngelGuardian;
      const purification = getPurificationCard(angel.purificationId);
      if (!purification) return;

      // Use shared angel battle resolution
      const result = resolveAngelBattle(state.player, angel, purification, _rng, state.battleRoll ?? undefined);

      if (result.victory) {
        const p = result.updatedPlayer;
        // Move to next terrace
        const newTerraceId = Math.min(7, (p.currentTerraceId || 1) + 1) as 1|2|3|4|5|6|7;
        p.currentTerraceId = newTerraceId;
        p.currentTileId = `t${newTerraceId}-p0`;

        // Check if Purgatorio is complete (Angel-7 defeated)
        const completed = checkPurgatorioComplete(p);

        // Save Purgatorio completion
        if (completed) {
          saveRealmCompletion('purgatorio', state.totalTurns);
          saveCollectedCards('purgatorio', p.purificationCards.map((c) => c.id));
        }

        set({
          player: p, activeAngelGuardian: null, activePurificationReward: purification,
          phase: completed ? 'gameOver' : 'purgatorio_purification',
          escaped: completed ? true : state.escaped,
          showSparkles: true,
          log: [...state.log, ...result.logs.map((l) => ({ ...l, turn: state.turnNumber }))],
        });
      } else {
        set({
          player: result.updatedPlayer,
          phase: 'purgatorio_rolling', activeAngelGuardian: null,
          totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
          shakeScreen: result.shake,
          log: [...state.log, ...result.logs.map((l) => ({ ...l, turn: state.turnNumber }))],
        });
        if (result.shake) setTimeout(() => set({ shakeScreen: false }), 600);
      }
      setTimeout(() => set({ showSparkles: false }), 2000);
      set({ battleRoll: null });
    },

    skipPurgatorioBattle: () => {
      const state = get();
      if (state.phase !== 'purgatorio_battle') return;
      const p = { ...state.player };
      // Use Angel Feather if available
      const hasFeather = p.buffs.some((b) => b.id === 'angel_feather');
      if (!hasFeather) return;
      p.buffs = p.buffs.filter((b) => b.id !== 'angel_feather');
      set({
        player: p, phase: 'purgatorio_rolling', activeSinProjection: null, battleRoll: null,
        totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
        purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0,
        log: [...state.log, { turn: state.turnNumber, message: t('purgatorio.eventAngelFeather', loc()), type: 'guardian' }],
      });
    },

    nextPurgatorioTurn: () => {
      const state = get();
      set({
        phase: 'purgatorio_rolling', turnNumber: state.turnNumber + 1, totalTurns: state.totalTurns + 1,
        purgatorioDice: null, demonDice: null, purgatorioIsDouble: false, purgatorioDoubleCount: 0, battleRoll: null,
        activePurificationReward: null,
      });
    },

    // ============================================================
    // Paradiso Actions
    // ============================================================

    startParadiso: () => {
      const state = get();
      const paradisoState = createParadisoGame(state.player);
      set({ ...paradisoState } as Partial<GameState>);
    },

    rollParadisoDice: () => {
      const state = get();
      if (state.phase !== 'paradiso_rolling') return;
      const p = { ...state.player, buffs: [...state.player.buffs] };

      // ── Demon vs User Dice Duel (Paradiso 3D4) + Auto-Move ──
      const d1 = _rng.nextInt(1, 4);
      const d2 = _rng.nextInt(1, 4);
      const d3 = _rng.nextInt(1, 4);
      const dice: [number, number] = [d1 + d2, d3];
      const sum = d1 + d2 + d3;
      const isTriple = d1 === d2 && d2 === d3;
      const isDouble = (d1 === d2) || (d2 === d3) || (d1 === d3);

      const dd1 = _rng.nextInt(1, 4);
      const dd2 = _rng.nextInt(1, 4);
      const dd3 = _rng.nextInt(1, 4);
      const demonSum = dd1 + dd2 + dd3;
      const demonBonus = getDemonBonus(p.currentSphereId ?? 9);

      const playerWins = isTriple || (!(dd1 === dd2 && dd2 === dd3) && (isDouble || sum > demonSum + demonBonus));

      const msgs: string[] = [];
      let showSparkles = false;

      if (playerWins) {
        if (isTriple) { showSparkles = true; p.grace = Math.min(150, (p.grace || 0) + 10); }
        else if (isDouble) p.grace = Math.min(150, (p.grace || 0) + 5);
        msgs.push(loc() === 'en'
          ? `⚔ You win! [${d1}][${d2}][${d3}] = ${sum} vs Demon ${demonSum}+${demonBonus} = ${demonSum + demonBonus}`
          : `⚔ 승리! [${d1}][${d2}][${d3}] = ${sum} vs 악마 ${demonSum}+${demonBonus} = ${demonSum + demonBonus}`);

        // Auto-move
        const totalMove = Math.max(1, sum + (p.moveBonus || 0));
        p.moveBonus = 0;
        const board = state.paradisoBoard;
        const remaining = remainingTilesInSphere(board, p.currentTileId);
        if (totalMove >= remaining) {
          const lastTile = board.find((t) => t.sphereId === p.currentSphereId && t.index === 9);
          if (lastTile) p.currentTileId = lastTile.id;
          const archangel = getArchangel(p.currentSphereId!);
          set({
            player: p, phase: 'paradiso_archangel', activeArchangel: archangel || null,
            paradisoDice: null, demonDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0, showSparkles,
            log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
          });
        } else {
          let currentTile = board.find((t) => t.id === p.currentTileId);
          for (let i = 0; i < totalMove; i++) {
            if (!currentTile) break;
            const next = getNextParadisoTile(board, currentTile.id);
            if (!next) break;
            currentTile = next;
          }
          if (currentTile) { p.currentTileId = currentTile.id; p.currentSphereId = currentTile.sphereId; }
          const tile = board.find((t) => t.id === p.currentTileId);
          if (tile?.type === 'spirit' && tile.spiritId) {
            const spirit = getLightSpirit(tile.spiritId);
            set({
              player: p, phase: 'paradiso_blessing', activeLightSpirit: spirit || null,
              paradisoDice: null, demonDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0,
              log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
            });
          } else if (tile?.type === 'blessing') {
            const bonus = _rng.nextInt(2, 5);
            p.grace = Math.min(150, (p.grace || 0) + bonus);
            set({
              player: p, phase: 'paradiso_rolling', totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
              paradisoDice: null, demonDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0,
              log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
            });
          } else {
            set({
              player: p, phase: 'paradiso_rolling', totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
              paradisoDice: null, demonDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0,
            });
          }
        }
      } else {
        const graceLoss = 3;
        p.grace = Math.max(0, (p.grace || 0) - graceLoss);
        msgs.push(loc() === 'en'
          ? `💀 Demon wins! [${dd1}][${dd2}][${dd3}]+${demonBonus} = ${demonSum + demonBonus} beats your ${sum}. -${graceLoss} Grace!`
          : `💀 악마 승리! [${dd1}][${dd2}][${dd3}]+${demonBonus} = ${demonSum + demonBonus}이 ${sum}를 이겼다. 은총 -${graceLoss}!`);
        set({
          player: p, paradisoDice: dice, demonDice: null,
          phase: 'paradiso_rolling', totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          paradisoIsDouble: false, paradisoDoubleCount: 0,
          log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
        });
      }
      if (showSparkles) setTimeout(() => set({ showSparkles: false }), 2000);
    },

    moveParadisoPlayer: () => {
      const state = get();
      if (state.phase !== 'paradiso_moving') return;

      const dice = state.paradisoDice;
      const totalMove = (dice?.[0] ?? 0) + (dice?.[1] ?? 0) + state.player.moveBonus;
      const p = { ...state.player, moveBonus: 0 };
      const board = state.paradisoBoard;
      const remaining = remainingTilesInSphere(board, p.currentTileId);

      // Lunar Chalice: +1 grace per turn
      if (p.celestialRelics.some((c) => c.id === 'relic-1')) {
        p.grace = Math.min(150, (p.grace || 0) + 1);
      }

      if (totalMove >= remaining) {
        const lastTile = board.find((t) => t.sphereId === p.currentSphereId && t.index === 9);
        if (lastTile) p.currentTileId = lastTile.id;

        const archangel = getArchangel(p.currentSphereId!);
        const archName = loc() === 'en' ? (archangel?.nameEn || '') : (archangel?.name || '');

        set({
          player: p, phase: 'paradiso_archangel', activeArchangel: archangel || null,
          log: [...state.log, { turn: state.turnNumber, message: loc() === 'en' ? `👼 Archangel "${archName}" appears!` : `👼 대천사 "${archName}" 등장!`, type: 'critical' }],
        });
        return;
      }

      let currentTile = board.find((t) => t.id === p.currentTileId);
      for (let i = 0; i < totalMove; i++) {
        if (!currentTile) break;
        const next = getNextParadisoTile(board, currentTile.id);
        if (!next) break;
        currentTile = next;
      }
      if (currentTile) {
        p.currentTileId = currentTile.id;
        p.currentSphereId = currentTile.sphereId;
      }

      const tile = board.find((t) => t.id === p.currentTileId);

      if (tile?.type === 'spirit' && tile.spiritId) {
        const spirit = getLightSpirit(tile.spiritId);
        const spiritName = (loc() === 'en' ? spirit?.nameEn : spirit?.name) || '';

        set({
          player: p, phase: 'paradiso_blessing', activeLightSpirit: spirit || null,
          log: [...state.log, { turn: state.turnNumber, message: loc() === 'en' ? `✨ ${spiritName} appears!` : `✨ ${spiritName} 등장!`, type: 'system' }],
        });
      } else if (tile?.type === 'blessing') {
        // Auto-blessing: small grace boost
        const bonus = _rng.nextInt(2, 5);
        p.grace = Math.min(150, (p.grace || 0) + bonus);
        set({
          player: p, phase: 'paradiso_rolling',
          totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          paradisoDice: null, demonDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0,
          log: [...state.log, { turn: state.turnNumber, message: loc() === 'en' ? `🌟 Blessing: +${bonus} Grace (${p.grace})` : `🌟 축복: 은총 +${bonus} (${p.grace})`, type: 'heal' }],
        });
      } else {
        set({
          player: p, phase: 'paradiso_rolling',
          totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          paradisoDice: null, demonDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0,
        });
      }
    },

    resolveParadisoBlessing: () => {
      const state = get();
      if (state.phase !== 'paradiso_blessing' || !state.activeLightSpirit) return;

      const spirit = state.activeLightSpirit;
      const p = { ...state.player };
      let graceGain = spirit.graceGift;

      // Rosary of Love: +50% grace
      if (p.celestialRelics.some((c) => c.id === 'relic-3')) {
        graceGain = Math.floor(graceGain * 1.5);
      }

      p.grace = Math.min(150, (p.grace || 0) + graceGain);
      const bonusText = loc() === 'en' ? (spirit.bonusGiftEn ? ` + ${spirit.bonusGiftEn}` : '') : (spirit.bonusGift ? ` + ${spirit.bonusGift}` : '');
      const spiritName = loc() === 'en' ? spirit.nameEn : spirit.name;

      set({
        player: p, phase: 'paradiso_rolling', activeLightSpirit: null,
        totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
        paradisoDice: null, demonDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0, showSparkles: true,
        log: [...state.log, { turn: state.turnNumber, message: loc() === 'en' ? `✨ ${spiritName} blesses you! +${graceGain} Grace${bonusText} (${p.grace})` : `✨ ${spiritName}의 축복! 은총 +${graceGain}${bonusText} (${p.grace})`, type: 'heal' }],
      });
      setTimeout(() => set({ showSparkles: false }), 2000);
    },

    resolveParadisoArchangel: () => {
      const state = get();
      if (state.phase !== 'paradiso_archangel' || !state.activeArchangel) return;

      const archangel = state.activeArchangel;
      const p = { ...state.player };
      const roll = state.battleRoll ?? _rng.nextInt(1, 6);
      // With good roll (4+), pass the trial
      const success = roll >= 4;

      if (success) {
        const newSphereId = Math.min(9, (p.currentSphereId || 1) + 1) as 1|2|3|4|5|6|7|8|9;
        p.currentSphereId = newSphereId;
        p.currentTileId = `s${newSphereId}-q0`;
        p.grace = Math.min(150, (p.grace || 0) + archangel.graceBlessing);

        const relic = getRelic(archangel.relicId);
        if (relic) p.celestialRelics = [...p.celestialRelics, relic];

        const completed = checkParadisoComplete(p);
        if (completed) {
          saveRealmCompletion('paradiso', state.totalTurns);
          saveCollectedCards('paradiso', p.celestialRelics.map((r) => r.id));
        }

        const archName = loc() === 'en' ? archangel.nameEn : archangel.name;
        set({
          player: p, activeArchangel: null, activeCelestialReward: relic,
          phase: completed ? 'gameOver' : 'paradiso_relic', escaped: completed,
          showSparkles: true,
          log: [...state.log, { turn: state.turnNumber, message: loc() === 'en' ? `👼✨ ${archName} trial passed! +${archangel.graceBlessing} Grace!` : `👼✨ ${archName}의 시험 통과! 은총 +${archangel.graceBlessing}!`, type: 'critical' }],
        });
      } else {
        p.grace = Math.max(0, (p.grace || 0) - 3);
        const archName = loc() === 'en' ? archangel.nameEn : archangel.name;
        set({
          player: p, phase: 'paradiso_rolling', activeArchangel: null,
          totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
          paradisoDice: null, demonDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0,
          log: [...state.log, { turn: state.turnNumber, message: loc() === 'en' ? `💫 ${archName} gazes calmly. Grace -3. Try again.` : `💫 ${archName}이 조용히 바라본다. 은총 -3. 다시 시도하세요.`, type: 'system' }],
        });
      }
      setTimeout(() => set({ showSparkles: false }), 2000);
      set({ battleRoll: null });
    },

    nextParadisoTurn: () => {
      const state = get();
      set({
        phase: 'paradiso_rolling', turnNumber: state.turnNumber + 1, totalTurns: state.totalTurns + 1,
        paradisoDice: null, demonDice: null, paradisoIsDouble: false, paradisoDoubleCount: 0, battleRoll: null,
        activeCelestialReward: null,
      });
    },
  };
});
