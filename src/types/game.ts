// ============================================================
// Abyssos V0.1a — Core Game Types (Inferno + Purgatorio + Paradiso)
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
  | 'demon_duel'
  | 'battle'
  | 'event'
  | 'gatekeeper'
  | 'guardianReward'
  | 'gameOver'
  | 'purgatorio_rolling'     // 연옥 주사위
  | 'purgatorio_moving'      // 연옥 이동
  | 'purgatorio_battle'      // 연옥 죄의 투영 전투
  | 'purgatorio_event'       // 연옥 이벤트
  | 'purgatorio_angel'       // 연옥 수호천사전
  | 'purgatorio_purification' // 연옥 정화카드 획득
  | 'paradiso_rolling'        // 천국 주사위
  | 'paradiso_moving'         // 천국 이동
  | 'paradiso_blessing'       // 천국 빛의 정령 축복
  | 'paradiso_archangel'      // 천국 대천사 시험
  | 'paradiso_relic';         // 천국 성물 획득

export type GatekeeperBattleType =
  | 'timing'     // TimingSlider with gimmick (GK-9, GK-5, GK-2)
  | 'cardmatch'  // Card memory match (GK-8)
  | 'rapidtap'   // Rapid tap speed test (GK-7)
  | 'quiz'       // Lore quiz (GK-6)
  | 'choice'     // Risk-reward choice (GK-4)
  | 'multitap'   // Multi-tap timing (GK-3)
  | 'final';     // Combined quiz + timing (GK-1)

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
  battleType: GatekeeperBattleType; // 고유 전투 타입
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

// ============================================================
// Purgatorio Types (연옥편)
// ============================================================

export type TerraceId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PurgatorioElementType =
  | 'earth'       // 🪨 1층 교만
  | 'sight'       // 👁 2층 시기
  | 'smoke'       // 🌫 3층 분노
  | 'lightning'   // ⚡ 4층 나태
  | 'crystal'     // 💎 5층 탐욕
  | 'wood'        // 🌳 6층 식탐
  | 'purgefire';  // 🔥 7층 색욕

export type AngelBattleType =
  | 'timing_quiz'    // Angel-1: timing + quiz
  | 'cardmatch'      // Angel-2: card match
  | 'timing_smoke'   // Angel-3: smoke-obscured timing
  | 'rapidtap'       // Angel-4: rapid tap
  | 'choice'         // Angel-5: risk-reward choice
  | 'quiz'           // Angel-6: lore quiz
  | 'purification';  // Angel-7: final multi-timing + reverse

// ---- Sin Projection Card (14 types: 2 per terrace) ----

export type SinChallengeType = 'narrative_choice' | 'virtue_test' | 'memory' | 'sequence' | 'meditation';

export interface SinChoice {
  label: string; labelEn: string;
  desc: string; descEn: string;
  // Outcome: [hpChange, virtueChange, moveBonus]
  outcome: { hp: number; virtue: number; move: number };
}

export interface SinProjectionCard {
  id: string;
  terraceId: TerraceId;
  tier: 'A' | 'B';
  name: string;
  nameEn: string;
  element: PurgatorioElementType;
  challengeType: SinChallengeType;
  narrative: string;        // 도덕적 딜레마
  narrativeEn: string;
  choices: [SinChoice, SinChoice]; // 두 가지 선택지
  rewardHp: number;
  penaltyHp: number;
  specialEffect?: string;
}

// ---- Angel Guardian Card (7 types: 1 per terrace) ----

export interface AngelGuardianCard {
  id: string;            // "angel-1" ~ "angel-7"
  terraceId: TerraceId;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  element: PurgatorioElementType;
  power: number;
  battleType: AngelBattleType;
  mechanic: string;
  mechanicEn: string;
  rewardHp: number;
  purificationBonus: string;
  purificationBonusEn: string;
  purificationId: string;
  narrative: string;
  narrativeEn: string;
}

// ---- Purification Card (7 types: earned from angels) ----

export interface PurificationCard {
  id: string;            // "purification-1" ~ "purification-7"
  terraceId: TerraceId;
  name: string;
  nameEn: string;
  element: PurgatorioElementType;
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

export type GameEra = 'inferno' | 'purgatorio' | 'paradiso';

export interface Player {
  name: string;
  hp: number;
  maxHp: number;
  currentTileId: string;
  currentCircleId: CircleId;
  guardianCards: GuardianCard[];  // 보유 수호카드 (지옥, 최대 9)
  moveBonus: number;
  battleStreak: number;
  isStunned: boolean;
  buffs: PlayerBuff[];

