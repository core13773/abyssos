import { Suspense } from 'react';
import GameClient from './GameClient';

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-950">
          <div className="text-center">
            <p className="text-2xl animate-pulse text-purple-400">🌅</p>
            <p className="text-stone-400 mt-2">Loading game...</p>
          </div>
        </div>
      }
    >
      <GameClient />
    </Suspense>
  );
}
