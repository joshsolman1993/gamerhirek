// Valorant API types (Henrik-3 API v2/v3)

export interface ValorantAccount {
  name: string;
  tag: string;
  puuid: string;
  region: string;
  card: {
    small: string;
    large: string;
    wide: string;
    id: string;
  };
  title: string;
  level: number;
}

export interface ValorantMMR {
  name: string;
  tag: string;
  current_data: {
    currenttier: number;
    currenttierpatched: string;
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    images: {
      small: string;
      large: string;
      triangle_down: string;
      triangle_up: string;
    } | null;
  };
  highest_rank: {
    patched_tier: string;
    tier: number;
    season: string;
  };
  mmr_history: MMREntry[];
}

export interface MMREntry {
  currenttier: number;
  currenttierpatched: string;
  ranking_in_tier: number;
  mmr_change_to_last_game: number;
  date: string;
  match_id: string;
}

export interface ValorantMatch {
  metadata: {
    matchid: string;
    map: string;
    mode: string;
    started_at: string;
  };
  players: {
    all_players: MatchPlayer[];
  };
  teams: {
    red: { has_won: boolean; rounds_won: number };
    blue: { has_won: boolean; rounds_won: number };
  };
}

export interface MatchPlayer {
  name: string;
  tag: string;
  team: string;
  character: string;
  tier: number;
  level: number;
  assets: {
    agent: { small: string; full: string; bust: string };
    card: { small: string };
  };
  stats: {
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    damage: { made: number; received: number };
    shots: { head: number; body: number; leg: number };
    rounds: { wins: number; played: number };
    playtime: { milliseconds: number };
    ability_casts: {
      c_cast: number;
      q_cast: number;
      e_cast: number;
      x_cast: number;
    };
  };
  behavior: { friendly_fire: { incoming: number; outgoing: number }; rounds_in_spawn: number };
}

export interface PlayerStatsResult {
  account: ValorantAccount;
  mmr: ValorantMMR;
  matches: ValorantMatch[];
  computed: {
    kd: number;
    winRate: number;
    avgScore: number;
    headshotPct: number;
    topAgents: { name: string; games: number; wins: number; kd: number; img: string }[];
    recentMatches: {
      id: string;
      map: string;
      mode: string;
      won: boolean;
      kills: number;
      deaths: number;
      assists: number;
      agent: string;
      agentImg: string;
      mmrChange: number;
      rounWins: number;
      roundTotal: number;
    }[];
  };
}
