import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginApi, 
  registerApi, 
  getUserProfileApi, 
  setupTwoFactorApi,
  enableTwoFactorApi,
  disableTwoFactorApi,
  verifyTwoFactorApi
} from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requireTwoFactor, setRequireTwoFactor] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const userData = await getUserProfileApi();
          setCurrentUser(userData);
        }
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem('token');
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
      const data = await loginApi(username, password);
      
      // Se è richiesta la 2FA, memorizza il token temporaneo e imposta lo stato
      if (data.requireTwoFactor) {
        setRequireTwoFactor(true);
        setTempToken(data.tempToken);
        return { requireTwoFactor: true };
      } else {
        // Login normale senza 2FA
        localStorage.setItem('token', data.token);
        setCurrentUser(data);
        setRequireTwoFactor(false);
        setTempToken(null);
      }
      
      return data;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const verifyTwoFactor = async (token) => {
    setError(null);
    try {
      // Usa il token temporaneo per la verifica 2FA
      const data = await verifyTwoFactorApi(token, tempToken);
      localStorage.setItem('token', data.token);
      setCurrentUser(data);
      setRequireTwoFactor(false);
      setTempToken(null);
      return data;
    } catch (error) {
      setError(error.message || 'Two-factor verification failed');
      throw error;
    }
  };

  const register = async (username, password) => {
    setError(null);
    try {
      const data = await registerApi(username, password);
      localStorage.setItem('token', data.token);
      setCurrentUser(data);
      return data;
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setRequireTwoFactor(false);
    setTempToken(null);
    setTwoFactorSetup(null);
  };

  const setupTwoFactor = async () => {
    setError(null);
    try {
      const setupData = await setupTwoFactorApi();
      setTwoFactorSetup(setupData);
      return setupData;
    } catch (error) {
      setError(error.message || 'Failed to setup two-factor authentication');
      throw error;
    }
  };

  const enableTwoFactor = async (token) => {
    setError(null);
    try {
      const data = await enableTwoFactorApi(token);
      // Aggiorna lo stato dell'utente
      setCurrentUser(prev => ({
        ...prev,
        twoFactorEnabled: true
      }));
      setTwoFactorSetup(null);
      return data;
    } catch (error) {
      setError(error.message || 'Failed to enable two-factor authentication');
      throw error;
    }
  };

  const disableTwoFactor = async (token) => {
    setError(null);
    try {
      const data = await disableTwoFactorApi(token);
      // Aggiorna lo stato dell'utente
      setCurrentUser(prev => ({
        ...prev,
        twoFactorEnabled: false
      }));
      return data;
    } catch (error) {
      setError(error.message || 'Failed to disable two-factor authentication');
      throw error;
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin || false,
    loading,
    error,
    requireTwoFactor,
    twoFactorSetup,
    login,
    register,
    logout,
    verifyTwoFactor,
    setupTwoFactor,
    enableTwoFactor,
    disableTwoFactor
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};