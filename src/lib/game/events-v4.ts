import type { Player, LogEntry, EventKind } from '@/types/game';
import type { RNG } from '@/lib/utils/random';
import { t, getActiveLocale } from '@/lib/i18n/translations';
import { getGuardianTrapReduction } from './guardian';
import { CURSES } from '@/lib/data/curses';
import { CONSUMABLES } from '@/lib/data/consumables';

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
    case 'starlight': return resolveStarlight(player, rng);
    case 'altar':    return resolveAltar(player, rng);
    case 'shop':     return resolveShop(player, rng);
    case 'wheel':    return resolveWheel(player, rng);
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

// ── NEW V0.2 Events ──

function resolveStarlight(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  const roll = rng.next();
  let message = '';
  if (roll < 0.3) {
    const consumable = CONSUMABLES[rng.nextInt(0, CONSUMABLES.length - 1)];
    p.consumables = [...p.consumables, consumable];
    message = loc === 'en' ? `✨ Starlight Box: Got ${consumable.nameEn}!` : `✨ 별빛 상자: ${consumable.name} 획득!`;
  } else if (roll < 0.6) {
    const heal = rng.nextInt(10, 30);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    message = loc === 'en' ? `✨ Starlight Box: +${heal} HP!` : `✨ 별빛 상자: HP +${heal}!`;
  } else if (roll < 0.85) {
    p.soulStones = (p.soulStones || 0) + rng.nextInt(1, 3);
    message = loc === 'en' ? `✨ Starlight Box: +${p.soulStones} Soul Stones!` : `✨ 별빛 상자: 영혼석 +${p.soulStones}!`;
  } else {
    const curse = CURSES[rng.nextInt(0, CURSES.length - 1)];
    p.curseCards = [...p.curseCards, curse];
    message = loc === 'en' ? `💀 Starlight Box: Curse ${curse.nameEn}...` : `💀 별빛 상자: 저주 ${curse.name}...`;
  }
  return { updatedPlayer: p, logs: [{ turn: 0, message, type: 'heal' }], shake: false, sparkles: true };
}

function resolveAltar(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  const curse = CURSES.find((c) => c.circleId === p.currentCircleId) || CURSES[rng.nextInt(0, CURSES.length - 1)];
  p.curseCards = [...p.curseCards, curse];
  const heal = rng.nextInt(15, 30);
  p.hp = Math.min(p.maxHp, p.hp + heal);
  return {
    updatedPlayer: p,
    logs: [{
      turn: 0,
      message: loc === 'en'
        ? `💀 Altar: Curse ${curse.nameEn} acquired! But +${heal} HP...`
        : `💀 제단: 저주 ${curse.name} 획득! 대신 HP +${heal}...`,
      type: 'damage',
    }],
    shake: true, sparkles: true,
  };
}

function resolveShop(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  const item = CONSUMABLES[rng.nextInt(0, CONSUMABLES.length - 1)];
  if ((p.soulStones || 0) >= item.cost) {
    p.soulStones = (p.soulStones || 0) - item.cost;
    p.consumables = [...p.consumables, item];
    return {
      updatedPlayer: p,
      logs: [{
        turn: 0,
        message: loc === 'en'
          ? `🏪 Merchant: Bought ${item.nameEn} for ${item.cost} stones!`
          : `🏪 상인: ${item.cost}석으로 ${item.name} 구매!`,
        type: 'heal',
      }],
      shake: false, sparkles: true,
    };
  }
  return {
    updatedPlayer: p,
    logs: [{
      turn: 0,
      message: loc === 'en'
        ? `🏪 Merchant: "Not enough stones..." (${item.cost} needed)`
        : `🏪 상인: "영혼석이 부족하다..." (${item.cost}석 필요)`,
      type: 'system',
    }],
    shake: false, sparkles: false,
  };
}

function resolveWheel(player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const loc = getActiveLocale();
  const roll = rng.next();
  if (roll < 0.15) {
    const heal = rng.nextInt(30, 50);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    p.soulStones = (p.soulStones || 0) + 5;
    return {
      updatedPlayer: p,
      logs: [{ turn: 0, message: loc === 'en' ? `🎰 JACKPOT! +${heal} HP +5 Stones!` : `🎰 대박! HP +${heal} 영혼석 +5!`, type: 'heal' }],
      shake: false, sparkles: true,
    };
  } else if (roll < 0.4) {
    const heal = rng.nextInt(10, 20);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    return {
      updatedPlayer: p,
      logs: [{ turn: 0, message: loc === 'en' ? `🎰 Win! +${heal} HP` : `🎰 당첨! HP +${heal}`, type: 'heal' }],
      shake: false, sparkles: false,
    };
  } else if (roll < 0.7) {
    const dmg = rng.nextInt(5, 15);
    p.hp = Math.max(0, p.hp - dmg);
    return {
      updatedPlayer: p,
      logs: [{ turn: 0, message: loc === 'en' ? `🎰 Lose... -${dmg} HP` : `🎰 꽝... HP -${dmg}`, type: 'damage' }],
      shake: true, sparkles: false,
    };
  } else {
    const curse = CURSES[rng.nextInt(0, CURSES.length - 1)];
    p.curseCards = [...p.curseCards, curse];
    return {
      updatedPlayer: p,
      logs: [{ turn: 0, message: loc === 'en' ? `🎰 CURSE! ${curse.nameEn}...` : `🎰 저주! ${curse.name}...`, type: 'damage' }],
      shake: true, sparkles: false,
    };
  }
}
