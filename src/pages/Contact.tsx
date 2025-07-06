
import React from 'react';
import Header from '../components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

const Contact: React.FC = () => (
  <div className="min-h-screen bg-[#fafafa]">
    <Header />
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight={900} color="#00796B" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          We’re here to help you 24/7
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="body1" color="text.primary" paragraph>
          Have questions, feedback, or need help with your booking? Our support team is always ready to assist you. Reach out to us using any of the methods below, and we’ll get back to you as soon as possible.
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1" fontWeight={700}>Email:</Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          <a href="mailto:support@safeway.com" style={{ color: '#00796B', textDecoration: 'underline' }}>support@safeway.com</a>
        </Typography>
        <Typography variant="subtitle1" fontWeight={700}>Phone:</Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          +237 6XX XXX XXX
        </Typography>
        <Typography variant="subtitle1" fontWeight={700}>Office Address:</Typography>
        <Typography variant="body1" color="text.secondary">
          Avenue Kennedy, Yaoundé, Cameroon
        </Typography>
      </Box>
      <Box textAlign="center">
        <Button variant="contained" color="success" size="large" href="mailto:support@safeway.com">
          Email Support
        </Button>
      </Box>
    </Container>
  </div>
);

export default Contact;
