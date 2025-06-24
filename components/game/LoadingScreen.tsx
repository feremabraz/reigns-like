import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const resourceIcons = ['✝', '♦', '⚔', '$'];

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

  useEffect(() => {
    if (!isLoadingComplete) return;

    const handleKeyPress = (_event: KeyboardEvent) => {
      onLoadingComplete();
    };

    const handleClick = () => {
      onLoadingComplete();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [isLoadingComplete, onLoadingComplete]);

  return (
    <motion.div
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white relative overflow-hidden cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center justify-center gap-8 mb-2 bg-gray-800 border border-gray-600 px-16 py-4 rounded">
          {resourceIcons.map((icon) => (
            <div key={icon} className="text-3xl text-gray-400">
              {icon}
            </div>
          ))}
        </div>

        <motion.div
          className="text-center my-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-6xl font-serif tracking-wider text-white drop-shadow-lg">
            The King is Dead
          </h1>
          <p className="text-gray-400 text-lg mt-2">A new reign begins...</p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <motion.div
              className="h-full bg-white rounded-full"
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {!isLoadingComplete ? (
            <motion.div
              className="text-gray-500 text-sm"
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
                className="text-white text-base mb-1"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                Press any key to continue
              </motion.div>
              <div className="text-gray-500 text-xs">or click anywhere</div>
            </motion.div>
          )}
        </motion.div>

        {isLoadingComplete && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="text-gray-400 text-xs tracking-wide">Ready to rule!</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
