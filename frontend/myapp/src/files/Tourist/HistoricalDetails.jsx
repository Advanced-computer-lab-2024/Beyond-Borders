import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

function HistoricalDetails() {
  const { HPname } = useParams(); // Get the historical place name from the route parameter
  const [historicalPlace, setHistoricalPlace] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Requested Historical Place Name:", HPname); // Log the parameter

    const fetchHistoricalPlaceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/historicalPlace/details/${encodeURIComponent(HPname)}`);
        console.log("Fetched Data:", response.data); // Log the fetched data
        setHistoricalPlace(response.data);
      } catch (error) {
        console.error('Error fetching historical place details:', error);
        setError('Historical place not found or an error occurred.');
      }
    };

    fetchHistoricalPlaceDetails();
  }, [HPname]);

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!historicalPlace) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{historicalPlace.name}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {historicalPlace.description}</Typography>
      <Typography variant="body1"><strong>Pictures:</strong> {historicalPlace.pictures?.join(', ') || 'No pictures available'}</Typography>
      <Typography variant="body1"><strong>Location:</strong> {historicalPlace.location?.address || 'Location not specified'}</Typography>
      <Typography variant="body1"><strong>Opening Hours:</strong> {historicalPlace.openingHours || 'Not available'}</Typography>
      <Typography variant="body1"><strong>Ticket Prices:</strong></Typography>
      <ul>
        <li>Foreigner: {historicalPlace.ticketPrices?.foreigner || 'N/A'}</li>
        <li>Native: {historicalPlace.ticketPrices?.native || 'N/A'}</li>
        <li>Student: {historicalPlace.ticketPrices?.student || 'N/A'}</li>
      </ul>
      
    </Box>
  );
}

export default HistoricalDetails;
