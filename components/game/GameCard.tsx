import { useAtom, useSetAtom } from 'jotai';
import { motion } from 'motion/react';
import Image from 'next/image';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { gameCards } from '@/lib/data/cards';
import {
  applyCardEffectAtom,
  cardIndexAtom,
  currentCardAtom,
  yearsInPowerAtom,
} from '@/lib/store/game';

export default function GameCard() {
  const [cardIndex, setCardIndex] = useAtom(cardIndexAtom);
  const [card] = useAtom(currentCardAtom);
  const applyEffect = useSetAtom(applyCardEffectAtom);
  const setCurrentCard = useSetAtom(currentCardAtom);
  const setYearsInPower = useSetAtom(yearsInPowerAtom);

  // Drag direction state (local only for animation)
  const [dragDirection, setDragDirection] = React.useState<'left' | 'right' | null>(null);

  // Handle choice selection
  const handleChoice = (choice: 'yes' | 'no') => {
    if (!card) return;
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
        className="relative w-64 h-80"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          x: dragDirection === 'left' ? -300 : 300,
          rotate: dragDirection === 'left' ? -15 : 15,
        }}
        transition={{ duration: 0.3 }}
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        onDrag={(_, info) => setDragDirection(info.offset.x < 0 ? 'left' : 'right')}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 120) handleChoice(info.offset.x < 0 ? 'no' : 'yes');
          setDragDirection(null);
        }}
        style={{ touchAction: 'pan-x', cursor: 'grab' }}
      >
        {/* Background illustration layer (arch clipped) */}
        <div
          className="absolute top-8 left-6 w-52 h-28 overflow-hidden z-10"
          style={{ borderRadius: '90px/64px', imageRendering: 'pixelated' }}
        >
          <Image
            src="/cards/card-illustration-background-01.png"
            alt="Card background"
            fill
            className="object-cover"
            draggable={false}
          />
        </div>
        {/* Foreground illustration layer */}
        <div
          className="absolute inset-0 w-full h-full z-20"
          style={{ imageRendering: 'pixelated' }}
        >
          <Image
            src="/cards/card-illustration-foreground-01.png"
            alt="Card foreground"
            fill
            className="object-contain"
            draggable={false}
          />
        </div>
        {/* Card template/frame layer */}
        <div
          className="absolute inset-0 w-full h-full z-30"
          style={{ imageRendering: 'pixelated' }}
        >
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
            top: 164,
            transform: 'translateX(-50%)',
            width: 160,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <h3
            className="font-bold text-sm text-center whitespace-nowrap w-full"
            style={{ lineHeight: '1.1' }}
          >
            {card.character}
          </h3>
        </div>
        {/* Prompt text below ribbon */}
        <div
          className="absolute left-1/2 z-40"
          style={{ top: 200, transform: 'translateX(-50%)', width: 152, pointerEvents: 'none' }}
        >
          <p
            className="text-black text-xs leading-tight font-medium text-center w-full"
            style={{ wordBreak: 'break-word' }}
          >
            {card.prompt}
          </p>
        </div>
        {/* Drag direction overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-50"
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
      {/* Choices below card */}
      <div className="flex flex-row items-center justify-center gap-8 mt-6 mx-auto">
        <Button
          variant="ghost"
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400 font-semibold text-base px-8 py-4 rounded-none relative backdrop-blur-sm"
          tabIndex={0}
          onClick={() => handleChoice('no')}
        >
          {card.noText}
        </Button>
        <Button
          variant="ghost"
          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-400 font-semibold text-base px-8 py-4 rounded-none relative backdrop-blur-sm"
          tabIndex={0}
          onClick={() => handleChoice('yes')}
        >
          {card.yesText}
        </Button>
      </div>
    </div>
  );
}
