import { useAtom, useSetAtom } from 'jotai';
import { motion } from 'motion/react';
import * as React from 'react';
import { PixelCardLayers } from '@/components/game/PixelCardLayers';

import { Badge } from '@/components/ui/primitives/badge';
import { Button } from '@/components/ui/primitives/button';
import { ButtonGroup } from '@/components/ui/primitives/button-group';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/primitives/card';
import { GlareCard } from '@/components/ui/themed/glare-card';
import { Ribbon } from '@/components/ui/themed/ribbon';
import { SpeechBubble } from '@/components/ui/themed/speech-bubble';
import { useSound } from '@/hooks/useSound';
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
  const cardArt = card.art;

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
        <PixelCardLayers art={cardArt} />
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
          }}
        >
          <Ribbon variant="gold" className="w-full px-3 py-1 text-xs">
            {card.character}
          </Ribbon>
        </div>
        {/* Prompt text below ribbon */}
        <div
          className="absolute left-1/2 z-40"
          style={{ top: 250, transform: 'translateX(-50%)', width: 190, pointerEvents: 'none' }}
        >
          <SpeechBubble
            tone="parchment"
            tail="bottom"
            className="pointer-events-none text-center text-sm leading-tight"
          >
            {card.prompt}
          </SpeechBubble>
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
      <GlareCard className="mt-6 w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <Badge className="mx-auto w-fit uppercase tracking-widest">Royal Counsel</Badge>
          <CardTitle className="text-white">How will you respond?</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 text-base">{card.prompt}</CardContent>
        <CardFooter>
          <ButtonGroup className="w-full" spacing="md">
            <Button
              variant="destructive"
              size="lg"
              tabIndex={0}
              className="flex-1"
              onClick={() => handleChoice('no')}
            >
              {card.noText}
            </Button>
            <Button
              variant="default"
              size="lg"
              tabIndex={0}
              className="flex-1"
              onClick={() => handleChoice('yes')}
            >
              {card.yesText}
            </Button>
          </ButtonGroup>
        </CardFooter>
      </GlareCard>
    </div>
  );
}
