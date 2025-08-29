import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type { Team } from "@/lib/types";
import { analyzeTradesForAllTeams, type TradeAnalysis } from "@/lib/tradeUtils";
import { useLeagueDetailsContext } from "./LeagueDetailsContext";
import { useTradeSelectionContext } from "./TradeSelectionContext";

interface TradeFinderContextType {
  selectedTargetTeam: string | null;
  setSelectedTargetTeam: (teamId: string | null) => void;
  availableTeams: Team[];
  tradeAnalyses: TradeAnalysis[];
  isLoading: boolean;
  hasAnyTrades: boolean;
}

const TradeFinderContext = createContext<TradeFinderContextType | undefined>(
  undefined
);

interface TradeFinderProviderProps {
  children: ReactNode;
}

export function TradeFinderProvider({ children }: TradeFinderProviderProps) {
  const { leagueDetails } = useLeagueDetailsContext();
  const { selectedPlayers, sourceTeam } = useTradeSelectionContext();
  const [selectedTargetTeam, setSelectedTargetTeam] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const availableTeams = useMemo(() => {
    if (!leagueDetails || !sourceTeam) {
      return [];
    }
    return leagueDetails.teams.filter(
      (team) => team.ownerId !== sourceTeam.ownerId
    );
  }, [leagueDetails, sourceTeam]);

  useEffect(() => {
    if (availableTeams.length > 0 && !selectedTargetTeam) {
      setSelectedTargetTeam(availableTeams[0].ownerId);
    }
  }, [availableTeams, selectedTargetTeam]);

  const tradeAnalyses = useMemo(() => {
    if (!leagueDetails || !sourceTeam || selectedPlayers.length === 0) {
      return [];
    }

    setIsLoading(true);

    try {
      const analyses = analyzeTradesForAllTeams(
        selectedPlayers,
        leagueDetails.teams,
        sourceTeam.ownerId,
        selectedTargetTeam ? [selectedTargetTeam] : undefined
      );

      return analyses;
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlayers, leagueDetails, sourceTeam, selectedTargetTeam]);

  const hasAnyTrades = useMemo(() => {
    return tradeAnalyses.some((analysis) => analysis.possibleTrades.length > 0);
  }, [tradeAnalyses]);

  return (
    <TradeFinderContext.Provider
      value={{
        selectedTargetTeam,
        setSelectedTargetTeam,
        availableTeams,
        tradeAnalyses,
        isLoading,
        hasAnyTrades,
      }}
    >
      {children}
    </TradeFinderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTradeFinderContext() {
  const context = useContext(TradeFinderContext);
  if (context === undefined) {
    throw new Error(
      "useTradeFinderContext must be used within a TradeFinderProvider"
    );
  }
  return context;
}
