
import React from 'react';
import Header from '../components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ: React.FC = () => (
  <div className="min-h-screen bg-[#fafafa]">
    <Header />
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight={900} color="#00796B" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Everything you need to know about booking and traveling with SafeWay
        </Typography>
      </Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={700}>How do I book a ticket?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Use our search form to find your route, compare agencies, select your trip, choose your seat(s), enter passenger details, and pay securely online. You’ll receive instant confirmation and a QR code for boarding.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={700}>Can I cancel or change my booking?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, you can cancel or modify your booking from your account’s booking history page, subject to the agency’s policy. Refunds are processed quickly and transparently.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={700}>What payment methods are accepted?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We accept Mobile Money (MTN, Orange), credit/debit cards, and other secure payment options. All transactions are encrypted and safe.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={700}>How do I get my ticket after booking?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            After payment, your ticket and QR code will be sent to your email and will be available in your account. Show the QR code at the agency to board.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={700}>Is my personal information safe?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes! We use industry-standard security to protect your data. Your information is never shared with third parties without your consent.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  </div>
);

export default FAQ;
