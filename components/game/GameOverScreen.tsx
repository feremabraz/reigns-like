import { useAtomValue, useSetAtom } from 'jotai';
import { motion } from 'motion/react';
import Image from 'next/image';
import { gameCards } from '@/lib/data/cards';
import {
  cardIndexAtom,
  currentCardAtom,
  deathReasonAtom,
  reignHistoryAtom,
  resetGameAtom,
  totalReignsAtom,
  yearsInPowerAtom,
} from '@/lib/store/game';
import buildingAsset01 from '@/public/ui/01.png';
import buildingAsset02 from '@/public/ui/02.png';

export default function GameOverScreen() {
  const deathReason = useAtomValue(deathReasonAtom);
  const yearsInPower = useAtomValue(yearsInPowerAtom);
  const totalReigns = useAtomValue(totalReignsAtom);
  const reignHistory = useAtomValue(reignHistoryAtom);
  const resetGame = useSetAtom(resetGameAtom);
  const setCurrentCard = useSetAtom(currentCardAtom);
  const setCardIndex = useSetAtom(cardIndexAtom);

  const handleRestart = () => {
    resetGame();
    setCardIndex(0);
    setCurrentCard(gameCards[0]);
  };

  const currentMonarchName = `King ${getMonarchName(totalReigns)}`;
  const currentYear = 700 + (totalReigns - 1) * 10 + yearsInPower;

  const timelineData = [
    ...reignHistory,
    {
      monarchName: currentMonarchName,
      yearStarted: 700 + (totalReigns - 1) * 10,
      yearEnded: currentYear,
      yearsRuled: yearsInPower,
      causeOfDeath: deathReason,
      reignNumber: totalReigns,
      isCurrent: true,
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center text-gray-200 p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="relative mb-12">
            <motion.div
              className="absolute left-0 -top-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Image
                src={buildingAsset01}
                alt="Start of reign"
                width={96}
                height={96}
                className="object-contain opacity-80"
              />
            </motion.div>
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 -top-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Image
                src={buildingAsset02}
                alt="Middle of reign"
                width={96}
                height={96}
                className="object-contain opacity-80"
              />
            </motion.div>
          </div>

          <div className="relative w-full h-2 bg-gray-700 rounded-full mb-8 shadow-lg">
            <div className="absolute w-full h-full flex justify-between">
              {timelineData.map((reign, index) => (
                <motion.div
                  key={reign.reignNumber}
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="absolute -top-2.5 w-6 h-6 bg-gray-500 rounded-full border-4 border-gray-800" />
                  {reign.isCurrent && (
                    <div className="absolute -top-12 w-max text-center transform -translate-x-1/2">
                      <div className="text-sm text-red-400 font-semibold">{reign.causeOfDeath}</div>
                      <div className="text-xs text-gray-400">{reign.yearEnded}</div>
                    </div>
                  )}
                  {!reign.isCurrent && (
                    <div className="absolute -top-12 w-max text-center transform -translate-x-1/2">
                      <div className="text-sm text-gray-300">{reign.monarchName}</div>
                      <div className="text-xs text-gray-500">
                        {getOrdinalNumber(reign.reignNumber)} King
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <h1 className="text-5xl text-gray-200 mb-4 drop-shadow-lg">Long live the</h1>
          <h1 className="text-6xl text-gray-100 tracking-wider drop-shadow-2xl">King</h1>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <motion.div
            onClick={handleRestart}
            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 px-12 py-4 rounded-lg shadow-2xl border-2 border-gray-600 transition-all duration-300"
          >
            <div className="flex items-center gap-3 text-lg">
              <span>👑</span>
              <span>Continue the Legacy</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-center text-gray-500 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        >
          Reign #{totalReigns} • The kingdom awaits its next ruler
        </motion.p>
      </div>
    </motion.div>
  );
}

function getMonarchName(reignNumber: number): string {
  const names = [
    'Edmund',
    'Edward',
    'Henry',
    'Richard',
    'William',
    'Harold',
    'Stephen',
    'John',
    'Geoffrey',
    'Robert',
    'Thomas',
    'Baldwin',
    'Roger',
    'Hugh',
    'Walter',
    'Gilbert',
  ];
  return (
    names[(reignNumber - 1) % names.length] +
    (reignNumber > names.length ? ` ${Math.floor((reignNumber - 1) / names.length) + 1}` : '')
  );
}

function getOrdinalNumber(num: number): string {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
}
