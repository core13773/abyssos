import type { TileType, EventKind } from '@/types/game';

export interface TileTypeInfo {
  type: TileType;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const TILE_TYPE_INFO: Record<TileType, TileTypeInfo> = {
  monster: {
    type: 'monster', label: '몬스터', icon: '👾',
    color: 'bg-red-900/60',
    description: '지옥의 괴물과의 전투. D6 + 보너스 ≥ 전투력이면 승리.',
  },
  event: {
    type: 'event', label: '이벤트', icon: '🎲',
    color: 'bg-stone-700/60',
    description: '예측할 수 없는 일이 일어난다. 휴식, 함정, 축복, 저주.',
  },
  gatekeeper: {
    type: 'gatekeeper', label: '수문장', icon: '👹',
    color: 'bg-yellow-600/60',
    description: '층의 관문을 지키는 보스. D6 미션에 도전하라.',
  },
};

export interface EventKindInfo {
  kind: EventKind;
  label: string;
  icon: string;
  color: string;
}

export const EVENT_KIND_INFO: Record<EventKind, EventKindInfo> = {
  rest:     { kind: 'rest',     label: '휴식', icon: '✧', color: 'text-emerald-400' },
  trap:     { kind: 'trap',     label: '함정', icon: '⚠', color: 'text-red-400' },
  blessing: { kind: 'blessing', label: '축복', icon: '★', color: 'text-sky-400' },
  curse:    { kind: 'curse',    label: '저주', icon: '☠', color: 'text-violet-400' },
  treasure: { kind: 'treasure', label: '보물', icon: '💎', color: 'text-yellow-400' },
  choice:   { kind: 'choice',   label: '선택', icon: '🤔', color: 'text-amber-400' },
  starlight: { kind: 'starlight', label: '별빛 상자', icon: '✨', color: 'text-amber-300' },
  altar:    { kind: 'altar',    label: '저주 제단', icon: '💀', color: 'text-red-500' },
  shop:     { kind: 'shop',     label: '영혼 상인', icon: '🏪', color: 'text-cyan-400' },
  wheel:    { kind: 'wheel',    label: '욕망의 바퀴', icon: '🎰', color: 'text-purple-400' },
};
