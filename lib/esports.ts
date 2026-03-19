export interface Team {
  id: string;
  name: string;
  acronym: string;
  logoUrl: string;
  color: string;
  roster: Player[];
}

export interface Player {
  handle: string;
  fullName?: string;
  role: "Duelist" | "Initiator" | "Controller" | "Sentinel" | "Flex" | "IGL";
  countryCode: string; // ISO 2 letter
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  status: "upcoming" | "live" | "completed";
  startTime: string; // ISO String
  tournament: string;
  bestOf: number;
}

export interface Standing {
  teamId: string;
  team: Team;
  wins: number;
  losses: number;
  mapDiff: number;
  roundDiff: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

export const TEAMS: Record<string, Team> = {
  fnc: {
    id: "fnc",
    name: "FNATIC",
    acronym: "FNC",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Esports_organization_Fnatic_logo.svg/1024px-Esports_organization_Fnatic_logo.svg.png",
    color: "#ff5900",
    roster: [
      { handle: "Boaster", role: "IGL", countryCode: "gb" },
      { handle: "Derke", role: "Duelist", countryCode: "fi" },
      { handle: "Alfajer", role: "Sentinel", countryCode: "tr" },
      { handle: "Leo", role: "Initiator", countryCode: "se" },
      { handle: "Chronicle", role: "Flex", countryCode: "ru" },
    ],
  },
  navi: {
    id: "navi",
    name: "Natus Vincere",
    acronym: "NAVI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Natus_Vincere_logo.svg/2048px-Natus_Vincere_logo.svg.png",
    color: "#ffee00",
    roster: [
      { handle: "ANGE1", role: "IGL", countryCode: "ua" },
      { handle: "Shao", role: "Initiator", countryCode: "ru" },
      { handle: "Zyppan", role: "Flex", countryCode: "se" },
      { handle: "SUYGETSU", role: "Sentinel", countryCode: "ru" },
      { handle: "ardiis", role: "Duelist", countryCode: "lv" },
    ],
  },
  kc: {
    id: "kc",
    name: "Karmine Corp",
    acronym: "KC",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Karmine_Corp_logo.svg/1200px-Karmine_Corp_logo.svg.png",
    color: "#0055ff",
    roster: [
      { handle: "N4RRATE", role: "Duelist", countryCode: "us" },
      { handle: "MAGNUM", role: "IGL", countryCode: "cz" },
      { handle: "marteen", role: "Duelist", countryCode: "cz" },
      { handle: "sh1n", role: "Initiator", countryCode: "fr" },
      { handle: "tomaszy", role: "Flex", countryCode: "pt" },
    ],
  },
  tl: {
    id: "tl",
    name: "Team Liquid",
    acronym: "TL",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Team_Liquid_logo.svg/1200px-Team_Liquid_logo.svg.png",
    color: "#002b5e",
    roster: [
      { handle: "Jamppi", role: "Flex", countryCode: "fi" },
      { handle: "nAts", role: "Sentinel", countryCode: "ru" },
      { handle: "Enzo", role: "IGL", countryCode: "fr" },
      { handle: "Keiko", role: "Duelist", countryCode: "gb" },
      { handle: "Mistic", role: "Controller", countryCode: "gb" },
    ],
  },
};

// Start times calculated relative to "now" for realism
const now = new Date();
const nextMatch1 = new Date(now.getTime() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000); // in 2h 15m
const nextMatch2 = new Date(now.getTime() + 26 * 60 * 60 * 1000); // tomorrow
const pastMatch1 = new Date(now.getTime() - 24 * 60 * 60 * 1000); // yesterday

export const MATCHES: Match[] = [
  {
    id: "m1",
    team1: TEAMS.fnc,
    team2: TEAMS.navi,
    score1: 0,
    score2: 0,
    status: "upcoming",
    startTime: nextMatch1.toISOString(),
    tournament: "VCT 2026 EMEA KICKOFF",
    bestOf: 3,
  },
  {
    id: "m2",
    team1: TEAMS.kc,
    team2: TEAMS.tl,
    score1: 0,
    score2: 0,
    status: "upcoming",
    startTime: nextMatch2.toISOString(),
    tournament: "VCT 2026 EMEA KICKOFF",
    bestOf: 3,
  },
  {
    id: "m3",
    team1: TEAMS.fnc,
    team2: TEAMS.tl,
    score1: 2,
    score2: 1,
    status: "completed",
    startTime: pastMatch1.toISOString(),
    tournament: "VCT 2026 EMEA KICKOFF",
    bestOf: 3,
  },
  {
    id: "m4",
    team1: TEAMS.kc,
    team2: TEAMS.navi,
    score1: 0,
    score2: 2,
    status: "completed",
    startTime: new Date(pastMatch1.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    tournament: "VCT 2026 EMEA KICKOFF",
    bestOf: 3,
  },
];

export const STANDINGS: Standing[] = [
  { teamId: "fnc", team: TEAMS.fnc, wins: 4, losses: 0, mapDiff: +6, roundDiff: +42 },
  { teamId: "navi", team: TEAMS.navi, wins: 3, losses: 1, mapDiff: +3, roundDiff: +18 },
  { teamId: "kc", team: TEAMS.kc, wins: 2, losses: 2, mapDiff: -1, roundDiff: -4 },
  { teamId: "tl", team: TEAMS.tl, wins: 0, losses: 4, mapDiff: -8, roundDiff: -56 },
];

export async function getProMatches(): Promise<Match[]> {
  return MATCHES.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

export async function getStandings(): Promise<Standing[]> {
  return STANDINGS.sort((a, b) => b.wins - a.wins || b.mapDiff - a.mapDiff);
}

export async function getTeams(): Promise<Team[]> {
  return Object.values(TEAMS);
}
