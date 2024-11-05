// src/files/Tourist/TouristHistoricalPlacesModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristHistoricalPlacesModal() {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await axios.get('/api/ViewAllUpcomingHistoricalPlacesEventsTourist');
        setHistoricalPlaces(response.data);
      } catch (error) {
        console.error('Error fetching historical places:', error);
      }
    };
    fetchHistoricalPlaces();
  }, []);

  // Function to handle sharing the historical place link with a hardcoded email
  const handleShare = async (placeName) => {
    try {
      const frontendLink = `http://localhost:3000/historicalPlace/details/${encodeURIComponent(placeName)}`;

      // Optionally send this to backend to generate a message or use frontend link directly
      const response = await axios.post('/getCopyLink', {
        entityType: 'historicalPlace', // Use "historicalPlace" entity type
        entityName: placeName,
        email: 'farahabouelwafaa@gmail.com' // Hardcoded email
      });
      const { msg } = response.data;

      // Copy the frontend link to the clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(frontendLink)
          .then(() => alert(`Link copied to clipboard successfully!`))
          .catch(err => alert(`Failed to copy link: ${err}`));
      } else {
        alert(`Here is the link to share: ${frontendLink}\n${msg}`);
      }
    } catch (error) {
      console.error('Error sharing link:', error);
      alert('An error occurred while generating the share link.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          Upcoming Historical Places Events
        </Typography>
        <Box sx={styles.listContainer}>
          {historicalPlaces.map(place => (
            <Box key={place.id} sx={styles.item}>
              <Typography variant="body1"><strong>Name:</strong> {place.name}</Typography>
              <Typography variant="body2"><strong>Location:</strong> {place.location}</Typography>
              <Typography variant="body2"><strong>Opening Hours:</strong> {place.openingHours}</Typography>
              
              {/* Share Button */}
              <Button
                variant="outlined"
                onClick={() => handleShare(place.name)}
                sx={styles.shareButton}
              >
                Share
              </Button>
            </Box>
          ))}
        </Box>
        <Button variant="contained" sx={styles.doneButton} onClick={() => navigate('/touristHome')}>
          Done
        </Button>
      </Box>
    </Modal>
  );
}

const styles = {
  modalContent: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 500, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
  },
  listContainer: {
    maxHeight: 300, overflowY: 'auto', mt: 2,
  },
  item: {
    p: 2, borderBottom: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  doneButton: {
    mt: 2, backgroundColor: '#00c853', '&:hover': { backgroundColor: '#69f0ae' },
  },
  shareButton: {
    mt: 1, backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#63a4ff' },
  },
};

export default TouristHistoricalPlacesModal;
