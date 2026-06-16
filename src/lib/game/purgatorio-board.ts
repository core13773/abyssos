import type { PurgatorioTile, TerraceId, EventKind } from '@/types/game';
import { TERRACES } from '@/lib/data/purgatorio';

/**
 * Build purgatorio linear board: 8 tiles per terrace × 7 = 56 tiles.
 *
 * Pattern: A - B - Choice - A - B - Prayer - B - Choice → Angel
 * (전진만 가능, 후퇴 없음)
 */
export function buildPurgatorioBoard(): PurgatorioTile[] {
  const board: PurgatorioTile[] = [];
  let globalIdx = 0;

  for (const terrace of TERRACES) {
    const tiles = buildTerraceTiles(terrace.id);
    for (const t of tiles) {
      t.globalIndex = globalIdx++;
      board.push(t);
    }
  }
  return board;
}

function buildTerraceTiles(terraceId: TerraceId): PurgatorioTile[] {
  const tiles: PurgatorioTile[] = [];

  const makeTile = (
    index: number,
    type: PurgatorioTile['type'],
    opts?: { sinKey?: 'A' | 'B'; eventKind?: EventKind }
  ) => {
    const terrace = TERRACES.find(t => t.id === terraceId)!;
    return {
      id: `t${terraceId}-p${index}`,
      terraceId,
      index,
      globalIndex: 0,
      type,
      sinProjectionId: opts?.sinKey
        ? (opts.sinKey === 'A' ? terrace.sinAId : terrace.sinBId)
        : undefined,
      eventKind: opts?.eventKind,
      label: type === 'event' ? (opts?.eventKind || 'event') : `sin-${terraceId}`,
    };
  };

  // A - B - Choice - A - B - Prayer - B - Choice → Angel
  tiles.push(makeTile(0, 'sin', { sinKey: 'A' }));
  tiles.push(makeTile(1, 'sin', { sinKey: 'B' }));
  tiles.push(makeTile(2, 'event', { eventKind: 'choice' }));
  tiles.push(makeTile(3, 'sin', { sinKey: 'A' }));
  tiles.push(makeTile(4, 'sin', { sinKey: 'B' }));
  tiles.push(makeTile(5, 'event', { eventKind: 'rest' }));
  tiles.push(makeTile(6, 'sin', { sinKey: 'B' }));
  tiles.push(makeTile(7, 'event', { eventKind: 'choice' }));

  return tiles;
}

/** Get next tile in the purgatorio board (forward only, no pushback) */
export function getNextPurgatorioTile(
  board: PurgatorioTile[],
  currentTileId: string
): PurgatorioTile | null {
  const current = board.find((t) => t.id === currentTileId);
  if (!current) return null;
  const nextGlobal = current.globalIndex + 1;
  if (nextGlobal >= board.length) return null;
  return board.find((t) => t.globalIndex === nextGlobal) ?? null;
}

/** Count remaining tiles in current terrace (including current tile) */
export function remainingTilesInTerrace(
  board: PurgatorioTile[],
  currentTileId: string
): number {
  const current = board.find((t) => t.id === currentTileId);
  if (!current) return 0;
  const terraceTiles = board.filter((t) => t.terraceId === current.terraceId);
  return terraceTiles.filter((t) => t.index >= current.index).length;
}
