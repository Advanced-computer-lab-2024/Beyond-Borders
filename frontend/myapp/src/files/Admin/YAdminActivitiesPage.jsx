import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';

function YAdminActivitiesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [scrollPositions, setScrollPositions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/viewAllActivitiesAdmin');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const flagActivity = async (name) => {
    try {
      const response = await axios.post('/api/flagActivity', { title: name });
      if (response.status === 200) {
        alert(response.data.message);
        fetchActivities();
      }
    } catch (error) {
      console.error('Error flagging activity:', error);
      alert('An error occurred while flagging the activity.');
    }
  };

  const renderRating = (rating) => {
    const roundedRating = Math.round(rating * 10) / 10;
    const fullStars = Math.floor(rating);
    const halfStars = roundedRating > fullStars ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
  
    return (
      <Box sx={styles.ratingContainer}>
        <Typography variant="body2" sx={{ fontSize: '24px', position: 'absolute', right: '170px', bottom: '2px' }}>
          {roundedRating}
        </Typography>
        {[...Array(fullStars)].map((_, index) => (
          <StarIcon key={`full-${index}`} sx={{ fontSize: '32px' }} />
        ))}
        {[...Array(halfStars)].map((_, index) => (
          <StarIcon key={`half-${index}`} sx={{ fontSize: '32px' }} />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <StarBorderIcon key={`empty-${index}`} sx={{ fontSize: '32px' }} />
        ))}
      </Box>
    );
  };
  

  const scrollCommentsLeft = (index) => {
    const container = document.getElementById(`commentsContainer-${index}`);
    container.scrollLeft -= 200; // Adjust scroll amount as needed
    updateScrollPosition(index, container.scrollLeft - 200);
  };
  
  const scrollCommentsRight = (index) => {
    const container = document.getElementById(`commentsContainer-${index}`);
    container.scrollLeft += 200; // Adjust scroll amount as needed
    updateScrollPosition(index, container.scrollLeft + 200);
  };
  
  const updateScrollPosition = (index, scrollLeft) => {
    setScrollPositions((prev) => ({ ...prev, [index]: scrollLeft }));
  };
  

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
          <Button onClick={() => navigate('/change-password')} sx={styles.menuButton}>
            Change My Password
          </Button>
          <Button onClick={() => navigate('/manage-access')} sx={styles.menuButton}>
            Manage Access
          </Button>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <LogoutIcon />
          </IconButton>
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
        <Button onClick={() => navigate('/complaints')} sx={styles.sidebarButton}>
          <AssignmentIcon sx={styles.icon} />
          {sidebarOpen && 'Complaints'}
        </Button>
        <Button onClick={() => navigate('/products')} sx={styles.sidebarButton}>
          <StorefrontIcon sx={styles.icon} />
          {sidebarOpen && 'Products'}
        </Button>
        <Button onClick={() => navigate('/YAdminActivitiesPage')} sx={styles.sidebarButton}>
          <LocalActivityIcon sx={styles.icon} />
          {sidebarOpen && 'Activities'}
        </Button>
        <Button onClick={() => navigate('/itineraries')} sx={styles.sidebarButton}>
          <MapIcon sx={styles.icon} />
          {sidebarOpen && 'Itineraries'}
        </Button>
        <Button onClick={() => navigate('/YAdminDashboard')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button>
      </Box>

      {/* Main Content Area with Activities */}
      <Box sx={styles.activitiesContainer}>
        {activities.map((activity, index) => (
          <Box key={index} sx={{ marginBottom: '20px' }}>
            <Box
              sx={{
                ...styles.activityCard,
                backgroundColor: activity.flagged ? '#cccfda' : 'white',
              }}
            >
              <Button
                variant="contained"
                onClick={() => flagActivity(activity.Name)}
                sx={styles.flagButton}
                disabled={activity.flagged}
              >
                {activity.flagged ? 'FLAGGED' : 'FLAG'}
              </Button>
              <Box sx={styles.activityInfo}>
                <Typography variant="h6" sx={{ fontWeight: 'bold',fontSize: '24px', marginBottom: '5px', display: 'flex', alignItems: 'center' }}>{activity.Name}</Typography>
                <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                  {activity.Location?.address || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                  {activity.AdvertiserName}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
                  <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                  {activity.Price}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                  {new Date(activity.Date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                  {activity.Time}
                </Typography>
                <Box sx={styles.quickFacts}>
                  <Box sx={{ ...styles.infoContainer, backgroundColor: activity.flagged ? '#b3b8c8' : '#f3f4f6' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Category:</Typography>
                    <Typography variant="body2">{activity.Category}</Typography>
                  </Box>
                  <Box sx={{ ...styles.infoContainer, backgroundColor: activity.flagged ? '#b3b8c8' : '#f3f4f6' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Tags:</Typography>
                    <Typography variant="body2">{activity.Tags.join(', ')}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={styles.activityRating}>
                {renderRating(activity.Rating)}
              </Box>
              <Box sx={styles.discountContainer}>
                <Box sx={{...styles.infoContainer, backgroundColor: activity.flagged ? '#b3b8c8' : '#f3f4f6'}}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Special Discount:</Typography>
                  <Typography variant="body2">{activity.SpecialDiscount}</Typography>
                </Box>
              </Box>
              <Box sx={styles.bookingOpenContainer}>
                <Box sx={{...styles.infoContainer, backgroundColor: activity.flagged ? '#b3b8c8' : '#f3f4f6'}}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Booking Open:</Typography>
                  <Typography variant="body2">{activity.BookingOpen ? 'Yes' : 'No'}</Typography>
                </Box>
              </Box>
            </Box>
            {/* Comments Section */}
<Box sx={styles.commentsSection}>
  {activity.Comments && activity.Comments.length > 0 ? (
    <>
      {scrollPositions[index] > 0 && (
        <IconButton sx={styles.scrollButton} onClick={() => scrollCommentsLeft(index)}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <Box
        sx={styles.commentsContainer}
        id={`commentsContainer-${index}`}
        onScroll={(e) => updateScrollPosition(index, e.target.scrollLeft)}
      >
        {activity.Comments.map((comment, idx) => (
          <Box key={idx} sx={styles.commentCard}>
            <Typography variant="body2">{comment.Comment || 'No comment available'}</Typography>
            <Typography variant="caption">@ {comment.touristUsername || 'Anonymous'}</Typography>
          </Box>
        ))}
      </Box>
      {scrollPositions[index] + 200 < document.getElementById(`commentsContainer-${index}`)?.scrollWidth && (
        <IconButton sx={styles.scrollButton} onClick={() => scrollCommentsRight(index)}>
          <ArrowForwardIcon />
        </IconButton>
      )}
    </>
  ) : (
    <Typography variant="body2">No comments available</Typography>
  )}
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
    position: 'relative',
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
  menuButton: {
    color: '#e6e7ed',
    fontWeight: 'bold',
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
  discountContainer: {
    position: 'absolute',
    bottom: '100px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  bookingOpenContainer: {
    position: 'absolute',
    bottom: '50px',
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
    position: 'absolute',
    bottom: '140px',
    right: '60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  flagButton: {
    position: 'absolute',
    top: '50px',
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
    marginTop: '10px',
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
  },
};

export default YAdminActivitiesPage;
