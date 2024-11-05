import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

function HotelSearchModal({ open, onClose }) {
  // States to hold search parameters and results
  const [searchKeywordHotel, setSearchKeywordHotel] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adults, setAdults] = useState('');
  const [loading, setLoading] = useState(false);
  const [hotelOffers, setHotelOffers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle hotel search
  const handleHotelSearch = async () => {
    if (!searchKeywordHotel || !checkInDate || !checkOutDate || !adults) {
      setErrorMessage('All fields are required.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Fetch hotels by city
      const responseByCity = await axios.post('/fetchHotelsByCity', { city: searchKeywordHotel });
      const hotelIds = responseByCity.data.map(hotel => hotel.id);

      // Fetch hotel offers based on additional parameters
      const responseByDetails = await axios.post('/fetchHotels', {
        checkInDate,
        checkOutDate,
        adults,
        ids: hotelIds
      });

      setHotelOffers(responseByDetails.data);
    } catch (error) {
      setErrorMessage('An error occurred while fetching hotels.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modalContainer}>
        <Typography variant="h6" sx={styles.modalTitle}>Hotel Search</Typography>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        {/* Search Input Fields */}
        <TextField
          label="City"
          variant="outlined"
          value={searchKeywordHotel}
          onChange={(e) => setSearchKeywordHotel(e.target.value)}
          fullWidth
          sx={styles.inputField}
        />
        <TextField
          label="Check-In Date"
          type="date"
          variant="outlined"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          fullWidth
          sx={styles.inputField}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Check-Out Date"
          type="date"
          variant="outlined"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          fullWidth
          sx={styles.inputField}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Adults"
          variant="outlined"
          type="number"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          fullWidth
          sx={styles.inputField}
        />

        <Button variant="contained" onClick={handleHotelSearch} sx={styles.searchButton}>
          {loading ? <CircularProgress size={24} color="secondary" /> : 'Search'}
        </Button>

        {/* Hotel Search Results */}
        {hotelOffers.length > 0 && (
          <Box sx={styles.resultsContainer}>
            <Typography variant="h6">Search Results</Typography>
            {hotelOffers.map((offer, index) => (
              <Box key={index} sx={styles.resultItem}>
                <Typography><strong>{offer.name}</strong></Typography>
                <Typography>Price: ${offer.price}</Typography>
                <Typography>{offer.description}</Typography>
                <Button onClick={() => console.log('Booking hotel', offer.id)}>Book Now</Button>
              </Box>
            ))}
          </Box>
        )}

        <Button variant="contained" onClick={onClose} sx={styles.doneButton}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}

// Styles
const styles = {
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    padding: 3,
    borderRadius: 2,
    boxShadow: 24,
  },
  modalTitle: {
    marginBottom: 2,
    textAlign: 'center',
  },
  inputField: {
    marginBottom: 2,
  },
  searchButton: {
    width: '100%',
    marginBottom: 2,
  },
  resultsContainer: {
    marginTop: 2,
    maxHeight: 300,
    overflowY: 'auto',
  },
  resultItem: {
    marginBottom: 2,
  },
  doneButton: {
    width: '100%',
    marginTop: 2,
  },
};

export default HotelSearchModal;
