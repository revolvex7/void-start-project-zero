import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface Creator {
  pageName: string;
  creatorName: string;
  is18Plus: boolean;
  profilePhoto?: string;
  bio?: string;
  coverPhoto?: string;
  introVideo?: string;
  themeColor?: string;
  socialLinks?: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  creator: Creator | null;
  createdAt: string;
  updatedAt: string;
  // Legacy properties for backward compatibility
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
      creator: undefined,
      createdAt: '',
      updatedAt: ''
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
      creator: undefined,
      createdAt: '',
      updatedAt: ''
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
    const userData = response.user;
    
    // Transform the response to include legacy properties
    const transformedUser: User = {
      ...userData,
      creatorName: userData.creator?.creatorName,
      pageName: userData.creator?.pageName,
      profilePhoto: userData.creator?.profilePhoto,
      is18Plus: userData.creator?.is18Plus,
      description: userData.creator?.bio,
      isCreatorProfileComplete: !!userData.creator?.pageName
    };
    
    setUser(transformedUser);
    localStorage.setItem('user', JSON.stringify(transformedUser));
  };

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getUserProfile();
      const userData = response.user;
      
      // Transform the new nested structure to include legacy properties for backward compatibility
      const transformedUser: User = {
        ...userData,
        // Legacy properties from creator object
        creatorName: userData.creator?.creatorName,
        pageName: userData.creator?.pageName,
        profilePhoto: userData.creator?.profilePhoto,
        is18Plus: userData.creator?.is18Plus,
        description: userData.creator?.bio,
        isCreatorProfileComplete: !!userData.creator?.pageName
      };
      
      setUser(transformedUser);
      localStorage.setItem('user', JSON.stringify(transformedUser));
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If token is invalid, clear auth state
      if (error instanceof Error && error.message.includes('401')) {
        logout();
      }
      throw error;
    }
  };

  const isCreator = !!user?.creator?.pageName || !!user?.pageName;

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