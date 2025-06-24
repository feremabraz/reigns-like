import { useAtomValue } from 'jotai';
import { motion } from 'motion/react';
import { gameResourcesAtom } from '@/lib/store/game';

const resourceIcons = {
  church: '✝',
  people: '♦',
  army: '⚔',
  wealth: '$',
};

export default function ResourceMeters() {
  const resources = useAtomValue(gameResourcesAtom);

  const getDotsCount = (value: number) => {
    if (value <= 20) return 1;
    if (value <= 40) return 2;
    if (value <= 60) return 3;
    if (value <= 80) return 4;
    return 5;
  };

  return (
    <motion.div
      className="flex justify-center items-center gap-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {Object.entries(resources).map(([key, value], index) => {
        const resourceKey = key as keyof typeof resources;
        const dotsCount = getDotsCount(value);
        const dotKeys = ['dot1', 'dot2', 'dot3', 'dot4', 'dot5'];

        return (
          <motion.div
            key={key}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
          >
            <div className="flex gap-1 mb-2 h-2">
              {dotKeys.map((dotKey, i) => (
                <motion.div
                  key={`${key}-${dotKey}`}
                  className="w-1.5 h-1.5 rounded-full"
                  animate={{
                    backgroundColor: i < dotsCount ? '#FFFFFF' : '#FFFFFF33',
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            <div className="text-white text-3xl">{resourceIcons[resourceKey]}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
