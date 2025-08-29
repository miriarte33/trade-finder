import { useTradeSelectionContext } from "@/contexts/TradeSelectionContext";
import { useTradeFinderContext } from "@/contexts/TradeFinderContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useLeagueDetailsContext } from "@/contexts/LeagueDetailsContext";
import { TradeOfferCard } from "@/components/TradeOfferCard";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export function TradeFinderPage() {
  const navigate = useNavigate();
  const { leagueId } = useParams<{ leagueId: string }>();
  const { selectedPlayers, sourceTeam, getTotalValue } =
    useTradeSelectionContext();
  const {
    availableTeams,
    selectedTargetTeam,
    setSelectedTargetTeam,
    tradeAnalyses,
    isLoading,
    hasAnyTrades,
  } = useTradeFinderContext();
  const { leagueDetails } = useLeagueDetailsContext();

  const handleBackToTeam = () => {
    if (leagueId) {
      navigate(`/league/${leagueId}`);
    }
  };

  const handleTeamSelection = (value: string) => {
    setSelectedTargetTeam(value);
  };

  if (!leagueDetails || !sourceTeam || selectedPlayers.length === 0) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              No players selected for trade analysis.
            </p>
            <Button onClick={handleBackToTeam}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trade Finder</h1>
            <p className="text-muted-foreground">{leagueDetails.name}</p>
          </div>
          <Button variant="outline" onClick={handleBackToTeam}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="trade-partner-select" className="text-sm font-medium">
            Trade Partner:
          </label>
          <Select
            value={selectedTargetTeam || ""}
            onValueChange={handleTeamSelection}
          >
            <SelectTrigger id="trade-partner-select" className="w-[280px]">
              <SelectValue placeholder="Select team to trade with" />
            </SelectTrigger>
            <SelectContent>
              {availableTeams.map((team) => (
                <SelectItem key={team.ownerId} value={team.ownerId}>
                  {team.name} ({team.owner})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!selectedTargetTeam ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Select a team to trade with to see possible offers
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <TradeOfferCard
                players={selectedPlayers}
                teamName={sourceTeam.name}
                teamOwner={sourceTeam.owner}
                totalValue={getTotalValue()}
              />
            </div>

            <div>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Analyzing trades...</p>
                </div>
              ) : !hasAnyTrades ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No possible trades.</p>
                </div>
              ) : (
                <div className="h-[75vh] overflow-y-auto space-y-4">
                  {tradeAnalyses.map((analysis) =>
                    analysis.possibleTrades.map((trade, index) => (
                      <TradeOfferCard
                        key={`${analysis.targetTeam.ownerId}-${index}`}
                        players={trade.players}
                        teamName={analysis.targetTeam.name}
                        teamOwner={analysis.targetTeam.owner}
                        totalValue={trade.totalValue}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
