export interface League {
  leagueId: string;
  name: string;
  site: string;
  username: string;
  id: {
    value: string;
  };
}

export interface FullLeagueDetails {
  name: string;
  teams: Team[];
  externalLeagueId: string;
}

export interface Team {
  name: string;
  owner: string;
  players: Player[];
  overallValue: number;
  overallRank: number;
  qbValue: number;
  qbRank: number;
  rbValue: number;
  rbRank: number;
  wrValue: number;
  wrRank: number;
  teValue: number;
  teRank: number;
  pickValue: number;
  pickRank: number;
  averageAge: number;
  adjustedAverageAge: number;
  trend30Day: number;
  rosterId: number;
  record: Record;
  ownerId: string;
}

export interface Record {
  wins: number;
  losses: number;
  ties: number;
  pointsScored: number;
}

export interface Player {
  player: PlayerDetails;
  value: number;
  overallRank: number;
  positionRank: number;
  redraftValue: number;
  combinedValue: number;
  starter: boolean;
}

export interface PlayerDetails {
  id: number;
  name: string;
  mflId: string;
  sleeperId: string;
  position: string;
  espnId: string;
  fleaflickerId: string;
}

export type LeaguesResponse = League[];
