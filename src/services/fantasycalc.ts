import type { LeaguesResponse, FullLeagueDetails } from "@/lib/types";

export const fetchUserLeagues = async (
  username: string
): Promise<LeaguesResponse> => {
  const response = await fetch(
    `https://api.fantasycalc.com/users/${encodeURIComponent(
      username
    )}?site=sleeper`
  );

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? `User "${username}" not found on Sleeper`
        : `Failed to fetch leagues: ${response.statusText}`
    );
  }

  return (await response.json()) as LeaguesResponse;
};

export const fetchLeagueDetails = async (
  leagueId: string
): Promise<FullLeagueDetails> => {
  const response = await fetch(
    `https://api.fantasycalc.com/leagues/${encodeURIComponent(
      leagueId
    )}?site=Sleeper`
  );

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? `League "${leagueId}" not found`
        : `Failed to fetch league details: ${response.statusText}`
    );
  }

  return (await response.json()) as FullLeagueDetails;
};
