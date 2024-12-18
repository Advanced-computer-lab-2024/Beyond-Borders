// src/files/Tourist/CompletedMuseums.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function CompletedMuseums({ currency, onClose }) {
  const [completedMuseums, setCompletedMuseums] = useState([]);
  const [museumRatings, setMuseumRatings] = useState({});
  const [museumComments, setMuseumComments] = useState({}); // New state for comments
  const [isCommentEnabled, setIsCommentEnabled] = useState({});
  const [convertedPrices, setConvertedPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedMuseums = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.get(`/api/viewMyCompletedMuseums`, { params: { Username: username } });
        setCompletedMuseums(response.data);
      } catch (error) {
        console.error('Error fetching completed museums:', error);
      }
    };
    fetchCompletedMuseums();
  }, []);

  // Fetch converted prices when currency changes
  useEffect(() => {
    const convertMuseumPrices = async () => {
      const newConvertedPrices = {};

      await Promise.all(
        completedMuseums.map(async (museum) => {
          try {
            const [foreignerResponse, nativeResponse, studentResponse] = await Promise.all([
              axios.post('/convertCurr', {
                priceEgp: museum.ticketPrices?.foreigner || 0,
                targetCurrency: currency,
              }),
              axios.post('/convertCurr', {
                priceEgp: museum.ticketPrices?.native || 0,
                targetCurrency: currency,
              }),
              axios.post('/convertCurr', {
                priceEgp: museum.ticketPrices?.student || 0,
                targetCurrency: currency,
              }),
            ]);

            newConvertedPrices[museum._id] = {
              foreigner: foreignerResponse.data.convertedPrice,
              native: nativeResponse.data.convertedPrice,
              student: studentResponse.data.convertedPrice,
            };
          } catch (error) {
            console.error(`Error converting prices for ${museum.name}:`, error);
          }
        })
      );

      setConvertedPrices(newConvertedPrices);
    };

    if (currency !== 'EGP') {
      convertMuseumPrices();
    }
  }, [currency, completedMuseums]);

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
      setIsCommentEnabled((prev) => ({ ...prev, [museumName]: true }));
    } catch (error) {
      console.error('Error rating museum:', error);
      alert('An error occurred while submitting your rating.');
    }
  };


  const handleCommentMuseum = async (museumName) => {
    const touristUsername = localStorage.getItem('username');
    const comment = museumComments[museumName]?.trim();

    if (!comment || comment.length === 0) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.put('/commentOnMuseum', {
        touristUsername,
        museumName,
        comment,
      });
      alert(response.data.msg);

      // Clear the comment field after submission
      setMuseumComments(prevComments => ({ ...prevComments, [museumName]: '' }));
    } catch (error) {
      console.error('Error commenting on museum:', error);
      alert('An error occurred while submitting your comment.');
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
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
                <Typography variant="body2">
                  <strong>Ticket Prices:</strong> 
                  Foreigner: {currency === 'EGP' ? `${museum.ticketPrices?.foreigner || 0} EGP` : `${convertedPrices[museum._id]?.foreigner || 'Loading...'} ${currency}`}, 
                  Native: {currency === 'EGP' ? `${museum.ticketPrices?.native || 0} EGP` : `${convertedPrices[museum._id]?.native || 'Loading...'} ${currency}`}, 
                  Student: {currency === 'EGP' ? `${museum.ticketPrices?.student || 0} EGP` : `${convertedPrices[museum._id]?.student || 'Loading...'} ${currency}`}
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
                {/* Comment Input for Museum */}
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Comment on Museum"
                    variant="outlined"
                    size="small"
                    multiline
                    fullWidth
                    disabled={!isCommentEnabled[museum.name]} // Disable until rating is submitted
                    value={museumComments[museum.name] || ''}
                    onChange={(e) => setMuseumComments({ ...museumComments, [museum.name]: e.target.value })}
                    rows={3}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleCommentMuseum(museum.name)}
                    sx={styles.commentButton}
                    disabled={!isCommentEnabled[museum.name]} // Disable button until rating is submitted
                  >
                    Submit Comment
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No completed museums found.</Typography>
          )}
        </Box>
        <Button variant="contained" sx={styles.doneButton} onClick={onClose}>
          Done
        </Button>
      </Box>
    </Modal>
  );
}


CompletedMuseums.propTypes = {
  currency: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
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
    backgroundColor: '#89CFF0', // Baby blue for comments
    color: 'white',
    marginTop: '0.5rem',
    '&:hover': { backgroundColor: '#A7DFFF' }, // Lighter blue on hover
  },
};

export default CompletedMuseums;
