// src/files/Tourist/CompletedMuseums.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CompletedMuseums() {
  const [completedMuseums, setCompletedMuseums] = useState([]);
  const [museumRatings, setMuseumRatings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedMuseums = async () => {
      try {
        const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
        const response = await axios.get(`/api/viewMyCompletedMuseums`, { params: { Username: username } });
        setCompletedMuseums(response.data);
      } catch (error) {
        console.error('Error fetching completed museums:', error);
      }
    };
    fetchCompletedMuseums();
  }, []);

  // Function to handle museum rating submission
  const handleRateMuseum = async (museumName) => {
    const touristUsername = localStorage.getItem('username');
    const ratingValue = parseInt(museumRatings[museumName], 10);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Rating must be a number between 1 and 5.");
      return;
    }

    try {
      const response = await axios.put('/rateCompletedMuseum', {
        touristUsername,
        museumName,
        rating: ratingValue,
      });
      alert(response.data.msg);

      // Update the museum list with the new average rating from the response
      const updatedMuseums = completedMuseums.map(museum =>
        museum.name === museumName
          ? { ...museum, Ratings: response.data.newAverageRating }
          : museum
      );
      setCompletedMuseums(updatedMuseums);
    } catch (error) {
      console.error('Error rating museum:', error);
      alert('An error occurred while submitting your rating.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Completed Museum Events
        </Typography>

        {/* Completed Museums Listing */}
        <Box sx={styles.listContainer}>
          {completedMuseums.length > 0 ? (
            completedMuseums.map(museum => (
              <Box key={museum._id} sx={styles.item}>
                <Typography variant="body1"><strong>Name:</strong> {museum.name}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {museum.location}</Typography>
                <Typography variant="body2"><strong>Opening Hours:</strong> {museum.openingHours}</Typography>
                <Typography variant="body2"><strong>Author:</strong> {museum.author}</Typography>
                <Typography variant="body2"><strong>Ticket Prices:</strong> 
                  Foreigner: {museum.ticketPrices?.foreigner}, 
                  Native: {museum.ticketPrices?.native}, 
                  Student: {museum.ticketPrices?.student}
                </Typography>
                <Typography variant="body2"><strong>Current Rating:</strong> {museum.Ratings || 'Not rated yet'}</Typography>
                
                {/* Rating Input for Museum */}
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    label="Rate this Museum"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={museumRatings[museum.name] || ''}
                    onChange={(e) => setMuseumRatings({ ...museumRatings, [museum.name]: e.target.value })}
                    inputProps={{ min: 1, max: 5 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleRateMuseum(museum.name)}
                    sx={styles.rateButton}
                  >
                    Submit Rating
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No completed museums found.</Typography>
          )}
        </Box>

        <Button variant="contained" sx={styles.doneButton} onClick={() => navigate('/touristHome')}>Done</Button>
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
    width: 600,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  listContainer: {
    maxHeight: '300px',
    overflowY: 'auto',
    borderTop: '1px solid #ddd',
    marginTop: '1rem',
    paddingTop: '1rem',
  },
  item: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #ddd',
  },
  doneButton: {
    marginTop: '1rem',
    backgroundColor: '#00c853',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#69f0ae',
    },
  },
  rateButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': { backgroundColor: '#63a4ff' },
  },
};

export default CompletedMuseums;
