import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom';
import './App.css';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import BookingHistory from './pages/BookingHistory';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import UserProfile from './pages/UserProfile';
// import { AuthProvider } from './contexts/AuthContext';
// import { BookingHistoryProvider } from './contexts/BookingHistoryContext';
import { LanguageProvider } from './contexts/LanguageContext';
// import LanguageSwitcher from './components/LanguageSwitcher';
import BusAgencyAdminDashboard from './pages/Admin.tsx';
import { useAuth } from './contexts/AuthContext';
import AdminAuth from './pages/adminAuth.tsx';

function App() {
  const { user } = useAuth();
  return (
    <LanguageProvider>
      {/* <BookingHistoryProvider> */}
        <BrowserRouter>
          {/* <div className="language-switcher-fixed">
            <LanguageSwitcher />
          </div> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin_login" element={<AdminAuth />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            {/* <Route path="/profile" element={<UserProfile />} /> */}
            <Route path="/profile" element={user?<UserProfile />:<Navigate to="/login" replace />} />
            {/* <Route path="/admin" element={user?.role==='admin'? <BusAgencyAdminDashboard />:<Navigate to="/login" replace />} /> */}
            <Route path="/admin" element={user?.role==='admin'?<BusAgencyAdminDashboard />:<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      {/* </BookingHistoryProvider> */}
    </LanguageProvider>
  );
}

export default App;
