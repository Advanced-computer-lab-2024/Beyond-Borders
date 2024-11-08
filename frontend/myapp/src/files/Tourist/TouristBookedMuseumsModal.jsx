import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function TouristBookedMuseumsModal({ currency, onClose }) {
  const [bookedMuseums, setBookedMuseums] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [convertedPrices, setConvertedPrices] = useState({});
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchBookedMuseums = async () => {
      const touristUsername = localStorage.getItem('username');
      if (!touristUsername) {
        setErrorMessage("Please log in to view your booked museums.");
        return;
      }

      try {
        const response = await axios.get('/api/viewMyBookedMuseums', {
          params: { Username: touristUsername },
        });
        setBookedMuseums(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || "An error occurred while fetching booked museums.");
      }
    };

    fetchBookedMuseums();
  }, []);

  useEffect(() => {
    const convertMuseumPrices = async () => {
      const newConvertedPrices = {};

      await Promise.all(
        bookedMuseums.map(async (museum) => {
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
  }, [currency, bookedMuseums]);

  const handleCancelBooking = async (museumName) => {
    const touristUsername = localStorage.getItem('username');
    if (!touristUsername) {
      setErrorMessage("Please log in to cancel a booking.");
      return;
    }

    try {
      const response = await axios.put('/deleteBookedMuseum', {
        touristUsername,
        museumName,
      });

      if (response.status === 200) {
        setErrorMessage(`Booking for ${museumName} canceled successfully.`);
        setBookedMuseums((prevMuseums) => prevMuseums.filter((museum) => museum.name !== museumName));
      } else {
        setErrorMessage(response.data.msg || 'Failed to cancel booking.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "An error occurred while canceling the booking.");
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Booked Museums
        </Typography>
        {errorMessage ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : (
          <Box sx={styles.listContainer}>
            {bookedMuseums.length > 0 ? (
              bookedMuseums.map((museum) => (
                <Box key={museum._id} sx={styles.item}>
                  <Typography variant="body1"><strong>Name:</strong> {museum.name || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Date:</strong> {museum.dateOfEvent ? new Date(museum.dateOfEvent).toLocaleDateString() : "N/A"}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {museum.location?.address || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Opening Hours:</strong> {museum.openingHours}</Typography>
                  <Typography variant="body2">
                    <strong>Ticket Prices:</strong><br />
                    Foreigner: {currency === 'EGP' ? `${museum.ticketPrices?.foreigner} EGP` : `${convertedPrices[museum._id]?.foreigner || 'Loading...'} ${currency}`}<br />
                    Native: {currency === 'EGP' ? `${museum.ticketPrices?.native} EGP` : `${convertedPrices[museum._id]?.native || 'Loading...'} ${currency}`}<br />
                    Student: {currency === 'EGP' ? `${museum.ticketPrices?.student} EGP` : `${convertedPrices[museum._id]?.student || 'Loading...'} ${currency}`}
                  </Typography>                
                  {/* Cancel Booking Button */}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelBooking(museum.name)}
                    sx={{ marginTop: '8px' }}
                  >
                    Cancel Booking
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No booked museums found.</Typography>
            )}
          </Box>
        )}
        <Button variant="contained" sx={styles.doneButton} onClick={onClose}>
          Done
        </Button>
      </Box>
    </Modal>
  );
}


TouristBookedMuseumsModal.propTypes = {
  currency: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

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
    display: 'flex', flexDirection: 'column', gap: 1,
  },
  doneButton: {
    mt: 2, backgroundColor: '#00c853', color: 'white', '&:hover': { backgroundColor: '#69f0ae' },
  },
};

export default TouristBookedMuseumsModal;
