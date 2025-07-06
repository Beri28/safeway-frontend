import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserBookings } from '../api';
import type { Booking } from '../apiTypes';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';

const BookingHistory = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [reviewed, setReviewed] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getUserBookings(token, user.id);
        setBookings(data);
      } catch (err: any) {
        setError('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, token]);

  const handleReview = (id: string) => {
    setReviewed(prev => ({ ...prev, [id]: true }));
    setReview('');
    setRating(null);
  };

  return (
    <Box maxWidth={700} mx="auto" p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>Booking History</Typography>
      {loading ? (
        <Typography color="#888">Loading bookings...</Typography>
      ) : error ? (
        <Typography color="error.main">{error}</Typography>
      ) : bookings.length === 0 ? (
        <Typography color="#888">No bookings yet.</Typography>
      ) : (
        bookings.map(b => (
          <Box key={b.id} mb={4} p={2} borderRadius={2} bgcolor="#f5f5f5" border="1px solid #e0e0e0">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={600}>{b.bus?.agency}</Typography>
              <Typography fontSize={14} color="#444">{b.bus?.from} → {b.bus?.to}</Typography>
            </Stack>
            <Typography fontSize={13} color="#888">{b.bus?.departure?.slice(0,16).replace('T',' ')} - {b.bus?.arrival?.slice(0,16).replace('T',' ')}</Typography>
            <Typography fontSize={13} color="#888">Seat: {b.seat}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography fontSize={13} color="#888">Status: {b.status}</Typography>
            <Typography fontSize={13} color="#888">Booked: {new Date(b.createdAt).toLocaleString()}</Typography>
            <Divider sx={{ my: 1 }} />
            {!reviewed[b.id] ? (
              <Box>
                <Typography fontWeight={600} mb={1}>Leave a Review</Typography>
                <Rating value={rating} onChange={(_, v) => setRating(v)} />
                <TextField
                  label="Your review"
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  size="small"
                  fullWidth
                  sx={{ my: 1 }}
                />
                <Button
                  variant="contained"
                  disabled={!rating || !review}
                  onClick={() => handleReview(b.id)}
                >
                  Submit Review
                </Button>
              </Box>
            ) : (
              <Typography color="green">Thank you for your feedback!</Typography>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default BookingHistory;
