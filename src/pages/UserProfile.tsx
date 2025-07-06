import React, {useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import HistoryIcon from '@mui/icons-material/History';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import ReviewModal from '../components/ReviewModal';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import { useEffect } from 'react';
import { getUserBookings, cancelBooking, searchBuses } from '../api';
import type { Booking, Route } from '../apiTypes';
import SearchForm from '../components/SearchForm';
import TicketList from '../components/TicketList';
import SeatSelectionModal from '../components/SeatSelectionModal';
import BookingModal from '../components/BookingModal';
import { useBookingHistory } from '../contexts/BookingHistoryContext';
import CircularProgress from '@mui/material/CircularProgress';
import { RefreshCcw } from 'lucide-react';
import Divider from '@mui/material/Divider';

const agencies = [
  { id: 1, name: 'Guarantee Express', rating: 4.5, logo: '🚌' },
  { id: 2, name: 'Binam Voyages', rating: 4.2, logo: '🚍' },
  { id: 3, name: 'United Express', rating: 4.7, logo: '🚐' },
  { id: 4, name: 'Central Express', rating: 4.1, logo: '🚌' }
];
const cities = [
  'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Garoua',
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Buea', 'Limbe'
];

const UserProfile: React.FC = () => {
  const { user, logout, token } = useAuth();
  const { bookings, addBooking } = useBookingHistory();
  const [tickets, setTickets] = useState<Booking[]>(bookings);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ open: boolean; ticket: Booking | null }>({ open: false, ticket: null });
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    loyalty: bookings.length*100,
    notifications: [
      { id: 1, text: 'Your ticket is confirmed.' },
      { id: 2, text: 'You earned 100 loyalty points!' }
    ]
  });
  const [dismissedNotifications, setDismissedNotifications] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = profile.notifications.filter(n => !dismissedNotifications.includes(n.id)).length;
  const [downloading, setDownloading] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
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
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch user bookings on mount
  const fetchBookings = async () => {
    if (!user || !token) return;
    setLoading2(true);
    setError(null);
    try {
      const bookings = await getUserBookings(token, user._id);
      setTickets(bookings);
      setProfile({...profile,loyalty: bookings.length*100})
    } catch (err: any) {
      console.log(err)
      setError('Failed to fetch bookings.');
    } finally {
      setLoading2(false);
    }
  };
  useEffect(() => {
    setProfile(
      {
        name: user?.name || '',
        email: user?.email || '',
        loyalty: bookings.length*100,
        notifications: [
          { id: 1, text: 'Your ticket is confirmed.' },
          { id: 2, text: 'You earned 100 loyalty points!' }
        ]
      }
    )
    fetchBookings();
    handleSearch()
  }, [user, token,bookings]);

  const handleSearch =async () => {
    if (searchParams.from && searchParams.to && searchParams.date) {
      // setShowResults(true);
      setLoading(true);
      setError(null);
      try {
        const buses = await searchBuses({
          from: searchParams.from,
          to: searchParams.to,
          date: searchParams.date
        });
        if(buses){
          console.log(buses)
          setAvailableTickets(buses);
          setShowResults(true);
        }
      } catch (err: any) {
        setError('Failed to fetch buses. Please try again.');
        setAvailableTickets([]);
      } finally {
        setLoading(false);
      }
    }
    // if (searchParams.from && searchParams.to && searchParams.date) {
    //   setShowResults(true);
    // }
  };

  const handleBookTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setSelectedSeats([]);
    setShowSeatSelection(true);
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

  const handleDownload = async (ticketId: string) => {
    setDownloading(ticketId);
    const ticket = tickets.find(t => t._id === ticketId);
    console.log(ticket)
    if (!ticket) return;
    // Generate PDF
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('SafeWay Bus Ticket Receipt', 20, 20);
    doc.setFontSize(12);
    doc.text(`Ticket ID: ${ticket._id}`, 20, 35);
    doc.text(`Passenger: ${profile.name}`, 20, 45);
    doc.text(`From: ${ticket.bus?.from ?? ''}`, 20, 55);
    doc.text(`To: ${ticket.bus?.to ?? ''}`, 20, 65);
    doc.text(`Date: ${ticket.bus?.date?? ''}`, 20, 75);
    doc.text(`Time: ${ticket.bus?.departureTime?.slice(0, 10) ?? ''}`, 20, 85);
    doc.text(`Agency: ${ticket.bus?.agency ?? ''}`, 20, 95);
    doc.text(`Seat: ${ticket.seat}`, 20, 105);
    doc.text(`Price: ${ticket.bus?.price?.toLocaleString() ?? ''} FCFA`, 20, 115);
    doc.text(`Status: ${ticket.status}`, 20, 125);
    doc.text(`Purchased: ${ticket.createdAt ?? ''}`, 20, 135);
    // Generate QR code (encode ticket info or a unique URL)
    try {
      // const qrValue = ` Ticket:${ticket._id}|${profile.name}|${ticket.bus?.from}->${ticket.bus?.to}|${ticket.bus?.departureTime?.slice(0,10)}|${ticket.seat}`;
      const qrValue = `https://safeway-frontend.vercel.app/ticket/${ticket._id}/${profile.name}/${ticket.seat}`;
      const qrDataUrl = await QRCode.toDataURL(qrValue, { width: 120, margin: 1 });
      doc.addImage(qrDataUrl, 'PNG', 140, 30, 50, 50);
      doc.setFontSize(10);
      doc.text('Scan QR for ticket validation', 140, 85);
    } catch (err) {
      // fallback: no QR
    }
    doc.setFontSize(10);
    doc.text('Thank you for booking with SafeWay!', 20, 150);
    setTimeout(() => {
      doc.save(`SafeWay_Ticket_${ticket._id}.pdf`);
      setDownloading(null);
    }, 800);
  };

  const handleCancel = async (bookingId: string) => {
    if (!token) return;
    setCancelling(bookingId);
    try {
      const updated = await cancelBooking(token, bookingId);
      setTickets(prev => prev.map(t => t._id === bookingId ? updated : t));
    } catch (err) {
      alert('Failed to cancel booking.');
    } finally {
      setCancelling(null);
    }
  };

  // Simulate real-time ticket updates
  React.useEffect(() => {
    const generateTickets = () => {
      const tickets: any[] = [];
      agencies.forEach(agency => {
        for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
          tickets.push({
            id: `${agency.id}-${i}`,
            agency: agency.name,
            agencyRating: agency.rating,
            agencyLogo: agency.logo,
            from: searchParams.from || 'Douala',
            to: searchParams.to || 'Yaoundé',
            departureTime: `${Math.floor(Math.random() * 12) + 6}:${Math.random() > 0.5 ? '00' : '30'}`,
            arrivalTime: `${Math.floor(Math.random() * 6) + 12}:${Math.random() > 0.5 ? '00' : '30'}`,
            duration: `${Math.floor(Math.random() * 4) + 3}h ${Math.floor(Math.random() * 60)}m`,
            price: Math.floor(Math.random() * 5000) + 3000,
            availableSeats: Math.floor(Math.random() * 20) + 5,
            totalSeats: 40,
            occupiedSeats: Array.from({length: Math.floor(Math.random() * 15) + 5}, () => Math.floor(Math.random() * 40) + 1),
            busType: Math.random() > 0.5 ? 'VIP' : 'Standard',
            features: ['AC', 'WiFi', 'Refreshments'].filter(() => Math.random() > 0.3)
          });
        }
      });
      setAvailableTickets(tickets.sort((a: any, b: any) => a.price - b.price));
    };
    if (showResults) {
      // generateTickets();
      const interval = setInterval(handleSearch, 10000);
      return () => clearInterval(interval);
    }
  }, [showResults, searchParams]);

  return (
    <Box className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ px:0,bgcolor: '#fff', color: '#222', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ maxWidth:{sm:'80%',xs:'90%'},mx:'auto',minHeight: 72,width: '100%' ,display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <DirectionsBusFilledIcon sx={{ color: '#388e3c', fontSize: 32 }} />
            <Typography variant="h5" fontWeight={900} color="#00796B" sx={{ letterSpacing: 1 }}>SafeWay</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={3}>
            {/* Loyalty Points */}
            <Box textAlign="center" display={{ xs: 'none', md: 'flex' }} flexDirection="column" alignItems="center" justifyContent="center" sx={{ minWidth: 80 }}>
              <Typography fontWeight={700} color="#00796B" fontSize={13}>Points</Typography>
              <Typography fontWeight={900} color="#ff9800" fontSize={20} sx={{ lineHeight: 1 }}>{profile.loyalty}</Typography>
            </Box>
            {/* Notifications */}
            <Box position="relative">
              <Badge color="error" badgeContent={unreadCount} invisible={unreadCount === 0}>
                <IconButton color="primary" onClick={() => setShowNotifications(v => !v)} aria-label="Show notifications" size="small">
                  <NotificationsIcon />
                </IconButton>
              </Badge>
              {showNotifications && (
                <Paper elevation={6} sx={{ position: 'absolute', right: 0, mt: 1, zIndex: 10, minWidth: 260, maxWidth: 320, p: 2, borderRadius: 3, boxShadow: 6 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography fontWeight={700} color="#00796B" fontSize={15}>Notifications</Typography>
                    <IconButton size="small" onClick={() => setShowNotifications(false)}><CloseIcon fontSize="small" /></IconButton>
                  </Box>
                  <Box maxHeight={120} overflow="auto" sx={{ scrollbarWidth: 'thin', width: '100%' }}>
                    {profile.notifications.filter(n => !dismissedNotifications.includes(n.id)).length === 0 ? (
                      <Typography fontSize={12} color="#888">No notifications</Typography>
                    ) : (
                      profile.notifications.filter(n => !dismissedNotifications.includes(n.id)).map(n => (
                        <Box key={n.id} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5, background: '#f5f7fa', borderRadius: 1, px: 1, py: 0.5 }}>
                          <Typography fontSize={12} color="#444" sx={{ textAlign: 'left', flex: 1 }}>• {n.text}</Typography>
                          <IconButton size="small" color="error" sx={{ minWidth: 0, ml: 1, fontSize: 10, p: 0.5 }} onClick={() => setDismissedNotifications(ids => [...ids, n.id])} aria-label="Dismiss notification">
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))
                    )}
                  </Box>
                  {profile.notifications.filter(n => !dismissedNotifications.includes(n.id)).length > 0 && (
                    <Button fullWidth size="small" color="error" sx={{ mt: 1, fontSize: 12 }} onClick={() => setDismissedNotifications(profile.notifications.map(n => n.id))}>Clear All</Button>
                  )}
                </Paper>
              )}
            </Box>
            {/* Avatar and Name */}
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: '#00796B', width: 40, height: 40, fontSize: 20, boxShadow: 1, border: '2px solid #fff' }}>{profile.name[0]}</Avatar>
              <Box display={{ xs: 'none', sm: 'block' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#222" sx={{ fontSize: 15 }}>{profile.name}</Typography>
                <Typography variant="caption" color="text.secondary">{profile.email}</Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{maxWidth:{sm:'80%',xs:'90%'},mx:'auto', py: 6 }}>
        {/* Profile Card */}
        <Paper elevation={4} sx={{ borderRadius: 5, p: 4, mb: 6, background: 'linear-gradient(90deg, #fff 60%, #e0f7fa 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <Box display="flex" alignItems="center" sx={{flexWrap:'wrap'}} gap={4}>
            <Avatar sx={{ bgcolor: '#00796B', width: 80, height: 80, fontSize: 40, boxShadow: 2, border: '4px solid #fff' }}>
              {profile.name[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h4" fontWeight={900} color="#222" sx={{ letterSpacing: 1 }}>{profile.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 0.5 }}>{profile.email}</Typography>
              {/* <Typography variant="body2" color="text.secondary">{profile.phone} {profile.region && `• ${profile.region}`}</Typography> */}
              <Box mt={1} display="flex" gap={2} alignItems="center">
                <Button variant="contained" color="primary" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} onClick={() => setEditProfileOpen(true)}>Edit Profile</Button>
                <Button variant="outlined" color="error" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} onClick={logout}>Logout</Button>
              </Box>
            </Box>
            <Box minWidth={180} textAlign="center" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
              <Typography fontWeight={700} color="#00796B" fontSize={15}>Loyalty Points</Typography>
              <Typography fontWeight={900} color="#ff9800" fontSize={28} sx={{ letterSpacing: 1 }}>{profile.loyalty}</Typography>
              <Typography fontSize={13} color="#888">Points</Typography>
            </Box>
          </Box>
        </Paper>
        <EditProfileModal
          open={editProfileOpen}
          user={profile}
          onSave={data => { setProfile(p => ({ ...p, ...data })); setEditProfileOpen(false); }}
          onClose={() => setEditProfileOpen(false)}
        />

        {/* Booking Flow Section */}
        <Paper elevation={1} sx={{ borderRadius: 4, py: 3, background: '#f8fafc', mb: 6 }}>
          <Typography variant="h5" fontWeight={800} color="#00796B" mb={2} sx={{ letterSpacing: 0.5,px:3 }}>
            Book a New Ticket
          </Typography>
          {!showResults ? (
            <Box sx={{ maxWidth: '90%', mx: 'auto',position:'relative' }}>
              <SearchForm
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                cities={cities}
                onSearch={handleSearch}
              />
              {loading && <CircularProgress color='info' size={42} sx={{position:'absolute',top:'60%',left:'50%'}} />}
            </Box>
          ) : (
            <Box px={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={700} color="#111">
                  {searchParams.from} → {searchParams.to}
                </Typography>
                <Button color="primary" onClick={() => setShowResults(false)}>
                  Modify Search
                </Button>
              </Box>
              {availableTickets.length>=1?
              <TicketList tickets={availableTickets} onBook={handleBookTicket} />
              :
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-600 mb-2">No available buses for that route and date...</h3>
              </div>
              }
            </Box>
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
        </Paper>

        <Paper elevation={2} sx={{ borderRadius: 4, p: 3, background: '#fff', mb: 3 }}>
          <Typography variant="h5" fontWeight={800} color="#00796B" mb={3} sx={{ letterSpacing: 0.5, display: 'flex', alignItems: 'center' }}>
            <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#00796B' }} /> My Ticket History
          </Typography>
          <button 
            onClick={() => fetchBookings()}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
          {loading2 ? (
            <Typography color="text.secondary">Loading bookings...</Typography>
          ) : error ? (
            <Typography color="error.main">{error}</Typography>
          ) : tickets.length === 0 ? (
            <Typography color="text.secondary">No tickets found.</Typography>
          ) : (
            <Stack spacing={3}>
              {tickets.filter((s)=>s.status!=='cancelled').map((ticket:Booking) => (
                <Paper key={ticket._id} elevation={0} sx={{ p: 2.5, borderRadius: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, background: '#f7fafc', border: '1px solid #e0e0e0' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="#00796B" sx={{ fontSize: 18 }}>{ticket.bus?.from} → {ticket.bus?.to}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 15 }}>{ticket.bus?.departureTime?.slice(0,16).replace('T',' ')} • {ticket.bus?.agency}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 15 }}>Seat: {ticket.seat} • Price: {ticket.bus?.price?.toLocaleString()} FCFA</Typography>
                    {ticket.status && <Chip label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)} color={ticket.status === 'booked' ? 'success' : ticket.status === 'cancelled' ? 'default' : 'primary'} size="small" sx={{ mt: 1, fontWeight: 600, fontSize: 13, px: 1.5 }} />}
                  </Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Tooltip title="Download PDF Receipt">
                      <span>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<DownloadIcon />}
                          disabled={downloading === ticket._id}
                          sx={{ fontWeight: 700, borderRadius: 2 }}
                          onClick={() => handleDownload(ticket._id)}
                        >
                          {downloading === ticket._id ? 'Downloading...' : 'Download PDF'}
                        </Button>
                      </span>
                    </Tooltip>
                    {ticket.status === 'booked' && (
                      <Tooltip title="Cancel this ticket">
                        <span>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            disabled={cancelling === ticket._id}
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                            onClick={() => handleCancel(ticket._id)}
                          >
                            {cancelling === ticket._id ? 'Cancelling...' : 'Cancel Ticket'}
                          </Button>
                        </span>
                      </Tooltip>
                    )}
                    {/* Rebook button */}
                    {/* <Button variant="outlined" color="success" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} onClick={() => handleBookTicket(ticket)}>
                      Rebook
                    </Button> */}
                    {/* Leave Review for used tickets */}
                    {ticket.status === 'used' && (
                      <Button variant="outlined" color="primary" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} onClick={() => setReviewModal({ open: true, ticket })}>
                        Leave Review
                      </Button>
                    )}
                  </Stack>
                </Paper>
              ))}
              <Divider />
              <Typography variant="h6" fontWeight={500} color="red" mb={3} sx={{ letterSpacing: 0.5, display: 'flex', alignItems: 'center' }}>
                <CancelIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'red' }} /> Canceled tickets
              </Typography>
              {tickets.filter((s)=>s.status==='cancelled').map((ticket:Booking) => (
                <Paper key={ticket._id} elevation={0} sx={{ p: 2.5, borderRadius: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, background: '#f7fafc', border: '1px solid #e0e0e0' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="#00796B" sx={{ fontSize: 18 }}>{ticket.bus?.from} → {ticket.bus?.to}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 15 }}>{ticket.bus?.departureTime?.slice(0,16).replace('T',' ')} • {ticket.bus?.agency}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 15 }}>Seat: {ticket.seat} • Price: {ticket.bus?.price?.toLocaleString()} FCFA</Typography>
                    {ticket.status && <Chip label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)} color={ticket.status === 'booked' ? 'success' : ticket.status === 'cancelled' ? 'default' : 'primary'} size="small" sx={{ mt: 1, fontWeight: 600, fontSize: 13, px: 1.5 }} />}
                  </Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Tooltip title="Download PDF Receipt">
                      <span>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<DownloadIcon />}
                          disabled={downloading === ticket._id}
                          sx={{ fontWeight: 700, borderRadius: 2 }}
                          onClick={() => handleDownload(ticket._id)}
                        >
                          {downloading === ticket._id ? 'Downloading...' : 'Download PDF'}
                        </Button>
                      </span>
                    </Tooltip>
                    {ticket.status === 'booked' && (
                      <Tooltip title="Cancel this ticket">
                        <span>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            disabled={cancelling === ticket._id}
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                            onClick={() => handleCancel(ticket._id)}
                          >
                            {cancelling === ticket._id ? 'Cancelling...' : 'Cancel Ticket'}
                          </Button>
                        </span>
                      </Tooltip>
                    )}
                    {/* Rebook button */}
                    {/* <Button variant="outlined" color="success" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} onClick={() => handleBookTicket(ticket)}>
                      Rebook
                    </Button> */}
                    {/* Leave Review for used tickets */}
                    {ticket.status === 'used' && (
                      <Button variant="outlined" color="primary" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} onClick={() => setReviewModal({ open: true, ticket })}>
                        Leave Review
                      </Button>
                    )}
                  </Stack>
                </Paper>
              ))}
              <Divider />
              {/* Review Modal */}
              <ReviewModal
                open={reviewModal.open}
                ticket={reviewModal.ticket}
                onSubmit={review => {
                  setReviewModal({ open: false, ticket: null });
                  // Here you would send review to backend or update state
                  alert('Thank you for your review!');
                }}
                onClose={() => setReviewModal({ open: false, ticket: null })}
              />
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default UserProfile;
