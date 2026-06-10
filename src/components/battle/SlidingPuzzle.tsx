'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  size: number;          // 3 = 3x3 (8 tiles + 1 empty)
  maxMoves: number;       // max moves allowed
  onResult: (success: boolean) => void;
}

type Tile = number | null; // null = empty space

function createBoard(size: number): { board: Tile[]; emptyIdx: number } {
  const total = size * size;
  const tiles: number[] = Array.from({ length: total - 1 }, (_, i) => i + 1);
  // Shuffle by doing random valid moves
  let emptyIdx = total - 1;
  const board: Tile[] = [...tiles, null];
  const dirs = [-size, size, -1, 1]; // up, down, left, right

  for (let i = 0; i < 100; i++) {
    const valid = dirs.filter((d) => {
      const newIdx = emptyIdx + d;
      if (newIdx < 0 || newIdx >= total) return false;
      if (d === -1 && emptyIdx % size === 0) return false;
      if (d === 1 && emptyIdx % size === size - 1) return false;
      return true;
    });
    const d = valid[Math.floor(Math.random() * valid.length)];
    const swapIdx = emptyIdx + d;
    board[emptyIdx] = board[swapIdx];
    board[swapIdx] = null;
    emptyIdx = swapIdx;
  }

  return { board, emptyIdx };
}

function isSolved(board: Tile[]): boolean {
  const total = board.length;
  for (let i = 0; i < total - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[total - 1] === null;
}

export default function SlidingPuzzle({ size, maxMoves, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [board, setBoard] = useState<Tile[]>([]);
  const [emptyIdx, setEmptyIdx] = useState(0);
  const [moves, setMoves] = useState(0);
  const boardRef = useRef<Tile[]>([]);
  const emptyRef = useRef(0);
  const movesRef = useRef(0);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const startGame = useCallback(() => {
    const { board: newBoard, emptyIdx: newEmpty } = createBoard(size);
    setBoard(newBoard);
    boardRef.current = newBoard;
    setEmptyIdx(newEmpty);
    emptyRef.current = newEmpty;
    setMoves(0);
    movesRef.current = 0;
    setPhase('playing');
  }, [size]);

  const handleMove = useCallback((idx: number) => {
    if (phase !== 'playing') return;
    const empty = emptyRef.current;
    const total = size * size;
    const row = Math.floor(idx / size);
    const emptyRow = Math.floor(empty / size);
    const col = idx % size;
    const emptyCol = empty % size;

    // Only allow adjacent moves (same row, col diff 1 OR same col, row diff 1)
    const isAdjacent = (row === emptyRow && Math.abs(col - emptyCol) === 1) || (col === emptyCol && Math.abs(row - emptyRow) === 1);
    if (!isAdjacent) return;

    const newBoard = [...boardRef.current];
    newBoard[empty] = newBoard[idx];
    newBoard[idx] = null;
    boardRef.current = newBoard;
    emptyRef.current = idx;
    setBoard(newBoard);
    setEmptyIdx(idx);
    movesRef.current += 1;
    setMoves(movesRef.current);

    if (isSolved(newBoard)) {
      setPhase('done');
      setTimeout(() => onResultRef.current(true), 400);
    } else if (movesRef.current >= maxMoves) {
      setPhase('done');
      setTimeout(() => onResultRef.current(false), 400);
    }
  }, [phase, size, maxMoves]);

  const totalCells = size * size;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold mb-2">
            {locale === 'en' ? `Solve in ${maxMoves} moves!` : `${maxMoves}회 이동 내에 맞춰라!`}
          </p>
          <button onClick={startGame} className="px-6 py-3 bg-indigo-700 hover:bg-indigo-600 text-indigo-200 font-bold rounded-xl text-lg active:scale-95 transition-transform">
            {locale === 'en' ? '▶ START' : '▶ 시작'}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="text-center">
          <p className="text-[10px] text-stone-500 mb-2">
            {locale === 'en' ? `Moves: ${moves}/${maxMoves}` : `이동: ${moves}/${maxMoves}회`}
          </p>
          <div
            className="grid gap-1 mx-auto"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: size * 52, height: size * 52 }}
          >
            {Array.from({ length: totalCells }, (_, i) => {
              const tile = board[i] ?? null;
              if (tile === null) {
                return <div key={i} className="w-12 h-12 rounded-lg bg-stone-900/50 border border-stone-800/30" />;
              }
              return (
                <motion.button
                  key={tile}
                  onClick={() => handleMove(i)}
                  className="w-12 h-12 rounded-lg bg-indigo-800/60 border border-indigo-600/40 flex items-center justify-center text-lg font-bold text-indigo-200 hover:bg-indigo-700 active:bg-indigo-900 transition-colors shadow-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  {tile}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${isSolved(boardRef.current) ? 'text-emerald-400' : 'text-red-400'}`}>
            {isSolved(boardRef.current)
              ? (locale === 'en' ? `✅ Solved in ${moves} moves!` : `✅ ${moves}회만에 완성!`)
              : (locale === 'en' ? `❌ Not solved! (${moves} moves)` : `❌ 실패! (${moves}회)`)}
          </p>
        </div>
      )}
    </div>
  );
}
