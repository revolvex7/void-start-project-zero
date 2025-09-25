import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v_1/internal';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// API functions
export const authAPI = {
  register: async (data: UserRegistrationData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const userAPI = {
  update: async (data: UpdateUserData) => {
    const response = await api.put('/user/', data);
    return response.data;
  },
};