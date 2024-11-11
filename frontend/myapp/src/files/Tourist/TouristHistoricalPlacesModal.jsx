// src/files/Tourist/TouristHistoricalPlacesModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristHistoricalPlacesModal({ currency, onClose }) {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [email, setEmail] = useState('');
  const [convertedPrices, setConvertedPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await axios.get('/api/ViewAllUpcomingHistoricalPlacesEventsTourist');
        setHistoricalPlaces(response.data);
      } catch (error) {
        console.error('Error fetching historical places:', error);
      }
    };
    fetchHistoricalPlaces();
  }, []);
  
  useEffect(() => {
    if (currency !== 'EGP') {
      convertHistoricalPlacePrices();
    }
  }, [currency, historicalPlaces]);

  const handleShare = async (placeName) => {
    try {
      const frontendLink = `http://localhost:3000/historicalPlace/details/${encodeURIComponent(placeName)}`;
      const response = await axios.post('/getCopyLink', {
        entityType: 'historicalPlace',
        entityName: placeName,
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

  const handleBookPlace = async (place) => {
    const touristUsername = localStorage.getItem('username');
    if (!touristUsername || !place) {
      alert("Please log in and select a historical place event to book.");
      return;
    }

    try {
      const response = await axios.put('/bookHistoricalPlace', {
        touristUsername,
        historicalPlaceName: place.name
      });

      if (response.status === 201) {
        alert(`Historical place event booked successfully!`);
        navigate('/PaymentPage', {
          state: {
            type: 'historicalPlace',
            name: place.name,
            totalCost: response.data.ticketPrice
          }
        });
      } else {
        alert(response.data.msg || 'Failed to book historical place event.');
      }
    } catch (error) {
      console.error('Error booking historical place event:', error);
      alert('An error occurred while booking the historical place event.');
    }
  };

  
  const convertHistoricalPlacePrices = async () => {
    const newConvertedPrices = {};

    await Promise.all(
      historicalPlaces.map(async (place) => {
        try {
          const [foreignerResponse, nativeResponse, studentResponse] = await Promise.all([
            axios.post('/convertCurr', {
              priceEgp: place.ticketPrices?.foreigner || 0,
              targetCurrency: currency,
            }),
            axios.post('/convertCurr', {
              priceEgp: place.ticketPrices?.native || 0,
              targetCurrency: currency,
            }),
            axios.post('/convertCurr', {
              priceEgp: place.ticketPrices?.student || 0,
              targetCurrency: currency,
            }),
          ]);

          newConvertedPrices[place._id] = {
            foreigner: foreignerResponse.data.convertedPrice,
            native: nativeResponse.data.convertedPrice,
            student: studentResponse.data.convertedPrice,
          };
        } catch (error) {
          console.error(`Error converting prices for ${place.name}:`, error);
        }
      })
    );

    setConvertedPrices(newConvertedPrices);
  };


  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          Upcoming Historical Places Events
        </Typography>

        <TextField
          label="Email for Sharing"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        <Box sx={styles.listContainer}>
          {historicalPlaces.map(place => (
            <Box key={place.id} sx={styles.item}>
              <Typography variant="body1"><strong>Name:</strong> {place.name}</Typography>
              <Typography variant="body2"><strong>Location:</strong> {place.location}</Typography>
              <Typography variant="body2"><strong>Opening Hours:</strong> {place.openingHours}</Typography>
              <Typography variant="body2">
              <strong>Ticket Prices:</strong> 
              Foreigner: {currency === 'EGP' ? `${place.ticketPrices?.foreigner || 0} EGP` : `${convertedPrices[place._id]?.foreigner || 'Loading...'} ${currency}`}, 
              Native: {currency === 'EGP' ? `${place.ticketPrices?.native || 0} EGP` : `${convertedPrices[place._id]?.native || 'Loading...'} ${currency}`}, 
              Student: {currency === 'EGP' ? `${place.ticketPrices?.student || 0} EGP` : `${convertedPrices[place._id]?.student || 'Loading...'} ${currency}`}
            </Typography>
          
             <Typography variant="body2"><strong>Author:</strong>{place.AuthorUsername}</Typography>
             <Typography variant="body2"><strong>Tags:</strong>{place.Tags}</Typography>
             <Typography variant="body2">
  <strong>Date:</strong> {new Date(Date.parse(place.dateOfEvent)).toLocaleDateString()}
</Typography>


           

              <Button
                variant="outlined"
                onClick={() => handleShare(place.name)}
                sx={styles.shareButton}
              >
                Share
              </Button>

              <Button
                variant="contained"
                onClick={() => handleBookPlace(place)}
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
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 500, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
  },
  listContainer: {
    maxHeight: 300, overflowY: 'auto', mt: 2,
  },
  item: {
    p: 2, borderBottom: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  doneButton: {
    mt: 2, backgroundColor: '#00c853', '&:hover': { backgroundColor: '#69f0ae' },
  },
  shareButton: {
    mt: 1, backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#63a4ff' },
  },
  bookButton: {
    mt: 1, backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#388E3C' },
  },
};

export default TouristHistoricalPlacesModal;
