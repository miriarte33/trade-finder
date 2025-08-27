import type { LeaguesResponse } from '@/lib/types';

export const fetchUserLeagues = async (username: string): Promise<LeaguesResponse> => {
  const response = await fetch(
    `https://api.fantasycalc.com/users/${encodeURIComponent(username)}?site=sleeper`
  );
  
  if (!response.ok) {
    throw new Error(
      response.status === 404 
        ? `User "${username}" not found on Sleeper`
        : `Failed to fetch leagues: ${response.statusText}`
    );
  }
  
  return response.json() as Promise<LeaguesResponse>;
};