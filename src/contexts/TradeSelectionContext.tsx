import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { Player, Team } from "@/lib/types";

interface TradeSelectionContextType {
  selectedPlayers: Player[];
  sourceTeam: Team | null;
  selectPlayer: (player: Player, team: Team) => void;
  deselectPlayer: (playerId: number) => void;
  clearSelection: () => void;
  isPlayerSelected: (playerId: number) => boolean;
  getTotalValue: () => number;
  hasSelectedPlayers: boolean;
}

const TradeSelectionContext = createContext<
  TradeSelectionContextType | undefined
>(undefined);

interface TradeSelectionProviderProps {
  children: ReactNode;
}

export function TradeSelectionProvider({
  children,
}: TradeSelectionProviderProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [sourceTeam, setSourceTeam] = useState<Team | null>(null);

  const selectPlayer = useCallback((player: Player, team: Team) => {
    setSelectedPlayers(prev => [...prev, player]);
    if (!sourceTeam) {
      setSourceTeam(team);
    }
  }, [sourceTeam]);

  const deselectPlayer = useCallback((playerId: number) => {
    setSelectedPlayers(prev => prev.filter(p => p.player.id !== playerId));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPlayers([]);
    setSourceTeam(null);
  }, []);

  const isPlayerSelected = useCallback(
    (playerId: number) => {
      return selectedPlayers.some((p) => p.player.id === playerId);
    },
    [selectedPlayers]
  );

  const getTotalValue = useCallback(() => {
    return selectedPlayers.reduce((total, player) => total + player.value, 0);
  }, [selectedPlayers]);

  const hasSelectedPlayers = useMemo(() => {
    return selectedPlayers.length > 0;
  }, [selectedPlayers]);

  return (
    <TradeSelectionContext.Provider
      value={{
        selectedPlayers,
        sourceTeam,
        selectPlayer,
        deselectPlayer,
        clearSelection,
        isPlayerSelected,
        getTotalValue,
        hasSelectedPlayers,
      }}
    >
      {children}
    </TradeSelectionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTradeSelectionContext() {
  const context = useContext(TradeSelectionContext);
  if (context === undefined) {
    throw new Error(
      "useTradeSelectionContext must be used within a TradeSelectionProvider"
    );
  }
  return context;
}
