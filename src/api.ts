import axios from 'axios';
import type { User, Route, Booking, AuthResponse } from './apiTypes';

// export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE = 'https://safeway-backend-71a1.onrender.com/api'// 'http://localhost:5000/api';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  console.log(res)
  return res.data;
}

export async function adminLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post(`${API_BASE}/auth/admin/login`, { email, password });
  console.log(res)
  return res.data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
  return res.data;
}

export async function getBuses(): Promise<Route[]> {
  const res = await axios.get(`${API_BASE}/buses`);
  return res.data;
}

export async function getBus(id: string): Promise<Route> {
  const res = await axios.get(`${API_BASE}/buses/${id}`);
  return res.data;
}

export async function deleteBus(id: string,token: string,): Promise<{message:string}> {
  const res = await axios.delete(`${API_BASE}/buses/${id}`,{ headers: { Authorization: `Bearer ${token}` }} );
  return res.data;
}

export async function searchBuses(params: { from?: string; to?: string; date?: string }): Promise<Route[]> {
  const res = await axios.post(`${API_BASE}/buses/search/route`, params );
  console.log(res)
  return res.data;
}

export async function bookSeat(token: string, busId: string, seat: number[],userId:string): Promise<Booking[]> {
  const res = await axios.post(
    `${API_BASE}/bookings`,
    { busId, seat,userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  let actualRes=res.data.map((b:Booking)=>{return {...b,user:b.userId,bus:b.busId}})
  return actualRes;
}

export async function getUserBookings(token: string, userId: string): Promise<Booking[]> {
  const res = await axios.get(`${API_BASE}/bookings/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  let actualRes=res.data.map((b:Booking)=>{return {...b,user:b.userId,bus:b.busId}})
  return actualRes;
}

export async function cancelBooking(token: string, bookingId: string): Promise<Booking> {
  const res = await axios.patch(
    `${API_BASE}/bookings/${bookingId}/cancel`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function getUser(token: string, id: string): Promise<User> {
  const res = await axios.get(`${API_BASE}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getUserForReceipt(id: string): Promise<User> {
  const res = await axios.get(`${API_BASE}/users/${id}`,);
  return res.data;
}

export async function getBookingForReceipt(id: string): Promise<Booking> {
  const res = await axios.get(`${API_BASE}/bookings/receipt/${id}`);
  let actualRes={...res.data,user:res.data.userId,bus:res.data.busId}
  return actualRes;
}
