// src/files/Tourist/TouristBookedActivitiesModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristBookedActivitiesModal() {
  const [bookedActivities, setBookedActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookedActivities = async () => {
      const username = localStorage.getItem('username'); // Retrieve the username from local storage
      if (!username) {
        setErrorMessage('Please log in to view your booked activities.');
        return;
      }

      try {
        const response = await axios.get('/api/viewBookedActivities', {
          params: { Username: username }
        });
        setBookedActivities(response.data);
      } catch (error) {
        console.error('Error fetching booked activities:', error);
        setErrorMessage('Failed to load booked activities.');
      }
    };

    fetchBookedActivities();
  }, []);

  const handleCancelBooking = async (activityName) => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert("You need to log in to cancel an activity.");
      return;
    }

    try {
      const response = await axios.put('/deleteBookedActivity', {
        touristUsername: username,
        activityName
      });

      alert(response.data.msg);
      // Update the booked activities after cancellation
      setBookedActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.Name !== activityName)
      );
    } catch (error) {
      alert(error.response?.data?.msg || 'Error canceling the activity.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Booked Activities
        </Typography>
        {errorMessage ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : (
          <Box sx={styles.listContainer}>
            {bookedActivities.length > 0 ? (
              bookedActivities.map((activity) => (
                <Box key={activity._id} sx={styles.item}>
                  <Typography variant="body1"><strong>Name:</strong> {activity.Name?.toString() || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Date:</strong> {activity.Date ? new Date(activity.Date).toLocaleDateString() : "N/A"}</Typography>
                  <Typography variant="body2"><strong>Price:</strong> ${activity.Price?.toString() || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {activity.Location?.address ? (<>{activity.Location.address}<br />Coordinates: [{activity.Location.coordinates[1]}, {activity.Location.coordinates[0]}]</>) : (`Coordinates: [${activity.Location?.coordinates[1]}, ${activity.Location?.coordinates[0]}]`)}</Typography>
                  
                  {/* Cancel Booking Button */}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelBooking(activity.Name)}
                    sx={{ marginTop: '8px' }}
                  >
                    Cancel Booking
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No booked activities found.</Typography>
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
    mt: 2, backgroundColor: '#00c853', color: 'white', '&:hover': { backgroundColor: '#69f0ae' },
  },
};

export default TouristBookedActivitiesModal;
