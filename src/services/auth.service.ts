import { api } from '../api/api';
import { LoginData, RegisterData, User } from '../types/api.types';

export const authService = {
  async createApiKey(): Promise<string> {
    try {
      const response = await api.post<{ key: string }>('/auth/create-api-key', {
        name: 'Holidaze API Key'
      });
      const apiKey = response.key;
      localStorage.setItem('apiKey', apiKey);
      return apiKey;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create API key');
    }
  },

  async login(data: LoginData): Promise<User> {
    try {
      const response = await api.post<User>('/auth/login', data);
      const user = response;
      
      if (user.accessToken) {
        localStorage.setItem('token', user.accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Create API key if we don't have one
        if (!localStorage.getItem('apiKey')) {
          await this.createApiKey();
        }
      }
      
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please check your credentials and try again.');
    }
  },

  async loginDemo(): Promise<User> {
    try {
      return await this.login({
        email: 'demo@stud.noroff.no',
        password: 'demo123456'
      });
    } catch (error: any) {
      throw new Error('Demo login failed. Please try again later.');
    }
  },

  async register(data: RegisterData): Promise<User> {
    try {
      return await api.post<User>('/auth/register', data);
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage.includes('Profile already exists')) {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      }
      throw new Error(errorMessage || 'Registration failed. Please try again.');
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) throw new Error('No user logged in');

      const updatedUser = await api.put<User>(`/holidaze/profiles/${currentUser.name}`, {
        bio: data.bio,
        avatar: data.avatar,
        banner: data.banner,
        venueManager: data.venueManager
      });

      const newUser = { ...currentUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  async getProfile(name: string, options?: { bookings?: boolean; venues?: boolean }): Promise<User> {
    try {
      const params: Record<string, string> = {};
      if (options?.bookings) params._bookings = 'true';
      if (options?.venues) params._venues = 'true';

      return await api.get<User>(`/holidaze/profiles/${name}`, params);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch profile');
    }
  },

  async getAllProfiles(): Promise<User[]> {
    try {
      return await api.get<User[]>('/holidaze/profiles');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch profiles');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('apiKey');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};