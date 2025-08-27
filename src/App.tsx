import { useState, useEffect } from 'react';
import { fetchUserLeagues } from '@/services/fantasycalc';
import { getUsernameCookie, setUsernameCookie, removeUsernameCookie } from '@/lib/cookies';
import { UsernameInput } from '@/components/UsernameInput';
import { LeagueList } from '@/components/LeagueList';
import type { League } from '@/lib/types';

export default function App() {
  const [username, setUsername] = useState<string>('');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUsername = getUsernameCookie();
    if (savedUsername) {
      setUsername(savedUsername);
      loadLeagues(savedUsername);
    }
  }, []);

  const loadLeagues = async (username: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchUserLeagues(username);
      setLeagues(data);
      setUsernameCookie(username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leagues');
      removeUsernameCookie();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
    loadLeagues(newUsername);
  };

  const handleChangeUser = () => {
    removeUsernameCookie();
    setUsername('');
    setLeagues([]);
    setError(null);
  };

  const handleLeagueSelect = (league: League) => {
    console.log('Selected league:', league);
    // TODO: Navigate to trade finder with selected league
  };

  if (!username || leagues.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">
            🏈 Sleeper Trade Finder
          </h1>
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
              {error}
            </div>
          )}
          <UsernameInput onSubmit={handleUsernameSubmit} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">🏈 Sleeper Trade Finder</h1>
          <p className="text-muted-foreground mt-2">
            Logged in as: {username}
            <button
              onClick={handleChangeUser}
              className="ml-4 text-primary hover:underline"
            >
              Change User
            </button>
          </p>
        </header>
        <LeagueList leagues={leagues} onSelect={handleLeagueSelect} />
      </div>
    </div>
  );
}