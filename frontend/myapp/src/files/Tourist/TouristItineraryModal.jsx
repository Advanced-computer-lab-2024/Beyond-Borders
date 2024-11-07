// src/files/Tourist/TouristItineraryModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristItineraryModal({ currency }) {
  const [itineraries, setItineraries] = useState([]);
  const [email, setEmail] = useState('');
  const [convertedPrices, setConvertedPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('/api/ViewAllUpcomingItinerariesTourist');
        setItineraries(response.data);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };
    fetchItineraries();
  }, []);


  useEffect(() => {
    // Convert prices whenever currency changes
    const convertItineraryPrices = async () => {
      const newConvertedPrices = {};
      console.log(currency);
      await Promise.all(
        itineraries.map(async (itinerary) => {
          try {
            console.log(`Converting price for ${itinerary.Title}:`, {
              priceEgp: itinerary.Price,
              targetCurrency: currency
            });
            const response = await axios.post('/convertCurr', {
              priceEgp: itinerary.Price,
              targetCurrency: currency,
            });
            newConvertedPrices[itinerary.id] = response.data.convertedPrice;
            console.log(response.data.convertedPrice);
          } catch (error) {
            console.error(`Error converting price for itinerary ${itinerary.Title}:`, error);
          }
        })
      );
      setConvertedPrices(newConvertedPrices);
    };

    if (currency !== 'EGP') {
      convertItineraryPrices();
    }
  }, [currency, itineraries]);

  const handleShare = async (itineraryTitle) => {
    try {
      const frontendLink = `http://localhost:3000/itinerary/details/${encodeURIComponent(itineraryTitle)}`;
      const response = await axios.post('/getCopyLink', {
        entityType: 'itinerary',
        entityName: itineraryTitle,
        email: email
      });
      const { msg } = response.data;

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

  const handleBookItinerary = async (itinerary) => {
    const touristUsername = localStorage.getItem('username');
    if (!touristUsername) {
      alert("Please log in to book an itinerary.");
      return;
    }

    try {
      const response = await axios.put('/bookItinerary', {
        touristUsername,
        itineraryName: itinerary.Title
      });

      if (response.status === 201) {
        alert(`Itinerary booked successfully! Total Cost: $${response.data.totalCost}`);
        navigate('/PaymentPage', {
          state: {
            type: 'itinerary', // Specify type as itinerary
            name: itinerary.Title,
            totalCost: response.data.totalCost
          }
        });
      } else {
        alert(response.data.msg || 'Failed to book itinerary.');
      }
    } catch (error) {
      console.error('Error booking itinerary:', error);
      alert('An error occurred while booking the itinerary.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          Upcoming Itineraries
        </Typography>

        <Box sx={styles.listContainer}>
          {itineraries.map(itinerary => (
            <Box key={itinerary.id} sx={styles.item}>
              <Typography variant="body1"><strong>Title:</strong> {itinerary.Title}</Typography>
              <Typography variant="body2">
                <strong>Price:</strong> {currency === 'EGP' ? `${itinerary.Price} EGP` : `${convertedPrices[itinerary.id] || 'Loading...'} ${currency}`}
              </Typography>
              <Typography variant="body2"><strong>Language:</strong> {itinerary.Language}</Typography>
              
              <TextField
                label="Email for Sharing"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              <Button
                variant="outlined"
                onClick={() => handleShare(itinerary.Title)}
                sx={styles.shareButton}
              >
                Share
              </Button>

              <Button
                variant="contained"
                onClick={() => handleBookItinerary(itinerary)}
                sx={styles.bookButton}
              >
                Book
              </Button>
            </Box>
          ))}
        </Box>

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
  doneButton: {
    mt: 2,
    backgroundColor: '#00c853',
    color: 'white',
    '&:hover': { backgroundColor: '#69f0ae' },
  },
  shareButton: {
    mt: 1,
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': { backgroundColor: '#63a4ff' },
  },
  bookButton: {
    mt: 1,
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': { backgroundColor: '#388E3C' },
  },
};

export default TouristItineraryModal;
