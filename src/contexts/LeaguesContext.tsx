import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchUserLeagues } from '@/services/fantasycalc';
import type { League } from '@/lib/types';
import { useAuthContext } from './AuthContext';

interface LeaguesContextType {
  leagues: League[];
  isLoading: boolean;
  error: string | null;
  selectedLeague: League | null;
  loadLeagues: (username: string) => Promise<League[]>;
  clearLeagues: () => void;
  selectLeague: (league: League) => void;
}

const LeaguesContext = createContext<LeaguesContextType | undefined>(undefined);

export function LeaguesProvider({ children }: { children: ReactNode }) {
  const { username, isAuthenticated } = useAuthContext();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  const loadLeagues = useCallback(async (usernameParam: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchUserLeagues(usernameParam);
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
  }, []);

  useEffect(() => {
    if (isAuthenticated && username && leagues.length === 0) {
      loadLeagues(username);
    }
  }, [isAuthenticated, username, leagues.length, loadLeagues]);

  return (
    <LeaguesContext.Provider
      value={{
        leagues,
        isLoading,
        error,
        selectedLeague,
        loadLeagues,
        clearLeagues,
        selectLeague,
      }}
    >
      {children}
    </LeaguesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLeaguesContext() {
  const context = useContext(LeaguesContext);
  if (context === undefined) {
    throw new Error('useLeaguesContext must be used within a LeaguesProvider');
  }
  return context;
}