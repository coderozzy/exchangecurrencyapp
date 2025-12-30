import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const userData = await apiService.getUser(userId);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      // If loading fails (e.g. user deleted from DB), clear storage
      await AsyncStorage.removeItem('userId');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const userData = await apiService.login(email, password);
    await AsyncStorage.setItem('userId', userData.id);
    setUser(userData);
  };

  const register = async (username: string, email: string, password: string) => {
    const userData = await apiService.register(username, email, password);
    await AsyncStorage.setItem('userId', userData.id);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userId');
    setUser(null);
  };

  const refreshUser = async () => {
    if (user) {
      try {
        const userData = await apiService.getUser(user.id);
        setUser(userData);
      } catch (error) {
        console.error('Failed to refresh user:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
