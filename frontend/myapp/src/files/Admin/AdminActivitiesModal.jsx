import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminActivitiesModal() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null); // Track selected activity for flagging
  const navigate = useNavigate();

  // Fetch activities when component mounts
  useEffect(() => {
    fetchActivities();
  }, []);

  // Fetch all activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/viewAllActivitiesAdmin');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Method to flag the selected activity if not already flagged
  const flagActivity = async () => {
    if (!selectedActivity) return;

    if (selectedActivity.flagged) {
      alert("This activity is already flagged.");
      return;
    }

    try {
      // Send 'title' to match backend
      const response = await axios.post('/api/flagActivity', { title: selectedActivity.Name });
      if (response.status === 200) {
        alert(response.data.message);
        setActivities(activities.map(activity =>
          activity.Name === selectedActivity.Name ? { ...activity, flagged: true } : activity
        ));
        setSelectedActivity(null); // Clear selected activity after flagging
      }
    } catch (error) {
      console.error('Error flagging activity:', error);
      alert('An error occurred while flagging the activity.');
    }
  };

  return (
    <Box>
      {/* Activities List Modal */}
      <Modal open={true} onClose={() => navigate('/HomePageAdmin')}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6" component="h2">
            All Activities
          </Typography>
          <Box sx={styles.listContainer}>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <Box key={index} sx={styles.item}>
                  <Typography variant="body1"><strong>Activity Name:</strong> {activity.Name}</Typography>
                  <Typography variant="body2"><strong>Advertiser Name:</strong> {activity.AdvertiserName}</Typography>
                  <Typography variant="body2"><strong>Date:</strong> {new Date(activity.Date).toLocaleDateString()}</Typography>
                  <Typography variant="body2"><strong>Time:</strong> {activity.Time}</Typography>
                  <Typography variant="body2"><strong>Special Discount:</strong> {activity.SpecialDiscount || 'None'}</Typography>
                  <Typography variant="body2"><strong>Booking Open:</strong> {activity.BookingOpen ? 'Yes' : 'No'}</Typography>
                  <Typography variant="body2"><strong>Booked:</strong> {activity.isBooked ? 'Yes' : 'No'}</Typography>
                  <Typography variant="body2"><strong>Price:</strong> ${activity.Price}</Typography>
                  <Typography variant="body2"><strong>Rating:</strong> {activity.Rating}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {activity.Location?.address || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Category:</strong> {activity.Category}</Typography>
                  <Typography variant="body2"><strong>Tags:</strong> {activity.Tags.join(', ')}</Typography>
                  <Typography variant="body2"><strong>Flagged:</strong> {activity.flagged ? 'Yes' : 'No'}</Typography>

                  {/* Flag Button */}
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSelectedActivity(activity); // Set the activity to flag
                      flagActivity(); // Call the flag function
                    }}
                    sx={styles.flagButton}
                    disabled={activity.flagged} // Disable if already flagged
                  >
                    {activity.flagged ? 'Already Flagged' : 'Flag'}
                  </Button>

                  <Typography variant="body2"><strong>Comments:</strong></Typography>
                  {Array.isArray(activity.Comments) && activity.Comments.length > 0 ? (
                    activity.Comments.map((comment, idx) => (
                      <Box key={idx} sx={{ mt: 1, mb: 1, padding: '5px', borderBottom: '1px solid #ccc' }}>
                        <Typography variant="body2"><strong>Username:</strong> {comment.touristUsername || 'Anonymous'}</Typography>
                        <Typography variant="body2"><strong>Comment:</strong> {comment.Comment || 'No comment'}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2">No comments available</Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography>No activities found.</Typography>
            )}
          </Box>
          <Button variant="contained" sx={styles.doneButton} onClick={() => navigate('/HomePageAdmin')}>
            Done
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

const styles = {
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 600,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
  listContainer: {
    maxHeight: 450,
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
  flagButton: {
    mt: 1,
    backgroundColor: '#ff5722',
    color: 'white',
    '&:hover': { backgroundColor: '#ff8a50' },
  },
};

export default AdminActivitiesModal;
