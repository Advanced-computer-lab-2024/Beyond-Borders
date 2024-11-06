// src/components/ItineraryDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

function ItineraryDetails() {
  const { itineraryName } = useParams(); // Get the itinerary name from the route parameter
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Requested Itinerary Name:", itineraryName); // Log the parameter

    const fetchItineraryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/itinerary/details/${encodeURIComponent(itineraryName)}`);
        console.log("Fetched Data:", response.data); // Log the fetched data
        setItinerary(response.data);
      } catch (error) {
        console.error('Error fetching itinerary details:', error);
        setError('Itinerary not found or an error occurred.');
      }
    };

    fetchItineraryDetails();
  }, [itineraryName]);

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!itinerary) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{itinerary.Title}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {itinerary.description}</Typography>
      <Typography variant="body1">
        <strong>Activities:</strong> {Array.isArray(itinerary.Activities) ? itinerary.Activities.join(', ') : 'No activities listed'}
      </Typography>
      <Typography variant="body1"><strong>Price:</strong> ${itinerary.Price}</Typography>
      <Typography variant="body1"><strong>Language:</strong> {itinerary.Language}</Typography>
      <Typography variant="body1">
        <strong>Locations:</strong> {Array.isArray(itinerary.Locations) ? itinerary.Locations.join(', ') : 'Locations not specified'}
      </Typography>
      <Typography variant="body1"><strong>Timeline:</strong> {itinerary.Timeline || 'Timeline not available'}</Typography>
      <Typography variant="body1"><strong>Pickup Location:</strong> {itinerary.pickupLocation || 'Not provided'}</Typography>
      <Typography variant="body1"><strong>Dropoff Location:</strong> {itinerary.dropoffLocation || 'Not provided'}</Typography>
      <Typography variant="body1"><strong>Accessibility:</strong> {itinerary.accessibility ? 'Yes' : 'No'}</Typography>
      <Typography variant="body1"><strong>Author:</strong> {itinerary.AuthorUsername || 'Not specified'}</Typography>
      <Typography variant="body1"><strong>Tags:</strong> {Array.isArray(itinerary.Tags) ? itinerary.Tags.join(', ') : 'No tags available'}</Typography>
      <Typography variant="body1"><strong>Date of Event:</strong> {new Date(itinerary.Date).toLocaleDateString()}</Typography>
    </Box>
  );
}

export default ItineraryDetails;
