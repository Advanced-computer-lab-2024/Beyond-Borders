// src/files/Tourist/CompletedHistorical.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CompletedHistorical() {
  const [completedHistoricalPlaces, setCompletedHistoricalPlaces] = useState([]);
  const [historicalPlaceRatings, setHistoricalPlaceRatings] = useState({});
  const [historicalPlaceComments, setHistoricalPlaceComments] = useState({}); // comments
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedHistoricalPlaces = async () => {
      try {
        const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
        const response = await axios.get(`/api/viewMyCompletedHistoricalPlaces`, { params: { Username: username } });
        setCompletedHistoricalPlaces(response.data);
      } catch (error) {
        console.error('Error fetching completed historical places:', error);
      }
    };
    fetchCompletedHistoricalPlaces();
  }, []);

  // Function to handle historical place rating submission
  const handleRateHistoricalPlace = async (HPname) => {
    const touristUsername = localStorage.getItem('username');
    const ratingValue = parseInt(historicalPlaceRatings[HPname], 10);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Rating must be a number between 1 and 5.");
      return;
    }

    try {
      const response = await axios.put('/rateCompletedHP', {
        touristUsername,
        HPname,
        rating: ratingValue,
      });
      alert(response.data.msg);

      // Update the historical place list with the new average rating from the response
      const updatedHistoricalPlaces = completedHistoricalPlaces.map(place =>
        place.name === HPname
          ? { ...place, Ratings: response.data.newAverageRating }
          : place
      );
      setCompletedHistoricalPlaces(updatedHistoricalPlaces);
    } catch (error) {
      console.error('Error rating historical place:', error);
      alert('An error occurred while submitting your rating.');
    }
  };



  const handleCommentHistoricalPlace = async (HPname) => {
    const touristUsername = localStorage.getItem('username');
    const comment = historicalPlaceComments[HPname]?.trim();

    if (!comment || comment.length === 0) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.put('/commentOnHP', {
        touristUsername,
        HPname,
        comment,
      });
      alert(response.data.msg);

      // Clear the comment field after submission
      setHistoricalPlaceComments(prevComments => ({ ...prevComments, [HPname]: '' }));
    } catch (error) {
      console.error('Error commenting on historical place:', error);
      alert('An error occurred while submitting your comment.');
    }
  };


  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Completed Historical Places
        </Typography>

        {/* Completed Historical Places Listing */}
        <Box sx={styles.listContainer}>
          {completedHistoricalPlaces.length > 0 ? (
            completedHistoricalPlaces.map(place => (
              <Box key={place._id} sx={styles.item}>
                <Typography variant="body1"><strong>Name:</strong> {place.name}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {place.location}</Typography>
                <Typography variant="body2"><strong>Opening Hours:</strong> {place.openingHours}</Typography>
                <Typography variant="body2"><strong>Author:</strong> {place.author}</Typography>
                <Typography variant="body2"><strong>Ticket Prices:</strong> 
                  Foreigner: {place.ticketPrices?.foreigner}, 
                  Native: {place.ticketPrices?.native}, 
                  Student: {place.ticketPrices?.student}
                </Typography>
                <Typography variant="body2"><strong>Current Rating:</strong> {place.Ratings || 'Not rated yet'}</Typography>
                
                {/* Rating Input for Historical Place */}
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    label="Rate this Historical Place"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={historicalPlaceRatings[place.name] || ''}
                    onChange={(e) => setHistoricalPlaceRatings({ ...historicalPlaceRatings, [place.name]: e.target.value })}
                    inputProps={{ min: 1, max: 5 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleRateHistoricalPlace(place.name)}
                    sx={styles.rateButton}
                  >
                    Submit Rating
                  </Button>
                </Box>
                {/* Comment Input for Historical Place */}
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Comment on Historical Place"
                    variant="outlined"
                    size="small"
                    multiline
                    fullWidth
                    value={historicalPlaceComments[place.name] || ''}
                    onChange={(e) => setHistoricalPlaceComments({ ...historicalPlaceComments, [place.name]: e.target.value })}
                    rows={3}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleCommentHistoricalPlace(place.name)}
                    sx={styles.commentButton}
                  >
                    Submit Comment
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No completed historical places found.</Typography>
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
  commentButton: {
    backgroundColor: '#89CFF0', // Baby blue for comments
    color: 'white',
    marginTop: '0.5rem',
    '&:hover': { backgroundColor: '#A7DFFF' }, // Lighter blue on hover
  },
};

export default CompletedHistorical;
