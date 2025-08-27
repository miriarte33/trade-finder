import { useState, useCallback } from 'react';
import { fetchUserLeagues } from '@/services/fantasycalc';
import type { League } from '@/lib/types';

export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  const loadLeagues = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchUserLeagues(username);
      setLeagues(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load leagues';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearLeagues = useCallback(() => {
    setLeagues([]);
    setError(null);
    setSelectedLeague(null);
  }, []);

  const selectLeague = useCallback((league: League) => {
    setSelectedLeague(league);
    console.log('Selected league:', league);
  }, []);

  return {
    leagues,
    isLoading,
    error,
    selectedLeague,
    loadLeagues,
    clearLeagues,
    selectLeague,
  };
}