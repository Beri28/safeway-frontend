import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Route } from '../apiTypes';

interface SeatSelectionModalProps {
  selectedTicket: Route;
  selectedSeats: number[];
  onClose: () => void;
  onSelect: (seat: number) => void;
  onContinue: () => void;
}

const SeatSelectionModal = ({ selectedTicket, selectedSeats, onClose, onSelect, onContinue }: SeatSelectionModalProps) => {
  // Determine bus capacity
  const busCapacity = selectedTicket?.seatsTotal || 30; // fallback to 30 if not provided
  const seatsPerRow = 5; // 3 left, 2 right
  const rows = Math.ceil(busCapacity / seatsPerRow);

  // Helper to get seat label (A, B, C, D, E, F)
  const seatLabel = (row: number, seatInRow: number) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    return `${row}${letters[seatInRow - 1]}`;
  };

  // Render seat map
  const renderSeatMap = () => {
    const seats = [];
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      // Left side (3 seats)
      for (let seatInRow = 1; seatInRow <= 3; seatInRow++) {
        const seatNumber = (row - 1) * seatsPerRow + seatInRow;
        if (seatNumber > busCapacity) continue;
        const label = seatLabel(row, seatInRow);
        const isOccupied = selectedTicket?.seatNumbersBooked?.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        rowSeats.push(
          <button
            key={label}
            onClick={() => !isOccupied && (isSelected || selectedSeats.length < 6) && onSelect(seatNumber)}
            disabled={isOccupied}
            className={`w-10 h-10 text-xs font-medium rounded-md border-2 transition-all ${isOccupied ? 'bg-red-200 border-red-300 text-red-600 cursor-not-allowed' : isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-green-300 border-green-300 text-black hover:bg-gray-100'}`}
            // aria-pressed={isSelected}
            aria-label={`Seat ${label}${isOccupied ? ' (Occupied)' : isSelected ? ' (Selected)' : ''}`}
          >
            {label}
          </button>
        );
      }
      // Aisle
      rowSeats.push(<div key={`aisle-${row}`} style={{ width: 24 }} />);
      // Right side (2 seats)
      for (let seatInRow = 4; seatInRow <6; seatInRow++) {
        const seatNumber = (row - 1) * seatsPerRow + seatInRow;
        if (seatNumber > busCapacity) continue;
        const label = seatLabel(row, seatInRow);
        const isOccupied = selectedTicket?.seatNumbersBooked?.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        rowSeats.push(
          <button
            key={label}
            onClick={() => !isOccupied && (isSelected || selectedSeats.length < 6) && onSelect(seatNumber)}
            disabled={isOccupied}
            className={`w-10 h-10 text-xs font-medium rounded-md border-2 transition-all ${isOccupied ? 'bg-red-200 border-red-300 text-red-600 cursor-not-allowed' : isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-green-300 border-green-300 text-black hover:bg-gray-100'}`}
            // aria-pressed={isSelected}
            aria-label={`Seat ${label}${isOccupied ? ' (Occupied)' : isSelected ? ' (Selected)' : ''}`}
          >
            {label}
          </button>
        );
      }
      seats.push(
        <div key={row} className="flex items-center justify-center gap-2 mb-2">
          {rowSeats}
        </div>
      );
    }
    return seats;
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: '#fff', color: '#111' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography fontWeight={700} fontSize={22} color="#111">Select Your Seat</Typography>
        <IconButton onClick={onClose} aria-label="Close seat selection">
          <CloseIcon sx={{ color: '#444' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box mb={2} p={2} borderRadius={2} bgcolor="#f5f5f5" border="1px solid #e0e0e0">
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography fontWeight={600} color="#111">{selectedTicket?.agency}</Typography>
            <Typography fontSize={14} color="#444">{selectedTicket?.busType}</Typography>
          </Stack>
          <Typography fontSize={13} color="#888">{selectedTicket?.from} → {selectedTicket?.to}</Typography>
          <Typography fontSize={13} color="#888">{selectedTicket?.departureTime}</Typography>
        </Box>
        <Box mb={2} p={2} borderRadius={2} bgcolor="#fff" border="1px solid #e0e0e0">
          <Box display="flex" justifyContent="center" mb={2}>
            <Box bgcolor="#222" color="#fff" px={2} py={0.5} borderRadius={2} fontSize={12} fontWeight={600} boxShadow={1}>🚗 Driver</Box>
          </Box>
          <Box>{renderSeatMap()}</Box>
        </Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box width={16} height={16} bgcolor="green" border="2px solid green" borderRadius={1}></Box>
            <Typography fontSize={12}>Available</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box width={16} height={16} bgcolor="blue" border="2px solid blue" borderRadius={1}></Box>
            <Typography fontSize={12} color="#000" px={0.5} borderRadius={1}>Selected</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box width={16} height={16} bgcolor="red" border="2px solid red" borderRadius={1}></Box>
            <Typography fontSize={12} color="#888">Occupied</Typography>
          </Stack>
        </Stack>
        {selectedSeats.length > 0 && (
          <Box mb={2} p={2} borderRadius={2} bgcolor="#f5f5f5" border="1px solid #e0e0e0">
            <Typography fontWeight={600} color="#111">
              Selected Seats: {selectedSeats.map(seatNum => {
                const row = Math.floor((seatNum - 1) / seatsPerRow) + 1;
                const col = (seatNum - 1) % seatsPerRow + 1;
                return seatLabel(row, col);
              }).join(', ')}
            </Typography>
            <Typography fontSize={12} color="#444">
              {selectedSeats.length} / 6 selected
            </Typography>
          </Box>
        )}
        <Button
          onClick={onContinue}
          disabled={selectedSeats.length === 0}
          variant="contained"
          fullWidth
          sx={{
            color: '#fff',
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 18,
            py: 1.5,
            mt: 1,
            boxShadow: 2,
            bgcolor: '#00796B',
            '&:hover': { bgcolor: '#222', color: '#fff' },
            '&.Mui-disabled': { bgcolor: '#f5f5f5', color: '#888' },
          }}
        >
          Continue to Payment
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SeatSelectionModal;
