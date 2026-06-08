import type { GameState, Player, Tile, LogEntry, ChoiceData, GatekeeperData, CircleId } from '@/types/game';
import { rollD6 } from './dice';
import { getNextTile, getCircleStartTile } from './board';
import { CIRCLES } from '@/lib/data/circles';
import { t, getActiveLocale } from '@/lib/i18n/translations';
import type { RNG } from '@/lib/utils/random';
import { getRandomMission } from '@/lib/data/missions';
import { resolveMission } from './missions';
import { getGatekeeper } from '@/lib/data/gatekeepers';

export interface EventResult {
  logs: LogEntry[];
  drawTarot: boolean;
  updatedPlayer: Player;
  choiceData: ChoiceData | null;
  gatekeeperData: GatekeeperData | null;
  shake: boolean;
  sparkles: boolean;
}

export function resolveTileEvent(
  state: GameState,
  player: Player,
  tile: Tile,
  rng: RNG
): EventResult {
  switch (tile.type) {
    case 'trap':     return resolveTrap(state, player, rng);
    case 'battle':   return resolveBattle(state, player, rng);
    case 'tarot':    return resolveTarotDraw(player);
    case 'rest':     return resolveRest(player, rng);
    case 'shop':     return resolveShop(player, rng);
    case 'gate':     return resolveGate(state, player);
    case 'curse':    return resolveCurse(player, rng);
    case 'blessing': return resolveBlessing(player, rng);
    case 'trial':    return resolveTrial(state, player, rng);
    case 'treasure': return resolveTreasure(player, rng);
    case 'choice':   return resolveChoice(state, player, rng);
    case 'mission':  return resolveMissionEvent(state, player, tile, rng);
    default:         return resolveNormal(player, rng);
  }
}

function base(p: Player): EventResult {
  return { logs: [], drawTarot: false, updatedPlayer: p, choiceData: null, gatekeeperData: null, shake: false, sparkles: false };
}

// ============================================================
function resolveNormal(_player: Player, rng: RNG): EventResult {
  const p = { ..._player, momentum: _player.momentum + 1 };
  const msg = t(`event.normal.${rng.nextInt(1, 7)}`, getActiveLocale());
  if (p.momentum >= 5 && p.hp < p.maxHp) {
    const heal = rng.nextInt(2, 4);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    p.momentum = 0;
    return { ...base(p), logs: [{ turn: 0, message: t('system.momentum' , getActiveLocale(), { msg, heal }), type: 'heal' }] };
  }
  return { ...base(p), logs: [{ turn: 0, message: msg, type: 'system' }] };
}

// ============================================================
function resolveTrap(_state: GameState, player: Player, rng: RNG): EventResult {
  const p = { ...player, battleStreak: 0, momentum: 0 };
  if (p.trapImmunity) { p.trapImmunity = false; return { ...base(p), logs: [{ turn: 0, message: t('event.trap.immune', getActiveLocale()), type: 'event' }] }; }
  if (p.shieldTurns > 0) return { ...base(p), logs: [{ turn: 0, message: t('event.trap.shield' , getActiveLocale(), { n: p.shieldTurns }), type: 'event' }] };

  const trapType = rng.nextInt(1, 6);
  let dmg: number; let msgKey: string; let shake = false;
  switch (trapType) {
    case 1: dmg = rng.nextInt(4, 8); msgKey = 'event.trap.spike'; break;
    case 2: dmg = rng.nextInt(3, 6); msgKey = 'event.trap.gas'; break;
    case 3: dmg = rng.nextInt(5, 10); msgKey = 'event.trap.collapse'; shake = true; break;
    case 4: dmg = rng.nextInt(3, 7); msgKey = 'event.trap.chains'; p.isStunned = true; break;
    case 5: dmg = rng.nextInt(2, 6); msgKey = 'event.trap.pit'; break;
    case 6: dmg = rng.nextInt(6, 12); msgKey = 'event.trap.lightning'; shake = true; break;
    default: dmg = rng.nextInt(4, 8); msgKey = 'event.trap.spike';
  }
  p.hp = Math.max(0, p.hp - dmg);
  let msg = t(msgKey , getActiveLocale(), { n: dmg });
  if (p.hp > 0 && p.hp <= 20) msg += t('system.hpCritical' , getActiveLocale(), { hp: p.hp });
  const result = base(p); result.logs = [{ turn: 0, message: msg, type: 'damage' }]; result.shake = shake;
  return result;
}

