import React, { useState, useMemo } from 'react';
import { agencies } from '../data.js';
import type { Trip } from '../data.js';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Alert from '@mui/material/Alert';

interface SeatSelectionProps {
    trip: Trip;
    onBack: () => void;
    onBookingComplete: () => void;
}

const Seat: React.FC<{ status: number, seatNumber: number, isSelected: boolean, onSelect: () => void }> = ({ status, seatNumber, isSelected, onSelect }) => {
    const getSeatStyles = () => {
        if (status === 2) return 'bg-gray-400 cursor-not-allowed';
        if (isSelected) return 'bg-blue-500 text-white shadow-lg';
        if (status === 1) return 'bg-green-200 hover:bg-green-300 cursor-pointer';
        return 'bg-transparent';
    };

    if (status === 0) {
        return <div aria-hidden="true" />;
    }

    return (
        <div
            className={`flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-md text-xs md:text-sm font-semibold transition-all duration-200 ${getSeatStyles()}`}
            onClick={status === 1 ? onSelect : undefined}
            aria-label={`Seat ${seatNumber}, ${status === 2 ? 'occupied' : 'available'}`}
            role="button"
            tabIndex={status === 1 ? 0 : -1}
        >
            {seatNumber}
        </div>
    );
};


const SeatSelection: React.FC<SeatSelectionProps> = ({ trip, onBack, onBookingComplete }) => {
    const [selectedSeat, setSelectedSeat] = useState<{ row: number, col: number, number: number } | null>(null);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'success'>('idle');
    
    const agency = useMemo(() => agencies.find(a => a.id === trip.agencyId), [trip.agencyId]);

    const handleSelectSeat = (row: number, col: number, seatNumber: number) => {
        if (selectedSeat?.row === row && selectedSeat?.col === col) {
            setSelectedSeat(null); // Deselect if clicked again
        } else {
            setSelectedSeat({ row, col, number: seatNumber });
        }
    };
    
    const handleBookNow = () => {
        setBookingStatus('success');
        setTimeout(() => {
            onBookingComplete();
        }, 3000);
    };

    let seatCounter = 0;

    if (bookingStatus === 'success') {
        return (
             <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />} sx={{ p: 3, '.MuiAlert-message': { fontSize: '1.2rem', display: 'flex', alignItems: 'center' } }}>
                Booking successful! Your seat <strong>&nbsp;{selectedSeat?.number}&nbsp;</strong> is confirmed. Redirecting...
            </Alert>
        )
    }

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
                Back to Trips
            </Button>
            <Typography variant="h5" gutterBottom>Select Your Seat</Typography>
            <Typography variant="subtitle1" color="text.secondary">{agency?.name} - {trip.from} to {trip.to}</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mt: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                     <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50 w-full max-w-sm">
                        <Box sx={{ mb: 2, alignSelf: 'flex-start' }} aria-label="Front of the bus">
                            <AirlineSeatReclineNormalIcon sx={{ transform: 'scaleX(-1) rotate(90deg)', fontSize: 40, color: 'text.secondary' }}/>
                        </Box>
                        <div className="grid grid-cols-5 gap-1 md:gap-2">
                            {trip.seats.map((row, rowIndex) => {
                                return row.map((status, colIndex) => {
                                    if (status !== 0) seatCounter++;
                                    const currentSeatNumber = seatCounter;
                                    const isSelected = selectedSeat?.row === rowIndex && selectedSeat?.col === colIndex;
                                    return <Seat key={`${rowIndex}-${colIndex}`} status={status} seatNumber={currentSeatNumber} isSelected={isSelected} onSelect={() => handleSelectSeat(rowIndex, colIndex, currentSeatNumber)} />;
                                })
                            })}
                        </div>
                    </div>
                    <Box sx={{ display: 'flex', gap: 3, mt: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><div className="h-5 w-5 rounded bg-green-200 border border-gray-300"></div><Typography variant="body2">Available</Typography></Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><div className="h-5 w-5 rounded bg-gray-400 border border-gray-500"></div><Typography variant="body2">Occupied</Typography></Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><div className="h-5 w-5 rounded bg-blue-500 border border-blue-700"></div><Typography variant="body2">Selected</Typography></Box>
                    </Box>
                </Box>
                
                <Box sx={{ minWidth: { xs: '100%', md: 280 }, flexShrink: 0 }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                         <Typography variant="h6" gutterBottom>Booking Summary</Typography>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography color="text.secondary">Seat Number:</Typography>
                            <Typography fontWeight="bold">{selectedSeat ? `Seat ${selectedSeat.number}` : 'None'}</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="text.secondary">Price:</Typography>
                            <Typography fontWeight="bold">{trip.price.toLocaleString()} XAF</Typography>
                         </Box>
                         <hr/>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6" color="primary">{trip.price.toLocaleString()} XAF</Typography>
                         </Box>
                         <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ 
                                mt: 3,
                                bgcolor: '#00796B',
                                '&:hover': { bgcolor: '#fbc02d', color: '#fff' },
                             }}
                            disabled={!selectedSeat}
                            onClick={handleBookNow}
                            startIcon={<CheckCircleIcon />}
                         >
                            Book Now
                         </Button>
                    </Paper>
                </Box>
            </Box>
        </Paper>
    );
};

export default SeatSelection;
