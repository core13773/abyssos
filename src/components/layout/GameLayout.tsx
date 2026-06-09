'use client';

import LinearBoard from '@/components/board-v4/LinearBoard';
import DicePanel from '@/components/dice/DicePanel';
import PlayerPanel from '@/components/player/PlayerPanel';
import GuardianPanel from '@/components/guardian/GuardianPanel';
import TutorialModal from '@/components/layout/TutorialModal';
import BattleModal from '@/components/battle/BattleModal';
import GatekeeperModal from '@/components/events/GatekeeperModal';
import GuardianRewardModal from '@/components/guardian/GuardianRewardModal';

export default function GameLayout() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto p-2 min-h-screen">
      {/* Status bar */}
      <section aria-label="Player Status">
        <PlayerPanel />
      </section>

      {/* Linear Board */}
      <section className="flex-1 min-h-0" aria-label="Game Board">
        <LinearBoard />
      </section>

      {/* Dice */}
      <section aria-label="Dice Roller">
        <DicePanel />
      </section>

      {/* Guardians + log */}
      <section className="pb-4" aria-label="Guardian Cards">
        <GuardianPanel />
      </section>

      {/* Tutorial (first visit only) */}
      <TutorialModal />

      {/* Modals */}
      <BattleModal />
      <GatekeeperModal />
      <GuardianRewardModal />
    </div>
  );
}
