import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import StarIcon from '@mui/icons-material/Star';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import { muiCardSx } from './muiCardSx';
import Grid from '@mui/material/Grid';
import { Bus } from '../apiTypes';

interface TicketCardProps {
  ticket: Bus;
  onBook: (ticket: Bus) => void;
}



const TicketCard = ({ ticket, onBook }: TicketCardProps) => (
  <Card elevation={4} sx={{ ...muiCardSx, border: '1px solid #f57c00', boxShadow: 4, p: 3 }}>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" gap={2}>
        <Box fontSize={32} mr={1}>🚌</Box>
        <Box>
          <Typography fontWeight={700} fontSize={18} color="#111" mb={0.5}>{ticket.agency}</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <StarIcon sx={{ color: '#FFD600', fontSize: 16 }} />
            <Typography variant="body2" color="#444">-</Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#e0e0e0' }} />
            <Typography variant="caption" sx={{ bgcolor: '#222', color: '#fff', px: 1, borderRadius: 1, fontWeight: 600 }}>{ticket.busType}</Typography>
          </Stack>
        </Box>
      </Box>
      <Box textAlign="right">
        <Typography fontWeight={800} fontSize={24} color="#111">
          {ticket.price.toLocaleString()} <Box component="span" fontWeight={500} fontSize={16}>FCFA</Box>
        </Typography>
        <Typography variant="body2" color="#888">per person</Typography> 
      </Box>
    </Box>
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12} md={4}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccessTimeIcon sx={{ color: '#222' }} fontSize="small" />
          <Box>
            <Typography fontWeight={600} fontSize={15}>{ticket.departureTime}</Typography>
            <Typography variant="caption" color="#888">Duration: -</Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PeopleIcon sx={{ color: '#222' }} fontSize="small" />
          <Box>
            <Typography fontWeight={600} fontSize={15}>{ticket.seatsTotal-ticket.seatsBooked} seats left</Typography>
            <Typography variant="caption" color="#888">Hurry! Limited availability</Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {ticket.features && ticket.features.map((feature: any, i: number) => (
            <Box key={i} sx={{ bgcolor: '#f5f5f5', color: '#222', px: 1, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, border: '1px solid #e0e0e0' }}>{feature}</Box>
          ))}
        </Stack>
      </Grid>
    </Grid>
    <Box display="flex" justifyContent="end" mt={3}>
      <Button
        onClick={() => onBook(ticket)}
        variant="contained"
        endIcon={<ChevronRightIcon fontSize="small" />}
        sx={{
          bgcolor: '#00796B',
          color: '#fff',
          borderRadius: 2,
          fontWeight: 600,
          fontSize: 16,
          px: 4,
          py: 1.5,
          boxShadow: 2,
          '&:hover': { bgcolor: '#fbc02d', color: '#fff' },
        }}
      >
        Book Now
      </Button>
    </Box>
  </Card>
);

export default TicketCard;
