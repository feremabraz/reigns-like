import type { GameCard } from '@/lib/store/game';

export const gameCards: GameCard[] = [
  {
    id: 'advisor-1',
    character: 'Royal Advisor',
    prompt: 'Your Majesty, the treasury is running low. Shall we raise taxes on the merchants?',
    yesEffect: { wealth: 15, people: -10 },
    noEffect: { wealth: -5, people: 5 },
    yesText: 'Tax the merchants',
    noText: 'Keep taxes low',
  },
  {
    id: 'priest-1',
    character: 'High Priest',
    prompt:
      'The Church requests funds to build a new cathedral. Will you support this holy endeavor?',
    yesEffect: { church: 20, wealth: -15 },
    noEffect: { church: -15, wealth: 5 },
    yesText: 'Fund the cathedral',
    noText: 'Decline the request',
  },
  {
    id: 'general-1',
    character: 'General',
    prompt: 'Our borders are threatened by bandits. Should we increase military spending?',
    yesEffect: { army: 15, wealth: -10 },
    noEffect: { army: -10, people: -5 },
    yesText: 'Strengthen the army',
    noText: 'Maintain current forces',
  },
  {
    id: 'peasant-1',
    character: 'Village Elder',
    prompt:
      'The harvest was poor this year. The people are hungry. Will you open the royal granaries?',
    yesEffect: { people: 20, wealth: -10 },
    noEffect: { people: -15, wealth: 5 },
    yesText: 'Share the grain',
    noText: 'Preserve royal stores',
  },
  {
    id: 'merchant-1',
    character: 'Guild Master',
    prompt:
      'A trade opportunity with neighboring kingdoms could bring great wealth, but may anger the Church.',
    yesEffect: { wealth: 20, church: -10 },
    noEffect: { wealth: -5, church: 5 },
    yesText: 'Pursue trade',
    noText: 'Decline the offer',
  },
  {
    id: 'noble-1',
    character: 'Duke',
    prompt:
      'The nobles demand more influence in court decisions. Will you grant them a council seat?',
    yesEffect: { wealth: 10, people: -15, army: 5 },
    noEffect: { wealth: -5, people: 10, army: -5 },
    yesText: 'Grant their request',
    noText: 'Maintain royal authority',
  },
  {
    id: 'spy-1',
    character: 'Royal Spy',
    prompt:
      'I have discovered a plot against your life. Shall we arrest the conspirators publicly?',
    yesEffect: { army: 10, people: -10, church: -5 },
    noEffect: { army: -5, people: 5 },
    yesText: 'Public arrests',
    noText: 'Handle discretely',
  },
  {
    id: 'jester-1',
    character: 'Court Jester',
    prompt:
      'The people are unhappy, Your Majesty. Shall I organize a grand festival to lift their spirits?',
    yesEffect: { people: 15, wealth: -10 },
    noEffect: { people: -5, wealth: 2 },
    yesText: 'Hold the festival',
    noText: 'Cancel the festivities',
  },
  {
    id: 'witch-1',
    character: 'Mysterious Woman',
    prompt: 'I offer you knowledge of dark arts that could strengthen your rule. Do you accept?',
    yesEffect: { army: 15, church: -20, people: -5 },
    noEffect: { church: 10, army: -5 },
    yesText: 'Accept her offer',
    noText: 'Reject dark magic',
  },
  {
    id: 'knight-1',
    character: 'Knight Commander',
    prompt: 'A dragon terrorizes the countryside. Shall we organize a quest to slay the beast?',
    yesEffect: { army: -10, people: 15, church: 10 },
    noEffect: { army: 5, people: -10 },
    yesText: 'Send knights',
    noText: 'Ignore the threat',
  },
  {
    id: 'scholar-1',
    character: 'Royal Scholar',
    prompt:
      'I propose establishing a university to advance learning. This requires significant investment.',
    yesEffect: { wealth: -15, people: 10, church: -5 },
    noEffect: { wealth: 5, people: -5, church: 5 },
    yesText: 'Build the university',
    noText: 'Focus on current needs',
  },
  {
    id: 'ambassador-1',
    character: 'Foreign Ambassador',
    prompt:
      'My kingdom offers a military alliance, but we require tribute as a sign of good faith.',
    yesEffect: { army: 20, wealth: -15 },
    noEffect: { army: -5, wealth: 5 },
    yesText: 'Accept the alliance',
    noText: 'Decline the offer',
  },
];
