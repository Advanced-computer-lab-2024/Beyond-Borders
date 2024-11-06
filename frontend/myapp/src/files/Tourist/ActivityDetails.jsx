// src/components/ActivityDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

function ActivityDetails() {
  const { activityName } = useParams(); // Get the activity name from the route parameter
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Requested Activity Name:", activityName); // Log the parameter

    const fetchActivityDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/activity/details/${encodeURIComponent(activityName)}`);
        console.log("Fetched Data:", response.data); // Log the fetched data
        setActivity(response.data);
      } catch (error) {
        console.error('Error fetching activity details:', error);
        setError('Activity not found or an error occurred.');
      }
    };

    fetchActivityDetails();
  }, [activityName]);

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!activity) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{activity.Name}</Typography>
      <Typography variant="body1"><strong>Advertiser:</strong> {activity.AdvertiserName || 'Not specified'}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {activity.Description || 'No description available'}</Typography>
      <Typography variant="body1"><strong>Pictures:</strong> {activity.Pictures?.join(', ') || 'No pictures available'}</Typography>
      
      {/* Location details */}
      <Typography variant="body1"><strong>Location:</strong> 
        {activity.Location?.address ? activity.Location.address : 'Location not specified'}
      </Typography>
      {activity.Location?.coordinates && (
        <Typography variant="body1">
          <strong>Coordinates:</strong> Lat: {activity.Location.coordinates[0]}, Lon: {activity.Location.coordinates[1]}
        </Typography>
      )}
      
      {/* Date and Time */}
      <Typography variant="body1"><strong>Date:</strong> {activity.Date ? new Date(activity.Date).toLocaleDateString() : 'Not available'}</Typography>
      <Typography variant="body1"><strong>Time:</strong> {activity.Time || 'Not available'}</Typography>
      
      {/* Additional Details */}
      <Typography variant="body1"><strong>Special Discount:</strong> {activity.SpecialDiscount || 'No discount available'}</Typography>
      <Typography variant="body1"><strong>Booking Open:</strong> {activity.BookingOpen ? 'Yes' : 'No'}</Typography>
      <Typography variant="body1"><strong>Is Booked:</strong> {activity.isBooked ? 'Yes' : 'No'}</Typography>
      
      {/* Price and Rating */}
      <Typography variant="body1"><strong>Price:</strong> ${activity.Price || 'N/A'}</Typography>
      <Typography variant="body1"><strong>Rating:</strong> {activity.Rating || 'No rating available'}</Typography>
      <Typography variant="body1"><strong>Category:</strong> {activity.Category || 'No category specified'}</Typography>
    </Box>
  );
}

export default ActivityDetails;
