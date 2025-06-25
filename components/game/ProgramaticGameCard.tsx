'use client';

import { useAtom, useSetAtom } from 'jotai';
import { motion } from 'motion/react';
import Image from 'next/image';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';
import { gameCards } from '@/lib/data/cards';
import {
  applyCardEffectAtom,
  cardIndexAtom,
  currentCardAtom,
  yearsInPowerAtom,
} from '@/lib/store/game';

// GBA-style effects component for the destructive variant
const DestructiveGBAEffects = () => (
  <>
    {/* LCD scanlines effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-800/20 to-transparent pointer-events-none" />
    {/* LCD glare effect */}
    <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
  </>
);

export default function ProgramaticGameCard() {
  const [cardIndex, setCardIndex] = useAtom(cardIndexAtom);
  const [card] = useAtom(currentCardAtom);
  const applyEffect = useSetAtom(applyCardEffectAtom);
  const setCurrentCard = useSetAtom(currentCardAtom);
  const setYearsInPower = useSetAtom(yearsInPowerAtom);

  const [dragDirection, setDragDirection] = React.useState<'left' | 'right' | null>(null);

  const { playSound } = useSound();

  const handleChoice = (choice: 'yes' | 'no') => {
    if (!card) return;

    playSound(choice === 'yes' ? 'select-yes' : 'select-no');

    const effect = choice === 'yes' ? card.yesEffect : card.noEffect;
    applyEffect(effect);
    const nextIndex = (cardIndex + 1) % gameCards.length;
    setCardIndex(nextIndex);
    setCurrentCard(gameCards[nextIndex]);
    if (nextIndex % 3 === 0) setYearsInPower((prev) => prev + 1);
  };

  if (!card) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        key={card.id}
        className="relative w-80 h-[400px] gauntlet-open bg-stone-900 rounded-2xl shadow-lg p-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          x: dragDirection === 'left' ? -375 : 375,
          rotate: dragDirection === 'left' ? -15 : 15,
        }}
        transition={{ duration: 0.3 }}
        drag="x"
        dragConstraints={{ left: -250, right: 250 }}
        onDrag={(_, info) => setDragDirection(info.offset.x < 0 ? 'left' : 'right')}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 150) handleChoice(info.offset.x < 0 ? 'no' : 'yes');
          setDragDirection(null);
        }}
        style={{ touchAction: 'pan-x' }}
      >
        {/* Inner card face */}
        <div className="w-full h-full bg-stone-800 rounded-lg relative">
          {/* Illustration Area */}
          <div className="absolute top-2 left-2 right-2 h-[180px] rounded-md overflow-hidden shadow-inner shadow-stone-800/50 ring-12 ring-inset ring-black/40">
            <Image
              src="/cards/card-illustration-unlayered-01.png"
              alt="Card Illustration"
              fill
              className="object-contain"
              draggable={false}
            />
          </div>

          {/* Ribbon for Character Name */}
          <div className="absolute top-[205px] left-1/2 -translate-x-1/2 w-[200px] h-8 bg-gradient-to-b from-red-900 to-red-950 border border-gray-800 z-30 flex items-center justify-center shadow-md rounded-md overflow-hidden">
            <DestructiveGBAEffects />
            <h3 className="relative z-10 font-orbitron font-bold text-sm text-red-300 text-center whitespace-nowrap w-full">
              {card.character}
            </h3>
          </div>

          {/* Prompt Text Area */}
          <div className="absolute top-[250px] left-1/2 -translate-x-1/2 w-[280px] p-4 z-30">
            <p className="text-white text-sm leading-tight font-medium text-center w-full">
              {card.prompt}
            </p>
          </div>

          {/* Drag direction overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-40 rounded-lg"
            animate={{
              backgroundColor:
                dragDirection === 'left'
                  ? 'rgba(220, 38, 38, 0.4)'
                  : dragDirection === 'right'
                    ? 'rgba(34, 197, 94, 0.4)'
                    : 'rgba(0, 0, 0, 0)',
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </motion.div>

      {/* Choices below card */}
      <div className="flex flex-row items-center justify-center gap-8 mt-6 mx-auto">
        <Button variant="destructive" size="lg" tabIndex={0} onClick={() => handleChoice('no')}>
          {card.noText}
        </Button>
        <Button variant="default" size="lg" tabIndex={0} onClick={() => handleChoice('yes')}>
          {card.yesText}
        </Button>
      </div>
    </div>
  );
}
