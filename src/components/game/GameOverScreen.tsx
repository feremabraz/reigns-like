import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { motion } from 'motion/react';

import { Badge } from '@/components/ui/primitives/badge';
import { Button } from '@/components/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/primitives/card';
import { Separator } from '@/components/ui/primitives/separator';
import { GlareCard } from '@/components/ui/themed/glare-card';
import { Panel } from '@/components/ui/themed/panel';
import { Screen, ScreenBackground } from '@/components/ui/themed/screen';
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
import { sample } from '@/lib/utils';

const FUNERAL_BACKGROUNDS = [
  { src: '/backgrounds/funeral-01.png', alt: 'Funeral march through the capital' },
  { src: '/backgrounds/funeral-02.png', alt: 'Somber cathedral funeral service' },
];

export default function GameOverScreen() {
  const deathReason = useAtomValue(deathReasonAtom);
  const yearsInPower = useAtomValue(yearsInPowerAtom);
  const totalReigns = useAtomValue(totalReignsAtom);
  const resetGame = useSetAtom(resetGameAtom);
  const setCurrentCard = useSetAtom(currentCardAtom);
  const setCardIndex = useSetAtom(cardIndexAtom);
  const { playSound } = useSound();
  const [funeralBackground] = useState(() => sample(FUNERAL_BACKGROUNDS));

  const handleRestart = () => {
    playSound('click');
    resetGame();
    setCardIndex(0);
    setCurrentCard(gameCards[0]);
  };

  const currentMonarchName = `King ${getMonarchName(totalReigns)}`;
  const currentYear = 700 + (totalReigns - 1) * 10 + yearsInPower;

  return (
    <Screen>
      <ScreenBackground src={funeralBackground.src} alt={funeralBackground.alt} />

      {/* Header with year (matching main game style) */}
      <header className="fixed top-0 left-0 right-0 z-10 flex justify-center items-center p-4">
        <Panel padding="sm" className="text-center">
          <h2 className="text-xl font-semibold">{currentYear}</h2>
        </Panel>
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
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlareCard padding="md" tone="royal" className="w-full max-w-lg mx-auto">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Badge variant="glow" className="px-4">
                    {currentMonarchName}
                  </Badge>
                  <p className="text-gray-300 text-sm">Long live the reign that was.</p>
                </div>

                <Card className="border-white/10 bg-gray-900/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-white">Legacy Report</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Years in power</span>
                      <span className="font-semibold text-white">{yearsInPower}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Year of death</span>
                      <span className="font-semibold text-white">{currentYear}</span>
                    </div>

                    <Separator className="my-2" />

                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                        Cause of death
                      </p>
                      <p className="text-red-300 text-lg font-medium">"{deathReason}"</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                  <Button variant="default" size="lg" onClick={handleRestart}>
                    Continue the Legacy
                  </Button>
                  <p className="text-gray-400 text-sm text-center">
                    Reign #{totalReigns + 1} • The kingdom awaits its next ruler
                  </p>
                </div>
              </div>
            </GlareCard>
          </motion.div>
        </motion.div>
      </main>
    </Screen>
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
