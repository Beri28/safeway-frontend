
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import FeaturedAgencies from '../components/FeaturedAgencies';
import TicketList from '../components/TicketList';
import SeatSelectionModal from '../components/SeatSelectionModal';
import BookingModal from '../components/BookingModal';
import AuthPromptModal from '../components/AuthPromptModal';
import '../App.css';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { searchBuses } from '../api';
import type { Route } from '../apiTypes';
import Typography from '@mui/material/Typography';

const cities = [
  'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Garoua',
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Buea', 'Limbe'
];

const agencies = [
  { id: 1, name: 'Guarantee Express', rating: 4.5, logo: '🚌' },
  { id: 2, name: 'Binam Voyages', rating: 4.2, logo: '🚍' },
  { id: 3, name: 'United Express', rating: 4.7, logo: '🚐' },
  { id: 4, name: 'Central Express', rating: 4.1, logo: '🚌' }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  const [showResults, setShowResults] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Route | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [availableTickets, setAvailableTickets] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (searchParams.from && searchParams.to && searchParams.date) {
      setShowResults(true);
      setLoading(true);
      setError(null);
      try {
        const buses = await searchBuses({
          from: searchParams.from,
          to: searchParams.to,
          date: searchParams.date
        });
        setAvailableTickets(buses);
      } catch (err: any) {
        setError('Failed to fetch buses. Please try again.');
        setAvailableTickets([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBookTicket = (ticket: Route) => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    setSelectedTicket(ticket);
    setSelectedSeats([]);
    setShowSeatSelection(true);
  };

  const handleAuthPromptLogin = () => {
    setShowAuthPrompt(false);
    navigate('/login');
  };
  const handleAuthPromptRegister = () => {
    setShowAuthPrompt(false);
    navigate('/register');
  };

  const handleSeatSelect = (seatNumber: number) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      } else if (prev.length < 6) {
        return [...prev, seatNumber];
      }
      return prev;
    });
  };

  const handleContinueToBooking = () => {
    setShowSeatSelection(false);
    setShowBooking(true);
  };

  const handleCloseSeatSelection = () => {
    setShowSeatSelection(false);
    setSelectedSeats([]);
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
    setSelectedSeats([]);
    setSelectedTicket(null);
  };

  useEffect(() => {
    if (showResults) {
      // generateTickets();
      const interval = setInterval(handleSearch, 10000);
      return () => clearInterval(interval);
    }
  }, [showResults, searchParams]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      {!showResults ? (
        <div className="md:max-w-[80%] max-w-[95%] mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#00796B] mb-3 tracking-tight drop-shadow-sm">
              Book Your Bus Ticket
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-4">
              Travel across Cameroon with trusted agencies, real-time seat selection, and instant confirmation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-2">
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Secure Online Payment
              </span>
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                Real-Time Updates
              </span>
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0" /></svg>
                Trusted Agencies
              </span>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl shadow-lg p-6 md:p-10 mb-10 border border-gray-100">
            <Typography variant="h5" fontWeight={800} color="#00796B" mb={2} sx={{ letterSpacing: 0.5 }}>
              Book a Ticket
            </Typography>
            <SearchForm
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              cities={cities}
              onSearch={handleSearch}
            />
          </div>
          <div className="mt-10">
            <FeaturedAgencies agencies={agencies} />
          </div>
        </div>
      ) : (
        <div className="max-w-[80%] mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center">{searchParams.from} <ArrowRight /> {searchParams.to}</h2>
              <p className="text-gray-600">{searchParams.date} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowResults(false)}
              className="text-[#f57c00] hover:text-[#f57c22] cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft />
              Modify Search
            </button>
          </div>
          {error && (
            <div className="text-red-600 mb-4">{error}</div>
          )}
          <TicketList
            tickets={availableTickets}
            onBook={handleBookTicket}
          />
          {loading && (
            <div className="text-center py-12">
              <div className="mx-auto text-gray-400 mb-4 text-6xl">🚌</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Searching for available buses...</h3>
              <p className="text-gray-500">We're checking with all travel agencies for the best options</p>
            </div>
          )}
          {(!loading && availableTickets.length<1) && (
            <div className="text-center py-12">
              {/* <div className="mx-auto text-gray-400 mb-4 text-6xl">🚌</div> */}
              <h3 className="text-lg font-medium text-gray-600 mb-2">No available buses for that route and date...</h3>
              {/* <p className="text-gray-500">We're checking with all travel agencies for the best options</p> */}
            </div>
          )}
        </div>
      )}

      {showSeatSelection && selectedTicket && (
        <SeatSelectionModal
          selectedTicket={selectedTicket}
          selectedSeats={selectedSeats}
          onSelect={handleSeatSelect}
          onContinue={handleContinueToBooking}
          onClose={handleCloseSeatSelection}
        />
      )}
      {showBooking && selectedTicket && (
        <BookingModal
          selectedTicket={selectedTicket}
          selectedSeats={selectedSeats}
          onClose={handleCloseBooking}
        />
      )}

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        open={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        onLogin={handleAuthPromptLogin}
        onRegister={handleAuthPromptRegister}
      />
      <Footer />
    </div>
  );
};

export default Home;