import axios from 'axios';

// Get BASE_URL from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const API_BASE_URL = BASE_URL;

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('accessToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'access-token': `${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Don't fetch user profile immediately, only store tokens
      return { token: response.data.accessToken };
    }
    
    return response;
  }

  async register(userData: { name: string; email: string; password: string }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Don't fetch user profile immediately, wait for step 3
      return { token: response.data.accessToken };
    }
    
    return response;
  }

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async forgotPassword(email: string) {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // User endpoints
  async getCurrentUser() {
    return await this.request('/user', {
      method: 'GET',
    });
  }

  async updateUser(userData: any) {
    return await this.request('/user', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Creator endpoints
  async getAllCreators() {
    return await this.request('/user/creators', {
      method: 'GET',
    });
  }

  async getCreatorById(creatorId: string) {
    return await this.request(`/user/creator/${creatorId}`, {
      method: 'GET',
    });
  }

  async getCreatorByPageName(pageName: string) {
    return await this.request(`/user/creator/page/${pageName}`, {
      method: 'GET',
    });
  }

  async toggleFollowCreator(creatorId: string) {
    return await this.request(`/user/creators/${creatorId}/follow`, {
      method: 'POST',
    });
  }

  // Common endpoints
  async getCategories() {
    return await this.request('/common/categories', {
      method: 'GET',
    });
  }

  async uploadFile(file: File, path?: string) {
    const formData = new FormData();
    formData.append('fileToUpload', file);
    if (path) {
      formData.append('path', path);
    }

    const url = `${this.baseURL}/common/upload-file`;
    const token = localStorage.getItem('accessToken');
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { 'access-token': `${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data; // Returns the S3 URL string
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // Post endpoints
  async createPost(postData: CreatePostData) {
    return await this.request('/user/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async getAllPosts() {
    return await this.request('/user/posts', {
      method: 'GET',
    });
  }

  async getPostById(postId: string) {
    return await this.request(`/user/posts/${postId}`, {
      method: 'GET',
    });
  }

  async updatePost(postId: string, postData: UpdatePostData) {
    return await this.request(`/user/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId: string) {
    return await this.request(`/user/posts/${postId}`, {
      method: 'DELETE',
    });
  }
}

// Create API instances
const apiService = new ApiService(API_BASE_URL);

export const authAPI = {
  login: (credentials: { email: string; password: string }) => apiService.login(credentials),
  register: (userData: { name: string; email: string; password: string }) => apiService.register(userData),
  logout: () => apiService.logout(),
  forgotPassword: (email: string) => apiService.forgotPassword(email),
  resetPassword: (token: string, newPassword: string) => apiService.resetPassword(token, newPassword),
  completeCreatorProfile: async (profileData: { creatorName: string; pageName: string; is18Plus?: boolean }) => {
    const response = await apiService.updateUser(profileData);
    console.log('Raw API response from updateUser:', response);
    console.log('response.data:', response.data);
    console.log('Full response keys:', Object.keys(response));
    
    // Handle different possible response structures
    // Option 1: { success: true, data: { user object } }
    // Option 2: { data: { user object } }
    // Option 3: { user object } directly
    
    if (response.data) {
      return { user: response.data };
    } else if (response.user) {
      return { user: response.user };
    } else {
      // Response might be the user object directly
      return { user: response };
    }
  },
  getUserProfile: async () => {
    const response = await apiService.getCurrentUser();
    return { user: response.data };
  },
};

export const userAPI = {
  getCurrentUser: () => apiService.getCurrentUser(),
  update: (userData: any) => apiService.updateUser(userData),
};

export const creatorAPI = {
  getAllCreators: () => apiService.getAllCreators(),
  getCreatorById: (creatorId: string) => apiService.getCreatorById(creatorId),
  getCreatorByPageName: (pageName: string) => apiService.getCreatorByPageName(pageName),
  toggleFollow: (creatorId: string) => apiService.toggleFollowCreator(creatorId),
};

export const commonAPI = {
  getCategories: () => apiService.getCategories(),
  uploadFile: (file: File, path?: string) => apiService.uploadFile(file, path),
};

export const postAPI = {
  create: (postData: CreatePostData) => apiService.createPost(postData),
  getAll: () => apiService.getAllPosts(),
  getById: (postId: string) => apiService.getPostById(postId),
  update: (postId: string, postData: UpdatePostData) => apiService.updatePost(postId, postData),
  delete: (postId: string) => apiService.deletePost(postId),
};

// Types
export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  pageName?: string;
  creatorName?: string;
  is18Plus?: boolean;
  profilePhoto?: string;
  bio?: string;
  coverPhoto?: string;
  introVideo?: string;
  themeColor?: string;
  socialLinks?: any;
  tags?: string[];
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface MediaFile {
  id?: string;
  type: string;
  url: string;
  name?: string;
  size?: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  accessType?: string;
  tags?: string[];
  mediaFiles?: MediaFile[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  accessType?: string;
  tags?: string[];
  mediaFiles?: MediaFile[];
}

export interface PostDetail {
  id: string;
  creatorId: string;
  title: string;
  content: string;
  accessType: string;
  tags?: string[];
  totalLikes: number;
  mediaFiles: Array<{
    id: string;
    type: string;
    url: string;
    name?: string;
    size?: number;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export interface Post {
  id: string;
  title: string;
  createdAt: string;
  public: boolean;
  totalLikes: number;
  totalComments: number;
}

export interface SocialLink {
  id: string;
  url: string;
  platform: string;
}

export interface Creator {
  id: string;
  pageName: string;
  creatorName: string;
  is18Plus: boolean;
  profilePhoto?: string;
  bio?: string;
  coverPhoto?: string;
  introVideo?: string;
  themeColor?: string;
  socialLinks?: SocialLink[];
  followersCount: number;
  subscribersCount: number;
  tags: string[];
  categoryId: string;
  category: string;
  totalPosts: number;
  createdAt: string;
  updatedAt: string;
  memberships: Membership[];
  recentPosts: Post[];
  exploreOthers: Post[];
  isFollowing?: boolean;
}

export interface CreatorProfileResponse {
  data: Creator;
}

export interface ToggleFollowResponse {
  message: string;
  data: {
    action: 'followed' | 'unfollowed';
    isFollowing: boolean;
  };
}

export default apiService;