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
      {/* Sidebar */}
      <Box sx={{ ...styles.sidebar, width: sidebarOpen ? '250px' : '60px' }}>
        <Box sx={styles.sidebarHeader}>
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
      </Box>
  
      {/* Main Content */}
      <Box sx={{ ...styles.mainContent, marginLeft: sidebarOpen ? '250px' : '60px' }}>
        {/* Top Menu */}
        <Box sx={styles.topMenu}>
          <Typography variant="h6" sx={styles.logo}>
            Beyond Borders
          </Typography>
          <Box>
            <Button sx={styles.menuButton} onClick={toggleTagForm}>
              Add New Historical Tag
            </Button>
            <Button sx={styles.menuButton} onClick={togglePasswordModal}>
              Change Password
            </Button>
  
            {/* Notification Button */}
            <IconButton sx={styles.iconButton}>
              <NotificationsIcon />
            </IconButton>
  
            {/* Logout Button */}
            <IconButton onClick={handleLogout} sx={styles.iconButton}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
  
        {/* Buttons as Main Content */}
        <Box sx={styles.content}>
          <Box sx={styles.infoBox} onClick={() => (window.location.href = '/MuseumTG')}>
    
            <Typography sx={styles.text}>Museums</Typography>
          </Box>
          <Box
            sx={styles.infoBox}
            onClick={() => (window.location.href = '/HistoricalPlaceTG')}
          >
            <Typography sx={styles.text}>Historical Places</Typography>
          </Box>
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
  
  
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#e6e7ed',
  },
  sidebar: {
    backgroundColor: '#4d587e', // Matches button colors
    color: '#e6e7ed',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'width 0.3s ease',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  sidebarTitle: {
    fontWeight: 'bold',
    marginLeft: '10px',
  },
  sidebarButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding: '10px 20px',
    color: '#e6e7ed',
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
    transition: 'margin-left 0.3s ease',
  },
  topMenu: {
    width: '100%',
    backgroundColor: '#192959',
    color: '#e6e7ed',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
  },
  menuButton: {
    color: '#e6e7ed',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#e6e7ed',
      color: '#192959',
    },
  },
  iconButton: {
    color: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#4d587e',
    },
  },
  content: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  infoBox: {
    backgroundColor: '#4d587e',
    color: '#e6e7ed',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  text: {
    fontSize: '16px',
    fontWeight: 'bold',
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
    backgroundColor: '#192959',
    color: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#4d587e',
    },
  },
  
    
};


export default TourismGovernorDashboard;
