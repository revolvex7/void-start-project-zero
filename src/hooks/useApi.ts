import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, userAPI, creatorAPI, commonAPI, postAPI } from '@/lib/api';

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
  posts: {
    all: ['posts'] as const,
    byId: (id: string) => ['posts', id] as const,
  },
} as const;

// User Queries
export const useUserProfile = (enabled: boolean = false) => {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: async () => {
      const response = await authAPI.getUserProfile();
      return response.user;
    },
    enabled, // Only fetch when explicitly enabled
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
      console.log('Complete creator profile response:', response);
      return response.user;
    },
    retry: false, // Don't retry - show error immediately for profile completion
    onSuccess: (userData) => {
      console.log('User data received in onSuccess:', userData);
      
      // The API returns the user object directly with creator fields at the top level
      // No need to access nested creator property
      if (!userData) {
        console.error('userData is undefined in onSuccess');
        return;
      }
      
      const transformedUser = {
        ...userData,
        isCreatorProfileComplete: !!userData.pageName
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

export const useCreatorById = (creatorId: string) => {
  return useQuery({
    queryKey: queryKeys.creators.byId(creatorId),
    queryFn: async () => {
      const response = await creatorAPI.getCreatorById(creatorId);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!creatorId, // Only run if creatorId is provided
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

// Posts Queries
export const usePosts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...queryKeys.posts.all, page, limit],
    queryFn: async () => {
      const response = await postAPI.getAll(page, limit);
      // Return the full response with posts and pagination
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePostById = (postId: string) => {
  return useQuery({
    queryKey: queryKeys.posts.byId(postId),
    queryFn: async () => {
      const response = await postAPI.getById(postId);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!postId, // Only run if postId is provided
  });
};

// Auth Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => authAPI.login(credentials),
    retry: false, // Don't retry login attempts - show error immediately
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
    retry: false, // Don't retry register attempts - show error immediately
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
    retry: false, // Don't retry - show error immediately
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) => 
      authAPI.resetPassword(token, newPassword),
    retry: false, // Don't retry - show error immediately
  });
};

// Follow/Unfollow Mutations
export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (creatorId: string) => {
      const response = await creatorAPI.toggleFollow(creatorId);
      return response;
    },
    onSuccess: (data, creatorId) => {
      // Update creators list cache directly for immediate UI update
      queryClient.setQueryData(queryKeys.creators.all, (oldData: any) => {
        if (!oldData) return oldData;
        
        return oldData.map((creator: any) => {
          if (creator.id === creatorId) {
            return {
              ...creator,
              isFollowing: data.data.isFollowing,
              followersCount: data.data.isFollowing 
                ? creator.followersCount + 1 
                : Math.max(0, creator.followersCount - 1)
            };
          }
          return creator;
        });
      });
      
      // Update specific creator cache
      queryClient.setQueryData(queryKeys.creators.byId(creatorId), (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          isFollowing: data.data.isFollowing,
          followersCount: data.data.isFollowing 
            ? oldData.followersCount + 1 
            : Math.max(0, oldData.followersCount - 1)
        };
      });
    },
    onError: (error) => {
      console.error('Failed to toggle follow status:', error);
    },
  });
};
