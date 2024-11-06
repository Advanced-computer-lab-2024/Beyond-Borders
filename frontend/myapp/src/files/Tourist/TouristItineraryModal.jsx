// src/files/Tourist/TouristItineraryModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristItineraryModal() {
  const [itineraries, setItineraries] = useState([]);
  const [email, setEmail] = useState(''); // State for the email input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('/api/ViewAllUpcomingItinerariesTourist');
        setItineraries(response.data);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };
    fetchItineraries();
  }, []);

  // Function to handle sharing the itinerary link with the entered email
  const handleShare = async (itineraryTitle) => {
    try {
      const frontendLink = `http://localhost:3000/itinerary/details/${encodeURIComponent(itineraryTitle)}`;

      // Send request to the backend to generate a link
      const response = await axios.post('/getCopyLink', {
        entityType: 'itinerary',
        entityName: itineraryTitle,
        email: email // Use the email from the text field
      });
      const { msg } = response.data;

      // Copy the frontend link to the clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(frontendLink)
          .then(() => alert(`Link copied to clipboard successfully!\n${msg}`))
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
          Upcoming Itineraries
        </Typography>

        {/* Email Input */}
        

        <Box sx={styles.listContainer}>
          {itineraries.map(itinerary => (
            <Box key={itinerary.id} sx={styles.item}>
              <Typography variant="body1"><strong>Title:</strong> {itinerary.Title}</Typography>
              <Typography variant="body2"><strong>Price:</strong> ${itinerary.Price}</Typography>
              <Typography variant="body2"><strong>Language:</strong> {itinerary.Language}</Typography>
              <TextField
          label="Email for Sharing"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

              {/* Share Button */}
              <Button
                variant="outlined"
                onClick={() => handleShare(itinerary.Title)}
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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
  listContainer: {
    maxHeight: 300,
    overflowY: 'auto',
    mt: 2,
  },
  item: {
    p: 2,
    borderBottom: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#00c853',
    color: 'white',
    '&:hover': { backgroundColor: '#69f0ae' },
  },
  shareButton: {
    mt: 1,
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': { backgroundColor: '#63a4ff' },
  },
};

export default TouristItineraryModal;
