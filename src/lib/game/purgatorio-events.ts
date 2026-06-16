import type { Player, LogEntry, EventKind, PurificationCard } from '@/types/game';
import type { RNG } from '@/lib/utils/random';
import { t, getActiveLocale } from '@/lib/i18n/translations';

export interface PurgatorioEventResult {
  updatedPlayer: Player;
  logs: LogEntry[];
  shake: boolean;
  sparkles: boolean;
}

/**
 * Resolve a purgatorio event tile.
 * Purgatorio events are generally more benevolent than Inferno events,
 * reflecting the theme of purification rather than punishment.
 */
export function resolvePurgatorioEvent(
  player: Player,
  eventKind: EventKind,
  rng: RNG
): PurgatorioEventResult {
  switch (eventKind) {
    case 'rest':     return resolvePrayer(player, rng);
    case 'choice':   return resolveCrossroads(player, rng);
    case 'blessing': return resolveStarlight(player);
    case 'curse':    return resolveSinWeight(player, rng);
    case 'treasure': return resolveAngelFeather(player);
    case 'trap':     return resolveSinWeight(player, rng); // trap → weight of sin
    default:         return { updatedPlayer: { ...player }, logs: [], shake: false, sparkles: false };
  }
}

/** Prayer (rest equivalent) — HP recovery + potential bonus */
function resolvePrayer(player: Player, rng: RNG): PurgatorioEventResult {
  const p = { ...player };
  const loc = getActiveLocale();

  // Base heal: 10-18
  let heal = rng.nextInt(10, 18);

  // Kiss of Temperance doubles healing
  if (p.purificationCards.some((c: PurificationCard) => c.id === 'purification-6')) {
    heal *= 2;
  }

  p.hp = Math.min(p.maxHp, p.hp + heal);

  return {
    updatedPlayer: p,
    logs: [{ turn: 0, message: t('purgatorio.eventPrayerDetailed', loc, { hp: heal, curr: p.hp, max: p.maxHp }), type: 'heal' }],
    shake: false,
    sparkles: false,
  };
}

/** Crossroads (choice equivalent) — 50/50 gamble */
function resolveCrossroads(player: Player, rng: RNG): PurgatorioEventResult {
  const p = { ...player };
  const loc = getActiveLocale();

  if (rng.next() < 0.5) {
    const heal = rng.nextInt(12, 25);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    p.moveBonus = (p.moveBonus || 0) + rng.nextInt(1, 3);
    return {
      updatedPlayer: p,
      logs: [{ turn: 0, message: t('purgatorio.eventCrossroadsSuccess', loc, { hp: heal, move: p.moveBonus }), type: 'heal' }],
      shake: false,
      sparkles: true,
    };
  }
  const dmg = rng.nextInt(4, 10);
  p.hp = Math.max(0, p.hp - dmg);
  return {
    updatedPlayer: p,
    logs: [{ turn: 0, message: t('purgatorio.eventCrossroadsFail', loc, { hp: dmg }), type: 'damage' }],
    shake: true,
    sparkles: false,
  };
}

/** Starlight Vision (blessing equivalent) — reduces enemy power for this terrace */
function resolveStarlight(player: Player): PurgatorioEventResult {
  const p = { ...player };
  const loc = getActiveLocale();

  p.buffs = p.buffs.filter((b) => b.id !== 'starlight');
  p.buffs.push({ id: 'starlight', name: 'Starlight Vision', remainingTurns: 8, value: -1 });

  return {
    updatedPlayer: p,
    logs: [{ turn: 0, message: t('purgatorio.eventStarlightDetailed', loc), type: 'system' }],
    shake: false,
    sparkles: true,
  };
}

/** Weight of Sin (curse/trap equivalent) — takes damage */
function resolveSinWeight(player: Player, rng: RNG): PurgatorioEventResult {
  const p = { ...player };
  const loc = getActiveLocale();

  const dmg = rng.nextInt(5, 12);

  // Eye of Mercy: immune to trap damage
  if (p.purificationCards.some((c: PurificationCard) => c.id === 'purification-2')) {
    return {
      updatedPlayer: p,
      logs: [{ turn: 0, message: t('purgatorio.eventEyeOfMercy', loc), type: 'guardian' }],
      shake: false,
      sparkles: true,
    };
  }

  p.hp = Math.max(0, p.hp - dmg);

  return {
    updatedPlayer: p,
    logs: [{ turn: 0, message: t('purgatorio.eventSinWeightDetailed', loc, { hp: dmg, curr: p.hp, max: p.maxHp }), type: 'damage' }],
    shake: dmg >= 8,
    sparkles: false,
  };
}

/** Angel Feather (treasure equivalent) — allows skipping next battle */
function resolveAngelFeather(player: Player): PurgatorioEventResult {
  const p = { ...player };
  const loc = getActiveLocale();

  p.buffs = p.buffs.filter((b) => b.id !== 'angel_feather');
  p.buffs.push({ id: 'angel_feather', name: 'Angel Feather', remainingTurns: 99, value: 1 });

  return {
    updatedPlayer: p,
    logs: [{ turn: 0, message: t('purgatorio.eventAngelFeather', loc), type: 'system' }],
    shake: false,
    sparkles: true,
  };
}
