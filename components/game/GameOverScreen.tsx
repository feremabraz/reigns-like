import { useAtomValue, useSetAtom } from 'jotai';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';
import { gameCards } from '@/lib/data/cards';
import {
  cardIndexAtom,
  currentCardAtom,
  deathReasonAtom,
  resetGameAtom,
  totalReignsAtom,
  yearsInPowerAtom,
} from '@/lib/store/game';

export default function GameOverScreen() {
  const deathReason = useAtomValue(deathReasonAtom);
  const yearsInPower = useAtomValue(yearsInPowerAtom);
  const totalReigns = useAtomValue(totalReignsAtom);
  const resetGame = useSetAtom(resetGameAtom);
  const setCurrentCard = useSetAtom(currentCardAtom);
  const setCardIndex = useSetAtom(cardIndexAtom);
  const { playSound } = useSound();

  const handleRestart = () => {
    playSound('click');
    resetGame();
    setCardIndex(0);
    setCurrentCard(gameCards[0]);
  };

  const currentMonarchName = `King ${getMonarchName(totalReigns)}`;
  const currentYear = 700 + (totalReigns - 1) * 10 + yearsInPower;

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative font-normal">
      {/* Same pixel art background as main game */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/funeral-01.png"
          alt="Background"
          fill
          className="object-cover opacity-80"
          priority
          draggable={false}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-5" />

      {/* Header with year (matching main game style) */}
      <header className="fixed top-0 left-0 right-0 z-10 flex justify-center items-center p-4">
        <div className="backdrop-blur-sm bg-gray-900/60 rounded-lg px-4 py-2 text-center">
          <h2 className="text-xl font-semibold">{currentYear}</h2>
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center min-h-screen pt-16 relative z-10">
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Game Over Title */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-red-400 mb-2 drop-shadow-lg">Long live the</h1>
            <h1 className="text-6xl font-bold text-white tracking-wider drop-shadow-2xl">King</h1>
          </motion.div>

          {/* Death information card (matching the backdrop style from main game) */}
          <motion.div
            className="backdrop-blur-sm bg-gray-900/80 rounded-lg p-6 mb-8 border border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">{currentMonarchName}</h2>
            <div className="text-gray-300 space-y-2 mb-4">
              <p>
                Ruled for <span className="text-white font-semibold">{yearsInPower}</span> years
              </p>
              <p>
                Year of death: <span className="text-white font-semibold">{currentYear}</span>
              </p>
            </div>
            <div className="border-t border-gray-600 pt-4">
              <p className="text-gray-400 text-sm mb-1">Cause of Death:</p>
              <p className="text-red-300 text-lg font-medium">"{deathReason}"</p>
            </div>
          </motion.div>

          {/* Continue button (matching the backdrop style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button variant="default" size="lg" onClick={handleRestart}>
              Continue the Legacy
            </Button>
            <p className="text-gray-400 text-sm mt-4">
              Reign #{totalReigns + 1} • The kingdom awaits its next ruler
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

function getMonarchName(reignNumber: number): string {
  const names = [
    'Edmund',
    'Edward',
    'Henry',
    'Richard',
    'William',
    'John',
    'Charles',
    'George',
    'James',
    'Louis',
    'Philip',
    'Arthur',
    'Frederick',
    'Albert',
    'Victor',
    'Alexander',
    'Theodore',
    'Constantine',
    'Maximilian',
    'Sebastian',
    'Bartholomew',
    'Reginald',
    'Archibald',
    'Cornelius',
  ];
  return names[(reignNumber - 1) % names.length];
}
