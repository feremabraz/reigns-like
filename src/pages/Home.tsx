import { AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import GameCard from '@/components/game/GameCard';
import WebGLStage from '@/components/game/WebGLStage';
import GameOverScreen from '@/components/game/GameOverScreen';
import LoadingScreen from '@/components/game/LoadingScreen';
import ResourceMeters from '@/components/game/ResourceMeters';
import { Panel } from '@/components/ui/themed/panel';
import { Screen, ScreenBackground } from '@/components/ui/themed/screen';
import { gameCards } from '@/lib/data/cards';
import {
  cardIndexAtom,
  completeLoadingAtom,
  currentCardAtom,
  isGameOverAtom,
  isLoadingAtom,
  yearsInPowerAtom,
} from '@/lib/store/game';
import { sample } from '@/lib/utils';

const HOME_BACKGROUNDS = [
  { src: '/backgrounds/castle-01.png', alt: 'Castle throne room at dusk' },
  { src: '/backgrounds/castle-02.png', alt: 'Sunlit royal courtyard' },
];

const Home = () => {
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  const isGameOver = useAtomValue(isGameOverAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const yearsInPower = useAtomValue(yearsInPowerAtom);
  const setCardIndex = useSetAtom(cardIndexAtom);
  const completeLoading = useSetAtom(completeLoadingAtom);
  const [homeBackground] = useState(() => sample(HOME_BACKGROUNDS));

  useEffect(() => {
    if (!currentCard && !isGameOver && !isLoading) {
      setCurrentCard(gameCards[0]);
      setCardIndex(0);
    }
  }, [currentCard, isGameOver, isLoading, setCurrentCard, setCardIndex]);

  const handleLoadingComplete = () => {
    completeLoading();
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
      <Screen>
        <WebGLStage />
        <ScreenBackground
          src={homeBackground.src}
          alt={homeBackground.alt}
          overlayClassName="bg-black/30"
        />
        <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center gap-4 p-4">
          <Panel padding="sm" className="w-full max-w-lg">
            <ResourceMeters />
          </Panel>
          <Panel padding="sm" className="text-center min-w-[120px]">
            <h2 className="text-xl font-semibold">{currentCalendarYear}</h2>
          </Panel>
        </header>
        <main className="flex items-center justify-center min-h-screen pt-16 relative z-5">
          {currentCard && <GameCard />}
        </main>
      </Screen>
    </AnimatePresence>
  );
};

export default Home;
