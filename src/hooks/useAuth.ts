import { useState, useEffect } from 'react';

// Simple auth hook for demo purposes
// In a real app, this would connect to your authentication system
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (email: string, password: string) => {
    // Demo login - in real app, validate with backend
    if (email && password) {
      localStorage.setItem('auth-token', 'demo-token');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};