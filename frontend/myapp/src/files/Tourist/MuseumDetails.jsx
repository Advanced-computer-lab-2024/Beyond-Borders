// src/components/MuseumDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

function MuseumDetails() {
  const { museumName } = useParams(); // Get the museum name from the route parameter
  const [museum, setMuseum] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMuseumDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/museum/details/${encodeURIComponent(museumName)}`);
        setMuseum(response.data);
      } catch (error) {
        console.error('Error fetching museum details:', error);
        setError('Museum not found or an error occurred.');
      }
    };

    fetchMuseumDetails();
  }, [museumName]);

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!museum) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{museum.name}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {museum.description}</Typography>
      <Typography variant="body1"><strong>Pictures:</strong> {museum.pictures?.join(', ') || 'No pictures available'}</Typography>
      <Typography variant="body1"><strong>Location:</strong> {museum.location?.address || 'Location not specified'}</Typography>
      <Typography variant="body1"><strong>Opening Hours:</strong> {museum.openingHours || 'Not available'}</Typography>
      <Typography variant="body1"><strong>Ticket Prices:</strong></Typography>
      <ul>
        <li>Foreigner: {museum.ticketPrices?.foreigner || 'N/A'}</li>
        <li>Native: {museum.ticketPrices?.native || 'N/A'}</li>
        <li>Student: {museum.ticketPrices?.student || 'N/A'}</li>
      </ul>
      
    </Box>
  );
}

export default MuseumDetails;
