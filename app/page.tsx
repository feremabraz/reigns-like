'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useEffect } from 'react';
import GameOverScreen from '@/components/game/GameOverScreen';
import LoadingScreen from '@/components/game/LoadingScreen';
import ProgramaticGameCard from '@/components/game/ProgramaticGameCard';
import ResourceMeters from '@/components/game/ResourceMeters';
import { useAmbientMusic } from '@/hooks/useAmbientMusic';
import { gameCards } from '@/lib/data/cards';
import {
  cardIndexAtom,
  completeLoadingAtom,
  currentCardAtom,
  isGameOverAtom,
  isLoadingAtom,
  yearsInPowerAtom,
} from '@/lib/store/game';

export default function Home() {
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  const isGameOver = useAtomValue(isGameOverAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const yearsInPower = useAtomValue(yearsInPowerAtom);
  const setCardIndex = useSetAtom(cardIndexAtom);
  const completeLoading = useSetAtom(completeLoadingAtom);
  const { play: playAmbientMusic, isLoading: musicLoading } = useAmbientMusic();

  useEffect(() => {
    if (!currentCard && !isGameOver && !isLoading) {
      setCurrentCard(gameCards[0]);
      setCardIndex(0);
    }
  }, [currentCard, isGameOver, isLoading, setCurrentCard, setCardIndex]);

  const handleLoadingComplete = () => {
    completeLoading();
    // Start ambient music when game begins
    if (!musicLoading) {
      playAmbientMusic();
    }
  };

  const currentCalendarYear = 700 + yearsInPower;

  if (isLoading) {
    return (
      <AnimatePresence mode="wait">
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      </AnimatePresence>
    );
  }

  if (isGameOver) {
    return (
      <AnimatePresence mode="wait">
        <GameOverScreen />
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative font-normal">
        {/* Pixel art background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/backgrounds/castle-01.png"
            alt="Background"
            fill
            className="object-cover opacity-80"
            priority
            draggable={false}
          />
        </div>
        <header className="fixed top-0 left-0 right-0 z-10 p-4">
          <div className="flex justify-between items-center w-full bg-gray-900/60 backdrop-blur-sm rounded-lg p-2">
            <ResourceMeters />
            <div className="text-center px-4">
              <h2 className="text-xl font-semibold">{currentCalendarYear}</h2>
            </div>
          </div>
        </header>
        <main className="flex items-center justify-center min-h-screen pt-16 relative z-5">
          {currentCard && <ProgramaticGameCard />}
        </main>
        <footer className="fixed bottom-0 left-0 right-0 z-10 p-4">
          <div className="flex justify-center items-center w-full bg-gray-900/60 backdrop-blur-sm rounded-lg p-4">
            <p>placeholder</p>
          </div>
        </footer>
      </div>
    </AnimatePresence>
  );
}
