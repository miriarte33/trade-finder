import { useLeagueDetailsContext } from "@/contexts/LeagueDetailsContext";
import { TeamPlayersList } from "@/components/TeamPlayersList";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LeagueDetailsPage() {
  const {
    leagueDetails,
    isLoading,
    error,
    selectedTeam,
    setSelectedTeam,
    sortedPlayers,
  } = useLeagueDetailsContext();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading league details...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">{error}</p>
        </div>
      </AppLayout>
    );
  }

  if (!leagueDetails) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{leagueDetails.name}</CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <label htmlFor="team-select" className="text-sm font-medium">
                Select Team:
              </label>
              <Select
                value={selectedTeam?.ownerId}
                onValueChange={(value) => {
                  const team = leagueDetails.teams.find(
                    (t) => t.ownerId === value
                  );
                  if (team) setSelectedTeam(team);
                }}
              >
                <SelectTrigger id="team-select" className="w-[280px]">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {leagueDetails.teams.map((team) => (
                    <SelectItem key={team.ownerId} value={team.ownerId}>
                      {team.name} ({team.owner})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTeam && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Overall Value: {selectedTeam.overallValue}</p>
                <p>Overall Rank: #{selectedTeam.overallRank}</p>
                <p>
                  Record: {selectedTeam.record.wins}-
                  {selectedTeam.record.losses}
                  {selectedTeam.record.ties > 0 &&
                    `-${selectedTeam.record.ties}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedTeam && <TeamPlayersList players={sortedPlayers} />}
      </div>
    </AppLayout>
  );
}
