import type { Player, MonsterCard, LogEntry } from '@/types/game';
import { rollD6 } from './dice';
import type { RNG } from '@/lib/utils/random';
import { t, getActiveLocale } from '@/lib/i18n/translations';
import { getGuardianDiceBonus } from './guardian';

export interface BattleResult {
  victory: boolean;
  updatedPlayer: Player;
  logs: LogEntry[];
  crit: boolean;
  fumble: boolean;
  shake: boolean;
  sparkles: boolean;
}

export function resolveMonsterBattle(
  player: Player,
  monster: MonsterCard,
  rng: RNG,
  forcedRoll?: number
): BattleResult {
  const p = { ...player, buffs: [...player.buffs] };
  const loc = getActiveLocale();
  const monName = loc === 'en' ? monster.nameEn : monster.name;

  // Apply pre-battle monster effects
  if (monster.specialEffect === 'pre_damage_3') {
    p.hp = Math.max(0, p.hp - 3);
  } else if (monster.specialEffect === 'pre_damage_5') {
    p.hp = Math.max(0, p.hp - 5);
  }

  // Calculate combat bonuses from guardian cards
  let diceBonus = getGuardianDiceBonus(p.guardianCards, p.hp, p.maxHp);

  // 소모품: 날카로운 단검 buff
  const daggerBuff = p.buffs.find((b) => b.id === 'dagger');
  if (daggerBuff) {
    diceBonus += daggerBuff.value;
    p.buffs = p.buffs.filter((b) => b.id !== 'dagger');
  }

  const roll = forcedRoll ?? rollD6(rng);
  const total = roll + diceBonus;
  const victory = total >= monster.power;
  const isCrit = roll === 6 && victory;
  const isFumble = roll === 1 && !victory;
  const logs: LogEntry[] = [];

  // Result message
  logs.push({
    turn: 0,
    message: victory
      ? t('battle.result.victory', loc, { name: monName, power: monster.power, roll: total })
      : t('battle.result.defeat', loc, { name: monName, power: monster.power, roll: total }),
    type: isCrit ? 'critical' : 'battle',
  });

  if (victory) {
    let heal = monster.rewardHp;

    if (isCrit) {
      heal *= 2;
      logs.push({ turn: 0, message: t('battle.result.crit', loc), type: 'critical' });
    }

    // 피의 축복
    if (p.guardianCards.some((g) => g.id === 'guardian-7')) {
      const excess = total - monster.power;
      if (excess > 0) {
        heal += excess;
        logs.push({ turn: 0, message: t('battle.result.bloodBlessing', loc, { n: excess }), type: 'guardian' });
      }
    }

    // 분노의 투구: healing penalty
    if (p.guardianCards.some((g) => g.id === 'guardian-5')) {
      heal = Math.floor(heal * 0.7);
    }

    p.hp = Math.min(p.maxHp, p.hp + heal);
    if (heal > 0) {
      logs.push({ turn: 0, message: t('battle.result.heal', loc, { hp: heal, curr: p.hp, max: p.maxHp }), type: 'heal' });
    }

    p.battleStreak = (p.battleStreak || 0) + 1;
    if (p.battleStreak >= 3) {
      // Combo bonus: extra healing
      const comboBonus = p.battleStreak >= 7 ? Math.floor(heal * 0.5) : p.battleStreak >= 5 ? Math.floor(heal * 0.3) : Math.floor(heal * 0.15);
      heal += comboBonus;
      logs.push({ turn: 0, message: t('battle.result.streak', loc, { n: p.battleStreak }), type: 'system' });
    }

    if (monster.specialEffect === 'buff_extend' && p.buffs.length > 0) {
      p.buffs = p.buffs.map((b) => ({ ...b, remainingTurns: b.remainingTurns + 1 }));
      logs.push({ turn: 0, message: t('battle.result.buffExtended', loc), type: 'system' });
    }
  } else {
    let dmg = monster.penaltyHp;

    // 소모품: 철벽 방패 buff
    const shieldBuff = p.buffs.find((b) => b.id === 'shield');
    if (shieldBuff) {
      dmg = Math.max(0, dmg + shieldBuff.value);
      p.buffs = p.buffs.filter((b) => b.id !== 'shield');
    }

    if (isFumble) {
      dmg *= 2;
      logs.push({ turn: 0, message: t('battle.result.fumble', loc), type: 'critical' });
    }

    // 얼음 거인의 심장
    if (p.guardianCards.some((g) => g.id === 'guardian-9')) {
      const reduction = 2;
      dmg = Math.max(1, dmg - reduction);
      logs.push({ turn: 0, message: t('battle.result.iceHeart', loc, { n: reduction }), type: 'guardian' });
    }

    p.hp = Math.max(0, p.hp - dmg);
    p.battleStreak = 0;
    logs.push({ turn: 0, message: t('battle.result.damage', loc, { hp: dmg, curr: p.hp, max: p.maxHp }), type: 'damage' });

    // Monster-specific effects
    if (monster.specialEffect === 'next_dice_down') {
      p.moveBonus = Math.max(0, (p.moveBonus || 0) - 1);
      logs.push({ turn: 0, message: t('battle.result.diceDown', loc), type: 'system' });
    }
    if (monster.specialEffect === 'rematch') {
      logs.push({ turn: 0, message: t('battle.result.hydraRegen', loc), type: 'critical' });
    }
    if (monster.specialEffect === 'poison_2turns') {
      p.buffs = p.buffs.filter((b) => b.id !== 'poison');
      p.buffs.push({ id: 'poison', name: 'Poison', remainingTurns: 2, value: -2 });
      logs.push({ turn: 0, message: t('battle.result.poison', loc), type: 'system' });
    }
    if (monster.specialEffect === 'buff_loss') {
      if (p.buffs.length > 0) {
        const lost = p.buffs.pop()!;
        logs.push({ turn: 0, message: t('battle.result.buffLost', loc, { name: lost.name }), type: 'system' });
      }
    }
  }

  return {
    victory,
    updatedPlayer: p,
    logs,
    crit: isCrit,
    fumble: isFumble,
    shake: isCrit || isFumble,
    sparkles: isCrit,
  };
}
