import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useResourceLoader } from '@/hooks/useResourceLoader';
import { useSound } from '@/hooks/useSound';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const { playSound } = useSound();
  const { progress, isLoading } = useResourceLoader();

  useEffect(() => {
    if (!isLoading && progress.percentage >= 100) {
      setIsLoadingComplete(true);
    }
  }, [isLoading, progress.percentage]);

  const handleContinue = () => {
    if (isLoadingComplete) {
      playSound('click');
      onLoadingComplete();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleContinue();
    }
  };

  return (
    <button
      type="button"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-cover bg-center bg-no-repeat cursor-gauntlet-open border-0 p-0"
      style={{
        backgroundImage: "url('/backgrounds/coronation-01.png')",
        imageRendering: 'pixelated',
      }}
      onClick={handleContinue}
      onKeyDown={handleKeyDown}
      disabled={!isLoadingComplete}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full p-8">
        {/* Title at top */}
        <div className="flex-shrink-0 pt-16">
          <motion.h1
            className="text-6xl font-bold text-center text-white drop-shadow-2xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The King is Dead
          </motion.h1>
        </div>

        {/* Loading section at bottom */}
        <div className="flex-shrink-0 w-full max-w-md">
          {/* Loading progress bar */}
          <motion.div
            className="w-full bg-gray-800/80 rounded-full h-4 mb-6 overflow-hidden backdrop-blur-sm border border-gray-600"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg"
              style={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Loading text and resource info */}
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <p className="text-lg font-medium mb-2">Loading... {progress.percentage}%</p>
            {progress.currentResource && (
              <p className="text-sm text-gray-300">{progress.currentResource.split('/').pop()}</p>
            )}
            <p className="text-sm text-gray-400 mt-2">
              {progress.loaded} / {progress.total} resources
            </p>
          </motion.div>

          {/* Continue prompt (only when loading is complete) */}
          {isLoadingComplete && (
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-xl text-white font-medium cursor-pointer hover:text-yellow-300 transition-colors"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Press anywhere to continue
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>
    </button>
  );
}
