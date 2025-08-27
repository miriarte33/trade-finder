import { LeagueList } from '@/components/LeagueList';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppLayout } from '@/components/layout/AppLayout';
import type { League } from '@/lib/types';

interface DashboardPageProps {
  username: string;
  leagues: League[];
  onChangeUser: () => void;
  onLeagueSelect: (league: League) => void;
}

export function DashboardPage({ 
  username, 
  leagues, 
  onChangeUser, 
  onLeagueSelect 
}: DashboardPageProps) {
  return (
    <AppLayout>
      <AppHeader username={username} onChangeUser={onChangeUser} />
      <LeagueList leagues={leagues} onSelect={onLeagueSelect} />
    </AppLayout>
  );
}