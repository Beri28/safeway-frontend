import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2,  
  Save, 
  X,  
  MapPin, 
  Bus, 
  Users, 
  DollarSign,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { API_BASE, deleteBus, getBuses } from '../api';
import { Route as BusRoute } from '../apiTypes';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@mui/material';

const BusAgencyAdminDashboard = () => {
  const { user, token,logout } = useAuth();
  const [trips, setTrips] = useState<BusRoute[]>([]);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showEditTrip, setShowEditTrip] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<any>({});
  // const [agencyInfo, setAgencyInfo] = useState({
  //   name: 'Guarantee Express',
  //   logo: '🚌',
  //   rating: 4.5,
  //   totalBuses: 15,
  //   activeTrips: 0
  // });

  const [newTrip, setNewTrip] = useState<BusRoute>({
    from: '',
    agency:'',
    to: '',
    date:'',
    departureTime: '',
    price: 0,
    busType: 'Standard',
    seatsTotal: 0,
    seatsBooked:0,
    seatNumbersBooked:[],
    features: []
  });

  const cities = [
    'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Garoua', 
    'Maroua', 'Ngaoundéré', 'Bertoua', 'Buea', 'Limbe'
  ];

  const busFeatures = ['AC', 'WiFi', 'Refreshments', 'Entertainment', 'Reclining Seats', 'USB Charging'];

  // Mock data for existing trips
  const mockTrips:BusRoute[] = [
        {
          agency:'Vatican',
          from: 'Douala',
          to: 'Yaoundé',
          date: '2025-06-22',
          departureTime: '07:00',
          price: 4500,
          busType: 'VIP',
          seatsTotal: 40,
          seatsBooked: 28,
          seatNumbersBooked:[],
          features: ['AC', 'WiFi', 'Refreshments'],
          status: 'Active'
        },
        {
          agency:'Vatican',
          from: 'Yaoundé',
          to: 'Bamenda',
          date: '2025-06-22',
          departureTime: '09:00',
          price: 3800,
          busType: 'Standard',
          seatsTotal: 40,
          seatsBooked: 15,
          seatNumbersBooked:[],
          features: ['AC', 'USB Charging'],
          status: 'Active'
        }
  ];
  const getBusesAll=async()=>{
    let buses=await getBuses()
    setTrips(buses);
    // setTrips(mockTrips);
    // setAgencyInfo(prev => ({ ...prev, activeTrips: mockTrips.length }));
  }
  useEffect(() => {
    getBusesAll()
  }, []);

  const handleAddTrip =async () => {
    setLoading(true)
    try {
        const bus = {
          ...newTrip,
        };
        console.log(bus)
        const res = await axios.post(`${API_BASE}/buses`,bus);
        if(res.data){
            if (newTrip.from && newTrip.to && newTrip.date && newTrip.departureTime && newTrip.price) {
              const trip = {
                ...newTrip,status: "Active" as 'Active'|'Cancelled'
              };
              setTrips([...trips, trip]);
              setNewTrip({
                from: '',
                agency:'',
                to: '',
                date:'',
                departureTime: '',
                price: 0,
                busType: 'Standard',
                seatsTotal: 0,
                seatsBooked:0,
                seatNumbersBooked:[],
                features: []
              });
              setShowAddTrip(false);
            }
            setShowAddTrip(false)
            await getBusesAll()
        }
        setLoading(false)
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
  };

  const handleEditTrip = (trip:any) => {
    setSelectedTrip(trip);
    setShowEditTrip(true);
  };

  const handleUpdateTrip = () => {
    setTrips(trips.map((trip:any) => 
      trip.id === selectedTrip.id ? selectedTrip : trip
    ));
    setShowEditTrip(false);
    setSelectedTrip(null);
  };

  const handleDeleteTrip =async (tripId:any) => {
    let res=await deleteBus(tripId,token|| "")
    console.log(res)
    setTrips(trips.filter((trip:BusRoute) => trip._id !== tripId));
  };

  // const calculateDuration = (departure:any, arrival:any) => {
  //   if (!departure || !arrival) return '';
  //   const [depHour, depMin] = departure.split(':').map(Number);
  //   const [arrHour, arrMin] = arrival.split(':').map(Number);
  //   const depMinutes = depHour * 60 + depMin;
  //   const arrMinutes = arrHour * 60 + arrMin;
  //   const duration = arrMinutes - depMinutes;
  //   const hours = Math.floor(duration / 60);
  //   const minutes = duration % 60;
  //   return `${hours}h ${minutes}m`;
  // };

  const toggleFeature = (feature:any, isNewTrip = true) => {
    if (isNewTrip) {
      setNewTrip(prev => ({
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature]
      }));
    } else {
      setSelectedTrip((prev:BusRoute) => ({
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature]
      }));
    }
  };

  const AddTripModal = ({newTrip,setNewTrip}:{newTrip:BusRoute,setNewTrip:React.Dispatch<React.SetStateAction<BusRoute>>}) => {
    return (
      <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Add New Trip</h3>
              <button onClick={() => setShowAddTrip(false)} className="text-gray-500">
                <X size={24} />{" "}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <select 
                  title="from"
                  value={newTrip.from}
                  onChange={(e) => setNewTrip({...newTrip, from: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select departure city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <select 
                  title="to"
                  value={newTrip.to}
                  onChange={(e) => setNewTrip({...newTrip, to: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select destination city</option>
                  {cities.filter(city => city !== newTrip.from).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input 
                  type="date"
                  title="date"
                  value={newTrip.date}
                  onChange={(e) => setNewTrip({...newTrip, date: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bus Type</label>
                <select
                  title="type" 
                  value={newTrip.busType}
                  onChange={(e) => setNewTrip({...newTrip, busType: e.target.value as "VIP"|"Standard"})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Departure Time</label>
                <input
                  name="departureTime" 
                  title="departureTime" 
                  type="time"
                  value={newTrip.departureTime}
                  onChange={(e) => setNewTrip({...newTrip, departureTime: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-2">Arrival Time</label>
                <input 
                  type="time"
                  value={newTrip.arrivalTime}
                  onChange={(e) => setNewTrip({...newTrip, arrivalTime: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium mb-2">Agency</label>
                <input 
                  type="text"
                  value={newTrip.agency}
                  onChange={(e) => setNewTrip({...newTrip, agency: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="vatican"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price (FCFA)</label>
                <input 
                  type="number"
                  // value={newTrip.price}
                  // onChange={(e) => setNewTrip({...newTrip, price: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total Seats</label>
                <input 
                  type="number"
                  title="seats"
                  value={newTrip.seatsTotal}
                  onChange={(e) => setNewTrip({...newTrip, seatsTotal: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="40"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Bus Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {busFeatures.map(feature => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      newTrip.features.includes(feature)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleAddTrip}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Add Trip
              </button>
              <button 
                onClick={() => setShowAddTrip(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  };

  const EditTripModal = () => (
    <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Edit Trip</h3>
            <button onClick={() => setShowEditTrip(false)} className="text-gray-500">
              <X size={24} />{" "}
            </button>
          </div>

          {selectedTrip && (
            <>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (FCFA)</label>
                  <input 
                    title="price"
                    type="number"
                    value={selectedTrip.price}
                    onChange={(e) => setSelectedTrip({...selectedTrip, price: parseInt(e.target.value)})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bus Type</label>
                  <select
                  title="type" 
                    value={selectedTrip.busType}
                    onChange={(e) => setSelectedTrip({...selectedTrip, busType: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="VIP">VIP</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Departure Time</label>
                  <input
                    title="departureTime" 
                    type="time"
                    value={selectedTrip.departureTime}
                    onChange={(e) => setSelectedTrip({...selectedTrip, departureTime: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium mb-2">Arrival Time</label>
                  <input 
                    title="price"
                    type="time"
                    value={selectedTrip.arrivalTime}
                    onChange={(e) => setSelectedTrip({...selectedTrip, arrivalTime: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div> */}

                <div>
                  <label className="block text-sm font-medium mb-2">Available Seats</label>
                  <input 
                    title="availableSeats"
                    type="number"
                    value={selectedTrip.availableSeats}
                    onChange={(e) => setSelectedTrip({...selectedTrip, availableSeats: parseInt(e.target.value)})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    max={selectedTrip.totalSeats}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select 
                  title="status"
                    value={selectedTrip.status}
                    onChange={(e) => setSelectedTrip({...selectedTrip, status: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Bus Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {busFeatures.map(feature => (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature, false)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedTrip.features.includes(feature)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleUpdateTrip}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Update Trip
                </button>
                <button 
                  onClick={() => setShowEditTrip(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ px:0,bgcolor: '#fff', color: '#222', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ maxWidth:{sm:'80%',xs:'95%'},mx:'auto',minHeight: 72,width: '100%',py:2 ,display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={2}>
            <DirectionsBusFilledIcon sx={{ color: '#388e3c', fontSize: 32 }} />
            <Box>
                <Typography variant="h5" fontWeight={900} color="#00796B" sx={{ letterSpacing: 1 }}>SafeWay</Typography>
                <Typography variant="body2" fontWeight={400} color="#00796B">Admin dashboard</Typography>
            </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={3}>
            {/* Notifications */}
            <Box position="relative">
            <Badge color="error" badgeContent={1} invisible={false}>
                <IconButton color="primary" aria-label="Show notifications" size="small">
                <NotificationsIcon />
                </IconButton>
            </Badge>
            </Box>
            {/* Avatar and Name */}
            <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: '#00796B', width: 40, height: 40, fontSize: 20, boxShadow: 1, border: '2px solid #fff' }}>A</Avatar>
            <Box display={{ xs: 'none', sm: 'block' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#222" sx={{ fontSize: 15 }}>Admin</Typography>
            </Box>
            </Box>
        </Box>
        </Toolbar>
      </AppBar>

      {/* Stats Cards */}
      <div className="md:max-w-[80%] max-w-[95%] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-blue-600">{trips.length}</p>
              </div>
              <Bus className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-green-600">{trips.reduce((sum:number, trip:BusRoute) => sum + trip.seatsBooked, 0)}</p>
              </div>
              <Users className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue Today</p>
                <p className="text-2xl font-bold text-purple-600">{(trips.reduce((sum:number, trip:BusRoute) => sum + (trip.seatsBooked * trip.price), 0)).toLocaleString()} FCFA</p>
              </div>
              <DollarSign className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Seats</p>
                <p className="text-2xl font-bold text-orange-600">{trips.reduce((sum:number, trip:BusRoute) => sum + (trip.seatsTotal-trip.seatsBooked), 0)}</p>
              </div>
              <BarChart3 className="text-orange-600" size={32} />
            </div>
          </div>
        </div>

        {/* Trips Management */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="md:p-6 p-6 px-4 border-b">
            <div className="flex flex-wrap justify-between items-center">
              <h2 className="text-xl font-semibold">Route Management</h2>
              <div className="flex gap-3 mt-3">
                <button 
                  // onClick={() => setTrips([...trips])}
                  onClick={() => getBusesAll()}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-400"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
                <button 
                  onClick={() => setShowAddTrip(true)}
                  className="flex text-nowrap items-center gap-2 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-500"
                >
                  <Plus size={16} />
                  Add New Route
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trips.map((trip:BusRoute) => (
                  <tr key={trip._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={24} className="text-gray-400" />
                        <span className="font-medium">{trip.from} → {trip.to}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{trip.agency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{trip.date}</div>
                        <div className="text-gray-500">{trip.departureTime}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        trip.busType === 'VIP' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {trip.busType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{trip.price.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-green-600 font-medium">{trip.seatsTotal-trip.seatsBooked} available</div>
                        <div className="text-gray-500">{trip.seatsBooked} booked</div>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        trip.status === 'Active' ? 'bg-green-100 text-green-800' :
                        trip.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status}
                      </span>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditTrip(trip)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />{" "}
                        </button>
                        <button 
                          onClick={() => handleDeleteTrip(trip._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />{" "}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {trips.length === 0 && (
            <div className="text-center py-12">
              <Bus className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No trips yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first trip</p>
              <button 
                onClick={() => setShowAddTrip(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add New Trip
              </button>
            </div>
          )}
        </div>
      </div>
      <Button variant="outlined" color="error" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} onClick={logout}>Logout</Button>
      {showAddTrip && 
        <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Add New Route</h3>
              <button onClick={() => setShowAddTrip(false)} className="text-gray-500">
                <X size={24} />{" "}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <select 
                  title="from"
                  value={newTrip.from}
                  onChange={(e) => setNewTrip({...newTrip, from: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select departure city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <select 
                  title="to"
                  value={newTrip.to}
                  onChange={(e) => setNewTrip({...newTrip, to: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select destination city</option>
                  {cities.filter(city => city !== newTrip.from).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input 
                  type="date"
                  title="date"
                  value={newTrip.date}
                  onChange={(e) => setNewTrip({...newTrip, date: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bus Type</label>
                <select
                  title="type" 
                  value={newTrip.busType}
                  onChange={(e) => setNewTrip({...newTrip, busType: e.target.value as "VIP"|"Standard"})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Departure Time</label>
                <input
                  name="departureTime" 
                  title="departureTime" 
                  type="time"
                  value={newTrip.departureTime}
                  onChange={(e) => setNewTrip({...newTrip, departureTime: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-2">Arrival Time</label>
                <input 
                  type="time"
                  value={newTrip.arrivalTime}
                  onChange={(e) => setNewTrip({...newTrip, arrivalTime: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium mb-2">Agency</label>
                <input 
                  type="text"
                  value={newTrip.agency}
                  onChange={(e) => setNewTrip({...newTrip, agency: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="vatican"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price (FCFA)</label>
                <input 
                  type="number"
                  value={newTrip.price}
                  onChange={(e) => setNewTrip({...newTrip, price: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total Seats</label>
                <input 
                  type="number"
                  title="seats"
                  value={newTrip.seatsTotal}
                  onChange={(e) => setNewTrip({...newTrip, seatsTotal: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="40"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Bus Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {busFeatures.map(feature => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      newTrip.features.includes(feature)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleAddTrip}
                className="flex-1 bg-green-700 text-white py-3 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
              >
                {loading?<CircularProgress color='secondary' sx={{color:'white'}} size={30} />:<Save size={18} />}
                Add Trip
              </button>
              <button 
                onClick={() => setShowAddTrip(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      }
      {showEditTrip && 
      <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Edit Route</h3>
              <button onClick={() => setShowEditTrip(false)} className="text-gray-500">
                <X size={24} />{" "}
              </button>
            </div>

            {selectedTrip && (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (FCFA)</label>
                    <input 
                      title="price"
                      type="number"
                      value={selectedTrip.price}
                      onChange={(e) => setSelectedTrip({...selectedTrip, price: parseInt(e.target.value)})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bus Type</label>
                    <select
                    title="type" 
                      value={selectedTrip.busType}
                      onChange={(e) => setSelectedTrip({...selectedTrip, busType: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Standard">Standard</option>
                      <option value="VIP">VIP</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Departure Time</label>
                    <input
                      title="departureTime" 
                      type="time"
                      value={selectedTrip.departureTime}
                      onChange={(e) => setSelectedTrip({...selectedTrip, departureTime: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium mb-2">Arrival Time</label>
                    <input 
                      title="price"
                      type="time"
                      value={selectedTrip.arrivalTime}
                      onChange={(e) => setSelectedTrip({...selectedTrip, arrivalTime: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium mb-2">Available Seats</label>
                    <input 
                      title="availableSeats"
                      type="number"
                      value={selectedTrip.availableSeats}
                      onChange={(e) => setSelectedTrip({...selectedTrip, availableSeats: parseInt(e.target.value)})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      max={selectedTrip.totalSeats}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select 
                    title="status"
                      value={selectedTrip.status}
                      onChange={(e) => setSelectedTrip({...selectedTrip, status: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Bus Features</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {busFeatures.map(feature => (
                      <button
                        key={feature}
                        onClick={() => toggleFeature(feature, false)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedTrip.features.includes(feature)
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleUpdateTrip}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Update Trip
                  </button>
                  <button 
                    onClick={() => setShowEditTrip(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default BusAgencyAdminDashboard;