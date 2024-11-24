import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Modal,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircleRounded';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import FlightIcon from '@mui/icons-material/Flight';
import BedIcon from '@mui/icons-material/Bed';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MapIcon from '@mui/icons-material/Map';
import ChecklistIcon from '@mui/icons-material/Checklist';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import axios from 'axios';

function HomeGuest() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [itinerariesOpen, setItinerariesOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Perform any setup or data fetching here
  }, []);

  return (
    <Box sx={styles.container}>
      {/* Top Menu */}
      <Box sx={styles.topMenu}>
        <Box sx={styles.menuIconContainer}>
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={styles.logo}>
            Beyond Borders
          </Typography>
        </Box>
        <Box sx={styles.topMenuRight}>
          <Button
            sx={{
              ...styles.menuButton,
              '&:hover': {
                backgroundColor: '#e6e7ed',
                color: '#192959',
              },
            }}
            startIcon={<AccountCircleIcon />}
          >
            My Profile
          </Button>
          <Tooltip title="Notifications" arrow>
            <IconButton
              sx={{
                ...styles.iconButton,
                '&:hover': {
                  backgroundColor: '#e6e7ed',
                  color: '#192959',
                },
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Shopping Cart" arrow>
            <IconButton
              sx={{
                ...styles.iconButton,
                '&:hover': {
                  backgroundColor: '#e6e7ed',
                  color: '#192959',
                },
              }}
            >
              <ShoppingCartOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Wishlist" arrow>
            <IconButton
              sx={{
                ...styles.iconButton,
                '&:hover': {
                  backgroundColor: '#e6e7ed',
                  color: '#192959',
                },
              }}
            >
              <BookmarkBorderOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout" arrow>
            <IconButton
              sx={{
                ...styles.iconButton,
                '&:hover': {
                  backgroundColor: '#e6e7ed',
                  color: '#192959',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          ...styles.sidebar,
          width: sidebarOpen ? '280px' : '60px',
        }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Button onClick={() => navigate('/TouristFlights')} sx={styles.sidebarButton}>
          <FlightIcon sx={styles.icon} />
          {sidebarOpen && 'Flights'}
        </Button>
        <Button onClick={() => navigate('/products')} sx={styles.sidebarButton}>
          <BedIcon sx={styles.icon} />
          {sidebarOpen && 'Hotels'}
        </Button>
        <Box>
          <Button
            onClick={() => setProductsOpen(!productsOpen)}
            sx={styles.sidebarButton}
          >
            <StorefrontIcon sx={styles.icon} />
            {sidebarOpen && (
              <Box sx={styles.dropdownToggle}>
                Products
                {productsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </Box>
            )}
          </Button>
          {productsOpen && (
            <Box sx={styles.dropdown}>
             
              <Button onClick={() => navigate('/view-all-products')} sx={styles.dropdownButton}>
                All Products
              </Button>
            </Box>
          )}
        </Box>

        <Box>
          <Button
            onClick={() => setActivitiesOpen(!activitiesOpen)}
            sx={styles.sidebarButton}
          >
            <LocalActivityIcon sx={styles.icon} />
            {sidebarOpen && (
              <Box sx={styles.dropdownToggle}>
                Activities
                {activitiesOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </Box>
            )}
          </Button>
          {activitiesOpen && (
            <Box sx={styles.dropdown}>
              <Button onClick={() => navigate('/GuestActivity')} sx={styles.dropdownButton}>
                Upcoming Activities
              </Button>
             
            </Box>
          )}
        </Box>

        <Box>
          <Button
            onClick={() => setItinerariesOpen(!itinerariesOpen)}
            sx={styles.sidebarButton}
          >
            <MapIcon sx={styles.icon} />
            {sidebarOpen && (
              <Box sx={styles.dropdownToggle}>
                Itineraries
                {itinerariesOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </Box>
            )}
          </Button>
          {itinerariesOpen && (
            <Box sx={styles.dropdown}>
              <Button onClick={() => navigate('/Guestitinerary')} sx={styles.dropdownButton}>
                Upcoming Itineraries
              </Button>
              
            </Box>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={styles.content}>
        <Box sx={styles.infoBox} onClick={() => navigate('/products')}>
          <img src="/images/products.jpg" alt="Products" style={styles.image} />
          <Typography variant="h6" sx={styles.text}>
            Products
          </Typography>
        </Box>
        <Box sx={styles.infoBox} onClick={() => navigate('/GuestActivity')}>
          <img src="/images/activity.jpg" alt="Activities" style={styles.image} />
          <Typography variant="h6" sx={styles.text}>
            Activities
          </Typography>
        </Box>
        <Box sx={styles.infoBox} onClick={() => navigate('/Guestitinerary')}>
          <img src="/images/itinerary.jpg" alt="Itineraries" style={styles.image} />
          <Typography variant="h6" sx={styles.text}>
            Itineraries
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#e6e7ed',
  },
  topMenu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#192959',
    color: '#e6e7ed',
  },
  menuIconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    fontWeight: 'bold',
  },
  topMenuRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  iconButton: {
    color: '#e6e7ed',
  },
  menuButton: {
    color: '#e6e7ed',
  },
  sidebar: {
    backgroundColor: '#4d587e',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: '60px',
    height: 'calc(100vh - 60px)',
    transition: 'width 0.3s ease',
    overflowX: 'hidden',
    padding: '10px',
  },
  sidebarButton: {
    color: '#e6e7ed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left',
    width: '100%',
    padding: '5px 20px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },
  icon: {
    marginRight: '10px',
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '20px',
  },
  dropdownButton: {
    color: '#e6e7ed',
    fontSize: '14px',
    paddingLeft: '20px',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },
  dropdownToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  content: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    padding: '20px',
    marginLeft: '60px',
  },
  infoBox: {
    backgroundColor: '#4d587e',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  image: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  text: {
    color: '#e6e7ed',
  },
};

export default HomeGuest;
