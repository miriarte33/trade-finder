import { useState, useEffect } from 'react';
import { getUsernameCookie, setUsernameCookie, removeUsernameCookie } from '@/lib/cookies';

export function useAuth() {
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

  return {
    username,
    isAuthenticated: !!username,
    login,
    logout,
  };
}