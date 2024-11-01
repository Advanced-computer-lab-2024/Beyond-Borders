// src/files/Tourist/TouristHomePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TouristHomePage() {
  const [activeModal, setActiveModal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeModal === 'profile') {
      const fetchProfile = async () => {
        try {
          // Retrieve the Username from localStorage
          const Username = localStorage.getItem('username');
          console.log('Retrieved Username from localStorage:', Username); // Debugging log

          if (!Username) {
            setErrorMessage('Username not found. Please log in.');
            setActiveModal(null);
            return;
          }

          // Fetch profile data using the Username as a query parameter
          const response = await axios.get('/api/viewTourist', {
            params: { Username },
          });

          if (response.data) {
            console.log('Profile data retrieved:', response.data); // Debugging log
            setProfile(response.data);
          } else {
            setErrorMessage('Profile data could not be retrieved.');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setErrorMessage('An error occurred while loading your profile.');
        }
      };
      fetchProfile();
    }
  }, [activeModal]);

  return (
    <Box sx={styles.container}>
      <Typography variant="h5" component="h1" sx={styles.title}>
        Beyond Borders
      </Typography>

      <Box sx={styles.buttonContainer}>
        <Button sx={styles.button} onClick={() => navigate('/touristProducts')}>
          View All Products
        </Button>
        <Button sx={styles.button} onClick={() => navigate('/touristActivities')}>
          View All Activities
        </Button>
        <Button sx={styles.button} onClick={() => navigate('/touristMuseums')}>
          View All Museums
        </Button>
        <Button sx={styles.button} onClick={() => navigate('/touristItineraries')}>
          View All Itineraries
        </Button>
        <Button sx={styles.button} onClick={() => navigate('/touristHistorical')}>
          View All Historical Places
        </Button>
        <Button sx={styles.profileButton} onClick={() => setActiveModal('profile')}>
          My Profile
        </Button>
      </Box>

      {activeModal === 'profile' && (
        <Modal open={true} onClose={() => setActiveModal(null)}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">
              My Profile
            </Typography>
            {errorMessage ? (
              <Typography color="error">{errorMessage}</Typography>
            ) : profile ? (
              <Box sx={styles.profileInfo}>
                <Typography><strong>Username:</strong> {profile.Username}</Typography>
                <Typography><strong>Email:</strong> {profile.Email}</Typography>
                <Typography><strong>Mobile Number:</strong> {profile.MobileNumber}</Typography>
                <Typography><strong>Date of Birth:</strong> {profile.DoB}</Typography>
                <Typography><strong>Nationality:</strong> {profile.Nationality}</Typography>
                <Typography><strong>Occupation:</strong> {profile.Occupation}</Typography>
                <Typography><strong>Wallet Balance:</strong> ${profile.Wallet}</Typography>
              </Box>
            ) : (
              <Typography>Loading...</Typography> 
            )}
            <Button
              variant="contained"
              onClick={() => setActiveModal(null)}
              sx={styles.doneButton}
            >
              Done
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

const styles = {
  container: {
    backgroundColor: '#00c853',
    color: 'white',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    marginBottom: 3,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 2,
    mt: 2,
  },
  button: {
    backgroundColor: 'white',
    color: '#00c853',
    borderRadius: '20px',
    padding: '10px 20px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#69f0ae',
    },
  },
  profileButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '20px',
    padding: '10px 20px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#69f0ae',
    },
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
  profileInfo: {
    mt: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#00c853',
    color: 'white',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: '#69f0ae',
    },
  },
};

export default TouristHomePage;
