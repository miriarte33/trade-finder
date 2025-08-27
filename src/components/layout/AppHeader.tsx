interface AppHeaderProps {
  username: string;
  onChangeUser: () => void;
}

export function AppHeader({ username, onChangeUser }: AppHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold">🏈 Sleeper Trade Finder</h1>
      <p className="text-muted-foreground mt-2">
        Logged in as: {username}
        <button
          onClick={onChangeUser}
          className="ml-4 text-primary hover:underline cursor-pointer"
        >
          Change User
        </button>
      </p>
    </header>
  );
}
