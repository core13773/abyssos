import type { BoardTile, CircleId, EventKind } from '@/types/game';
import { CIRCLES } from '@/lib/data/circles';
import type { RNG } from '@/lib/utils/random';

/**
 * Build linear board: 12 tiles per circle × 9 = 108 tiles.
 *
 * Pattern: A-B-Choice-A-B-Rest-Elite-B-Choice-A-B-Treasure → Gatekeeper
 */
export function buildBoardV4(rng: RNG): BoardTile[] {
  const board: BoardTile[] = [];
  let globalIdx = 0;

  for (const circle of CIRCLES) {
    const tiles = buildCircleTiles(circle.id, rng);
    for (const t of tiles) {
      t.globalIndex = globalIdx++;
      board.push(t);
    }
  }
  return board;
}

const RANDOM_EVENTS: EventKind[] = ['choice', 'starlight', 'altar', 'shop', 'wheel'];

function buildCircleTiles(circleId: CircleId, rng: RNG): BoardTile[] {
  const tiles: BoardTile[] = [];

  const makeTile = (index: number, type: BoardTile['type'], opts?: { monsterKey?: 'A' | 'B' | 'E'; eventKind?: EventKind }) => ({
    id: `c${circleId}-t${index}`,
    circleId,
    index,
    globalIndex: 0, // filled later
    type,
    monsterId: opts?.monsterKey
      ? (opts.monsterKey === 'A' ? CIRCLES.find(c => c.id === circleId)!.monsterAId
        : opts.monsterKey === 'B' ? CIRCLES.find(c => c.id === circleId)!.monsterBId
        : CIRCLES.find(c => c.id === circleId)!.monsterBId) // Elite = B variant
      : undefined,
    eventKind: opts?.eventKind,
    label: type === 'event' ? (opts?.eventKind || 'event') : (opts?.monsterKey === 'E' ? 'elite' : `tile-${index}`),
  });

  const pickEvent = (): EventKind => RANDOM_EVENTS[rng.nextInt(0, RANDOM_EVENTS.length - 1)];

  // A - B - [Random Event] - A - B - Rest - Elite - B - [Random Event] - A - B - [Random Event]
  tiles.push(makeTile(0, 'monster', { monsterKey: 'A' }));
  tiles.push(makeTile(1, 'monster', { monsterKey: 'B' }));
  tiles.push(makeTile(2, 'event', { eventKind: pickEvent() }));
  tiles.push(makeTile(3, 'monster', { monsterKey: 'A' }));
  tiles.push(makeTile(4, 'monster', { monsterKey: 'B' }));
  tiles.push(makeTile(5, 'event', { eventKind: 'rest' }));
  tiles.push(makeTile(6, 'monster', { monsterKey: 'E' })); // ELITE
  tiles.push(makeTile(7, 'monster', { monsterKey: 'B' }));
  tiles.push(makeTile(8, 'event', { eventKind: pickEvent() }));
  tiles.push(makeTile(9, 'monster', { monsterKey: 'A' }));
  tiles.push(makeTile(10, 'monster', { monsterKey: 'B' }));
  tiles.push(makeTile(11, 'event', { eventKind: pickEvent() }));

  return tiles;
}

export function getNextTileV4(board: BoardTile[], currentTileId: string): BoardTile | null {
  const current = board.find((t) => t.id === currentTileId);
  if (!current) return null;
  const nextGlobal = current.globalIndex + 1;
  if (nextGlobal >= board.length) return null;
  return board.find((t) => t.globalIndex === nextGlobal) ?? null;
}

export function getTileAtOffsetV4(board: BoardTile[], currentTileId: string, offset: number): BoardTile | null {
  const current = board.find((t) => t.id === currentTileId);
  if (!current) return null;
  const targetGlobal = current.globalIndex + offset;
  if (targetGlobal < 0 || targetGlobal >= board.length) return null;
  return board.find((t) => t.globalIndex === targetGlobal) ?? null;
}

export function remainingTilesInCircle(board: BoardTile[], currentTileId: string): number {
  const current = board.find((t) => t.id === currentTileId);
  if (!current) return 0;
  const circleTiles = board.filter((t) => t.circleId === current.circleId);
  return circleTiles.filter((t) => t.index >= current.index).length;
}
