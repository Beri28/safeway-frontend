import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../apiTypes';
import { useBookingHistory } from './BookingHistoryContext';
import { getUserBookings } from '../api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'safeway_auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { addBooking } = useBookingHistory();
  // On mount, check localStorage for auth
  useEffect(() => {
    const getUserfromLocal=async ()=>{
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.token && parsed.user) {
            console.log(parsed)
            setUser(parsed.user);
            setToken(parsed.token);
            let bookingsTemp=await getUserBookings(parsed.token,parsed.user?._id)
            bookingsTemp.forEach(b=>addBooking(b))
          }
        } catch {}
      }
    }
    getUserfromLocal()
  }, []);

  // useEffect(()=>{

  // },[user,token])

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    // Store only non-sensitive info
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ user, token }));
  };

  const logout = () => {
    setTimeout(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }, 3000);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
