import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer: React.FC = () => (
  <Box component="footer" sx={{
    background: '#00796B',
    color: '#fff',
    py: 4,
    px:4,
    mt: 8,
    borderTop: '1px solid #e0e0e0',
    textAlign: 'center',
  }}>
    <Typography variant="subtitle1" fontWeight={700} mb={1}>
      SafeWay &copy; {new Date().getFullYear()} — Cameroon’s #1 Bus Booking Platform
    </Typography>
    <Typography variant="body2" color="rgba(255,255,255,0.8)" mb={1}>
      All rights reserved.
    </Typography>
    {/* <Typography variant="body2" color="rgba(255,255,255,0.8)" mb={1}>
      Made with ❤️ in Cameroon. All rights reserved.
    </Typography> */}
    <Box mt={2}>
      <Link href="/about" color="#ffd600" underline="hover" sx={{ mx: 1, fontWeight: 500 }}>About</Link>
      <Link href="/contact" color="#ffd600" underline="hover" sx={{ mx: 1, fontWeight: 500 }}>Contact</Link>
      <Link href="/faq" color="#ffd600" underline="hover" sx={{ mx: 1, fontWeight: 500 }}>FAQ</Link>
    </Box>
  </Box>
);

export default Footer;
