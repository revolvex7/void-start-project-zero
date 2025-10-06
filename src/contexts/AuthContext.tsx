import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  creatorName?: string;
  pageName?: string;
  profilePhoto?: string;
  description?: string;
  is18Plus?: boolean;
  isCreatorProfileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  switchToCreator: () => void;
  completeCreatorProfile: (profileData: { creatorName: string; pageName: string; is18Plus?: boolean }) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  isCreator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const response = await authAPI.login(credentials);
    // Set a basic user object so isAuthenticated becomes true
    const basicUser: User = {
      id: 'temp-id',
      name: credentials.email.split('@')[0], // Use email prefix as name
      email: credentials.email,
    };
    setUser(basicUser);
    localStorage.setItem('user', JSON.stringify(basicUser));
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    const response = await authAPI.register(userData);
    // Set a basic user object so isAuthenticated becomes true
    const basicUser: User = {
      id: 'temp-id',
      name: userData.name,
      email: userData.email,
    };
    setUser(basicUser);
    localStorage.setItem('user', JSON.stringify(basicUser));
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
    // Update localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
    }
  };

  const switchToCreator = () => {
    // This function can be used to initiate creator setup
    // The actual creator status will be determined by pageName existence
  };

  const completeCreatorProfile = async (profileData: { creatorName: string; pageName: string; is18Plus?: boolean }) => {
    const response = await authAPI.completeCreatorProfile(profileData);
    setUser(response.user);
  };

  const fetchUserProfile = async () => {
    const response = await authAPI.getUserProfile();
    setUser(response.user);
  };

  const isCreator = !!user?.pageName;

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    switchToCreator,
    completeCreatorProfile,
    fetchUserProfile,
    isCreator,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 