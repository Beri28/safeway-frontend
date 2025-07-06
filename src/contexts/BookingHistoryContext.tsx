import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import type { Booking as ApiBooking } from '../apiTypes';
export interface Booking extends ApiBooking {
  ticket?: any;
  seats?: number[];
  passengers?: { name: string; gender: string; phone: string }[];
  date?: string;
}

interface BookingHistoryContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}

const BookingHistoryContext = createContext<BookingHistoryContextType | undefined>(undefined);

export const BookingHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (booking: Booking) => setBookings(prev => [...prev, booking]);
  useEffect(()=>{

  },[bookings])
  return (
    <BookingHistoryContext.Provider value={{ bookings, addBooking }}>
      {children}
    </BookingHistoryContext.Provider>
  );
};

export const useBookingHistory = () => {
  const ctx = useContext(BookingHistoryContext);
  if (!ctx) throw new Error('useBookingHistory must be used within BookingHistoryProvider');
  return ctx;
};
