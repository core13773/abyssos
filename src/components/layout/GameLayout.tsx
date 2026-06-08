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
      {/* Zone 1: Status bar */}
      <PlayerPanel />

      {/* Zone 2: Linear Board */}
      <div className="flex-1 min-h-0">
        <LinearBoard />
      </div>

      {/* Zone 3: Dice */}
      <DicePanel />

      {/* Zone 4: Guardians + log */}
      <div className="pb-4">
        <GuardianPanel />
      </div>

      {/* Tutorial (first visit only) */}
      <TutorialModal />

      {/* Modals */}
      <BattleModal />
      <GatekeeperModal />
      <GuardianRewardModal />
    </div>
  );
}
