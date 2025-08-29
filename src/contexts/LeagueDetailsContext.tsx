import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { fetchLeagueDetails } from '@/services/fantasycalc';
import type { FullLeagueDetails, Team } from '@/lib/types';
import { useAuthContext } from './AuthContext';

export type SortField = 'value' | 'overallRank' | 'starter' | 'position';
export type SortOrder = 'asc' | 'desc';

interface LeagueDetailsContextType {
  leagueDetails: FullLeagueDetails | null;
  isLoading: boolean;
  error: string | null;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team) => void;
  sortedPlayers: Team['players'];
  sortBy: SortField;
  sortOrder: SortOrder;
  setSortBy: (field: SortField) => void;
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
  const [sortBy, setSortByState] = useState<SortField>('value');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const loadLeagueDetails = useCallback(async () => {
    if (!leagueId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchLeagueDetails(leagueId);
      setLeagueDetails(data);
      
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

  const setSortBy = useCallback((field: SortField) => {
    if (field === sortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortByState(field);
      setSortOrder('desc');
    }
  }, [sortBy]);

  const sortedPlayers = useMemo(() => {
    if (!selectedTeam) return [];
    
    const players = [...selectedTeam.players];
    
    players.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'overallRank':
          comparison = a.overallRank - b.overallRank;
          break;
        case 'starter':
          if (a.starter === b.starter) {
            comparison = a.value - b.value;
          } else {
            comparison = a.starter ? -1 : 1;
          }
          break;
        case 'position':
          if (a.player.position === b.player.position) {
            comparison = b.value - a.value;
          } else {
            comparison = a.player.position.localeCompare(b.player.position);
          }
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return players;
  }, [selectedTeam, sortBy, sortOrder]);

  return (
    <LeagueDetailsContext.Provider
      value={{
        leagueDetails,
        isLoading,
        error,
        selectedTeam,
        setSelectedTeam,
        sortedPlayers,
        sortBy,
        sortOrder,
        setSortBy,
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