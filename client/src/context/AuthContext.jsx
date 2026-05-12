import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken, setToken, removeToken, setUserDetails, getUserDetails, removeUserDetails } from '../utils/tokenStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkTokenExpiry = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        return true; // expired
      }
      return false; // not expired
    } catch (e) {
      return true; // invalid token
    }
  };

  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      if (token) {
        if (checkTokenExpiry(token)) {
          logout();
        } else {
          try {
            const decoded = jwtDecode(token);
            const savedUser = getUserDetails();
            // Recover username from JWT if present, otherwise from local storage fallback
            setUser({ 
              id: decoded.id, 
              username: decoded.username || savedUser?.username 
            });
            setIsAuthenticated(true);
          } catch (e) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData) => {
    setToken(userData.token);
    const userObj = {
      id: userData._id,
      username: userData.username,
      email: userData.email
    };
    setUserDetails(userObj);
    setUser(userObj);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    removeUserDetails();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
