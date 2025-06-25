import { useCallback } from 'react';

type SoundType = 'click' | 'select-yes' | 'select-no';

export function useSound() {
  const playSound = useCallback((type: SoundType) => {
    let soundFile = '';

    switch (type) {
      case 'click':
        soundFile = '/sounds/click.ogg';
        break;
      case 'select-yes':
        soundFile = '/sounds/select-yes.ogg';
        break;
      case 'select-no':
        soundFile = '/sounds/select-no.ogg';
        break;
      default:
        return;
    }

    const audio = new Audio(soundFile);
    audio.volume = 0.5; // Adjust volume as needed
    audio.play().catch((error) => console.error('Error playing sound:', error));
  }, []);

  return { playSound };
}