// ============================================================
function resolveBattle(_state: GameState, player: Player, rng: RNG): EventResult {
  const p = { ...player, momentum: 0 };
  if (p.battleBuff) {
    p.battleBuff = false; p.battleStreak = (p.battleStreak || 0) + 1;
    const heal = p.battleStreak >= 3 ? 10 : 5;
    p.hp = Math.min(p.maxHp, p.hp + heal);
    const streakStr = p.battleStreak >= 3 ? t('event.battle.streak3' , getActiveLocale(), { n: p.battleStreak }) : '';
    const result = base(p); result.sparkles = p.battleStreak >= 5;
    result.logs = [{ turn: 0, message: `${t('event.battle.buff', getActiveLocale())}${streakStr} (+${heal} HP)`, type: 'battle' }];
    return result;
  }

  const monsterKeys = ['cerberus','minotaur','harpy','hellLion','plutus','specter','styxWraith','fireSpirit','iceGolem','shadowBeast','rockGiant','whipDemon','demonLord'];
  const powers = [5,6,4,6,7,5,5,6,7,5,6,5,8];
  const tiers = [1,1,1,2,2,1,1,2,2,1,2,1,3];
  const idx = rng.nextInt(0, monsterKeys.length - 1);
  const mKey = monsterKeys[idx];
  const monsterName = t(`monster.${mKey}`, getActiveLocale());
  const monsterPower = powers[idx];
  const monsterTier = tiers[idx];
  const monsterDesc = t(`monster.desc.${idx}`, getActiveLocale());
  const playerRoll = rollD6(rng) + 1;
  const isCrit = playerRoll === 7;

  if (playerRoll >= monsterPower) {
    p.battleStreak = (p.battleStreak || 0) + 1;
    const streak = p.battleStreak;
    let bonusHeal = 0; let sparkles = false; let msg: string;
    if (isCrit && monsterTier >= 2) {
      bonusHeal = 12; sparkles = true;
      msg = t('event.battle.crit' , getActiveLocale(), { monster: monsterName, power: monsterPower });
    } else if (playerRoll === monsterPower) {
      bonusHeal = 3;
      msg = t('event.battle.closeWin' , getActiveLocale(), { monster: monsterName, power: monsterPower });
    } else {
      bonusHeal = 5;
      msg = t('event.battle.win' , getActiveLocale(), { desc: monsterDesc, monster: monsterName, power: monsterPower });
    }
    if (streak >= 3) msg += t(streak >= 5 ? 'event.battle.streak3' : 'event.battle.streak' , getActiveLocale(), { n: streak });
    p.hp = Math.min(p.maxHp, p.hp + bonusHeal);
    const result = base(p);
    result.logs = [{ turn: 0, message: bonusHeal ? `${msg} (+${bonusHeal} HP)` : msg, type: isCrit ? 'critical' : 'battle' }];
    result.sparkles = sparkles; result.shake = isCrit;
    return result;
  }

  p.battleStreak = 0;
  const isCritFail = playerRoll <= 2;
  const dmg = (isCritFail ? 10 : 6) + rng.nextInt(2, 10);
  p.hp = Math.max(0, p.hp - dmg);
  let msg = isCritFail
    ? t('event.battle.critFail' , getActiveLocale(), { desc: monsterDesc, monster: monsterName, power: monsterPower, dmg })
    : t('event.battle.lose' , getActiveLocale(), { monster: monsterName, power: monsterPower, dmg });
  if (p.hp <= 20 && p.hp > 0) msg += t('system.hpDanger', getActiveLocale());
  const result = base(p); result.logs = [{ turn: 0, message: msg, type: isCritFail ? 'critical' : 'battle' }];
  result.shake = isCritFail;
  return result;
}

// ============================================================
function resolveTarotDraw(player: Player): EventResult {
  const p = { ...player, momentum: player.momentum + 1 };
  const result = base(p); result.drawTarot = true;
  result.logs = [{ turn: 0, message: t('event.tarot.draw', getActiveLocale()), type: 'tarot' }];
  return result;
}

