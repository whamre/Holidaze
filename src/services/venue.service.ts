import { api } from '../api/api';
import { Venue } from '../types/api.types';
import { authService } from './auth.service';

export const venueService = {
  async getVenues(): Promise<Venue[]> {
    try {
      return await api.get<Venue[]>('/holidaze/venues', { _owner: 'true' });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch venues');
    }
  },

  async getVenueById(id: string): Promise<Venue> {
    try {
      return await api.get<Venue>(`/holidaze/venues/${id}`, { 
        _owner: 'true',
        _bookings: 'true'
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch venue details');
    }
  },

  async getManagerVenues(): Promise<Venue[]> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) throw new Error('No user logged in');

      return await api.get<Venue[]>(`/holidaze/profiles/${currentUser.name}/venues`, {
        _owner: 'true',
        _bookings: 'true'
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch manager venues');
    }
  },

  async createVenue(data: Partial<Venue>): Promise<Venue> {
    try {
      return await api.post<Venue>('/holidaze/venues', data);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create venue');
    }
  },

  async updateVenue(id: string, data: Partial<Venue>): Promise<Venue> {
    try {
      return await api.put<Venue>(`/holidaze/venues/${id}`, data);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update venue');
    }
  },

  async deleteVenue(id: string): Promise<void> {
    try {
      await api.delete(`/holidaze/venues/${id}`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete venue');
    }
  },

  async searchVenues(query: string): Promise<Venue[]> {
    try {
      return await api.get<Venue[]>(`/holidaze/venues/search`, { q: query });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to search venues');
    }
  }
};