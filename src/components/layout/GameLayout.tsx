'use client';

import { useGameStore } from '@/lib/store/gameStore';
import LinearBoard from '@/components/board-v4/LinearBoard';
import PurgatorioBoardComponent from '@/components/board-v4/PurgatorioBoard';
import ParadisoBoardComponent from '@/components/board-v4/ParadisoBoard';
import PurgatorioPlayerPanel from '@/components/player/PurgatorioPlayerPanel';
import PurgatorioDicePanel from '@/components/dice/PurgatorioDicePanel';
import GuardianPanel from '@/components/guardian/GuardianPanel';
import TutorialModal from '@/components/layout/TutorialModal';
import BattleModal from '@/components/battle/BattleModal';
import GatekeeperModal from '@/components/events/GatekeeperModal';
import AngelModal from '@/components/events/AngelModal';
import ArchangelModal from '@/components/events/ArchangelModal';
import GuardianRewardModal from '@/components/guardian/GuardianRewardModal';
import PurificationRewardModal from '@/components/guardian/PurificationRewardModal';
import CelestialRewardModal from '@/components/guardian/CelestialRewardModal';
import PurgatorioContinueModal from '@/components/events/PurgatorioContinueModal';

import DemonDuel from '@/components/battle/DemonDuel';
import SinChoiceModal from '@/components/events/SinChoiceModal';

export default function GameLayout() {
  const player = useGameStore((s) => s.player);
  const era = player.era;
  const isPurgatorio = era === 'purgatorio';
  const isParadiso = era === 'paradiso';
  const isInferno = era === 'inferno';
  const escaped = useGameStore((s) => s.escaped);
  const phase = useGameStore((s) => s.phase);

  const renderBoard = () => {
    if (isParadiso) return <ParadisoBoardComponent />;
    if (isPurgatorio) return <PurgatorioBoardComponent />;
    return <LinearBoard />;
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto p-2 min-h-screen">
      <section aria-label="Player Status">
        <PurgatorioPlayerPanel />
      </section>

      <section className="flex-1 min-h-0" aria-label="Game Board">
        {renderBoard()}
      </section>

      <section aria-label="Dice Roller">
        <PurgatorioDicePanel />
      </section>

      <section className="pb-4" aria-label="Guardian Cards">
        <GuardianPanel />
      </section>

      <TutorialModal />
      <DemonDuel />
      {/* Inferno modals */}
      {isInferno && <BattleModal />}
      {isInferno && <GatekeeperModal />}
      {isInferno && <GuardianRewardModal />}
      {/* Purgatorio modals */}
      {isPurgatorio && <SinChoiceModal />}
      {isPurgatorio && <AngelModal />}
      {isPurgatorio && <PurificationRewardModal />}
      {/* PurgatorioContinueModal: shown when Inferno is completed, offering transition to Purgatorio */}
      {isInferno && escaped && phase === 'gameOver' && <PurgatorioContinueModal />}
      {/* Paradiso modals */}
      {isParadiso && <ArchangelModal />}
      {isParadiso && <CelestialRewardModal />}
    </div>
  );
}
