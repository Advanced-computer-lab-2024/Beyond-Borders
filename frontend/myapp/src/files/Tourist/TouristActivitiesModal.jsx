// src/files/Tourist/TouristActivitiesModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristActivitiesModal() {
  const [activities, setActivities] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/ViewAllUpcomingActivities');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, []);

  const handleSearchActivities = async () => {
    try {
      const response = await axios.post('/api/ActivitiesSearchAll', { searchString: searchKeyword });
      setActivities(response.data);
    } catch (error) {
      console.error('Error searching activities:', error);
    }
  };

  const handleFilterActivities = async () => {
    try {
      const response = await axios.post('/api/filterActivities', {
        Category: category || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        InputDate: date || undefined,
        Rating: rating ? parseInt(rating) : undefined
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Error filtering activities:', error);
    }
  };

  const sortActivitiesByPrice = (order) => {
    const sortedActivities = [...activities].sort((a, b) => {
      return order === 'asc' ? a.Price - b.Price : b.Price - a.Price;
    });
    setActivities(sortedActivities);
  };

  const sortActivitiesByRating = (order) => {
    const sortedActivities = [...activities].sort((a, b) => {
      return order === 'asc' ? a.Rating - b.Rating : b.Rating - a.Rating;
    });
    setActivities(sortedActivities);
  };

  // Function to handle sharing the activity link
  const handleShare = async (activityName) => {
    try {
      const frontendLink = `http://localhost:3000/activity/details/${encodeURIComponent(activityName)}`;

      // Send request to the backend to generate a link
      const response = await axios.post('/getCopyLink', {
        entityType: 'activity', // Use "activity" entity type
        entityName: activityName,
        email: 'farahabouelwafaa@gmail.com' // Hardcoded email
      });
      const { msg } = response.data;

      // Copy the frontend link to the clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(frontendLink)
          .then(() => alert(`Link copied to clipboard successfully!\n${msg}`))
          .catch(err => alert(`Failed to copy link: ${err}`));
      } else {
        alert(`Here is the link to share: ${frontendLink}\n${msg}`);
      }
    } catch (error) {
      console.error('Error sharing link:', error);
      alert('An error occurred while generating the share link.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          Upcoming Activities
        </Typography>

        {/* Search, Filter, and Sort Controls */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <TextField label="Search Activities" variant="outlined" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
          <Button variant="contained" onClick={handleSearchActivities} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>Search</Button>
          <TextField label="Category" variant="outlined" value={category} onChange={(e) => setCategory(e.target.value)} />
          <TextField label="Min Price" variant="outlined" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <TextField label="Max Price" variant="outlined" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          <TextField label="Date" variant="outlined" type="date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Rating" variant="outlined" type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
          <Button variant="contained" onClick={handleFilterActivities} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>Apply Filter</Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => sortActivitiesByPrice('asc')} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>Sort by Price (Ascending)</Button>
            <Button variant="contained" onClick={() => sortActivitiesByPrice('desc')} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>Sort by Price (Descending)</Button>
            <Button variant="contained" onClick={() => sortActivitiesByRating('asc')} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>Sort by Rating (Ascending)</Button>
            <Button variant="contained" onClick={() => sortActivitiesByRating('desc')} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>Sort by Rating (Descending)</Button>
          </Box>
        </Box>

        {/* Activity Listing */}
        <Box sx={styles.listContainer}>
          {activities.length > 0 ? (
            activities.map(activity => (
              <Box key={activity.id} sx={styles.item}>
                <Typography variant="body1"><strong>Name:</strong> {activity.Name}</Typography>
                <Typography variant="body2"><strong>Date:</strong> {new Date(activity.Date).toLocaleDateString()}</Typography>
                <Typography variant="body2"><strong>Price:</strong> ${activity.Price}</Typography>
                <Typography variant="body2"><strong>Rating:</strong> {activity.Rating}</Typography>

                {/* Share Button */}
                <Button
                  variant="outlined"
                  onClick={() => handleShare(activity.Name)}
                  sx={styles.shareButton}
                >
                  Share
                </Button>
              </Box>
            ))
          ) : (
            <Typography>No activities found.</Typography>
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
  shareButton: {
    mt: 1,
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': { backgroundColor: '#63a4ff' },
  },
};

export default TouristActivitiesModal;
