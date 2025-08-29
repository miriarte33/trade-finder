import { useTradeSelectionContext } from "@/contexts/TradeSelectionContext";
import { useTradeFinderContext } from "@/contexts/TradeFinderContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeagueDetailsContext } from "@/contexts/LeagueDetailsContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export function TradeFinderPage() {
  const navigate = useNavigate();
  const { leagueId } = useParams<{ leagueId: string }>();
  const { selectedPlayers, sourceTeam, getTotalValue } =
    useTradeSelectionContext();
  const {
    availableTeams,
    selectedTargetTeams,
    setSelectedTargetTeams,
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
    if (value === "all") {
      setSelectedTargetTeams(availableTeams.map((team) => team.ownerId));
    } else {
      const team = availableTeams.find((t) => t.ownerId === value);
      if (team) {
        setSelectedTargetTeams([value]);
      }
    }
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
          <label htmlFor="team-filter" className="text-sm font-medium">
            Trade with:
          </label>
          <Select
            value={
              selectedTargetTeams.length === availableTeams.length
                ? "all"
                : selectedTargetTeams[0] || ""
            }
            onValueChange={handleTeamSelection}
          >
            <SelectTrigger id="team-filter" className="w-[280px]">
              <SelectValue placeholder="Select teams to trade with" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {availableTeams.map((team) => (
                <SelectItem key={team.ownerId} value={team.ownerId}>
                  {team.name} ({team.owner})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Players</CardTitle>
              <p className="text-sm text-muted-foreground">
                From {sourceTeam.name} • Total Value: {getTotalValue()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedPlayers.map((player) => (
                  <div
                    key={player.player.id}
                    className="flex justify-between items-center p-2 bg-muted/50 rounded"
                  >
                    <div>
                      <span className="font-medium">{player.player.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({player.player.position})
                      </span>
                    </div>
                    <span className="text-sm">{player.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Possible Trades</CardTitle>
              <p className="text-sm text-muted-foreground">
                Within 200 points of your players' total value
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Analyzing trades...</p>
              ) : !hasAnyTrades ? (
                <p className="text-muted-foreground">No possible trades.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {tradeAnalyses.map((analysis) =>
                    analysis.possibleTrades.map((trade, index) => (
                      <div
                        key={`${analysis.targetTeam.ownerId}-${index}`}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">
                              {analysis.targetTeam.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              ({analysis.targetTeam.owner})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Value: {trade.totalValue}</p>
                            <p className="text-xs text-muted-foreground">
                              Diff: {trade.valueDifference}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {trade.players.map((player) => (
                            <div
                              key={player.player.id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {player.player.name} ({player.player.position})
                              </span>
                              <span>{player.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