function resolveRest(player: Player, rng: RNG): EventResult {
  const p = { ...player, momentum: player.momentum + 1 };
  const tipe = rng.nextInt(1, 4);
  let heal: number; let msgKey: string;
  switch (tipe) {
    case 1: heal = rng.nextInt(6, 12); msgKey = 'event.rest.1'; break;
    case 2: heal = rng.nextInt(10, 20); msgKey = 'event.rest.2'; break;
    case 3: heal = rng.nextInt(8, 15); msgKey = 'event.rest.3'; break;
    case 4: heal = rng.nextInt(8, 15); msgKey = 'event.rest.4'; p.moveBonus = (p.moveBonus || 0) + 1; break;
    default: heal = rng.nextInt(6, 12); msgKey = 'event.rest.1';
  }
  p.hp = Math.min(p.maxHp, p.hp + heal);
  const result = base(p);
  result.logs = [{ turn: 0, message: `${t(msgKey , getActiveLocale(), { n: heal })} (HP: ${p.hp})`, type: 'heal' }];
  return result;
}

function resolveShop(player: Player, rng: RNG): EventResult {
  const p = { ...player, momentum: player.momentum + 1 };
  if (p.hand.length >= 3) {
    if (rng.next() < 0.5 && p.hp < p.maxHp) {
      const heal = rng.nextInt(5, 12); p.hp = Math.min(p.maxHp, p.hp + heal);
      return { ...base(p), logs: [{ turn: 0, message: t('event.shop.heal' , getActiveLocale(), { n: heal }), type: 'heal' }] };
    }
    if (p.moveBonus === 0) {
      p.moveBonus = rng.nextInt(1, 3);
      return { ...base(p), logs: [{ turn: 0, message: t('event.shop.move' , getActiveLocale(), { n: p.moveBonus }), type: 'system' }] };
    }
    return { ...base(p), logs: [{ turn: 0, message: t('event.shop.full', getActiveLocale()), type: 'system' }] };
  }
  const result = base(p); result.drawTarot = true;
  result.logs = [{ turn: 0, message: t('event.shop.draw', getActiveLocale()), type: 'tarot' }];
  return result;
}

function resolveGate(state: GameState, player: Player): EventResult {
  const p = { ...player, momentum: 0, battleStreak: 0 };
  const newCircleId = p.currentCircleId - 1;

  // Circle 1 gate → final escape (no gatekeeper, instant victory)
  if (newCircleId < 1) {
    const result = base(p); result.sparkles = true;
    result.logs = [{ turn: 0, message: t('event.gate.escape', getActiveLocale()), type: 'system' }];
    return result;
  }

  // Trigger gatekeeper boss encounter!
  const gatekeeper = getGatekeeper(p.currentCircleId);
  const locale = getActiveLocale();
  const gkName = locale === 'en' ? (gatekeeper?.nameEn || '') : (gatekeeper?.name || '');

  const result = base(p);
  result.gatekeeperData = gatekeeper || null;
  result.sparkles = true;
  result.logs = [{
    turn: 0,
    message: t('event.gate.gatekeeper', locale, { name: gkName }),
    type: 'battle',
  }];
  return result;
}

function resolveCurse(player: Player, rng: RNG): EventResult {
  const p = { ...player, momentum: 0 };
  const tipe = rng.nextInt(1, 6);
  let msg: string; let shake = false;
  switch (tipe) {
    case 1: { const dmg = rng.nextInt(3, 8); p.hp = Math.max(0, p.hp - dmg); msg = t('event.curse.hp' , getActiveLocale(), { n: dmg }); break; }
    case 2: p.moveBonus = Math.max(-3, (p.moveBonus||0) - rng.nextInt(1, 3)); msg = t('event.curse.slow', getActiveLocale()); break;
    case 3: p.battleBuff = false; p.trapImmunity = false; msg = t('event.curse.cleanse', getActiveLocale()); break;
    case 4: p.isStunned = true; msg = t('event.curse.vision', getActiveLocale()); break;
    case 5: { const dmg = rng.nextInt(5, 10); p.hp = Math.max(0, p.hp - dmg); p.shieldTurns = 0; msg = t('event.curse.drain' , getActiveLocale(), { n: dmg }); shake = true; break; }
    case 6: { const dmg = rng.nextInt(1, 4); p.hp = Math.max(0, p.hp - dmg); msg = t('event.curse.omen' , getActiveLocale(), { n: dmg }); break; }
    default: { const dmg = rng.nextInt(3, 6); p.hp = Math.max(0, p.hp - dmg); msg = t('event.curse.hp' , getActiveLocale(), { n: dmg }); }
  }
  const result = base(p); result.logs = [{ turn: 0, message: msg, type: 'damage' }]; result.shake = shake;
  return result;
}

