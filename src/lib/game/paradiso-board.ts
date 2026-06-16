import type { ParadisoTile, SphereId } from '@/types/game';
import { SPHERES } from '@/lib/data/paradiso';

export function buildParadisoBoard(): ParadisoTile[] {
  const board: ParadisoTile[] = [];
  let globalIdx = 0;
  for (const sphere of SPHERES) {
    const tiles = buildSphereTiles(sphere.id);
    for (const t of tiles) {
      t.globalIndex = globalIdx++;
      board.push(t);
    }
  }
  return board;
}

function buildSphereTiles(sphereId: SphereId): ParadisoTile[] {
  const tiles: ParadisoTile[] = [];
  const sphere = SPHERES.find(s => s.id === sphereId)!;

  const makeTile = (index: number, type: ParadisoTile['type'], spiritKey?: 'A' | 'B') => ({
    id: `s${sphereId}-q${index}`,
    sphereId, index, globalIndex: 0, type,
    spiritId: spiritKey ? (spiritKey === 'A' ? sphere.spiritAId : sphere.spiritBId) : undefined,
    label: type === 'blessing' ? 'blessing' : type === 'archangel' ? 'archangel' : `spirit-${sphereId}`,
  });

  // A - B - blessing - A - B - blessing - B - A - blessing - B → Archangel
  tiles.push(makeTile(0, 'spirit', 'A'));
  tiles.push(makeTile(1, 'spirit', 'B'));
  tiles.push(makeTile(2, 'blessing'));
  tiles.push(makeTile(3, 'spirit', 'A'));
  tiles.push(makeTile(4, 'spirit', 'B'));
  tiles.push(makeTile(5, 'blessing'));
  tiles.push(makeTile(6, 'spirit', 'B'));
  tiles.push(makeTile(7, 'spirit', 'A'));
  tiles.push(makeTile(8, 'blessing'));
  tiles.push(makeTile(9, 'spirit', 'B'));

  return tiles;
}

export function getNextParadisoTile(board: ParadisoTile[], currentTileId: string): ParadisoTile | null {
  const current = board.find((t) => t.id === currentTileId);
  if (!current) return null;
  const nextGlobal = current.globalIndex + 1;
  if (nextGlobal >= board.length) return null;
  return board.find((t) => t.globalIndex === nextGlobal) ?? null;
}

export function remainingTilesInSphere(board: ParadisoTile[], currentTileId: string): number {
  const current = board.find((t) => t.id === currentTileId);
  if (!current) return 0;
  const sphereTiles = board.filter((t) => t.sphereId === current.sphereId);
  return sphereTiles.filter((t) => t.index >= current.index).length;
}
