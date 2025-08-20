import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { v4 } from '../utils/uuid';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users storage
const USERS_KEY = 'job_tracker_users';
const CURRENT_USER_KEY = 'job_tracker_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
      setUser(JSON.parse(currentUser));
      setIsAuthenticated(true);
    }
  }, []);

  const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    
    if (users.find(u => u.username === username || u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = {
      id: v4(),
      username,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};