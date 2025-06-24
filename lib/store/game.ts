import { atom } from 'jotai';

export interface GameCard {
  id: string;
  character: string;
  prompt: string;
  yesText?: string;
  noText?: string;
  yesEffect: ResourceEffect;
  noEffect: ResourceEffect;
}

export interface ResourceEffect {
  church?: number;
  people?: number;
  army?: number;
  wealth?: number;
}

export interface GameResources {
  church: number;
  people: number;
  army: number;
  wealth: number;
}

export interface ReignRecord {
  monarchName: string;
  yearStarted: number;
  yearEnded: number;
  yearsRuled: number;
  causeOfDeath: string;
  reignNumber: number;
  isCurrent?: boolean;
}

// Game state atoms
export const isLoadingAtom = atom(true);
export const gameResourcesAtom = atom<GameResources>({
  church: 50,
  people: 50,
  army: 50,
  wealth: 50,
});

export const currentCardAtom = atom<GameCard | null>(null);
export const cardIndexAtom = atom(0);
export const yearsInPowerAtom = atom(1);
export const totalReignsAtom = atom(1);
export const reignHistoryAtom = atom<ReignRecord[]>([]);
export const isGameOverAtom = atom(false);
export const deathReasonAtom = atom('');

// Action atoms
export const applyCardEffectAtom = atom(null, (get, set, effect: ResourceEffect) => {
  const currentResources = get(gameResourcesAtom);
  const newResources = { ...currentResources };

  // Apply effects
  if (effect.church !== undefined) {
    newResources.church = Math.max(0, Math.min(100, newResources.church + effect.church));
  }
  if (effect.people !== undefined) {
    newResources.people = Math.max(0, Math.min(100, newResources.people + effect.people));
  }
  if (effect.army !== undefined) {
    newResources.army = Math.max(0, Math.min(100, newResources.army + effect.army));
  }
  if (effect.wealth !== undefined) {
    newResources.wealth = Math.max(0, Math.min(100, newResources.wealth + effect.wealth));
  }

  set(gameResourcesAtom, newResources);

  // Check for game over conditions
  const dangerouslyLow = Object.values(newResources).some((value) => value <= 0);
  const dangerouslyHigh = Object.values(newResources).some((value) => value >= 100);

  if (dangerouslyLow || dangerouslyHigh) {
    const yearsInPower = get(yearsInPowerAtom);
    const totalReigns = get(totalReignsAtom);
    const reignHistory = get(reignHistoryAtom);

    set(isGameOverAtom, true);

    // Set death reason and add to reign history
    let causeOfDeath = '';
    if (newResources.church <= 0) {
      causeOfDeath = 'Excommunicated by the Church';
      set(
        deathReasonAtom,
        'The Church has excommunicated you for your heretical ways. Your reign ends in spiritual darkness.'
      );
    } else if (newResources.church >= 100) {
      causeOfDeath = 'Overthrown by the Church';
      set(
        deathReasonAtom,
        'The Church has gained too much power and has declared you unfit to rule. A theocracy rises in your place.'
      );
    } else if (newResources.people <= 0) {
      causeOfDeath = 'Overthrown by the People';
      set(
        deathReasonAtom,
        'The people have risen in revolt against your tyrannical rule. You flee the kingdom in the dead of night.'
      );
    } else if (newResources.people >= 100) {
      causeOfDeath = 'Deposed by Popular Demand';
      set(
        deathReasonAtom,
        'The people have grown too powerful and demand democracy. Your monarchy crumbles under their united voice.'
      );
    } else if (newResources.army <= 0) {
      causeOfDeath = 'Conquered by Enemies';
      set(
        deathReasonAtom,
        'Without an army to protect you, neighboring kingdoms invade and divide your lands amongst themselves.'
      );
    } else if (newResources.army >= 100) {
      causeOfDeath = 'Military Coup';
      set(
        deathReasonAtom,
        'Your military has grown too powerful and stages a coup. The generals now rule in your stead.'
      );
    } else if (newResources.wealth <= 0) {
      causeOfDeath = 'Bankrupted the Kingdom';
      set(
        deathReasonAtom,
        'The royal treasury is empty. Unable to pay your debts, you are forced to abdicate and flee to avoid debtors prison.'
      );
    } else if (newResources.wealth >= 100) {
      causeOfDeath = 'Corrupted by Wealth';
      set(
        deathReasonAtom,
        'Your excessive wealth has corrupted the kingdom. Merchants now hold more power than the crown itself.'
      );
    }

    // Add current reign to history
    const newReignRecord: ReignRecord = {
      monarchName: `King ${getMonarchName(totalReigns)}`,
      yearStarted: 700 + (totalReigns - 1) * 10, // Approximate start year
      yearEnded: 700 + (totalReigns - 1) * 10 + yearsInPower,
      yearsRuled: yearsInPower,
      causeOfDeath,
      reignNumber: totalReigns,
    };

    set(reignHistoryAtom, [...reignHistory, newReignRecord]);
  }
});

export const resetGameAtom = atom(null, (get, set) => {
  const totalReigns = get(totalReignsAtom);

  set(isLoadingAtom, true);
  set(gameResourcesAtom, {
    church: 50,
    people: 50,
    army: 50,
    wealth: 50,
  });
  set(currentCardAtom, null);
  set(cardIndexAtom, 0);
  set(yearsInPowerAtom, 1);
  set(totalReignsAtom, totalReigns + 1);
  set(isGameOverAtom, false);
  set(deathReasonAtom, '');
});

export const completeLoadingAtom = atom(null, (_get, set) => {
  set(isLoadingAtom, false);
});

// Helper function to generate monarch names
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
