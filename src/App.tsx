import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLeagues } from "@/hooks/useLeagues";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";

export default function App() {
  const { username, isAuthenticated, login, logout } = useAuth();
  const { leagues, isLoading, error, loadLeagues, clearLeagues, selectLeague } =
    useLeagues();

  useEffect(() => {
    if (isAuthenticated && leagues.length === 0) {
      loadLeagues(username);
    }
  }, [isAuthenticated, username, leagues.length, loadLeagues]);

  const handleUsernameSubmit = async (newUsername: string) => {
    await loadLeagues(newUsername);
    login(newUsername);
  };

  const handleChangeUser = () => {
    logout();
    clearLeagues();
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
    <DashboardPage
      username={username}
      leagues={leagues}
      onChangeUser={handleChangeUser}
      onLeagueSelect={selectLeague}
    />
  );
}
