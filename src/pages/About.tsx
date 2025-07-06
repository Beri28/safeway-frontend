
import React from 'react';
import Header from '../components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const About: React.FC = () => (
  <div className="min-h-screen bg-[#fafafa]">
    <Header />
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight={900} color="#00796B" gutterBottom>
          About SafeWay
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Cameroon’s #1 Bus Booking Platform
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="body1" color="text.primary" paragraph>
          SafeWay was founded with a mission to make intercity travel in Cameroon easy, safe, and affordable for everyone. We partner with the country’s most trusted bus agencies to offer a seamless booking experience, transparent pricing, and real-time seat selection.
        </Typography>
        <Typography variant="body1" color="text.primary" paragraph>
          Our platform brings together technology and local expertise to help you plan your journey, compare agencies, and travel with peace of mind. Whether you’re traveling for business, family, or adventure, SafeWay is your reliable companion on the road.
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} color="#388e3c" gutterBottom>
          Why Choose SafeWay?
        </Typography>
        <ul style={{ paddingLeft: 24, color: '#333', fontSize: 18, lineHeight: 1.7 }}>
          <li>✔️ Book tickets for all major routes and agencies in Cameroon</li>
          <li>✔️ Real-time seat selection and instant confirmation</li>
          <li>✔️ Secure online payments (Mobile Money, cards, more)</li>
          <li>✔️ 24/7 customer support and easy booking management</li>
          <li>✔️ Transparent pricing, no hidden fees</li>
        </ul>
      </Box>
      <Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Join thousands of happy travelers who trust SafeWay for their journeys every day!
        </Typography>
      </Box>
    </Container>
  </div>
);

export default About;
