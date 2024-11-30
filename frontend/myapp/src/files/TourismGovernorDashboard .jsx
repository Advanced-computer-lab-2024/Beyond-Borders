import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MuseumIcon from '@mui/icons-material/AccountBalance';
import HistoricalPlaceIcon from '@mui/icons-material/HistoryEdu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';


const TourismGovernorDashboard = () => {
  const [tagName, setTagName] = useState('');
  const [showTagForm, setShowTagForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Retrieve credentials from localStorage
    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
  
    // Redirect to the login page with credentials autofilled
    navigate('/login', { state: { username, password } });
  };
  
  const toggleTagForm = () => {
    setShowTagForm(!showTagForm);
    setResponseMessage('');
    setErrorMessage('');
  };

  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
    setPasswordUpdateMessage('');
    setErrorMessage('');
  };

  const handleTagFormSubmit = async (event) => {
    event.preventDefault();

    const formData = { NameOfHistoricalTags: tagName };

    try {
      const response = await fetch('/createHistoricalTag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage('Historical Tag added successfully!');
        setTagName(''); // Reset the form
      } else {
        setErrorMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };
  const username = localStorage.getItem('username') || 'User'; // Retrieve username from localStorage

  const handlePasswordFormSubmit = async (event) => {
    event.preventDefault();

    const username = localStorage.getItem('username');
    const formData = { Username: username, newPassword };

    try {
      const response = await axios.put('/updateGovernorPassword', formData);

      if (response.status === 200) {
        setPasswordUpdateMessage('Password updated successfully!');
        setNewPassword('');
        togglePasswordModal();
      } else {
        setErrorMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the password.');
    }
  };

  return (
    <Box sx={styles.container}>
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
        <Button sx={styles.menuButton} onClick={toggleTagForm}>
              Add New Historical Tag
            </Button>
            <Button sx={styles.menuButton} onClick={togglePasswordModal}>
              Change Password
            </Button>
          <IconButton sx={styles.iconButton}>
            <NotificationsIcon />
          </IconButton>
          <IconButton onClick={() => navigate('/')}sx={styles.iconButton}>
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
      ><Box sx={styles.sidebarHeader}>
        <Button onClick={() => setSidebarOpen(!sidebarOpen)} sx={styles.menuButton}>
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </Button>
          {sidebarOpen && (
            <Typography variant="h6" sx={styles.sidebarTitle}>
              Tourism Dashboard
            </Typography>
          )}
        </Box>
        <Button
          sx={styles.sidebarButton}
          onClick={() => (window.location.href = '/MuseumTG')}
        >
          <MuseumIcon sx={styles.icon} />
          {sidebarOpen && 'Museums'}
        </Button>
        <Button
          sx={styles.sidebarButton}
          onClick={() => (window.location.href = '/HistoricalPlaceTG')}
        >
          <HistoricalPlaceIcon sx={styles.icon} />
          {sidebarOpen && 'Historical Places'}
        </Button>
        {/* <Button onClick={() => navigate('/YAdminDashboard')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button> */}
      </Box>

      {/* Main Content Area with Boxes */}
      <Box sx={{ ...styles.content, filter: sidebarOpen ? 'brightness(0.5)' : 'none' }}>
      {/* Left Section: Welcome Message */}
      <Box sx={styles.welcomeSection}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#192959', textAlign: 'left' }}>
            Welcome back, {username}!
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '18px', lineHeight: '1.8', color: '#192959', textAlign: 'left' }}>
            Thank you for choosing Beyond Borders. Use your dashboard to explore Museums,
            Historical Places, and stay connected with the vibrant tourism ecosystem.
            Let's create unforgettable experiences together!
            </Typography>
        </Box>
        <Box sx={styles.infoBox} onClick={() => navigate('/MuseumTG')}>
          <img src="/images/museum.jpg" alt="Museums" style={styles.image} />
          <Typography variant="h6" sx={styles.text} className="text">Museums</Typography>
        </Box>
        <Box sx={styles.infoBox} onClick={() => navigate('/HistoricalPlaceTG')}>
          <img src="/images/historicalplace.jpg" alt="Historical Places" style={styles.image} />
          <Typography variant="h6" sx={styles.text} className="text">Historical Places</Typography>
        </Box>
      </Box>

      {/* Add Historical Tag Modal */}
      <Modal open={showTagForm} onClose={toggleTagForm}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6">Add New Historical Tag</Typography>
          <form onSubmit={handleTagFormSubmit}>
            <TextField
              label="Tag Name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              fullWidth
              required
              sx={{ mt: 2, mb: 2 }}
            />
            <Button type="submit" variant="contained" sx={styles.actionButton}>
              Add Tag
            </Button>
          </form>
          {responseMessage && (
            <Typography sx={{ color: 'green', mt: 2 }}>{responseMessage}</Typography>
          )}
          {errorMessage && (
            <Typography sx={{ color: 'red', mt: 2 }}>{errorMessage}</Typography>
          )}
        </Box>
      </Modal>
  
      {/* Change Password Modal */}
      <Modal open={showPasswordModal} onClose={togglePasswordModal}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6">Change Password</Typography>
          <form onSubmit={handlePasswordFormSubmit}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
              sx={{ mt: 2, mb: 2 }}
            />
            <Button type="submit" variant="contained" sx={styles.actionButton}>
              Update Password
            </Button>
          </form>
          {passwordUpdateMessage && (
            <Typography sx={{ color: 'green', mt: 2 }}>{passwordUpdateMessage}</Typography>
          )}
          {errorMessage && (
            <Typography sx={{ color: 'red', mt: 2 }}>{errorMessage}</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#e6e7ed',
    color: '#e6e7ed',
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
  manageAccessContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#192959',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 1,
  },
  dropdownItem: {
    color: '#e6e7ed',
    display: 'block',
    padding: '10px 20px',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: '#4d587e',
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
  content: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    padding: '20px 70px 20px 90px',
    marginLeft: '60px',
    transition: 'margin-left 0.3s ease',
  },
  infoBox: {
    backgroundColor: '#4d587e',
    color: '#e6e7ed',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '&:hover .text': {
      transform: 'scale(1.5)',
    },
  },
  image: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '10px',
    transition: 'transform 0.2s',
  },
  text: {
    transition: 'transform 0.2s',
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
  actionButton: {
    backgroundColor: '#99a0b5',
    color: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },
  acceptButton: {
    color: '#4CAF50',
  },
  rejectButton: {
    color: '#FF5252',
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#FF0000',
    '&:hover': { backgroundColor: '#FF5252' },
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    maxHeight: 400,
    overflowY: "auto",
  },
  categoryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  iconContainer: {
    display: "flex",
    gap: 1,
  },
  closeButton: {
    backgroundColor: "#FF5252",
    color: "#fff",
    mt: 2,
    "&:hover": { backgroundColor: "#D32F2F" },
  },
  largeModalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw', // Adjust width as needed
    maxWidth: '600px', // Restrict max width
    maxHeight: '80vh', // Limit height
    backgroundColor: '#fff',
    padding: '20px', // Added padding to give space inside the modal
    margin: '20px', // Added margin to give space outside the modal
    borderRadius: '8px',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // Prevent outer scrolling
  },
  scrollableContainer: {
    flex: 1,
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    overflowY: 'auto', // Enable only vertical scrolling
  },
  requestItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f3f4f6',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: "#333",
  },
  actionIcons: {
    display: "flex",
    gap: "10px",
  },
  welcomeSection: {
    //width: '500px',
    flex: 1,
    marginRight: '0px',
    padding: '140px 0px 20px 20px',
    // backgroundColor: '#f8f9fa',
    // borderRadius: '15px',
    // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

export default TourismGovernorDashboard;
