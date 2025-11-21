import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/primitives/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/primitives/card';
import { Progress } from '@/components/ui/primitives/progress';
import { Screen, ScreenBackground } from '@/components/ui/themed/screen';
import { useSound } from '@/hooks/useSound';
import { sample } from '@/lib/utils';

const CORONATION_BACKGROUNDS = [
  { src: '/backgrounds/coronation-01.png', alt: 'Coronation ceremony hall' },
  { src: '/backgrounds/coronation-02.png', alt: 'Sun-drenched cathedral interior' },
];

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [coronationBackground] = useState(() => sample(CORONATION_BACKGROUNDS));
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const { playSound } = useSound();

  // Simulate loading progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsLoadingComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(progressInterval);
  }, []);

  // Handle user interaction to continue
  useEffect(() => {
    if (!isLoadingComplete) return;

    const handleInteraction = () => {
      playSound('click');
      onLoadingComplete();
    };

    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [isLoadingComplete, onLoadingComplete, playSound]);

  return (
    <Screen className="cursor-pointer">
      <ScreenBackground src={coronationBackground.src} alt={coronationBackground.alt} />

      {/* Game title at the top */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-8xl font-bold text-white drop-shadow-lg mb-2">The King is Dead</h1>
          <p className="text-gray-400 text-lg">A new reign begins...</p>
        </motion.div>
      </div>

      {/* Loading progress at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-16">
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div
            className="drop-shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="border-white/15 bg-black/60">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-serif tracking-widest text-white">
                  Ascending the Throne
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {isLoadingComplete ? 'Ceremony prepared' : 'Stabilizing the realm'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  className="w-full"
                  animate={{ opacity: isLoadingComplete ? 0.8 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Progress value={loadingProgress} />
                </motion.div>

                {!isLoadingComplete ? (
                  <motion.p
                    className="text-gray-300 text-sm font-mono"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  >
                    Loading... {loadingProgress}%
                  </motion.p>
                ) : (
                  <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Badge variant="glow">Ready</Badge>
                    <motion.p
                      className="text-white text-base"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    >
                      Press anywhere to continue
                    </motion.p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Screen>
  );
}
