import axios from 'axios';

const BASE_URL = 'https://tf-backend-toc9.onrender.com/api/v_1/internal';

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
}

// Create API instances
const apiService = new ApiService(API_BASE_URL);

export const authAPI = {
  login: (credentials: { email: string; password: string }) => apiService.login(credentials),
  register: (userData: { name: string; email: string; password: string }) => apiService.register(userData),
  logout: () => apiService.logout(),
  completeCreatorProfile: async (profileData: { creatorName: string; pageName: string; is18Plus?: boolean }) => {
    const response = await apiService.updateUser(profileData);
    return { user: response.data };
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
}

export default apiService;