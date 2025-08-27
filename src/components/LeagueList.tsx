import { LeagueCard } from './LeagueCard';
import type { League } from '@/lib/types';

interface LeagueListProps {
  leagues: League[];
  onSelect: (league: League) => void;
}

export const LeagueList = ({ leagues, onSelect }: LeagueListProps) => {
  if (leagues.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No leagues found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leagues.map((league) => (
        <LeagueCard
          key={league.id.value}
          league={league}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};