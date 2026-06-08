import type { Tile, CircleId, TileType, MissionDifficulty } from '@/types/game';
import { CIRCLES } from '@/lib/data/circles';
import { getActiveLocale } from '@/lib/i18n/translations';
import { getRandomMission } from '@/lib/data/missions';
import type { RNG } from '@/lib/utils/random';

/**
 * Build the full game board from circle definitions.
 * Each circle becomes a ring of tiles. The last tile of each
 * circle is marked as the "gate" tile (except circle 1 which
 * has the final escape gate).
 */
export function buildBoard(rng: RNG): Tile[] {
  const board: Tile[] = [];

  for (const circle of CIRCLES) {
    const tiles = buildCircleTiles(circle.id, circle.tileCount, circle.tileTypes, rng);
    board.push(...tiles);
  }

  return board;
}

function buildCircleTiles(
  circleId: CircleId,
  tileCount: number,
  typeWeights: { type: TileType; weight: number }[],
  rng: RNG
): Tile[] {
  const tiles: Tile[] = [];

  // Build weighted type pool
  const pool: TileType[] = [];
  for (const tw of typeWeights) {
    for (let i = 0; i < tw.weight; i++) {
      pool.push(tw.type);
    }
  }

  for (let i = 0; i < tileCount; i++) {
    // The last tile is always a gate (except we place it at index tileCount-1)
    const isLast = i === tileCount - 1;
    const type = isLast ? 'gate' : rng.pick(pool);

    const locale = getActiveLocale();
    const label = isLast
      ? (locale === 'en' ? 'Ascension Gate' : '승천문')
      : (locale === 'en' ? `Circle ${circleId} #${i + 1}` : `${circleId}층 ${i + 1}번째`);

    // Assign missions to mission-type tiles based on circle depth
    let mission: ReturnType<typeof getRandomMission> | undefined;
    if (type === 'mission') {
      // Difficulty scales: deeper circles = harder missions
      const diffRoll = rng.next();
      let difficulty: MissionDifficulty;
      if (circleId >= 8) {
        // Deepest circles: mostly hard/deadly
        difficulty = diffRoll < 0.1 ? 'easy' : diffRoll < 0.35 ? 'medium' : diffRoll < 0.7 ? 'hard' : 'deadly';
      } else if (circleId >= 5) {
        // Mid circles: balanced
        difficulty = diffRoll < 0.2 ? 'easy' : diffRoll < 0.5 ? 'medium' : diffRoll < 0.85 ? 'hard' : 'deadly';
      } else {
        // Upper circles: easier
        difficulty = diffRoll < 0.4 ? 'easy' : diffRoll < 0.75 ? 'medium' : diffRoll < 0.95 ? 'hard' : 'deadly';
      }
      mission = getRandomMission(difficulty, rng);
    }

    tiles.push({
      id: `c${circleId}-t${i}`,
      circleId,
      index: i,
      type,
      label,
      isGate: isLast,
      mission,
    });
  }

  return tiles;
}

/**
 * Find the starting tile for a circle (first tile of that circle).
 */
export function getCircleStartTile(board: Tile[], circleId: CircleId): Tile {
  const tile = board.find((t) => t.circleId === circleId && t.index === 0);
  if (!tile) throw new Error(`Circle ${circleId} not found on board`);
  return tile;
}

/**
 * Get all tiles in a circle, ordered by index.
 */
export function getCircleTiles(board: Tile[], circleId: CircleId): Tile[] {
  return board
    .filter((t) => t.circleId === circleId)
    .sort((a, b) => a.index - b.index);
}

/**
 * Find the tile that comes after the given tile.
 * If it's a gate tile, returns the first tile of the NEXT circle (ascending).
 * If it's the gate of circle 1, returns null (escape!).
 */
export function getNextTile(board: Tile[], currentTileId: string): Tile | null {
  const current = board.find((t) => t.id === currentTileId);
  if (!current) throw new Error(`Tile ${currentTileId} not found`);

  // If it's a gate tile, ascend to the next circle
  if (current.isGate) {
    const nextCircleId = (current.circleId - 1) as CircleId;
    if (nextCircleId < 1) {
      // Escaped from circle 1 gate — GAME WIN!
      return null;
    }
    return getCircleStartTile(board, nextCircleId);
  }

  // Next tile in the same circle
  const sameCircle = getCircleTiles(board, current.circleId);
  const nextIndex = current.index + 1;
  const next = sameCircle.find((t) => t.index === nextIndex);
  if (next) return next;

  // Should not happen — gate should always be last
  return null;
}

/**
 * Get the tile at a given offset from the current tile.
 * Positive = forward, negative = backward.
 * Can cross circles (forward through gate, or backward to previous circle).
 */
export function getTileAtOffset(board: Tile[], currentTileId: string, offset: number): Tile | null {
  if (offset === 0) return board.find((t) => t.id === currentTileId) ?? null;

  let tile: Tile | null = board.find((t) => t.id === currentTileId) ?? null;
  if (!tile) return null;

  if (offset > 0) {
    for (let i = 0; i < offset; i++) {
      tile = getNextTile(board, tile!.id);
      if (!tile) break; // escaped
    }
  } else {
    for (let i = 0; i < Math.abs(offset); i++) {
      tile = getPreviousTile(board, tile!.id);
    }
  }

  return tile;
}

function getPreviousTile(board: Tile[], currentTileId: string): Tile | null {
  const current = board.find((t) => t.id === currentTileId);
  if (!current) return null;

  // If it's the first tile of a circle, go back to previous circle's last tile
  if (current.index === 0) {
    const prevCircleId = (current.circleId + 1) as CircleId;
    if (prevCircleId > 9) return null; // Can't go deeper than circle 9
    const prevCircleTiles = getCircleTiles(board, prevCircleId);
    return prevCircleTiles[prevCircleTiles.length - 1] ?? null;
  }

  // Previous tile in the same circle
  const sameCircle = getCircleTiles(board, current.circleId);
  const prevIndex = current.index - 1;
  return sameCircle.find((t) => t.index === prevIndex) ?? null;
}

/**
 * Calculate the remaining tiles until escape (circle 1 gate).
 */
export function tilesUntilEscape(board: Tile[], currentTileId: string): number {
  let count = 0;
  let tile: Tile | null = board.find((t) => t.id === currentTileId) ?? null;

  while (tile) {
    tile = getNextTile(board, tile.id);
    if (tile) count++;
  }

  return count;
}

/**
 * Get the escape gate tile (last tile of circle 1).
 */
export function getEscapeGate(board: Tile[]): Tile {
  const c1Tiles = getCircleTiles(board, 1);
  return c1Tiles[c1Tiles.length - 1];
}
