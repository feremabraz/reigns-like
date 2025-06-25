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

export default function UnlayeredGameCard() {
  const [cardIndex, setCardIndex] = useAtom(cardIndexAtom);
  const [card] = useAtom(currentCardAtom);
  const applyEffect = useSetAtom(applyCardEffectAtom);
  const setCurrentCard = useSetAtom(currentCardAtom);
  const setYearsInPower = useSetAtom(yearsInPowerAtom);

  // Drag direction state (local only for animation)
  const [dragDirection, setDragDirection] = React.useState<'left' | 'right' | null>(null);

  const { playSound } = useSound();

  // Handle choice selection
  const handleChoice = (choice: 'yes' | 'no') => {
    if (!card) return;

    // Play the appropriate sound effect
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
        className="relative w-80 h-[400px] gauntlet-open"
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
        {/* Single unlayered illustration */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <div className="relative" style={{ width: '90%', height: '90%' }}>
              <Image
                src="/cards/card-illustration-unlayered-01.png"
                alt="Card illustration"
                fill
                className="object-contain"
                style={{
                  imageRendering: 'pixelated',
                  objectPosition: 'center center',
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Card template overlay with transparency */}
        <div className="absolute inset-0 w-full h-full z-30 pointer-events-none">
          <Image
            src="/cards/card-template.png"
            alt="Card template"
            fill
            className="object-contain"
            draggable={false}
          />
        </div>

        {/* Character name on ribbon */}
        <div
          className="absolute left-1/2 z-40"
          style={{
            top: 205,
            transform: 'translateX(-50%)',
            width: 200,
            height: 35,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <h3
            className="font-bold text-base text-center whitespace-nowrap w-full"
            style={{ lineHeight: '1.1' }}
          >
            {card.character}
          </h3>
        </div>

        {/* Prompt text below ribbon */}
        <div
          className="absolute left-1/2 z-40"
          style={{ top: 250, transform: 'translateX(-50%)', width: 190, pointerEvents: 'none' }}
        >
          <p
            className="text-black text-sm leading-tight font-medium text-center w-full"
            style={{ wordBreak: 'break-word' }}
          >
            {card.prompt}
          </p>
        </div>

        {/* Drag direction overlay */}
        <motion.div
          className="absolute top-0 left-0 w-80 h-[400px] pointer-events-none z-50 rounded-lg"
          animate={{
            backgroundColor:
              dragDirection === 'left'
                ? 'rgba(220, 38, 38, 0.4)' // Strong red matching destructive button
                : dragDirection === 'right'
                  ? 'rgba(34, 197, 94, 0.4)' // Strong green matching default button
                  : 'rgba(0, 0, 0, 0)',
          }}
          transition={{ duration: 0.2 }}
        />
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
