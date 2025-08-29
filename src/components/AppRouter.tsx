import { Routes, Route, useNavigate, useParams } from "react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLeaguesContext } from "@/contexts/LeaguesContext";
import { LeagueDetailsProvider } from "@/contexts/LeagueDetailsContext";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LeagueDetailsPage } from "@/pages/LeagueDetailsPage";
import type { League } from "@/lib/types";

function LeagueDetailsWrapper() {
  const { leagueId } = useParams<{ leagueId: string }>();
  
  if (!leagueId) {
    return <div>League ID not found</div>;
  }

  return (
    <LeagueDetailsProvider leagueId={leagueId}>
      <LeagueDetailsPage />
    </LeagueDetailsProvider>
  );
}

export function AppRouter() {
  const navigate = useNavigate();
  const { username, isAuthenticated, login, logout } = useAuthContext();
  const { leagues, isLoading, error, loadLeagues, clearLeagues, selectLeague } = useLeaguesContext();

  const handleUsernameSubmit = async (newUsername: string) => {
    await loadLeagues(newUsername);
    login(newUsername);
  };

  const handleChangeUser = () => {
    logout();
    clearLeagues();
    navigate('/');
  };

  const handleLeagueSelect = (league: League) => {
    selectLeague(league);
    navigate(`/league/${league.leagueId}`);
  };

  if (!isAuthenticated || leagues.length === 0) {
    return (
      <LoginPage
        onSubmit={handleUsernameSubmit}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardPage
            username={username}
            leagues={leagues}
            onChangeUser={handleChangeUser}
            onLeagueSelect={handleLeagueSelect}
          />
        }
      />
      <Route path="/league/:leagueId" element={<LeagueDetailsWrapper />} />
    </Routes>
  );
}