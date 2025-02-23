import { api } from '../api/api';
import { Booking } from '../types/api.types';
import { authService } from './auth.service';

export const bookingService = {
  async createBooking(venueId: string, data: { dateFrom: string; dateTo: string; guests: number }): Promise<Booking> {
    try {
      return await api.post<Booking>('/holidaze/bookings', {
        ...data,
        venueId
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create booking. Please try again.');
    }
  },

  async getUserBookings(): Promise<Booking[]> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) throw new Error('No user logged in');

      return await api.get<Booking[]>(`/holidaze/profiles/${currentUser.name}/bookings`, {
        _venue: 'true',
        _customer: 'true'
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch bookings');
    }
  },

  async getVenueBookings(venueId: string): Promise<Booking[]> {
    try {
      const venue = await api.get<Booking[]>(`/holidaze/venues/${venueId}`, {
        _bookings: 'true',
        _customer: 'true'
      });
      return venue.bookings || [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch venue bookings');
    }
  }
};