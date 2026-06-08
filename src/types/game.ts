// ============================================================
// Abyssos v4.0 — Core Game Types
// ============================================================

// ---- Enums & IDs ----

export type CircleId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TileType = 'monster' | 'event' | 'gatekeeper';

export type EventKind = 'rest' | 'trap' | 'blessing' | 'curse' | 'treasure' | 'choice';

export type ElementType =
  | 'ice'       // ❄️ 9층 배반
  | 'illusion'  // 🎭 8층 사기
  | 'blood'     // 🩸 7층 폭력
  | 'fire'      // 🔥 6층 이단
  | 'mud'       // 😡 5층 분노
  | 'gold'      // 💰 4층 탐욕
  | 'poison'    // 🤢 3층 식탐
  | 'wind'      // 🌪 2층 색욕
  | 'holy';     // ✨ 1층 미망

export type GamePhase =
  | 'rolling'
  | 'moving'
  | 'battle'
  | 'event'
  | 'gatekeeper'
  | 'guardianReward'
  | 'gameOver';

// ---- Monster Card (18 types: 2 per circle) ----

export interface MonsterCard {
  id: string;            // "monster-9a", "monster-9b", etc.
  circleId: CircleId;
  tier: 'A' | 'B';      // A=하급(칸1~5), B=상급(칸7~11)
  name: string;
  nameEn: string;
  element: ElementType;
  power: number;         // D6 + bonus >= power → 승리
  ability: string;       // 특수 능력 설명
  abilityEn: string;
  rewardHp: number;
  penaltyHp: number;
  specialEffect?: string; // 추가 효과 키 (스턴, 이동력 변화 등)
}

// ---- Gatekeeper Card (9 types: 1 per circle) ----

export interface GatekeeperCard {
  id: string;            // "gk-9" ~ "gk-1"
  circleId: CircleId;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  element: ElementType;
  power: number;         // D6 + bonus >= power → 승리
  mechanic: string;      // 고유 기믹 설명
  mechanicEn: string;
  rewardHp: number;
  rewardMove: number;
  penaltyHp: number;
  pushback: number;      // 패배 시 후퇴 칸 수
  guardianId: string;    // 연결된 수호카드 ID
  narrative: string;
  narrativeEn: string;
}

// ---- Guardian Card (9 types: earned from gatekeepers) ----

export interface GuardianCard {
  id: string;            // "guardian-9" ~ "guardian-1"
  circleId: CircleId;
  name: string;
  nameEn: string;
  element: ElementType;
  effectType: 'passive' | 'active' | 'both';
  mainEffect: string;
  mainEffectEn: string;
  subEffect: string;
  subEffectEn: string;
  narrative: string;
  narrativeEn: string;
}

// ---- Board Tile ----

export interface BoardTile {
  id: string;                 // "c9-t0" ~ "c1-t11"
  circleId: CircleId;
  index: number;              // 0~11 within circle
  globalIndex: number;        // 0~107 across all circles
  type: TileType;
  eventKind?: EventKind;      // for event tiles
  monsterId?: string;         // for monster tiles → MonsterCard.id
  label: string;
}

// ---- Player ----

export interface PlayerBuff {
  id: string;
  name: string;
  remainingTurns: number;
  value: number;
}

export interface Player {
  name: string;
  hp: number;
  maxHp: number;
  currentTileId: string;
  currentCircleId: CircleId;
  guardianCards: GuardianCard[];  // 보유 수호카드 (최대 9)
  moveBonus: number;
  battleStreak: number;
  isStunned: boolean;
  buffs: PlayerBuff[];
}

// ---- Dice ----

export type DiceRoll = [number, number];

// ---- Game Log ----

export interface LogEntry {
  turn: number;
  message: string;
  type: 'roll' | 'move' | 'battle' | 'damage' | 'heal' | 'system' | 'critical' | 'guardian';
}

// ---- Full Game State ----

export interface GameState {
  phase: GamePhase;
  player: Player;
  board: BoardTile[];
  dice: DiceRoll | null;
  isDouble: boolean;
  doubleCount: number;
  turnNumber: number;
  log: LogEntry[];
  // Current active modals
  activeMonster: MonsterCard | null;
  activeGatekeeper: GatekeeperCard | null;
  activeGuardianReward: GuardianCard | null;
  // Event resolution pending
  pendingEventKind: EventKind | null;
  // Battle roll from timing slider: 6=crit, 4=normal, 1=miss
  battleRoll: number | null;
  // Escape check flag
  defeatGatekeeperOnArrival: CircleId | null;
  // Visual effects
  shakeScreen: boolean;
  showSparkles: boolean;
  // Game end
  escaped: boolean;
  totalTurns: number;
}