function resolveBlessing(player: Player, rng: RNG): EventResult {
  const p = { ...player, momentum: player.momentum + 1 };
  const tipe = rng.nextInt(1, 6);
  let msg: string; let sparkles = false;
  switch (tipe) {
    case 1: { const h = rng.nextInt(10, 25); p.hp = Math.min(p.maxHp, p.hp + h); msg = t('event.blessing.heal' , getActiveLocale(), { n: h }); break; }
    case 2: p.shieldTurns = Math.max(p.shieldTurns, rng.nextInt(1, 3)); msg = t('event.blessing.shield' , getActiveLocale(), { n: p.shieldTurns }); break;
    case 3: p.moveBonus = (p.moveBonus||0) + rng.nextInt(2, 4); msg = t('event.blessing.move' , getActiveLocale(), { n: p.moveBonus }); break;
    case 4: p.battleBuff = true; msg = t('event.blessing.battle', getActiveLocale()); break;
    case 5: p.trapImmunity = true; msg = t('event.blessing.trap', getActiveLocale()); break;
    case 6: { const h = rng.nextInt(5, 15); p.hp = Math.min(p.maxHp, p.hp + h); p.moveBonus = (p.moveBonus||0) + 2; msg = t('event.blessing.grand' , getActiveLocale(), { n: h }); sparkles = true; break; }
    default: { const h = rng.nextInt(5, 15); p.hp = Math.min(p.maxHp, p.hp + h); msg = t('event.blessing.heal' , getActiveLocale(), { n: h }); }
  }
  const result = base(p); result.logs = [{ turn: 0, message: msg, type: 'heal' }]; result.sparkles = sparkles;
  return result;
}

function resolveTrial(state: GameState, player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const tipe = rng.nextInt(1, 4);
  const roll = rollD6(rng);
  switch (tipe) {
    case 1: {
      const target = 3 + rng.nextInt(0, 2);
      if (roll >= target) {
        const heal = roll * 2; p.hp = Math.min(p.maxHp, p.hp + heal);
        p.moveBonus = (p.moveBonus||0) + 1; p.momentum = (p.momentum||0) + 1;
        return { ...base(p), logs: [{ turn: 0, message: t('event.trial.courage.pass' , getActiveLocale(), { roll, target, heal }), type: 'system' }] };
      }
      const dmg = target - roll + 2; p.hp = Math.max(0, p.hp - dmg); p.momentum = 0;
      return { ...base(p), logs: [{ turn: 0, message: t('event.trial.courage.fail' , getActiveLocale(), { roll, target, dmg }), type: 'damage' }] };
    }
    case 2: {
      const pred = rng.nextInt(2, 5);
      if (Math.abs(roll - pred) <= 1) {
        const heal = rng.nextInt(8, 15); p.hp = Math.min(p.maxHp, p.hp + heal); p.momentum = (p.momentum||0) + 2;
        return { ...base(p), logs: [{ turn: 0, message: t('event.trial.wisdom.pass' , getActiveLocale(), { pred, roll, heal }), type: 'heal' }] };
      }
      return { ...base(p), logs: [{ turn: 0, message: t('event.trial.wisdom.fail' , getActiveLocale(), { pred, roll }), type: 'system' }] };
    }
    case 3: {
      if (roll >= 4) { p.shieldTurns = Math.max(p.shieldTurns, roll - 2); p.momentum = (p.momentum||0) + 1;
        return { ...base(p), logs: [{ turn: 0, message: t('event.trial.endurance.pass' , getActiveLocale(), { roll, n: p.shieldTurns }), type: 'system' }] }; }
      p.hp = Math.max(0, p.hp - 3); p.momentum = 0;
      return { ...base(p), logs: [{ turn: 0, message: t('event.trial.endurance.fail' , getActiveLocale(), { roll }), type: 'damage' }] };
    }
    case 4: {
      if (roll >= 5) { p.moveBonus = (p.moveBonus||0) + 3; p.momentum = (p.momentum||0) + 2;
        const r = base(p); r.sparkles = true; r.logs = [{ turn: 0, message: t('event.trial.fate.crit' , getActiveLocale(), { roll }), type: 'system' }]; return r; }
      if (roll <= 2) { const dmg = rng.nextInt(3, 6); p.hp = Math.max(0, p.hp - dmg); p.momentum = 0;
        return { ...base(p), logs: [{ turn: 0, message: t('event.trial.fate.fail' , getActiveLocale(), { roll, dmg }), type: 'damage' }] }; }
      return { ...base(p), logs: [{ turn: 0, message: t('event.trial.fate.draw' , getActiveLocale(), { roll }), type: 'system' }] };
    }
  }
  return { ...base(p), logs: [{ turn: 0, message: '...', type: 'system' }] };
}

