import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import MapIcon from '@mui/icons-material/Map';
import axios from 'axios';
import { AlignHorizontalLeft, TranslateSharp } from '@mui/icons-material';

function GuestItineraryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itineraries, setItineraries] = useState([]);

  // Fetch itineraries when component mounts
  useEffect(() => {
    viewAllItineraries();
  }, []);

  const viewAllItineraries = async () => {
    try {
      const response = await axios.get('/api/ViewAllUpcomingItinerariesGuest');
      if (response.data) {
        setItineraries(response.data);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  return (
    <Box sx={styles.container}>
      {/* Sidebar */}
      <Box
        sx={{
          ...styles.sidebar,
          width: sidebarOpen ? '280px' : '60px',
        }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Button sx={styles.sidebarButton}>
          <LocalActivityIcon sx={styles.icon} />
          {sidebarOpen && 'Activities'}
        </Button>
        <Button sx={styles.sidebarButton}>
          <MapIcon sx={styles.icon} />
          {sidebarOpen && 'Itineraries'}
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          ...styles.mainContent,
          marginLeft: sidebarOpen ? '280px' : '60px',
        }}
      >
        {/* Top Menu */}
        <Box sx={styles.topMenu}>
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MenuIcon sx={{ color: '#e6e7ed' }} />
          </IconButton>
          <Typography variant="h6" sx={styles.logo}>
            Beyond Borders
          </Typography>
          <Button sx={styles.menuButton}>PREFERENCE TAGS</Button>
        </Box>

        {/* Itineraries List */}
        <Box sx={styles.activitiesContainer}>
          {itineraries.map((itinerary, index) => (
            <Box key={index} sx={styles.activityCard}>
              {/* Left Section */}
              <Box sx={styles.activityLeft}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {itinerary.Title}
                </Typography>
                <Typography variant="body2">{itinerary.Locations || 'N/A'}</Typography>
                <Typography variant="body2">Author: {itinerary.AuthorUsername}</Typography>
                <Typography variant="body2">Price: ${itinerary.Price}</Typography>
                <Typography variant="body2">
                  Date: {new Date(itinerary.Date).toLocaleDateString()}
                </Typography>
                <Box sx={styles.tagContainer}>
                  {itinerary.Tags.map((tag, idx) => (
                    <Typography key={idx} sx={styles.tag}>
                      {tag}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Divider */}
              <Divider orientation="vertical" flexItem sx={styles.verticalDivider} />

              {/* Right Section */}
              <Box sx={styles.activityRight}>
                <Typography variant="body2">Activities: {itinerary.Activities}</Typography>
                <Typography variant="body2">Language: {itinerary.Language}</Typography>
                <Typography variant="body2">
                  Accessibility: {itinerary.accessibility ? 'Accessible' : 'Not Accessible'}
                </Typography>
                <Typography variant="body2">Pickup: {itinerary.pickupLocation}</Typography>
                <Typography variant="body2">Drop-off: {itinerary.dropoffLocation}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#e6e7ed',
    color: '#192959',
  },
  sidebar: {
    backgroundColor: '#4d587e',
    color: '#e6e7ed',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100%',
    transition: 'width 0.3s ease',
    overflowX: 'hidden',
    padding: '10px',
    zIndex: 2,
  },
  sidebarButton: {
    color: '#e6e7ed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px 20px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },
  icon: {
    marginRight: '10px',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    transition: 'margin-left 0.3s ease',
  },
  topMenu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#192959',
    color: '#e6e7ed',
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '24px',
    position: 'absolute', // Use absolute positioning
    left: '70px',          // Position it to the left side
    top: '50%',            // Center vertically relative to the parent container
    transform: 'translateY(-50%)', // Adjust for vertical centering
  },
  menuButton: {
    color: '#e6e7ed',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#e6e7ed',
      color: '#192959',
    },
  },
  activitiesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px',
  },
  activityCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
  },
  activityLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '45%',
  },
  verticalDivider: {
    backgroundColor: '#d1d5db',
    width: '1px',
    margin: '0 15px',
  },
  activityRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '50%',
  },
  tagContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#cccfda',
    color: '#192959',
    borderRadius: '16px',
    padding: '5px 10px',
    fontSize: '14px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default GuestItineraryPage;
