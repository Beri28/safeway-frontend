import React from 'react';
import { agencies } from '../data.js';
import type { Trip } from '../data.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface TripListProps {
    trips: Trip[];
    onSelectTrip: (trip: Trip) => void;
    onBack: () => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onSelectTrip, onBack }) => {
    if (trips.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6">No buses found for this route.</Typography>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mt: 2 }}>
                    Change Search
                </Button>
            </Box>
        );
    }
    
    return (
        <Box>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
                Back to Search
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {trips.map(trip => {
                    const agency = agencies.find(a => a.id === trip.agencyId);
                    const duration = (new Date(`1970-01-01T${trip.arrivalTime}:00`).getTime() - new Date(`1970-01-01T${trip.departureTime}:00`).getTime()) / (1000 * 60 * 60);
                    return (
                        <Card key={trip.id} elevation={2}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar src={agency?.logo} sx={{ mr: 2, width: 40, height: 40, bgcolor: 'primary.main' }}>{agency?.name.charAt(0)}</Avatar>
                                    <Typography variant="h6">{agency?.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h5">{trip.departureTime}</Typography>
                                        <Typography variant="body2" color="text.secondary">{trip.from}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                        <AccessTimeIcon />
                                        <Typography variant="caption" display="block">~{duration.toFixed(1)}h</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h5">{trip.arrivalTime}</Typography>
                                        <Typography variant="body2" color="text.secondary">{trip.to}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', p: 2, borderTop: '1px solid #eee', bgcolor: '#fafafa' }}>
                                <Typography variant="h6" color="primary">{trip.price.toLocaleString()} XAF</Typography>
                                <Button variant="contained" endIcon={<EventSeatIcon />} onClick={() => onSelectTrip(trip)}>
                                    Select Seat
                                </Button>
                            </CardActions>
                        </Card>
                    );
                })}
            </Box>
        </Box>
    );
};

export default TripList;