import { motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSound } from '@/hooks/useSound';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
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
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative font-normal cursor-pointer">
      {/* Coronation background for loading screen */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/coronation-01.png"
          alt="Coronation Background"
          fill
          className="object-cover opacity-80"
          priority
          draggable={false}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-5" />

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
            className="backdrop-blur-sm bg-gray-900/60 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600 mx-auto mb-4">
              <motion.div
                className="h-full bg-white rounded-full"
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {!isLoadingComplete ? (
              <motion.div
                className="text-gray-300 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
                Loading... {loadingProgress}%
              </motion.div>
            ) : (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-white text-base"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  Press anywhere to continue
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
