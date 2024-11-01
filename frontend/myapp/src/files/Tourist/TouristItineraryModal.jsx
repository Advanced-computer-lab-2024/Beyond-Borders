// src/files/Tourist/TouristItineraryModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristItineraryModal() {
  const [itineraries, setItineraries] = useState([]);
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

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          Upcoming Itineraries
        </Typography>
        <Box sx={styles.listContainer}>
          {itineraries.map(itinerary => (
            <Box key={itinerary.id} sx={styles.item}>
              <Typography variant="body1"><strong>Title:</strong> {itinerary.Title}</Typography>
              <Typography variant="body2"><strong>Price:</strong> ${itinerary.Price}</Typography>
              <Typography variant="body2"><strong>Language:</strong> {itinerary.Language}</Typography>
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
  },
  doneButton: {
    mt: 2, backgroundColor: '#00c853', '&:hover': { backgroundColor: '#69f0ae' },
  },
};

export default TouristItineraryModal;
