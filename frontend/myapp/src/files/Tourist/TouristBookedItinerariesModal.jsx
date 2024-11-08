import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristBookedItinerariesModal() {
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookedItineraries = async () => {
      try {
        const touristUsername = localStorage.getItem('username');
        const response = await axios.get(`/api/viewBookedItineraries`, { params: { touristUsername } });
        if (response.data.bookedItineraries) {
          setBookedItineraries(response.data.bookedItineraries);
        } else {
          setErrorMessage(response.data.msg || 'No booked itineraries found.');
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.msg || 'Error fetching booked itineraries.');
      }
    };
    fetchBookedItineraries();
  }, []);

  const handleCancelItinerary = async (itineraryTitle) => {
    const touristUsername = localStorage.getItem('username');
    try {
      const response = await axios.put('/deleteBookedItinerary', { 
         touristUsername, itineraryName: itineraryTitle 
      });
      alert(response.data.msg || 'Itinerary cancelled successfully.');
      setBookedItineraries(prev => prev.filter(itinerary => itinerary.Title !== itineraryTitle));
    } catch (error) {
      alert(error.response?.data?.msg || 'Error cancelling itinerary.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Booked Itineraries
        </Typography>
        {errorMessage ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : (
          <Box sx={styles.listContainer}>
            {bookedItineraries.length > 0 ? (
              bookedItineraries.map((itinerary) => (
                <Box key={itinerary._id} sx={styles.item}>
                  <Typography variant="body1"><strong>Title:</strong> {itinerary.Title}</Typography>
                  <Typography variant="body2"><strong>Date:</strong> {itinerary.Date ? new Date(itinerary.Date).toLocaleDateString() : 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Price:</strong> ${itinerary.Price}</Typography>
                  <Typography variant="body2"><strong>Language:</strong> {itinerary.Language}</Typography>
                  <Typography variant="body2"><strong>Accessibility:</strong> {itinerary.accessibility ? 'Yes' : 'No'}</Typography>
                  <Typography variant="body2"><strong>Pickup Location:</strong> {itinerary.pickupLocation}</Typography>
                  <Typography variant="body2"><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</Typography>
                  <Typography variant="body2"><strong>Tags:</strong> {itinerary.Tags?.join(', ') || 'No tags'}</Typography>
                  <Typography variant="body2"><strong>Ratings:</strong> {itinerary.Ratings} ({itinerary.RatingCount} reviews)</Typography>

                  {/* Display Comments */}
                  <Typography variant="body2"><strong>Comments:</strong></Typography>
                  {itinerary.Comments.length > 0 ? (
                    itinerary.Comments.map((comment, idx) => (
                      <Box key={idx} sx={styles.comment}>
                        <Typography variant="body2"><strong>{comment.touristUsername}:</strong> {comment.Comment}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2">No comments available</Typography>
                  )}

                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => handleCancelItinerary(itinerary.Title)}
                  >
                    Cancel Booking
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No booked itineraries found.</Typography>
            )}
          </Box>
        )}
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
    maxHeight: '80vh',
    overflowY: 'auto',
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
  comment: {
    ml: 2,
    mt: 1,
    borderBottom: '1px solid #eee',
    pb: 1,
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#00c853',
    color: 'white',
    '&:hover': { backgroundColor: '#69f0ae' },
  },
};

export default TouristBookedItinerariesModal;