  // ---- Purgatorio fields ----
  era: GameEra;                              // 현재 편 (inferno/purgatorio/paradiso)
  currentTerraceId?: TerraceId;              // 연옥 현재 테라스
  purificationCards: PurificationCard[];     // 보유 정화카드 (연옥, 최대 7)
  totalCardCount: number;                    // 전체 보유 카드 수 (수호+정화)
  virtue: number;                            // 덕목 게이지 (-10 ~ 10), 연옥에서 사용

  // ---- Paradiso fields ----
  grace: number;                             // 은총 게이지 (0-100)
  currentSphereId?: SphereId;               // 천국 현재 천구
  celestialRelics: CelestialRelic[];        // 보유 성물 (천국, 최대 9)
}

// ---- Dice ----

export type DiceRoll = [number, number];

// ---- Game Log ----

export interface LogEntry {
  turn: number;
  message: string;
  type: 'roll' | 'move' | 'battle' | 'damage' | 'heal' | 'system' | 'critical' | 'guardian';
}

// ---- Purgatorio Board Tile ----

export interface PurgatorioTile {
  id: string;                 // "t1-p0" ~ "t7-p7"
  terraceId: TerraceId;
  index: number;              // 0~7 within terrace
  globalIndex: number;        // 0~55 across all terraces
  type: PurgatorioTileType;
  eventKind?: EventKind;
  sinProjectionId?: string;    // for sin tiles
  label: string;
}

export type PurgatorioTileType = 'sin' | 'event' | 'angel';

// ============================================================
// Paradiso Types (천국편)
// ============================================================

export type SphereId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type ParadisoElementType =
  | 'lunar'      // 🌙 1천
  | 'mercurial'  // ☿ 2천
  | 'venusian'   // ♀ 3천
  | 'solar'      // ☀ 4천
  | 'martial'    // ♂ 5천
  | 'jovian'     // ♃ 6천
  | 'saturnine'  // ♄ 7천
  | 'stellar'    // ⭐ 8천
  | 'prime';     // 💫 9천

export type ArchangelTrialType =
  | 'narrative_choice'
  | 'quiz'
  | 'memory_path'
  | 'timing_multi'
  | 'rapid_sequence'
  | 'balance'
  | 'meditation'
  | 'song_match'
  | 'final_ascension';

// ---- Light Spirit Card (18 types: 2 per sphere) ----

export interface LightSpiritCard {
  id: string;
  sphereId: SphereId;
  tier: 'A' | 'B';
  name: string;
  nameEn: string;
  element: ParadisoElementType;
  graceGift: number;    // 은총 선물량
  bonusGift?: string;   // 추가 선물 설명
  bonusGiftEn?: string;
}

// ---- Archangel Card (9 types: 1 per sphere) ----

export interface ArchangelCard {
  id: string;            // "archangel-1" ~ "archangel-9"
  sphereId: SphereId;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  element: ParadisoElementType;
  trialType: ArchangelTrialType;
  trialDesc: string;
  trialDescEn: string;
  graceBlessing: number; // 은총 축복량
  relicId: string;       // 연결된 성물 ID
  narrative: string;
  narrativeEn: string;
}

// ---- Celestial Relic (9 types) ----

export interface CelestialRelic {
  id: string;
  sphereId: SphereId;
  name: string;
  nameEn: string;
  element: ParadisoElementType;
  effect: string;
  effectEn: string;
  narrative: string;
  narrativeEn: string;
}

// ---- Paradiso Board Tile ----

export interface ParadisoTile {
  id: string;
  sphereId: SphereId;
  index: number;
  globalIndex: number;
  type: ParadisoTileType;
  spiritId?: string;     // for spirit tiles
  label: string;
}

export type ParadisoTileType = 'spirit' | 'blessing' | 'archangel';

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

  // ---- Demon dice (for vs display) ----
  demonDice: DiceRoll | null;

  // ---- Purgatorio state ----
  purgatorioBoard: PurgatorioTile[];
  activeSinProjection: SinProjectionCard | null;
  activeAngelGuardian: AngelGuardianCard | null;
  activePurificationReward: PurificationCard | null;
  // Purgatorio dice
  purgatorioDice: DiceRoll | null;
  purgatorioIsDouble: boolean;
  purgatorioDoubleCount: number;

  // ---- Paradiso state ----
  paradisoBoard: ParadisoTile[];
  activeLightSpirit: LightSpiritCard | null;
  activeArchangel: ArchangelCard | null;
  activeCelestialReward: CelestialRelic | null;
  paradisoDice: DiceRoll | null;
  paradisoIsDouble: boolean;
  paradisoDoubleCount: number;
}
