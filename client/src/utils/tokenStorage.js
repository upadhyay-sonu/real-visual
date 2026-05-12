const TOKEN_KEY = '3d_viewer_auth_token';
const USER_KEY = '3d_viewer_user';

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setUserDetails = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserDetails = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUserDetails = () => {
  localStorage.removeItem(USER_KEY);
};
