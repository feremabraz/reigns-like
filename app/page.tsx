'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import GameCard from '@/components/game/GameCard';
import GameOverScreen from '@/components/game/GameOverScreen';
import LoadingScreen from '@/components/game/LoadingScreen';
import ResourceMeters from '@/components/game/ResourceMeters';
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

  useEffect(() => {
    if (!currentCard && !isGameOver && !isLoading) {
      setCurrentCard(gameCards[0]);
      setCardIndex(0);
    }
  }, [currentCard, isGameOver, isLoading, setCurrentCard, setCardIndex]);

  const handleLoadingComplete = () => {
    completeLoading();
  };

  const handleCardChoice = () => {};

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
        <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <ResourceMeters />
          <div className="text-center">
            <h2 className="text-xl font-semibold">{currentCalendarYear}</h2>
          </div>
        </header>
        <main className="flex items-center justify-center min-h-screen pt-16">
          {currentCard && <GameCard card={currentCard} onChoice={handleCardChoice} />}
        </main>
      </div>
    </AnimatePresence>
  );
}
