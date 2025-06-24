import { useAtom, useSetAtom } from 'jotai';
import { motion, useAnimate } from 'motion/react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { gameCards } from '@/lib/data/cards';
import {
  applyCardEffectAtom,
  cardIndexAtom,
  currentCardAtom,
  type GameCard,
  yearsInPowerAtom,
} from '@/lib/store/game';

interface GameCardProps {
  card: GameCard;
  onChoice: (choice: 'yes' | 'no') => void;
}

export default function GameCardComponent({ card, onChoice }: GameCardProps) {
  const [scope] = useAnimate();
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const applyEffect = useSetAtom(applyCardEffectAtom);
  const setCurrentCard = useSetAtom(currentCardAtom);
  const [cardIndex, setCardIndex] = useAtom(cardIndexAtom);
  const setYearsInPower = useSetAtom(yearsInPowerAtom);

  const handleChoice = useCallback(
    (choice: 'yes' | 'no') => {
      const effect = choice === 'yes' ? card.yesEffect : card.noEffect;
      applyEffect(effect);

      const nextIndex = (cardIndex + 1) % gameCards.length;
      setCardIndex(nextIndex);
      setCurrentCard(gameCards[nextIndex]);

      if (nextIndex % 3 === 0) {
        setYearsInPower((prev) => prev + 1);
      }

      onChoice(choice);
    },
    [applyEffect, card, cardIndex, onChoice, setCardIndex, setCurrentCard, setYearsInPower]
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'z') handleChoice('no');
      else if (event.key.toLowerCase() === 'x') handleChoice('yes');
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleChoice]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-64 h-10 flex justify-between items-center mb-2 px-4">
        <motion.div
          className="text-blue-400 font-semibold text-lg"
          animate={{ opacity: dragDirection === 'left' ? 1 : 0.5 }}
        >
          {card.noText}
        </motion.div>
        <motion.div
          className="text-green-400 font-semibold text-lg"
          animate={{ opacity: dragDirection === 'right' ? 1 : 0.5 }}
        >
          {card.yesText}
        </motion.div>
      </div>

      <motion.div
        key={card.id}
        className="relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          x: dragDirection === 'left' ? -300 : 300,
          rotate: dragDirection === 'left' ? -15 : 15,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          ref={scope}
          className="w-64 h-80 bg-amber-100 border-4 border-amber-800 rounded-lg shadow-lg cursor-grab active:cursor-grabbing overflow-hidden relative"
          drag="x"
          dragConstraints={{ left: -200, right: 200 }}
          onDrag={(_, info) => {
            const dx = info.delta.x;
            const newDirection = dx > 0 ? 'right' : 'left';
            if (newDirection !== dragDirection) setDragDirection(newDirection);
          }}
          onDragEnd={(_, info) => {
            setDragDirection(null);
            if (Math.abs(info.point.x) > 100) {
              const choice = info.point.x > 0 ? 'yes' : 'no';
              handleChoice(choice);
            }
          }}
        >
          <div className="flex items-center justify-center h-64 p-4">
            <div className="w-48 h-48 relative">
              <Image
                src={card.characterImage}
                alt={card.character}
                layout="fill"
                className="object-cover rounded-lg"
                draggable={false}
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-amber-200 border-t-2 border-amber-800 p-3">
            <h3 className="text-gray-800 text-center font-normal text-sm">{card.character}</h3>
          </div>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              backgroundColor:
                dragDirection === 'left'
                  ? 'rgba(59, 130, 246, 0.2)'
                  : dragDirection === 'right'
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'rgba(0, 0, 0, 0)',
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
