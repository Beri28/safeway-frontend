// Types shared between backend and frontend for API data

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?:string;
  role: 'user' | 'admin';
}

export interface Route {
  _id?: string;
  agency: string;
  from: string;
  to: string;
  busType:"VIP"|"Standard";
  busNumber?:string;
  departureTime: string; // ISO string
  date: string;   // ISO string
  seatsTotal: number;
  seatsBooked: number;
  seatNumbersBooked:number[];
  price: number;
  features:string[];
  status?:'Active'|'Cancelled'
}

export interface Booking {
  _id: string;
  userId: string;
  busId: string;
  seat: number;
  status: 'booked' | 'cancelled' | 'used';
  createdAt: string; // ISO string
  // Optionally, include populated user/bus for admin endpoints
  user?: User;
  bus?: Route;
}

export interface AuthResponse {
  token: string;
  user: User;
}
