import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getUsernameCookie, setUsernameCookie, removeUsernameCookie } from '@/lib/cookies';

interface AuthContextType {
  username: string;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const savedUsername = getUsernameCookie();
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const login = (newUsername: string) => {
    setUsername(newUsername);
    setUsernameCookie(newUsername);
  };

  const logout = () => {
    removeUsernameCookie();
    setUsername('');
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        isAuthenticated: !!username,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}