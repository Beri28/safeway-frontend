export interface Agency {
  id: number;
  name: string;
  logo: string;
}

// For real API, use Bus from apiTypes
import type { Bus } from './apiTypes';
export interface Trip extends Bus {
  agencyId?: number;
  departureTime?: string;
  arrivalTime?: string;
  seats?: number[][]; // 0: aisle, 1: available, 2: occupied
}

export const cities: string[] = [
  'Douala',
  'Yaoundé',
  'Bafoussam',
  'Bamenda',
  'Limbe',
  'Garoua',
  'Maroua',
  'Ngaoundéré',
  'Kumba',
  'Buea',
];

export const agencies: Agency[] = [
  { id: 1, name: 'General Express', logo: 'https://placehold.co/40x40/f44336/FFFFFF?text=G' },
  { id: 2, name: 'Touristique Express', logo: 'https://placehold.co/40x40/3f51b5/FFFFFF?text=T' },
  { id: 3, name: 'Finex Voyage', logo: 'https://placehold.co/40x40/4caf50/FFFFFF?text=F' },
  { id: 4, name: 'Buca Voyage', logo: 'https://placehold.co/40x40/ffeb3b/000000?text=B' },
];

const generateSeats = (): number[][] => {
    const seats: number[][] = [];
    // 14 rows, 5 columns (2 seats, aisle, 2 seats)
    for (let i = 0; i < 14; i++) {
        const row: number[] = [];
        for (let j = 0; j < 5; j++) {
            if (j === 2) {
                row.push(0); // Aisle
            } else {
                // ~60% chance of being available
                row.push(Math.random() > 0.4 ? 1 : 2); 
            }
        }
        seats.push(row);
    }
    return seats;
};

export const trips: Trip[] = [
    { id: '1', agencyId: 1, agency: 'General Express', from: 'Douala', to: 'Yaoundé', departure: 'Douala', arrival: 'Yaoundé', departureTime: '08:00', arrivalTime: '12:00', price: 6000, seats: generateSeats(), seatsTotal: 52, seatsBooked: 0 },
    { id: '2', agencyId: 2, agency: 'Touristique Express', from: 'Douala', to: 'Yaoundé', departure: 'Douala', arrival: 'Yaoundé', departureTime: '09:30', arrivalTime: '13:30', price: 6500, seats: generateSeats(), seatsTotal: 52, seatsBooked: 0 },
    { id: '3', agencyId: 3, agency: 'Finex Voyage', from: 'Douala', to: 'Yaoundé', departure: 'Douala', arrival: 'Yaoundé', departureTime: '11:00', arrivalTime: '15:00', price: 6000, seats: generateSeats(), seatsTotal: 52, seatsBooked: 0 },
    { id: '4', agencyId: 1, agency: 'General Express', from: 'Yaoundé', to: 'Bafoussam', departure: 'Yaoundé', arrival: 'Bafoussam', departureTime: '10:00', arrivalTime: '16:00', price: 7000, seats: generateSeats(), seatsTotal: 52, seatsBooked: 0 },
    { id: '5', agencyId: 4, agency: 'Buca Voyage', from: 'Yaoundé', to: 'Bafoussam', departure: 'Yaoundé', arrival: 'Bafoussam', departureTime: '12:00', arrivalTime: '18:00', price: 7500, seats: generateSeats(), seatsTotal: 52, seatsBooked: 0 },
    { id: '6', agencyId: 2, agency: 'Touristique Express', from: 'Bafoussam', to: 'Bamenda', departure: 'Bafoussam', arrival: 'Bamenda', departureTime: '07:00', arrivalTime: '10:00', price: 3000, seats: generateSeats(), seatsTotal: 52, seatsBooked: 0 },
    { id: '7', agencyId: 3, agency: 'Finex Voyage', from: 'Douala', to: 'Limbe', departure: 'Douala', arrival: 'Limbe', departureTime: '14:00', arrivalTime: '16:00', price: 2500, seats: generateSeats(), seatsTotal: 52, seatsBooked: 0 },
    { id: '8', agencyId: 4, agency: 'Buca Voyage', from: 'Limbe', to: 'Douala', departure: 'Limbe', arrival: 'Douala', departureTime: '09:00', arrivalTime: '11:00', price: 2500, seats: generateSeats(), seatsTotal: 52, seatsBooked: 0 },
    { id: '9', agencyId: 2, agency: 'Touristique Express', from: 'Bafoussam', to: 'Douala', departure: 'Bafoussam', arrival: 'Douala', departureTime: '13:00', arrivalTime: '19:00', price: 8000, seats: generateSeats(), seatsTotal: 52, seatsBooked: 0 },
];
