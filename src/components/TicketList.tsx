
import TicketCard from './TicketCard';
import Box from '@mui/material/Box';

interface TicketListProps {
  tickets: any[];
  onBook: (ticket: any) => void;
}


const TicketList = ({ tickets, onBook }: TicketListProps) => (
  <Box display="flex" flexDirection="column" gap={3}>
    {tickets.map((ticket,i) => (
      <TicketCard key={i} ticket={ticket} onBook={onBook} />
    ))}
    {/* {tickets.length === 0 && (
      <Box textAlign="center" py={8}>
        <Box mb={3} fontSize={64} color="#222" sx={{ animation: 'bounce 1.5s infinite' }}>🚌</Box>
        <Typography variant="h6" fontWeight={700} color="#111" mb={1}>
          Searching for available buses...
        </Typography>
        <Typography variant="body2" color="#444">
          We're checking with all travel agencies for the best options
        </Typography>
      </Box>
    )} */}
  </Box>
);

export default TicketList;