function resolveTreasure(player: Player, rng: RNG): EventResult {
  const p = { ...player, momentum: player.momentum + 1 };
  const tipe = rng.nextInt(1, 5);
  let msg: string; let sparkles = false;
  switch (tipe) {
    case 1: { const h = rng.nextInt(12, 25); p.hp = Math.min(p.maxHp, p.hp + h); msg = t('event.treasure.potion' , getActiveLocale(), { n: h }); break; }
    case 2: p.moveBonus = (p.moveBonus||0) + rng.nextInt(2, 5); msg = t('event.treasure.scroll' , getActiveLocale(), { n: p.moveBonus }); break;
    case 3: p.shieldTurns = Math.max(p.shieldTurns, 2); p.trapImmunity = true; msg = t('event.treasure.charm', getActiveLocale()); sparkles = true; break;
    case 4: p.bonusTurns = Math.max(p.bonusTurns, 2); p.moveBonus = (p.moveBonus||0) + 1; msg = t('event.treasure.coin', getActiveLocale()); break;
    case 5: { const h = rng.nextInt(5, 15); p.hp = Math.min(p.maxHp, p.hp + h); p.battleBuff = true; msg = t('event.treasure.gem' , getActiveLocale(), { n: h }); sparkles = true; break; }
    default: { const h = rng.nextInt(8, 18); p.hp = Math.min(p.maxHp, p.hp + h); msg = t('event.treasure.potion' , getActiveLocale(), { n: h }); }
  }
  const result = base(p); result.logs = [{ turn: 0, message: msg, type: 'heal' }]; result.sparkles = sparkles;
  return result;
}

// ============================================================
// MISSION
// ============================================================
function resolveMissionEvent(
  state: GameState,
  player: Player,
  tile: import('@/types/game').Tile,
  rng: RNG
): EventResult {
  const p = { ...player, momentum: 0 };
  const mission = tile.mission || getRandomMission('easy', rng);
  const result = resolveMission(state, mission, rng);

  p.hp = Math.max(0, Math.min(p.maxHp, p.hp + result.hpChange));
  p.moveBonus = (p.moveBonus || 0) + result.moveBonusChange;

  const r = base(p);
  r.logs = result.logs;
  r.shake = result.shake;
  r.sparkles = result.sparkles;

  // Mission rewards: chance to draw a tarot card on success
  if (result.success && rng.next() < 0.4 && p.hand.length < 3) {
    r.drawTarot = true;
  }

  return r;
}

