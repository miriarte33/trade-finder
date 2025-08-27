import Cookies from 'js-cookie';

const COOKIE_NAME = 'sleeper_username';
const COOKIE_EXPIRY = 30; // days

export const getUsernameCookie = (): string | undefined => {
  return Cookies.get(COOKIE_NAME);
};

export const setUsernameCookie = (username: string): void => {
  Cookies.set(COOKIE_NAME, username, { 
    expires: COOKIE_EXPIRY,
    sameSite: 'strict'
  });
};

export const removeUsernameCookie = (): void => {
  Cookies.remove(COOKIE_NAME);
};