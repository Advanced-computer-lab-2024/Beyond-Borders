import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function CompletedActivity({ currency,onClose  }) {
  const [completedActivities, setCompletedActivities] = useState([]);
  const [activityRatings, setActivityRatings] = useState({});
  const [activityComments, setActivityComments] = useState({});
  const [isCommentEnabled, setIsCommentEnabled] = useState({});
  const [convertedPrices, setConvertedPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedActivities = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.get(`/api/viewMyCompletedActivities`, { params: { Username: username } });
        setCompletedActivities(response.data);
      } catch (error) {
        console.error('Error fetching completed activities:', error);
      }
    };
    fetchCompletedActivities();
  }, []);

  // Convert activity prices whenever the currency changes
  useEffect(() => {
    const convertActivityPrices = async () => {
      const newConvertedPrices = {};
      await Promise.all(
        completedActivities.map(async (activity) => {
          try {
            const response = await axios.post('/convertCurr', {
              priceEgp: activity.Price,
              targetCurrency: currency,
            });
            newConvertedPrices[activity._id] = response.data.convertedPrice;
          } catch (error) {
            console.error(`Error converting price for activity ${activity.Name}:`, error);
          }
        })
      );
      setConvertedPrices(newConvertedPrices);
    };

    if (currency !== 'EGP') {
      convertActivityPrices();
    }
  }, [currency, completedActivities]);

  const handleRateActivity = async (activityName) => {
    const touristUsername = localStorage.getItem('username');
    const ratingValue = parseInt(activityRatings[activityName], 10);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Rating must be a number between 1 and 5.");
      return;
    }

    try {
      const response = await axios.put('/rateCompletedActivity', {
        touristUsername,
        activityName,
        rating: ratingValue,
      });
      alert(response.data.msg);

      const updatedActivities = completedActivities.map(activity =>
        activity.Name === activityName
          ? { ...activity, Rating: response.data.newAverageRating }
          : activity
      );
      setCompletedActivities(updatedActivities);
      setIsCommentEnabled((prev) => ({ ...prev, [activityName]: true }));
    } catch (error) {
      console.error('Error rating activity:', error);
      alert('An error occurred while submitting your rating.');
    }
  };

  const handleCommentActivity = async (activityName) => {
    const touristUsername = localStorage.getItem('username');
    const comment = activityComments[activityName]?.trim();

    if (!comment || comment.length === 0) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.put('/commentOnActivity', {
        touristUsername,
        activityName,
        comment,
      });
      alert(response.data.msg);

      setActivityComments(prevComments => ({ ...prevComments, [activityName]: '' }));
    } catch (error) {
      console.error('Error commenting on activity:', error);
      alert('An error occurred while submitting your comment.');
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Completed Activities
        </Typography>

        <Box sx={styles.listContainer}>
          {completedActivities.length > 0 ? (
            completedActivities.map(activity => (
              <Box key={activity._id} sx={styles.item}>
                <Typography variant="body1"><strong>Name:</strong> {activity.Name}</Typography>
                <Typography variant="body2"><strong>Date:</strong> {new Date(activity.Date).toLocaleDateString()}</Typography>
                <Typography variant="body2"><strong>Time:</strong> {activity.Time}</Typography>
                <Typography variant="body2"><strong>Advertiser Name:</strong> {activity.AdvertiserName}</Typography>
                <Typography variant="body2"><strong>Special Discount:</strong> {activity.SpecialDiscount}</Typography>
                <Typography variant="body2">
                  <strong>Price:</strong> {currency === 'EGP' ? `${activity.Price} EGP` : `${convertedPrices[activity._id] || 'Loading...'} ${currency}`}
                </Typography>
                <Typography variant="body2"><strong>Category:</strong> {activity.Category}</Typography>
                <Typography variant="body2"><strong>Current Activity Rating:</strong> {activity.Rating || 'Not rated yet'}</Typography>
                <Typography variant="body2"><strong>Booking Open:</strong> {activity.BookingOpen ? 'Yes' : 'No'}</Typography>
                <Typography variant="body2"><strong>Is Booked:</strong> {activity.isBooked ? 'Yes' : 'No'}</Typography>

                <Typography variant="body2"><strong>Location:</strong> {activity.Location?.address || 'No address available'}</Typography>
                {activity.Location?.coordinates && (
                  <Typography variant="body2">
                    <strong>Coordinates:</strong> {activity.Location.coordinates.join(', ')}
                  </Typography>
                )}
                
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    label="Rate this Activity"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={activityRatings[activity.Name] || ''}
                    onChange={(e) => setActivityRatings({ ...activityRatings, [activity.Name]: e.target.value })}
                    inputProps={{ min: 1, max: 5 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleRateActivity(activity.Name)}
                    sx={styles.rateButton}
                  >
                    Submit Activity Rating
                  </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Comment on Activity"
                    variant="outlined"
                    size="small"
                    multiline
                    fullWidth
                    disabled={!isCommentEnabled[activity.Name]}
                    value={activityComments[activity.Name] || ''}
                    onChange={(e) => setActivityComments({ ...activityComments, [activity.Name]: e.target.value })}
                    rows={3}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleCommentActivity(activity.Name)}
                    sx={styles.commentButton}
                    disabled={!isCommentEnabled[activity.Name]}
                  >
                    Submit Comment
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No completed activities found.</Typography>
          )}
        </Box>

        <Button variant="contained" sx={styles.doneButton} onClick={onClose}>
          Done
        </Button>
      </Box>
    </Modal>
  );
}

CompletedActivity.propTypes = {
  currency: PropTypes.string.isRequired,
};

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
    backgroundColor: '#89CFF0',
    color: 'white',
    marginTop: '0.5rem',
    '&:hover': { backgroundColor: '#A7DFFF' },
  },
};

export default CompletedActivity;
