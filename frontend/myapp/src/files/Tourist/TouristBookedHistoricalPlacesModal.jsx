import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristBookedHistoricalPlacesModal() {
  const [bookedHistoricalPlaces, setBookedHistoricalPlaces] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookedHistoricalPlaces = async () => {
      try {
        const touristUsername = localStorage.getItem('username');
        const response = await axios.get(`/api/viewMyBookedHistoricalPlaces`, { params: { Username: touristUsername } });
        if (response.data.length > 0) {
          setBookedHistoricalPlaces(response.data);
        } else {
          setErrorMessage(response.data.msg || 'No booked historical places found.');
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.msg || 'Error fetching booked historical places.');
      }
    };
    fetchBookedHistoricalPlaces();
  }, []);

  const handleCancelBooking = async (placeName) => {
    const touristUsername = localStorage.getItem('username');
    try {
      const response = await axios.put('/deleteBookedHP', {  touristUsername, HPName: placeName  });
      alert(response.data.msg || 'Historical place booking cancelled successfully.');
      setBookedHistoricalPlaces(prev => prev.filter(place => place.name !== placeName));
    } catch (error) {
      alert(error.response?.data?.msg || 'Error cancelling historical place booking.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Booked Historical Places
        </Typography>
        {errorMessage ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : (
          <Box sx={styles.listContainer}>
            {bookedHistoricalPlaces.length > 0 ? (
              bookedHistoricalPlaces.map((place) => (
                <Box key={place._id} sx={styles.item}>
                  <Typography variant="body1"><strong>Name:</strong> {place.name}</Typography>
                  <Typography variant="body2"><strong>Date of Event:</strong> {place.dateOfEvent ? new Date(place.dateOfEvent).toLocaleDateString() : 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {place.location}</Typography>

                  {/* Display Ticket Prices */}
                  <Typography variant="body2"><strong>Ticket Prices:</strong></Typography>
                  <Typography variant="body2">Foreigner: ${place.ticketPrices.foreigner}</Typography>
                  <Typography variant="body2">Native: ${place.ticketPrices.native}</Typography>
                  <Typography variant="body2">Student: ${place.ticketPrices.student}</Typography>

                  {/* Display Comments */}
                  <Typography variant="body2"><strong>Comments:</strong></Typography>
                  {place.Comments.length > 0 ? (
                    place.Comments.map((comment, idx) => (
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
                    onClick={() => handleCancelBooking(place.name)}
                  >
                    Cancel Booking
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No booked historical places found.</Typography>
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

export default TouristBookedHistoricalPlacesModal;
