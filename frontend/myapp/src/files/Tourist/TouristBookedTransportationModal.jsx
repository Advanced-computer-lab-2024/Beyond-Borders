import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristBookedTransportationModal({ currency, onClose }) {
  const [bookedTransportation, setBookedTransportation] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [convertedPrices, setConvertedPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookedTransportation = async () => {
      const touristUsername = localStorage.getItem('username');
      if (!touristUsername) {
        setErrorMessage("Please log in to view your booked transportation.");
        return;
      }

      try {
        const response = await axios.get('/api/viewMyBookedTransportation', {
          params: { Username: touristUsername },
        });
        setBookedTransportation(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || "An error occurred while fetching booked transportation.");
      }
    };

    fetchBookedTransportation();
  }, []);
  useEffect(() => {
    if (currency !== 'EGP') {
        convertTransportationPrices();
    }
}, [currency, bookedTransportation]);


const convertTransportationPrices = async () => {
  const newConvertedPrices = {};

  await Promise.all(
    bookedTransportation.map(async (transportation) => {
          try {
              const response = await axios.post('/convertCurr', {
                  priceEgp: transportation.price || 0,
                  targetCurrency: currency,
              });

              newConvertedPrices[transportation._id] = response.data.convertedPrice;
          } catch (error) {
              console.error(`Error converting price for ${transportation.serviceName}:`, error);
          }
      })
  );

  setConvertedPrices(newConvertedPrices);
};


  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Booked Transportation
        </Typography>
        {errorMessage ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : (
          <Box sx={styles.listContainer}>
            {bookedTransportation.length > 0 ? (
              bookedTransportation.map((transport) => (
                <Box key={transport._id} sx={styles.item}>
                  <Typography variant="body1"><strong>Service Name:</strong> {transport.serviceName || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Advertiser Name:</strong> {transport.advertiserName || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Service Type:</strong> {transport.serviceType || "N/A"}</Typography>
                  <Typography variant="body2">
                                <strong>Price:</strong> {currency === 'EGP' ? `${transport.price || 0} EGP` : `${convertedPrices[transport._id] || 'Loading...'} ${currency}`}
                            </Typography>
                  <Typography variant="body2"><strong>Capacity:</strong> {transport.capacity || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Available:</strong> {transport.available ? 'Yes' : 'No'}</Typography>
                  <Typography variant="body2"><strong>Route:</strong> {transport.routeDetails?.startLocation} to {transport.routeDetails?.endLocation}</Typography>
                  
                  <Typography variant="body2"><strong>Schedule:</strong></Typography>
                  {transport.schedule.length > 0 ? (
                    transport.schedule.map((schedule, index) => (
                      <Box key={index} sx={{ pl: 2 }}>
                        <Typography variant="body2">Day: {schedule.day}</Typography>
                        <Typography variant="body2">Departure: {schedule.departureTime}</Typography>
                        <Typography variant="body2">Arrival: {schedule.arrivalTime}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2">No schedule available.</Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography>No booked transportation found.</Typography>
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
    display: 'flex', flexDirection: 'column', gap: 1,
  },
  doneButton: {
    mt: 2, backgroundColor: '#00c853', color: 'white', '&:hover': { backgroundColor: '#69f0ae' },
  },
};

export default TouristBookedTransportationModal;
