import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, userAPI, creatorAPI, commonAPI } from '@/lib/api';

// Query Keys
export const queryKeys = {
  user: {
    profile: ['user', 'profile'] as const,
  },
  creators: {
    all: ['creators'] as const,
    byId: (id: string) => ['creators', id] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
} as const;

// User Queries
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: async () => {
      const response = await authAPI.getUserProfile();
      return response.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// User Mutations
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: any) => userAPI.update(userData),
    onSuccess: (data) => {
      // Update the user profile cache
      queryClient.setQueryData(queryKeys.user.profile, data.data);
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
};

export const useCompleteCreatorProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: { creatorName: string; pageName: string; is18Plus?: boolean }) => {
      const response = await authAPI.completeCreatorProfile(profileData);
      return response.user;
    },
    onSuccess: (userData) => {
      // Transform and update cache
      const transformedUser = {
        ...userData,
        creatorName: userData.creator?.creatorName,
        pageName: userData.creator?.pageName,
        profilePhoto: userData.creator?.profilePhoto,
        is18Plus: userData.creator?.is18Plus,
        description: userData.creator?.bio,
        isCreatorProfileComplete: !!userData.creator?.pageName
      };
      
      queryClient.setQueryData(queryKeys.user.profile, transformedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
};

// Creator Queries
export const useCreators = () => {
  return useQuery({
    queryKey: queryKeys.creators.all,
    queryFn: async () => {
      const response = await creatorAPI.getAllCreators();
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Categories Queries
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const response = await commonAPI.getCategories();
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (categories don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Auth Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => authAPI.login(credentials),
    onSuccess: () => {
      // Clear all queries on login
      queryClient.clear();
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: { name: string; email: string; password: string }) => authAPI.register(userData),
    onSuccess: () => {
      // Clear all queries on register
      queryClient.clear();
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authAPI.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) => 
      authAPI.resetPassword(token, newPassword),
  });
};

// Follow/Unfollow Mutations
export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (creatorId: string) => {
      const BASE_URL = 'http://localhost:8000/api/v_1/internal';
      const response = await fetch(`${BASE_URL}/user/creators/${creatorId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access-token': localStorage.getItem('accessToken') || '',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle follow status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate creators list to refresh follow status
      queryClient.invalidateQueries({ queryKey: queryKeys.creators.all });
    },
  });
};