// ============================================================
// CHOICE
// ============================================================
function resolveChoice(_state: GameState, player: Player, rng: RNG): EventResult {
  const p = { ...player };
  const theme = rng.nextInt(1, 4);
  let choiceData: ChoiceData;

  switch (theme) {
    case 1:
      choiceData = {
        title: t('event.choice.crossroads', getActiveLocale()),
        description: t('event.choice.crossroadsDesc', getActiveLocale()),
        options: [
          { id: 'safe-path', label: t('event.choice.safePath_label', getActiveLocale()), description: t('event.choice.safePath_desc', getActiveLocale()), riskLevel: 'safe' },
          { id: 'risky-path', label: t('event.choice.riskyPath_label', getActiveLocale()), description: t('event.choice.riskyPath_desc', getActiveLocale()), riskLevel: 'risky' },
        ],
      };
      break;
    case 2:
      choiceData = {
        title: t('event.choice.figure', getActiveLocale()),
        description: t('event.choice.figureDesc', getActiveLocale()),
        options: [
          { id: 'accept-deal', label: t('event.choice.accept_label', getActiveLocale()), description: t('event.choice.accept_desc', getActiveLocale()), riskLevel: 'dangerous' },
          { id: 'ignore', label: t('event.choice.ignore_label', getActiveLocale()), description: t('event.choice.ignore_desc', getActiveLocale()), riskLevel: 'safe' },
        ],
      };
      break;
    case 3:
      choiceData = {
        title: t('event.choice.altar', getActiveLocale()),
        description: t('event.choice.altarDesc', getActiveLocale()),
        options: [
          { id: 'pray', label: t('event.choice.pray_label', getActiveLocale()), description: t('event.choice.pray_desc', getActiveLocale()), riskLevel: 'risky' },
          { id: 'leave-offering', label: t('event.choice.offering_label', getActiveLocale()), description: t('event.choice.offering_desc', getActiveLocale()), riskLevel: 'safe' },
        ],
      };
      break;
    case 4:
    default:
      choiceData = {
        title: t('event.choice.soul', getActiveLocale()),
        description: t('event.choice.soulDesc', getActiveLocale()),
        options: [
          { id: 'help-soul', label: t('event.choice.help_label', getActiveLocale()), description: t('event.choice.help_desc', getActiveLocale()), riskLevel: 'risky' },
          { id: 'run-away', label: t('event.choice.flee_label', getActiveLocale()), description: t('event.choice.flee_desc', getActiveLocale()), riskLevel: 'safe' },
        ],
      };
  }

  const result = base(p); result.choiceData = choiceData;
  result.logs = [{ turn: 0, message: t('event.choice.arrive', getActiveLocale()), type: 'choice' }];
  return result;
}

export function resolvePlayerChoice(player: Player, choiceId: string, rng: RNG): EventResult {
  const p = { ...player };
  switch (choiceId) {
    case 'safe-path': case 'ignore': case 'run-away': {
      const heal = rng.nextInt(3, 8); p.hp = Math.min(p.maxHp, p.hp + heal); p.momentum = (p.momentum||0) + 1;
      return { ...base(p), logs: [{ turn: 0, message: t('event.choice.safeResult' , getActiveLocale(), { n: heal }), type: 'system' }] };
    }
    case 'leave-offering': {
      p.hp = Math.max(1, p.hp - 5);
      if (rng.next() < 0.5) { p.shieldTurns = Math.max(p.shieldTurns, 2);
        return { ...base(p), logs: [{ turn: 0, message: t('event.choice.offeringShield', getActiveLocale()), type: 'system' }] }; }
      p.moveBonus = (p.moveBonus||0) + 3;
      return { ...base(p), logs: [{ turn: 0, message: t('event.choice.offeringMove', getActiveLocale()), type: 'system' }] };
    }
    case 'risky-path': case 'accept-deal': case 'pray': case 'help-soul': {
      if (rng.nextInt(1, 6) >= 3) {
        const heal = rng.nextInt(8, 18); p.hp = Math.min(p.maxHp, p.hp + heal);
        p.moveBonus = (p.moveBonus||0) + rng.nextInt(1, 3); p.momentum = (p.momentum||0) + 2;
        const result = base(p); result.sparkles = true;
        result.logs = [{ turn: 0, message: t('event.choice.riskWin' , getActiveLocale(), { heal }), type: 'system' }];
        return result;
      }
      const dmg = rng.nextInt(5, 12); p.hp = Math.max(0, p.hp - dmg); p.momentum = 0;
      const result = base(p); result.shake = true;
      result.logs = [{ turn: 0, message: t('event.choice.riskLose' , getActiveLocale(), { dmg }), type: 'damage' }];
      return result;
    }
    default: return { ...base(p), logs: [{ turn: 0, message: '...', type: 'system' }] };
  }
}

