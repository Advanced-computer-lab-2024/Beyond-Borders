// src/files/Tourist/TouristMuseumsModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristMuseumsModal() {
  const [museums, setMuseums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await axios.get('/api/ViewAllUpcomingMuseumEventsTourist');
        setMuseums(response.data);
      } catch (error) {
        console.error('Error fetching museums:', error);
      }
    };
    fetchMuseums();
  }, []);

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          Upcoming Museum Events
        </Typography>
        <Box sx={styles.listContainer}>
          {museums.map(museum => (
            <Box key={museum.id} sx={styles.item}>
              <Typography variant="body1"><strong>Name:</strong> {museum.name}</Typography>
              <Typography variant="body2"><strong>Location:</strong> {museum.location}</Typography>
              <Typography variant="body2"><strong>Opening Hours:</strong> {museum.openingHours}</Typography>
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

export default TouristMuseumsModal;