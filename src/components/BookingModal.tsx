import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import { useBookingHistory } from '../contexts/BookingHistoryContext';
import { useAuth } from '../contexts/AuthContext';
import { bookSeat } from '../api';
import { Booking, Route } from '../apiTypes';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';

interface BookingModalProps {
  selectedTicket: Route;
  selectedSeats: number[];
  onClose: () => void;
}



const BookingModal = ({ selectedTicket, selectedSeats = [], onClose }: BookingModalProps) => {
  const seatsPerRow = 6;
  const { user,token } = useAuth();
  // console.log(user)
  const seatLabel = (seatNum: number) => {
    const row = Math.floor((seatNum - 1) / seatsPerRow) + 1;
    const col = (seatNum - 1) % seatsPerRow + 1;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    return `${row}${letters[col - 1]}`;
  };
  const [passengers, setPassengers] = useState(
    selectedSeats.map(() => ({ name: user?.name, gender: 'male', phone: '670000000' }))
  );
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [step, setStep] = useState<'form' | 'confirm' | 'paid'>('form');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [bookings,setBookings] = useState<Booking[]>([]);
  const { addBooking } = useBookingHistory();

  // Validate promo code
  const handleApplyPromo = () => {
    if (promo.trim().toLowerCase() === 'save10') {
      setDiscount(0.1);
    } else {
      setDiscount(0);
    }
  };

  // Calculate total
  const total = selectedTicket?.price * selectedSeats.length;
  const discounted = discount ? Math.round(total * (1 - discount)) : total;

  // Handle payment
  const handlePay =async () => {
    setPaying(true);
    // setBookings([])
    try {
      let bookingTemp=await bookSeat(token|| '',selectedTicket._id||'',selectedSeats,user?._id || '')
      if(bookingTemp){
        console.log(bookingTemp)
        setPaying(false);
        setStep('paid');
        setBookings(bookingTemp)
        bookingTemp.forEach(b=>addBooking(b));
      }
    } catch (error:any) {
      console.log(error)
      if(error.response.status===400){
        setError(error.response.data.message)
      }
      setPaying(false);
    }
    // setPaying(true);
    // setTimeout(() => {
    //   setPaying(false);
    //   setStep('paid');
    //   // addBooking({
    //   //   userId:user.id,
    //   //   busId:'',
    //   //   id: Date.now().toString(),
    //   //   ticket: selectedTicket,
    //   //   seats: selectedSeats,
    //   //   passengers,
    //   //   date: new Date().toISOString(),
    //   //   // status: 'confirmed',
    //   // });
    // }, 2000);
  };

  const handleDownload = async (ticketId: string) => {
      if(!ticketId) return 
      console.log(bookings)
      if (!bookings) {
        return
      };
      setDownloading(ticketId);
      // Generate PDF
      for(let i=0;i<bookings.length;i++){
        let ticket=bookings[i]
        console.log(ticket)
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('SafeWay Bus Ticket Receipt', 20, 20);
        doc.setFontSize(12);
        doc.text(`Ticket ID: ${ticket._id}`, 20, 35);
        doc.text(`Passenger: ${user?.name}`, 20, 45);
        doc.text(`From: ${ticket.bus?.from?? ''}`, 20, 55);
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
          // const qrValue = `Ticket:${ticket._id}|${user?.name}|${ticket.bus?.from}->${ticket.bus?.to}|${ticket.bus?.departureTime?.slice(0,10)}|${ticket.seat}`;
          const qrValue = `https://safeway-frontend.vercel.app/ticket/${ticket._id}/${user?.name}/${ticket.seat}`;
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
      }
  };
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: '#fff', color: '#111' } }}>
    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
      <Typography fontWeight={700} fontSize={22} color="#111">{step === 'form' ? 'Book Your Ticket' : step === 'confirm' ? 'Confirm & Pay' : 'Booking Confirmed'}</Typography>
      <IconButton onClick={onClose} aria-label="Close booking">
        <CloseIcon sx={{ color: '#444' }} />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ p: 3 }}>
      {/* Trip details */}
      <Box mb={2} p={2} borderRadius={2} bgcolor="#f5f5f5" border="1px solid #e0e0e0">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography fontWeight={600} color="#111">{selectedTicket?.agency}</Typography>
          <Typography fontSize={14} color="#444">{selectedTicket?.busType}</Typography>
        </Stack>
        <Typography fontSize={13} color="#888">{selectedTicket?.from} → {selectedTicket?.to}</Typography>
        <Typography fontSize={13} color="#888">{selectedTicket?.departureTime}</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography fontSize={13} color="#888">Amenities: {selectedTicket?.features?.join(', ') || 'Standard'}</Typography>
        <Typography fontSize={13} color="#888">Cancellation: Free up to 24h before departure</Typography>
        <Typography fontSize={13} color="#888">Agency Contact: +237 6XX XXX XXX</Typography>
      </Box>
      {/* Step 1: Passenger details */}
      {step === 'form' && (
        <>
          <Typography fontWeight={600} mb={1}>Passenger Details</Typography>
          <Stack spacing={2} mb={2}>
            {selectedSeats.map((seat, idx) => (
              <Stack key={seat} direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <TextField
                  label={`Name (Seat ${seatLabel(seat)})`}
                  value={passengers[idx]?.name || ''}
                  onChange={e => setPassengers(p => p.map((psg, i) => i === idx ? { ...psg, name: e.target.value } : psg))}
                  required
                  size="small"
                  sx={{ flex: 2 }}
                />
                <TextField
                  select
                  label="Gender"
                  value={passengers[idx]?.gender || ''}
                  onChange={e => setPassengers(p => p.map((psg, i) => i === idx ? { ...psg, gender: e.target.value } : psg))}
                  required
                  size="small"
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </TextField>
                <TextField
                  label="Phone"
                  value={passengers[idx]?.phone || ''}
                  onChange={e => setPassengers(p => p.map((psg, i) => i === idx ? { ...psg, phone: e.target.value } : psg))}
                  required
                  size="small"
                  sx={{ flex: 2 }}
                />
              </Stack>
            ))}
          </Stack>
          {/* Promo code */}
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <TextField
              label="Promo Code"
              value={promo}
              onChange={e => setPromo(e.target.value)}
              size="small"
              sx={{ flex: 2 }}
            />
            <Button onClick={handleApplyPromo} variant="outlined" sx={{ flex: 1, minWidth: 100 }}>Apply</Button>
            {discount > 0 && <Typography color="green">-10% applied</Typography>}
          </Stack>
          {/* Payment method */}
          <TextField
            select
            label="Payment Method"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="mobile">Mobile Money</MenuItem>
            <MenuItem value="card">Credit/Debit Card</MenuItem>
          </TextField>
          {/* Total */}
          <Box borderTop="1px solid #e0e0e0" pt={2} mt={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={700} fontSize={18}>Total Amount</Typography>
              <Typography fontWeight={800} fontSize={24} color="#111">
                {discounted?.toLocaleString()} <Box component="span" fontWeight={500} fontSize={16}>FCFA</Box>
              </Typography>
            </Stack>
            <Button
              variant="contained"
              fullWidth
              startIcon={<CreditCardIcon fontSize="small" />}
              sx={{
                bgcolor: '#00796B',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 18,
                py: 1.5,
                boxShadow: 2,
                '&:hover': { bgcolor: '#222', color: '#fff' },
              }}
              disabled={passengers.some(p => !p.name || !p.gender || !p.phone)}
              onClick={() => setStep('confirm')}
            >
              Continue to Payment
            </Button>
          </Box>
        </>
      )}
      {/* Step 2: Confirm & Pay */}
      {step === 'confirm' && (
        <>
          <Typography fontWeight={600} mb={1}>Review & Confirm</Typography>
          <Box mb={2} p={2} borderRadius={2} bgcolor="#f5f5f5" border="1px solid #e0e0e0">
            <Typography fontWeight={600} color="#111">
              Seats: {selectedSeats.map(seatLabel).join(', ')}
            </Typography>
            <Typography fontSize={12} color="#444">
              {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
            </Typography>
            <Divider sx={{ my: 1 }} />
            {passengers.map((p, i) => (
              <Typography key={i} fontSize={13} color="#222">{seatLabel(selectedSeats[i])}: {p.name} ({p.gender}), {p.phone}</Typography>
            ))}
          </Box>
          <Box borderTop="1px solid #e0e0e0" pt={2} mt={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={700} fontSize={18}>Total Amount</Typography>
              <Typography fontWeight={800} fontSize={24} color="#111">
                {discounted?.toLocaleString()} <Box component="span" fontWeight={500} fontSize={16}>FCFA</Box>
              </Typography>
            </Stack>
            <Typography color="error.main">{error}</Typography>
            <Button
              variant="contained"
              fullWidth
              startIcon={<CreditCardIcon fontSize="small" />}
              sx={{
                bgcolor: '#00796B',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 18,
                py: 1.5,
                boxShadow: 2,
                '&:hover': { bgcolor: '#222', color: '#fff' },
              }}
              disabled={paying}
              onClick={handlePay}
            >
              {paying ? 'Processing Payment...' : 'Pay Now'}
            </Button>
          </Box>
        </>
      )}
      {/* Step 3: Paid/Confirmation */}
      {step === 'paid' && (
        <Box textAlign="center" py={4}>
          <Typography fontWeight={700} fontSize={22} color="green" mb={2}>Booking Confirmed!</Typography>
          <Typography fontSize={16} color="#111" mb={2}>Your ticket has been booked successfully.</Typography>
          <Box sx={{display:'flex',justifyContent:'center'}} mb={2}>
            {selectedSeats.map(seat=>(
              <QRCodeSVG key={seat} value={`Ticket:${selectedTicket?._id}|${user?.email}|${selectedTicket.from}->${selectedTicket.to}|${selectedTicket.departureTime?.slice(0,10)}|${seat}`} size={50} />
            ))
            }
            {/* <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent('BookingID:' + Date.now())}&size=120x120`} alt="QR Code" /> */}
          </Box>
          <Box>
            <Tooltip title="Download Receipt">
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Download />}
                  disabled={downloading === selectedTicket._id}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                  onClick={() => handleDownload(selectedTicket._id || "")}
                >
                  {downloading === selectedTicket._id ? 'Downloading...' : 'Download Receipt'}
                </Button>
              </span>
            </Tooltip>
          </Box>
          <Typography fontSize={14} color="#444">Ticket receipt can now be downloaded.Show this receipt or QR code at boarding.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={onClose}>Close</Button>
        </Box>
      )}
    </DialogContent>
    </Dialog>
  );
}
export default BookingModal;