// ============================================================
// GATEKEEPER BATTLE
// ============================================================
export function resolveGatekeeperBattle(
  state: GameState,
  player: Player,
  gatekeeper: GatekeeperData,
  rng: RNG
): EventResult {
  const p = { ...player, momentum: 0 };
  const locale = getActiveLocale();

  // Roll D6 for the challenge
  const roll = rollD6(rng);

  // Bonuses: battle streak and momentum
  const streakBonus = Math.floor((p.battleStreak || 0) / 2);
  const momentumBonus = Math.floor((p.momentum || 0) / 3);
  const total = roll + streakBonus + momentumBonus;

  const gkName = locale === 'en' ? gatekeeper.nameEn : gatekeeper.name;

  if (total >= gatekeeper.power) {
    // VICTORY! Ascend to next circle
    const newCircleId = (p.currentCircleId - 1) as CircleId;
    if (newCircleId >= 1) {
      const startTile = getCircleStartTile(state.board, newCircleId);
      p.currentCircleId = newCircleId;
      p.currentTileId = startTile.id;
    }
    p.hp = Math.min(p.maxHp, p.hp + gatekeeper.rewardHp);
    p.moveBonus = (p.moveBonus || 0) + gatekeeper.rewardMoveBonus;
    p.battleStreak = (p.battleStreak || 0) + 1;
    p.momentum = (p.momentum || 0) + 2;

    const circle = CIRCLES.find((c) => c.id === newCircleId);
    const circleName = locale === 'en' ? (circle?.nameEn || '') : (circle?.name || '');

    const result = base(p);
    result.sparkles = true;
    result.logs = [{
      turn: 0,
      message: t('gatekeeper.win', locale, {
        roll: total.toString(),
        power: gatekeeper.power.toString(),
        name: gkName,
        heal: gatekeeper.rewardHp.toString(),
        circle: circleName,
      }),
      type: 'critical',
    }];
    return result;
  }

  // DEFEAT! Take damage and get pushed back
  p.hp = Math.max(1, p.hp - gatekeeper.penaltyHp);
  p.battleStreak = 0;
  p.isStunned = total <= gatekeeper.power - 3; // stun on critical fail

  // Pushback
  let finalTileId = p.currentTileId;
  for (let i = 0; i < gatekeeper.penaltyPushback; i++) {
    const prevTile = getTileAtOffset(state.board, finalTileId, -1);
    if (prevTile) finalTileId = prevTile.id;
    else break;
  }
  p.currentTileId = finalTileId;

  const result = base(p);
  result.shake = true;
  result.logs = [{
    turn: 0,
    message: t('gatekeeper.lose', locale, {
      roll: total.toString(),
      power: gatekeeper.power.toString(),
      name: gkName,
      dmg: gatekeeper.penaltyHp.toString(),
    }),
    type: 'critical',
  }];
  return result;
}

// Helper to get tile at offset (used in gatekeeper pushback)
function getTileAtOffset(
  board: import('@/types/game').Tile[],
  currentTileId: string,
  offset: number
): import('@/types/game').Tile | null {
  if (offset === 0) return board.find((t) => t.id === currentTileId) ?? null;
  let tile: import('@/types/game').Tile | null = board.find((t) => t.id === currentTileId) ?? null;
  if (!tile) return null;

  if (offset > 0) {
    for (let i = 0; i < offset; i++) {
      tile = getNextTile(board, tile!.id);
      if (!tile) break;
    }
  } else {
    for (let i = 0; i < Math.abs(offset); i++) {
      const current = board.find((t) => t.id === tile!.id);
      if (!current) break;
      if (current.index === 0) {
        const prevCircleId = (current.circleId + 1) as CircleId;
        if (prevCircleId > 9) break;
        const prevTiles = board.filter((t) => t.circleId === prevCircleId).sort((a, b) => a.index - b.index);
        tile = prevTiles[prevTiles.length - 1] ?? null;
      } else {
        const sameCircle = board.filter((t) => t.circleId === current.circleId).sort((a, b) => a.index - b.index);
        tile = sameCircle.find((t) => t.index === current.index - 1) ?? null;
      }
    }
  }
  return tile;
}

// ============================================================
// PLAYER MOVEMENT
// ============================================================
export function movePlayerOnBoard(
  board: import('@/types/game').Tile[],
  player: Player,
  steps: number
): { destination: Player; escaped: boolean } {
  const p = { ...player };
  let currentTile = board.find((t) => t.id === p.currentTileId);
  if (!currentTile) return { destination: p, escaped: false };

  for (let i = 0; i < steps; i++) {
    const next = getNextTile(board, currentTile.id);
    if (!next) { p.currentCircleId = 1; return { destination: p, escaped: true }; }
    currentTile = next;
  }
  p.currentTileId = currentTile.id; p.currentCircleId = currentTile.circleId;
  return { destination: p, escaped: false };
}
