import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { League } from '@/lib/types';

interface LeagueCardProps {
  league: League;
  onSelect: (league: League) => void;
}

export const LeagueCard = ({ league, onSelect }: LeagueCardProps) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(league)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{league.name}</span>
          <span className="text-sm text-muted-foreground font-normal">
            {league.site}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            League ID: {league.leagueId}
          </p>
          <p className="text-sm text-muted-foreground">
            Username: {league.username}
          </p>
          <p className="text-center text-sm text-primary mt-4">
            Click to select
          </p>
        </div>
      </CardContent>
    </Card>
  );
};