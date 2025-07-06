import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, LogOut, MenuIcon } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAuth } from '../contexts/AuthContext';
import { Avatar,Divider, Stack, Drawer} from '@mui/material'




const Header = () => {
  const { user,logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menu,setMenu]=useState<boolean>(false)
  const navigate=useNavigate()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLangChange = (lng: 'en' | 'fr') => {
    setLang(lng);
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{
      background: '#00796B',
      boxShadow: '0 4px 24px 0 rgba(56, 142, 60, 0.08)',
      mb: {sm:4,xs:0}
    }}>
      <Toolbar sx={{ maxWidth: {sm:'80%',xs:'95%'}, mx: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 1,
          }}>
            <DirectionsBusFilledIcon sx={{ color: '#388e3c', fontSize: 32 }} />
          </Box>
          <Typography
            variant="h5"
            fontWeight={900}
            color="#fff"
            letterSpacing={2}
            component={RouterLink}
            to="/"
            sx={{ textDecoration: 'none', cursor: 'pointer', '&:hover': { color: '#ffd600' } }}
          >
            SafeWay
          </Typography>
        </Box>
        <Box alignItems="center" sx={{display:{sm:'flex',xs:'none'}}} gap={3}>
          <Typography
            component={RouterLink}
            to="/about"
            variant="subtitle1"
            color="#fff"
            fontWeight={600}
            sx={{ textDecoration: 'none', '&:hover': { color: '#ffd600' } }}
          >
            About Us
          </Typography>
          <Typography
            component={RouterLink}
            to="/contact"
            variant="subtitle1"
            color="#fff"
            fontWeight={600}
            sx={{ textDecoration: 'none', '&:hover': { color: '#ffd600' } }}
          >
            Contact Us
          </Typography>
          <Typography
            component={RouterLink}
            to="/faq"
            variant="subtitle1"
            color="#fff"
            fontWeight={600}
            sx={{ textDecoration: 'none', '&:hover': { color: '#ffd600' } }}
          >
            FAQ
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="language switcher"
            sx={{ mx: 1,display:'flex' }}
          >
            {/* <Button>
            </Button>   */}
            <LanguageIcon />
            <ChevronDown />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem selected={lang === 'en'} onClick={() => handleLangChange('en')}>English</MenuItem>
            <MenuItem selected={lang === 'fr'} onClick={() => handleLangChange('fr')}>Français</MenuItem>
          </Menu>
          {!user &&
          <Button sx={{
            color:'#f57c00',
            borderColor:'#f57c00',
            '&:hover':{color:'white',borderColor:'white',transform:'scale(1.1)'}
          }} variant='outlined'
            component={RouterLink}
            to="/login"
          >
            Login
          </Button>}
        </Box>
        <Box sx={{display:{sm:'none',xs:'flex'}}}>
          {!user?
          <Button sx={{
            color:'#f57c00',
            borderColor:'#f57c00',
            '&:hover':{color:'white',borderColor:'white',transform:'scale(1.1)'}
          }} variant='outlined'
            component={RouterLink}
            to="/login"
          >
            Login
          </Button>
          :
          <IconButton onClick={()=>setMenu(true)}>
            <MenuIcon color='white' />
          </IconButton>
          }
          <Drawer anchor='right' open={menu} sx={{display:{sm:'none',xs:'flex'}}} onClose={()=>setMenu(false)} >
            <Stack spacing={1} padding={5} sx={{height:'100%'}} >
              {user &&
                <Typography sx={{display:'flex',alignItems:'center',columnGap:'.45em',color:'black'}}>
                    <Avatar sx={{width:30,height:30,fontSize:''}} >{user?.name[0]}</Avatar>{user?.name}
                </Typography>
              }
              <Divider />
              <Typography
                component={RouterLink}
                to="/"
                variant="subtitle1"
                color="#00796B"
                fontWeight={600}
                sx={{ textDecoration: 'none', '&:hover': { color: '#ffd600' } }}
              >
                Home
              </Typography>
              <Typography
                component={RouterLink}
                to="/about"
                variant="subtitle1"
                color="#00796B"
                fontWeight={600}
                sx={{ textDecoration: 'none', '&:hover': { color: '#ffd600' } }}
              >
                About Us
              </Typography>
              <Typography
                component={RouterLink}
                to="/contact"
                variant="subtitle1"
                color="#00796B"
                fontWeight={600}
                sx={{ textDecoration: 'none', '&:hover': { color: '#ffd600' } }}
              >
                Contact Us
              </Typography>
              <Typography
                component={RouterLink}
                to="/faq"
                variant="subtitle1"
                color="#00796B"
                fontWeight={600}
                sx={{ textDecoration: 'none', '&:hover': { color: '#ffd600' } }}
              >
                FAQ
              </Typography>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                aria-label="language switcher"
                sx={{ mx: 1,display:'flex' }}
              >
                {/* <Button>
                </Button>   */}
                <LanguageIcon sx={{color:'#00796B'}} />
                <ChevronDown color='#00796B' />
              </IconButton>
              <Divider />
              {user &&
                <Button variant='outlined' color='inherit' sx={{color:'black'}} onClick={logout}>
                  <LogOut className='text-black ' />  Logout
                </Button>
              }
            </Stack>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
