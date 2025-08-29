import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { fetchLeagueDetails } from '@/services/fantasycalc';
import type { FullLeagueDetails, Team } from '@/lib/types';
import { useAuthContext } from './AuthContext';

interface LeagueDetailsContextType {
  leagueDetails: FullLeagueDetails | null;
  isLoading: boolean;
  error: string | null;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team) => void;
  sortedPlayers: Team['players'];
  reloadLeagueDetails: () => Promise<FullLeagueDetails | undefined>;
}

const LeagueDetailsContext = createContext<LeagueDetailsContextType | undefined>(undefined);

interface LeagueDetailsProviderProps {
  children: ReactNode;
  leagueId: string;
}

export function LeagueDetailsProvider({ children, leagueId }: LeagueDetailsProviderProps) {
  const { username } = useAuthContext();
  const [leagueDetails, setLeagueDetails] = useState<FullLeagueDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const loadLeagueDetails = useCallback(async () => {
    if (!leagueId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchLeagueDetails(leagueId);
      setLeagueDetails(data);
      
      // Find and set the current user's team as default
      const userTeam = data.teams.find(team => 
        team.owner.toLowerCase() === username.toLowerCase()
      );
      
      if (userTeam) {
        setSelectedTeam(userTeam);
      } else if (data.teams.length > 0) {
        setSelectedTeam(data.teams[0]);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load league details';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [leagueId, username]);

  useEffect(() => {
    loadLeagueDetails();
  }, [loadLeagueDetails]);

  const sortedPlayers = useMemo(() => {
    if (!selectedTeam) return [];
    return [...selectedTeam.players].sort((a, b) => b.value - a.value);
  }, [selectedTeam]);

  return (
    <LeagueDetailsContext.Provider
      value={{
        leagueDetails,
        isLoading,
        error,
        selectedTeam,
        setSelectedTeam,
        sortedPlayers,
        reloadLeagueDetails: loadLeagueDetails,
      }}
    >
      {children}
    </LeagueDetailsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLeagueDetailsContext() {
  const context = useContext(LeagueDetailsContext);
  if (context === undefined) {
    throw new Error('useLeagueDetailsContext must be used within a LeagueDetailsProvider');
  }
  return context;
}