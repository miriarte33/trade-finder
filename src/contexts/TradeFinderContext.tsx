import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type { Team, Position } from "@/lib/types";
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
  includedPositions: Set<Position>;
  excludedPositions: Set<Position>;
  setIncludedPositions: (positions: Set<Position>) => void;
  setExcludedPositions: (positions: Set<Position>) => void;
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
  const [includedPositions, setIncludedPositions] = useState<Set<Position>>(new Set());
  const [excludedPositions, setExcludedPositions] = useState<Set<Position>>(new Set());

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
        selectedTargetTeam ? [selectedTargetTeam] : undefined,
        includedPositions,
        excludedPositions
      );

      return analyses;
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlayers, leagueDetails, sourceTeam, selectedTargetTeam, includedPositions, excludedPositions]);

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
        includedPositions,
        excludedPositions,
        setIncludedPositions,
        setExcludedPositions,
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
