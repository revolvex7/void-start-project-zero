import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useUserProfile, 
  useLogin, 
  useRegister, 
  useLogout, 
  useCompleteCreatorProfile,
  useForgotPassword,
  useResetPassword,
  queryKeys 
} from '@/hooks/useApi';

interface Creator {
  pageName: string;
  creatorName: string;
  is18Plus: boolean;
  profilePhoto?: string;
  bio?: string;
  coverPhoto?: string;
  introVideo?: string;
  themeColor?: string;
  socialLinks?: Array<{id: string, platform: string, url: string}>;
  tags?: string[];
  categoryId?: string;
}

interface User {
  isVerified: any;
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
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const queryClient = useQueryClient();

  // React Query hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const completeCreatorProfileMutation = useCompleteCreatorProfile();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  // User profile query - disabled by default, only fetch manually when needed
  const { 
    data: userProfileData, 
    isLoading: isProfileLoading, 
    refetch: refetchProfile 
  } = useUserProfile(false); // Disabled automatic fetching

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // If it's a temp user (from login/register), fetch real profile
        if (parsedUser.id === 'temp-id') {
          refetchProfile();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    
    setIsInitialLoading(false);
  }, [refetchProfile]);

  // Update user state when profile data changes
  useEffect(() => {
    if (userProfileData) {
      const transformedUser: User = {
        ...userProfileData,
        creatorName: userProfileData.creator?.creatorName,
        pageName: userProfileData.creator?.pageName,
        profilePhoto: userProfileData.creator?.profilePhoto,
        is18Plus: userProfileData.creator?.is18Plus,
        description: userProfileData.creator?.bio,
        isCreatorProfileComplete: !!userProfileData.creator?.pageName
      };
      
      setUser(transformedUser);
      localStorage.setItem('user', JSON.stringify(transformedUser));
    }
  }, [userProfileData]);

  const login = async (credentials: { email: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);
    
    // Set a basic user object so isAuthenticated becomes true
    const basicUser: User = {
      id: 'temp-id',
      name: credentials.email.split('@')[0],
      email: credentials.email,
      creator: null,
      createdAt: '',
      updatedAt: '',
      isVerified: undefined
    };
    setUser(basicUser);
    localStorage.setItem('user', JSON.stringify(basicUser));
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    await registerMutation.mutateAsync(userData);
    
    // Set a basic user object so isAuthenticated becomes true
    const basicUser: User = {
      id: 'temp-id',
      name: userData.name,
      email: userData.email,
      creator: null,
      createdAt: '',
      updatedAt: '',
      isVerified: undefined
    };
    setUser(basicUser);
    localStorage.setItem('user', JSON.stringify(basicUser));
  };

  const logout = () => {
    logoutMutation.mutate();
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
    const userData = await completeCreatorProfileMutation.mutateAsync(profileData);
    
    // The API might return user data with nested creator object or flat structure
    // Handle both cases for backward compatibility
    const transformedUser: User = {
      ...userData,
      // Add backward-compatible flat fields
      creatorName: userData.creator?.creatorName || userData.creatorName,
      pageName: userData.creator?.pageName || userData.pageName,
      profilePhoto: userData.creator?.profilePhoto || userData.profilePhoto,
      is18Plus: userData.creator?.is18Plus || userData.is18Plus,
      description: userData.creator?.bio || userData.description,
      isCreatorProfileComplete: !!(userData.creator?.pageName || userData.pageName)
    };
    
    setUser(transformedUser);
    localStorage.setItem('user', JSON.stringify(transformedUser));
    
    // Fetch fresh profile data to ensure everything is in sync
    await refetchProfile();
  };

  const fetchUserProfile = async () => {
    try {
      await refetchProfile();
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If token is invalid, clear auth state
      if (error instanceof Error && error.message.includes('401')) {
        logout();
      }
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    await forgotPasswordMutation.mutateAsync(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await resetPasswordMutation.mutateAsync({ token, newPassword });
  };

  const isCreator = !!user?.creator?.pageName || !!user?.pageName;
  const isLoading = isInitialLoading || isProfileLoading;

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
    forgotPassword,
    resetPassword,
    isCreator,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 