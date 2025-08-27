import { UsernameInput } from '@/components/UsernameInput';

interface LoginPageProps {
  onSubmit: (username: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function LoginPage({ onSubmit, isLoading, error }: LoginPageProps) {
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
        <UsernameInput onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}