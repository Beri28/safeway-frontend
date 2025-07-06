
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFormProps {
  searchParams: {
    from: string;
    to: string;
    date: string;
    passengers: number;
  };
  setSearchParams: React.Dispatch<React.SetStateAction<{
    from: string;
    to: string;
    date: string;
    passengers: number;
  }>>;
  cities: string[];
  onSearch: () => void;
}

const SearchForm = ({ searchParams, setSearchParams, cities, onSearch }: SearchFormProps) => {
  return (
    <Box bgcolor="#fff" borderRadius={4} boxShadow={3} p={4} border="1px solid #e0e0e0">
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
        <FormControl fullWidth>
          <InputLabel id="from-label">From</InputLabel>
          <Select
            labelId="from-label"
            value={searchParams.from}
            label="From"
            onChange={e => setSearchParams(sp => ({ ...sp, from: e.target.value }))}
            sx={{ bgcolor: '#fff', color: '#111', borderRadius: 2 }}
          >
            <MenuItem value="">From</MenuItem>
            {cities.map(city => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="to-label">To</InputLabel>
          <Select
            labelId="to-label"
            value={searchParams.to}
            label="To"
            onChange={e => setSearchParams(sp => ({ ...sp, to: e.target.value }))}
            sx={{ bgcolor: '#fff', color: '#111', borderRadius: 2 }}
          >
            <MenuItem value="">To</MenuItem>
            {cities.filter(city => city !== searchParams.from).map(city => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel shrink htmlFor="date-input">Date</InputLabel>
          <input
            id="date-input"
            type="date"
            value={searchParams.date}
            onChange={e => setSearchParams(sp => ({ ...sp, date: e.target.value }))}
            title="date"
            placeholder="Select date"
            className="mui-date-input"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              border: '2px solid #e0e0e0',
              background: '#fff',
              color: '#111',
              fontWeight: 500,
              fontSize: 16,
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="passengers-label">Passengers</InputLabel>
          <Select
            labelId="passengers-label"
            value={searchParams.passengers}
            label="Passengers"
            onChange={e => setSearchParams(sp => ({ ...sp, passengers: e.target.value }))}
            sx={{ bgcolor: '#fff', color: '#111', borderRadius: 2 }}
          >
            {[1,2,3,4,5,6].map(num => (
              <MenuItem key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Button
        onClick={onSearch}
        disabled={!searchParams.from || !searchParams.to || !searchParams.date}
        variant="contained"
        fullWidth
        startIcon={<SearchIcon />}
        sx={{
          bgcolor: '#f57c00',
          color: '#fff',
          borderRadius: 2,
          fontWeight: 700,
          fontSize: 18,
          py: 1.5,
          boxShadow: 2,
          '&:hover': { bgcolor: '#ff9800', color: '#fff' },
          '&.Mui-disabled': { bgcolor: '#f5f5f5', color: '#888' },
        }}
      >
        Search Buses
      </Button>
    </Box>
  );
};

export default SearchForm;
