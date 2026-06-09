'use client';

import { create } from 'zustand';
import type { GameState } from '@/types/game';
import { createNewGameV4 } from '@/lib/game/engine';
import { rollDice } from '@/lib/game/dice';
import { getNextTileV4, remainingTilesInCircle } from '@/lib/game/board-v4';
import { resolveMonsterBattle } from '@/lib/game/battle';
import { resolveEventV4 } from '@/lib/game/events-v4';
import { getGuardianDiceBonus, getGuardianDamageReduction } from '@/lib/game/guardian';
import { getMonster } from '@/lib/data/monsters';
import { getGatekeeper } from '@/lib/data/gatekeepers';
import { getGuardian } from '@/lib/data/guardians';
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
    },
    board: [],
    dice: null, isDouble: false, doubleCount: 0,
    turnNumber: 1, log: [],
    activeMonster: null, activeGatekeeper: null, activeGuardianReward: null,
    pendingEventKind: null, battleRoll: null, defeatGatekeeperOnArrival: null,
    shakeScreen: false, showSparkles: false,
    escaped: false, totalTurns: 0,

    initGame: () => {
      _rng = createRNG(timeSeed());
      set({ ...createNewGameV4(), phase: 'rolling' });
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

      const result = rollDice(_rng);
      const totalMove = result.sum + p.moveBonus;
      const isDouble = result.isDouble;
      const doubleCount = isDouble ? state.doubleCount + 1 : 0;

      if (result.isSnakeEyes) p.hp = Math.max(0, p.hp - 3);

      const msgs: string[] = [];
      let showSparkles = false;
      let shakeScreen = false;

      if (result.isSnakeEyes) {
        shakeScreen = true;
        msgs.push(t('dice.snakeEyes', loc(), { d1: result.dice[0], d2: result.dice[1], sum: result.sum }));
      } else if (result.isBoxcar) {
        showSparkles = true;
        msgs.push(t('dice.boxcar', loc(), { d1: result.dice[0], d2: result.dice[1], sum: result.sum }));
      } else if (isDouble) {
        msgs.push(t('dice.normal', loc(), { d1: result.dice[0], d2: result.dice[1], raw: result.sum, total: totalMove }));
        msgs.push(t('dice.double', loc()));
      } else {
        msgs.push(t('dice.normal', loc(), { d1: result.dice[0], d2: result.dice[1], raw: result.sum, total: totalMove }));
      }

      set({
        player: p, dice: result.dice, isDouble: result.isDouble, doubleCount,
        phase: 'moving', shakeScreen, showSparkles,
        log: [...state.log, ...msgs.map((m) => ({ turn: state.turnNumber, message: m, type: 'roll' as const }))],
      });
      if (showSparkles) setTimeout(() => set({ showSparkles: false }), 2000);
    },

    movePlayerAction: () => {
      const state = get();
      if (state.phase !== 'moving') return;

      const totalMove = (state.dice?.[0] ?? 0) + (state.dice?.[1] ?? 0) + state.player.moveBonus;
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
          player: p, phase: 'gatekeeper', activeGatekeeper: gk || null,
          log: [...state.log, { turn: state.turnNumber, message: t('gk.arrive', loc(), { name: gkName }), type: 'critical' }],
        });
        return;
      }

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
          dice: null, isDouble: false, doubleCount: 0,
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

      if (result.victory || !result.victory) {
        set({
          player: result.updatedPlayer,
          shakeScreen: result.shake, showSparkles: result.sparkles,
        });

        if (result.victory) {
          set({
            phase: 'rolling', activeMonster: null, battleRoll: null,
            totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
            dice: null, isDouble: false, doubleCount: 0, log: newLog,
          });
        } else {
          // Check for rematch
          if (state.activeMonster.specialEffect === 'rematch' && result.updatedPlayer.hp > 0) {
            const stronger = { ...state.activeMonster, power: state.activeMonster.power + 2 };
            set({ phase: 'battle', activeMonster: stronger, log: newLog, battleRoll: null });
          } else {
            set({
              phase: 'rolling', activeMonster: null, battleRoll: null,
              totalTurns: state.totalTurns + 1, turnNumber: state.turnNumber + 1,
              dice: null, isDouble: false, doubleCount: 0, log: newLog,
            });
          }
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
        dice: null, isDouble: false, doubleCount: 0,
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
          dice: null, isDouble: false, doubleCount: 0, shakeScreen: true,
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
        dice: null, isDouble: false, doubleCount: 0,
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
        dice: null, isDouble: false, doubleCount: 0, battleRoll: null,
      });
    },

    clearEffects: () => set({ shakeScreen: false, showSparkles: false }),
  };
});
