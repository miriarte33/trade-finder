export interface League {
  leagueId: string;
  name: string;
  site: string;
  username: string;
  id: {
    value: string;
  };
}

export type LeaguesResponse = League[];