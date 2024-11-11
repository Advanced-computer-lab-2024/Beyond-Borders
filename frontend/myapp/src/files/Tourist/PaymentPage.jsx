// src/files/Tourist/PaymentPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import axios from 'axios';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, name, totalCost } = location.state || {};

  const handlePayment = async () => {
    const touristUsername = localStorage.getItem('username');
    if (!touristUsername) {
      alert("Please log in to make a payment.");
      return;
    }

    try {
        const endpoint = type === 'historicalPlace' ? '/payHP' : type === 'museum' ? '/payMuseum' : type === 'itinerary' ? '/payItinerary' : '/payActivity';      const payload = {
        touristUsername,
        activityName: type === 'activity' ? name : undefined,
        museumName: type === 'museum' ? name : undefined,
        HPName: type === 'historicalPlace' ? name :undefined,
        ItineraryName: type === 'itinerary' ? name :undefined
      };

      const response = await axios.put(endpoint, payload);

      if (response.status === 200) {
        alert(`Payment successful! Remaining Wallet Balance: ${response.data.remainingWallet}`);
        console.log(`Points: ${response.data.Points}, Badge Level: ${response.data.BadgeLevelOfPoints}`);
        navigate('/touristHome');
      } else {
        alert(response.data.msg || 'Failed to complete payment.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred while processing the payment.');
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h5">Payment Page</Typography>
      <Typography variant="body1">
        You are about to pay for a {type} booking: <strong>{name}</strong>
      </Typography>
      <Typography variant="body1">Total Cost: {totalCost}</Typography>
      <Button variant="contained" onClick={handlePayment} sx={styles.payButton}>
        Pay
      </Button>
      <Button variant="outlined" onClick={() => navigate('/touristHome')} sx={styles.cancelButton}>
        Cancel
      </Button>
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    mt: 4,
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 3,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': { backgroundColor: '#388E3C' },
  },
  cancelButton: {
    mt: 2,
  },
};

export default PaymentPage;
