import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MuseumIcon from "@mui/icons-material/Museum";
import HistoricalPlaceIcon from "@mui/icons-material/AccountBalance";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ImageIcon from "@mui/icons-material/Image";
import TagIcon from "@mui/icons-material/Label";
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';


const HistoricalPlaceTG = () => {
  const [places, setPlaces] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const fetchHistoricalPlacesByAuthor = async () => {
    const AuthorUsername = localStorage.getItem('username');

    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post('/readAllHistoricalPlace', { AuthorUsername });

      if (response.status === 200) {
        if (response.data.length === 0) {
          setErrorMessage('You do not have Historical Places Created.');
          setPlaces([]);
        } else {
          setPlaces(response.data);
          setErrorMessage('');
        }
      } else {
        setErrorMessage('An unexpected response was received from the server.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage('An error occurred while fetching historical places. Please try again.');
    }
  };

  const editHistoricalPlace = (placeName) => {
    const AuthorUsername = localStorage.getItem('username');
    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }
    window.location.href = '/EditHistoricalPlace?name=${encodeURIComponent(placeName)}&author=${encodeURIComponent(AuthorUsername)}';
  };

  const removeHistoricalPlace = async (placeName) => {
    const AuthorUsername = localStorage.getItem('username');

    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this historical place?')) {
      try {
        const response = await axios.delete('/deleteHistoricalPlace', {
          data: { name: placeName, AuthorUsername },
        });

        alert(response.data.message);
        fetchHistoricalPlacesByAuthor();
      } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred while deleting the historical place. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchHistoricalPlacesByAuthor();
  }, []);

  return (
    <Box sx={styles.container}>
      {/* Dim overlay when sidebar is open */}
      {sidebarOpen && <Box sx={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Top Menu Bar */}
      <Box sx={styles.topMenu}>
        <Box sx={styles.menuIconContainer}>
          <IconButton onMouseEnter={() => setSidebarOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={styles.logo}>
            Beyond Borders
          </Typography>
        </Box>
        <Box sx={styles.topMenuRight}>
        <Box>
            <Button
              sx={styles.menuButton}
              onClick={() => (window.location.href = "/HistoricalPlace")}
            >
              Add New Historical Place
            </Button>
            <IconButton onClick={() => alert("Logged out!")} sx={styles.iconButton}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Collapsible Sidebar */}
      <Box
        sx={{
          ...styles.sidebar,
          width: sidebarOpen ? '280px' : '60px',
        }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Button
          sx={styles.sidebarButton}
          onClick={() => (window.location.href = "/MuseumTG")}
        >
          <MuseumIcon sx={styles.icon} />
          {sidebarOpen && "Museums"}
        </Button>
        <Button
          sx={styles.sidebarButton}
          onClick={() => (window.location.href = "/HistoricalPlaceTG")}
        >
          <HistoricalPlaceIcon sx={styles.icon} />
          {sidebarOpen && "Historical Places"}
        </Button>
        <Button onClick={() => navigate('/TourismGovernorDashboard')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button>
      </Box>

      {/* Main Content Area with Activities */}
      <Box sx={styles.activitiesContainer}>
  {places.map((place, index) => (
    <Box key={index} sx={{ marginBottom: '40px' }}> {/* Wrapper for each itinerary and comments */}
      
      {/* Itinerary Container */}
      <Box
        sx={{
          ...styles.activityCard,
          backgroundColor: 'white',
        }}
      >
        

        {/* Activity Content */}
        <Box sx={styles.activityContent}>
          {/* Left Side */}
          <Box sx={styles.activityLeft}>
            <Typography variant="h6" sx={{ display: 'flex',fontWeight: 'bold', fontSize: '24px', marginBottom: '5px' }}>
              {place.name}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'left' }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              {place.location || 'N/A'}
            </Typography>
            {/* Other musuem details */}
              {/* Tags */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Tags:
                </Typography>
                <Box sx={styles.tagContainer}>
                  {place.Tags.map((tag, tagIndex) => (
                    <Typography
                      key={tagIndex}
                      sx={{
                        ...styles.tag,
                        backgroundColor: '#cccfda',
                        color: '#192959',
                      }}
                    >
                      {tag}
                    </Typography>
                  ))}
                </Box>
              </Box>

                
          </Box>

          {/* Divider Line */}
          <Divider orientation="vertical" flexItem sx={styles.verticalDivider} />

          {/* Right Side */}
          <Box sx={styles.activityRight}>
          <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'right' }}>
              <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
              Foreigner  ${place.ticketPrices.foreigner}, Native  ${place.ticketPrices.native}, Student  ${place.ticketPrices.student}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '16px'}}>
            <strong>Description:</strong> {place.description || "No description provided."}
            </Typography>
            <Typography variant="body2" sx={styles.info}>
                      <ImageIcon fontSize="small" sx={{ mr: 1 }} />
                      Pictures: {place.pictures ? place.pictures.length : 0} available
            </Typography>
            {/* <Typography variant="body2" sx={{ fontSize: '16px' }}>
              <strong>Booking Open:</strong> {activity.isBooked ? 'Yes' : 'No'}
            </Typography> */}
          </Box>
          {/* Edit/Delete Buttons */}
          <Box sx={styles.museumActions}>
                  <IconButton
                    onClick={() =>
                      (window.location.href = `/editHistoricalPlace?name=${encodeURIComponent(
                        place.name
                      )}&author=${encodeURIComponent(localStorage.getItem("username"))}`)
                    }
                    sx={styles.actionButton}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => removeHistoricalPlace(place.name)}
                    sx={{ ...styles.actionButton, ...styles.deleteButton }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
        </Box>

      
      </Box>

      
    </Box>
  ))}
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
    color: '#192959',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  topMenu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#192959',
    color: '#e6e7ed',
    position: 'sticky',
    top: 0,             // Sticks to the top of the viewport
    zIndex: 2,
  },
  menuIconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  logo: {
    fontWeight: 'bold',
    color: '#e6e7ed',
  },
  topMenuRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  iconButton: {
    color: '#e6e7ed',  // Initial color
    '&:hover': {
      backgroundColor: '#e6e7ed', // Background color on hover
      color: '#192959',           // Text color on hover
    },
  },
  menuButton: {
    color: '#e6e7ed',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#e6e7ed', // Set background color on hover
      color: '#192959',           // Set text color on hover
    },
  },  
  sidebar: {
    backgroundColor: '#4d587e',
    color: '#e6e7ed',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 60,
    height: 'calc(100vh - 60px)',
    width: '60px',
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
    textAlign: 'left',
    width: '100%',
    padding: '10px 20px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },
  icon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  activitiesContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px 70px 20px 90px',
    marginLeft: '60px',
    transition: 'margin-left 0.3s ease',
  },
  languageContainer: {
    position: 'absolute',
    bottom: '190px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  accessibilityContainer: {
    position: 'absolute',
    bottom: '150px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  pickupLocationContainer: {
    position: 'absolute',
    bottom: '110px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dropoffLocationContainer: {
    position: 'absolute',
    bottom: '70px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  bookingOpenContainer: {
    position: 'absolute',
    bottom: '30px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  activityCard: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    padding: '50px 50px', // Increase padding for top/bottom and left/right
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },  
  activityInfo: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  quickFacts: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    marginTop: '10px',
  },
  infoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '16px',
    padding: '5px 10px',
    marginRight: '10px', // Add spacing between containers if needed
  },
  activityRating: {
    position: 'absolute', // Fix the position of the rating section
    top: '250px', // Adjust this value to set the vertical position
    right: '50px', // Adjust this value to set the horizontal position
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  flagButton: {
    position: 'absolute',
    top: '40px',
    right: '50px',
    backgroundColor: '#ff5722',
    color: 'white',
    '&:hover': { backgroundColor: '#ff8a50' },
  },
  activityInfoLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  
  activityInfoRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    alignItems: 'flex-end',
  },
  commentsSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px', // Add space between itinerary and comments
    overflow: 'hidden',
    width: '100%',
  },
  commentsContainer: {
    display: 'flex',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    width: '100%',
    padding: '10px',
    '&::-webkit-scrollbar': {
      display: 'none', // Hide scrollbar for a cleaner look
    },
  },
  scrollButton: {
    color: '#192959',
    backgroundColor: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#d1d5db',
    },
  },
  commentCard: {
    minWidth: '400px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '10px',
    marginRight: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left', // Align comments text to the left
  },
  backToTop: {
    position: 'fixed',
    bottom: '20px',
    right: '70px',
    backgroundColor: '#192959',
    color: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#e6e7ed',
      color: '#192959',
    },
    padding: '5px 50px',
    borderRadius: '30px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
  },
  addButton: {
    color: '#192959',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    maxHeight: 400,
    overflowY: 'auto',
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  inputContainer: {
    display: 'flex',
    gap: 2,
    mt: 2,
  },
  actionButton: {
    backgroundColor: '#e6e7ed', // Background color on hover
    color: '#192959',           // Text color on hover
    '&:hover': {
      backgroundColor: '#192959', // Background color on hover
      color: '#e6e7ed',           // Text color on hover
    },
  },
  activityCard: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  activityContent: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px', // Adjust spacing between left and right sections
  },
  activityLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '45%', // Adjust as necessary
    paddingRight: '10px',
    textAlign: 'left', // Align text to the left
  },
  verticalDivider: {
    backgroundColor: '#d1d5db',
    width: '1px',
    margin: '40px 15px 0 15px', // Adjust the top margin to position the start
  },
  activityRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '55%', // Adjust as necessary
    paddingTop: '50px',
    textAlign: 'left', // Align text to the left
  },
  tagContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    textAlign: 'left', // Align text within tags to the left
  },
  tag: {
    borderRadius: '16px',
    padding: '5px 10px',
    fontSize: '14px',
    textAlign: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
};

export default HistoricalPlaceTG;