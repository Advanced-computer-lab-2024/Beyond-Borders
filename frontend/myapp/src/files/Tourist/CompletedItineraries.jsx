import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CompletedItineraries() {
  const [completedItineraries, setCompletedItineraries] = useState([]);
  const [itineraryRatings, setItineraryRatings] = useState({}); // Store ratings for each itinerary
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedItineraries = async () => {
      try {
        const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
        const response = await axios.get(`/api/viewMyCompletedItineraries`, { params: { Username: username } });
        setCompletedItineraries(response.data);
      } catch (error) {
        console.error('Error fetching completed itineraries:', error);
      }
    };
    fetchCompletedItineraries();
  }, []);

  // Function to handle itinerary rating submission
  const handleRateItinerary = async (itineraryName) => {
    const touristUsername = localStorage.getItem('username');
    const ratingValue = parseInt(itineraryRatings[itineraryName], 10);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Rating must be a number between 1 and 5.");
      return;
    }

    try {
      const response = await axios.put('/rateCompletedItinerary', {
        touristUsername,
        itineraryName,
        rating: ratingValue
      });
      alert(response.data.msg);

      // Directly use the backend-provided newAverageRating without frontend modification
      const updatedItineraries = completedItineraries.map(itinerary =>
        itinerary.Title === itineraryName
          ? { ...itinerary, Ratings: response.data.newAverageRating }
          : itinerary
      );
      setCompletedItineraries(updatedItineraries);
    } catch (error) {
      console.error('Error rating itinerary:', error);
      alert('An error occurred while submitting your rating.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Completed Itineraries
        </Typography>

        {/* Completed Itineraries Listing */}
        <Box sx={styles.listContainer}>
          {completedItineraries.length > 0 ? (
            completedItineraries.map(itinerary => (
              <Box key={itinerary._id} sx={styles.item}>
                <Typography variant="body1"><strong>Title:</strong> {itinerary.Title}</Typography>
                <Typography variant="body2"><strong>Description:</strong> {itinerary.Description}</Typography>
                <Typography variant="body2"><strong>Date:</strong> {new Date(itinerary.Date).toLocaleDateString()}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {itinerary.Location}</Typography>
                <Typography variant="body2"><strong>Price:</strong> ${itinerary.Price}</Typography>
                <Typography variant="body2"><strong>Language:</strong> {itinerary.Language}</Typography>
                <Typography variant="body2"><strong>Tour Guide:</strong> {itinerary.AuthorUsername}</Typography>
                <Typography variant="body2"><strong>Current Itinerary Rating:</strong> {itinerary.Ratings || 'Not rated yet'}</Typography>
                
                {/* Rating Input for Itinerary */}
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    label="Rate this Itinerary"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={itineraryRatings[itinerary.Title] || ''}
                    onChange={(e) => setItineraryRatings({ ...itineraryRatings, [itinerary.Title]: e.target.value })}
                    inputProps={{ min: 1, max: 5 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleRateItinerary(itinerary.Title)}
                    sx={styles.rateButton}
                  >
                    Submit Itinerary Rating
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No completed itineraries found.</Typography>
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

export default CompletedItineraries;
