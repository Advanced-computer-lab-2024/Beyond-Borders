import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminItineraryModal({ onClose, activeModal }) {
  const [itineraries, setItineraries] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null); // Track selected itinerary for flagging
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('/api/viewAllItinerariesAdmin');
        setItineraries(response.data);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };
    fetchItineraries();
  }, []);

  // Method to flag the selected itinerary if not already flagged
  const flagItinerary = async () => {
    if (!selectedItinerary) return;

    if (selectedItinerary.flagged) {
      alert("This itinerary is already flagged.");
      return;
    }

    try {
      const response = await axios.post('/api/flagItinerary', { title: selectedItinerary.Title });
      if (response.status === 200) {
        alert(response.data.message);
        setItineraries(itineraries.map(it =>
          it.Title === selectedItinerary.Title ? { ...it, flagged: true } : it
        ));
        setSelectedItinerary(null); // Clear selected itinerary after flagging
      }
    } catch (error) {
      console.error('Error flagging itinerary:', error);
      alert('An error occurred while flagging the itinerary.');
    }
  };

  return (
    <Modal open={activeModal === 'itineraries'} onClose={onClose}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">Itineraries</Typography>
        <Box sx={styles.listContainer}>
          {itineraries.length > 0 ? (
            itineraries.map((itinerary) => (
              <Box key={itinerary._id} sx={styles.item}>
                <Typography variant="body1"><strong>Title:</strong> {itinerary.Title}</Typography>
                <Typography variant="body2"><strong>Activities:</strong> {itinerary.Activities}</Typography>
                <Typography variant="body2"><strong>Locations:</strong> {itinerary.Locations}</Typography>
                <Typography variant="body2"><strong>Timeline:</strong> {itinerary.Timeline}</Typography>
                <Typography variant="body2"><strong>Language:</strong> {itinerary.Language}</Typography>
                <Typography variant="body2"><strong>Price:</strong> ${itinerary.Price}</Typography>
                <Typography variant="body2"><strong>Date:</strong> {new Date(itinerary.Date).toLocaleDateString()}</Typography>
                <Typography variant="body2"><strong>Accessibility:</strong> {itinerary.accessibility ? 'Yes' : 'No'}</Typography>
                <Typography variant="body2"><strong>Pickup Location:</strong> {itinerary.pickupLocation}</Typography>
                <Typography variant="body2"><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</Typography>
                <Typography variant="body2"><strong>Is Booked:</strong> {itinerary.isBooked ? 'Yes' : 'No'}</Typography>
                <Typography variant="body2"><strong>Tags:</strong> {itinerary.Tags.join(', ')}</Typography>
                <Typography variant="body2"><strong>Author:</strong> {itinerary.AuthorUsername}</Typography>
                <Typography variant="body2"><strong>Rating:</strong> {itinerary.Ratings}</Typography>
                <Typography variant="body2"><strong>Rating Count:</strong> {itinerary.RatingCount}</Typography>
                <Typography variant="body2"><strong>Flagged:</strong> {itinerary.flagged ? 'Yes' : 'No'}</Typography>
                
                <Typography variant="body2"><strong>Comments:</strong></Typography>
                {Array.isArray(itinerary.Comments) && itinerary.Comments.length > 0 ? (
                  itinerary.Comments.map((comment, idx) => (
                    <Box key={idx} sx={{ mt: 1, mb: 1, padding: '5px', borderBottom: '1px solid #ccc' }}>
                      <Typography variant="body2"><strong>Username:</strong> {comment.touristUsername || 'Anonymous'}</Typography>
                      <Typography variant="body2"><strong>Comment:</strong> {comment.Comment || 'No comment'}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">No comments available</Typography>
                )}
                
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedItinerary(itinerary); // Set the itinerary to flag
                    flagItinerary(); // Call the flag function
                  }}
                  sx={styles.flagButton}
                  disabled={itinerary.flagged} // Disable if already flagged
                >
                  {itinerary.flagged ? 'Already Flagged' : 'Flag'}
                </Button>
              </Box>
            ))
          ) : (
            <Typography>No itineraries found.</Typography>
          )}
        </Box>
        <Button variant="contained" sx={styles.doneButton} onClick={() => navigate('/HomePageAdmin')}>
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
  flagButton: {
    mt: 1, backgroundColor: '#ff5722', color: 'white', '&:hover': { backgroundColor: '#ff8a50' },
  },
};

export default AdminItineraryModal;
