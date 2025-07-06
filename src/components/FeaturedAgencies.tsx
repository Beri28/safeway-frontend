import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';

interface Agency {
  id: number;
  name: string;
  rating: number;
  logo: string;
}



const getStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        fontSize="small"
        sx={{ color: i <= Math.round(rating) ? '#FFD600' : '#E0E0E0' }}
        aria-hidden="true"
      />
    );
  }
  return stars;
};


const FeaturedAgencies = ({ agencies }: { agencies: Agency[] }) => (
  <Box mt={8}>
    <Typography variant="h4" fontWeight={700} align="center" color="#4B4453" mb={2} letterSpacing={1.5}>
      Trusted Travel Agencies
    </Typography>
    <Typography align="center" color="text.secondary" mb={4} fontSize={18}>
      We partner with Cameroon’s most reputable bus agencies to ensure your journey is safe, comfortable, and reliable. All agencies are vetted for quality service, modern fleets, and customer satisfaction.
    </Typography>
    <Grid container spacing={3} justifyContent="center" alignItems='stretch' >
      {agencies.map((agency) => (
        <Grid item xs={12} height={"100%"} sm={6} md={3} key={agency.id}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                boxShadow: 8,
                transform: 'translateY(-4px) scale(1.03)',
              },
              textAlign: 'center',
              py: 2,
              px: 1.5,
              background: 'linear-gradient(135deg, #f8fafc 60%, #b2f5ea 100%)',
            }}
            tabIndex={0}
            aria-label={`Agency: ${agency.name}, rating: ${agency.rating}`}
            title={agency.name}
          >
            <CardContent>
              <Box display="flex" justifyContent="center" mb={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(45,212,191,0.12)', // teal-300/20
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    boxShadow: 1,
                    border: '1.5px solid #b2f5ea',
                  }}
                >
                  {agency.logo}
                </Box>
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="#4B4453" textTransform="uppercase" letterSpacing={1} mb={0.5}>
                {agency.name}
              </Typography>
              {agency.rating >= 4.5 && (
                <Tooltip title="Verified Agency" arrow>
                  <Chip
                    icon={<VerifiedIcon sx={{ color: '#14b8a6' }} />}
                    label="Verified"
                    size="small"
                    sx={{ bgcolor: '#e0f2f1', color: '#14b8a6', fontWeight: 600, mb: 0.5, animation: 'pulse 1.5s infinite' }}
                  />
                </Tooltip>
              )}
              <Typography variant="body2" color="text.secondary" mt={1} mb={1.5}>
                {agency.name} offers modern, comfortable buses, professional drivers, and excellent on-time records. Enjoy amenities like air conditioning, WiFi, and refreshments on select routes.
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" mt={1} mb={0.5}>
                {getStars(agency.rating)}
                <Typography variant="body2" color="text.secondary" ml={0.5} fontWeight={500}>
                  {agency.rating.toFixed(1)} / 5.0
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default FeaturedAgencies;
