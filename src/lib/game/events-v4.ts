import type { Player, LogEntry, EventKind } from '@/types/game';
import type { RNG } from '@/lib/utils/random';
import { t, getActiveLocale } from '@/lib/i18n/translations';
import { getGuardianTrapReduction } from './guardian';

export interface EventResult {
  updatedPlayer: Player;
  logs: LogEntry[];
  shake: boolean;
  sparkles: boolean;
}

export function resolveEventV4(player: Player, eventKind: EventKind, rng: RNG): EventResult {
  switch (eventKind) {
    case 'rest':     return resolveRest(player, rng);
    case 'trap':     return resolveTrap(player, rng);
    case 'blessing': return resolveBlessing(player, rng);
    case 'curse':    return resolveCurse(player, rng);
    case 'treasure': return resolveTreasure(player, rng);
    case 'choice':   return resolveChoiceEvent(player, rng);
    default:         return { updatedPlayer: { ...player }, logs: [], shake: false, sparkles: false };
  }
}

function resolveChoiceEvent(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  // 50/50 risky gamble
  if (rng.next() < 0.5) {
    const heal = rng.nextInt(12, 25);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    p.moveBonus = (p.moveBonus || 0) + rng.nextInt(1, 3);
    return { updatedPlayer: p, logs: [{ turn: 0, message: t('event.choice.greatSuccess', loc, { hp: heal, move: p.moveBonus }), type: 'heal' }], shake: false, sparkles: true };
  }
  const dmg = rng.nextInt(5, 12);
  p.hp = Math.max(0, p.hp - dmg);
  return { updatedPlayer: p, logs: [{ turn: 0, message: t('event.choice.fail', loc, { hp: dmg }), type: 'damage' }], shake: true, sparkles: false };
}

function resolveTreasure(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  const tipe = rng.nextInt(1, 3);
  if (tipe === 1) {
    const heal = rng.nextInt(15, 30);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    return { updatedPlayer: p, logs: [{ turn: 0, message: t('event.blessing.heal', loc, { hp: heal }), type: 'heal' }], shake: false, sparkles: true };
  }
  p.moveBonus = (p.moveBonus || 0) + rng.nextInt(1, 4);
  return { updatedPlayer: p, logs: [{ turn: 0, message: t('event.blessing.move', loc, { n: p.moveBonus }), type: 'system' }], shake: false, sparkles: true };
}

function resolveRest(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  const heal = rng.nextInt(8, 18);
  p.hp = Math.min(p.maxHp, p.hp + heal);
  return {
    updatedPlayer: p,
    logs: [{ turn: 0, message: t('event.rest', loc, { hp: heal, curr: p.hp, max: p.maxHp }), type: 'heal' }],
    shake: false, sparkles: false,
  };
}

function resolveTrap(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  let dmg = rng.nextInt(4, 10);
  const reduction = getGuardianTrapReduction(p.guardianCards);
  if (reduction > 0) {
    dmg = Math.floor(dmg * (1 - reduction));
  }
  p.hp = Math.max(0, p.hp - dmg);
  const key = reduction > 0 ? 'event.trap.reduced' : 'event.trap';
  return {
    updatedPlayer: p,
    logs: [{ turn: 0, message: t(key, loc, { hp: dmg, curr: p.hp, max: p.maxHp }), type: 'damage' }],
    shake: dmg >= 8, sparkles: false,
  };
}

function resolveBlessing(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  const tipe = rng.nextInt(1, 2);
  if (tipe === 1) {
    const heal = rng.nextInt(10, 25);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    return { updatedPlayer: p, logs: [{ turn: 0, message: t('event.blessing.heal', loc, { hp: heal }), type: 'heal' }], shake: false, sparkles: true };
  }
  p.moveBonus = (p.moveBonus || 0) + rng.nextInt(1, 3);
  return { updatedPlayer: p, logs: [{ turn: 0, message: t('event.blessing.move', loc, { n: p.moveBonus }), type: 'system' }], shake: false, sparkles: true };
}

function resolveCurse(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  const tipe = rng.nextInt(1, 2);
  if (tipe === 1) {
    const dmg = rng.nextInt(3, 8);
    p.hp = Math.max(0, p.hp - dmg);
    return { updatedPlayer: p, logs: [{ turn: 0, message: t('event.curse.damage', loc, { hp: dmg }), type: 'damage' }], shake: true, sparkles: false };
  }
  p.isStunned = true;
  return { updatedPlayer: p, logs: [{ turn: 0, message: t('event.curse.stun', loc), type: 'system' }], shake: false, sparkles: false };
}
