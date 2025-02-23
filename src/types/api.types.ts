export interface User {
  name: string;
  email: string;
  avatar?: MediaObject;
  banner?: MediaObject;
  bio?: string;
  venueManager: boolean;
  accessToken?: string;
  _count?: {
    venues: number;
    bookings: number;
  };
}

export interface MediaObject {
  url: string;
  alt: string;
}

export interface Meta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

export interface Location {
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
}

export interface Owner {
  name: string;
  email: string;
  avatar?: MediaObject;
  banner?: MediaObject;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: MediaObject[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: Meta;
  location: Location;
  owner: Owner;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: Venue;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  venueManager?: boolean;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    isFirstPage?: boolean;
    isLastPage?: boolean;
    currentPage?: number;
    previousPage?: number | null;
    nextPage?: number | null;
    pageCount?: number;
    totalCount?: number;
  };
}