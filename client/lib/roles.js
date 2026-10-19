// Role copy and the night action each role takes. `tone` picks the role's colour in game.css.
export const ROLES = {
  MAFIA: {
    label: 'Mafia',
    team: 'Mafia',
    tone: 'mafia',
    blurb: 'Each night, choose a player to eliminate with your team. Stay hidden by day.',
    goal: 'Outnumber the town.',
    night: { prompt: 'Choose who to eliminate', verb: 'Marked' },
  },
  DOCTOR: {
    label: 'Doctor',
    team: 'Town',
    tone: 'doctor',
    blurb: 'Each night, protect one player from being killed. You may protect yourself.',
    goal: 'Find and vote out every Mafia member.',
    night: { prompt: 'Choose who to protect', verb: 'Protected' },
  },
  DETECTIVE: {
    label: 'Detective',
    team: 'Town',
    tone: 'detective',
    blurb: 'Each night, investigate one player to learn whether they are Mafia.',
    goal: 'Find and vote out every Mafia member.',
    night: { prompt: 'Choose who to investigate', verb: 'Investigating' },
  },
  VILLAGER: {
    label: 'Villager',
    team: 'Town',
    tone: 'villager',
    blurb: 'You have no night power. Find the Mafia by talking and voting.',
    goal: 'Find and vote out every Mafia member.',
    night: null,
  },
};

// Career ranks by total wins.
export const RANKS = [
  { name: 'Associate', wins: 0 },
  { name: 'Soldier', wins: 3 },
  { name: 'Capo', wins: 10 },
  { name: 'Consigliere', wins: 25 },
  { name: 'Underboss', wins: 50 },
  { name: 'Don', wins: 100 },
];

export function rankOf(wins = 0) {
  let i = 0;
  while (i + 1 < RANKS.length && wins >= RANKS[i + 1].wins) i++;
  const next = RANKS[i + 1] || null;
  const from = RANKS[i].wins;
  return { ...RANKS[i], level: i + 1, next, progress: next ? (wins - from) / (next.wins - from) : 1 };
}
