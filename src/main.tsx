import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext';
import { BookingHistoryProvider } from './contexts/BookingHistoryContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BookingHistoryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BookingHistoryProvider>
  </StrictMode>,
)
