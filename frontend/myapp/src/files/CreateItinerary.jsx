import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';

const CreateItinerary = () => {
  const [itineraryData, setItineraryData] = useState({
    title: '',
    activities: '',
    locations: '',
    timeline: '',
    language: '',
    price: '',
    date: '',
    accessibility: false,
    pickupLocation: '',
    dropoffLocation: '',
    tags: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItineraryData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const AuthorUsername = localStorage.getItem('username');
    if (!AuthorUsername) {
      alert('You need to log in first.');
      return;
    }

    const tagsArray = itineraryData.tags.split(',').map((tag) => tag.trim());
    const dataToSubmit = {
      AuthorUsername,
      Title: itineraryData.title,
      Date: itineraryData.date,
      Timeline: itineraryData.timeline,
      Price: itineraryData.price,
      Locations: itineraryData.locations,
      Activities: itineraryData.activities,
      accessibility: itineraryData.accessibility,
      pickupLocation: itineraryData.pickupLocation,
      dropoffLocation: itineraryData.dropoffLocation,
      Tags: tagsArray,
      Language: itineraryData.language
    };

    try {
      const response = await axios.post('/api/createItinerary', dataToSubmit);
      alert('Itinerary created successfully!');

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = `HomePageTourguide`;
      }, 500);

      // Clear form data
      setItineraryData({
        title: '',
        activities: '',
        locations: '',
        timeline: '',
        language: '',
        price: '',
        date: '',
        accessibility: false,
        pickupLocation: '',
        dropoffLocation: '',
        tags: ''
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '600px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" align="center" sx={{ marginBottom: '20px' }}>
        Create New Itinerary
      </Typography>
      {errorMessage && (
        <Typography variant="body2" color="error" sx={{ marginBottom: '10px' }}>
          {errorMessage}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Itinerary Title"
          name="title"
          value={itineraryData.title}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Activities (comma-separated)"
          name="activities"
          value={itineraryData.activities}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Locations (comma-separated)"
          name="locations"
          value={itineraryData.locations}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Timeline"
          name="timeline"
          value={itineraryData.timeline}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Language"
          name="language"
          value={itineraryData.language}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Price (USD)"
          name="price"
          type="number"
          value={itineraryData.price}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date"
          name="date"
          type="date"
          value={itineraryData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="Pickup Location"
          name="pickupLocation"
          value={itineraryData.pickupLocation}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Dropoff Location"
          name="dropoffLocation"
          value={itineraryData.dropoffLocation}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tags (comma-separated)"
          name="tags"
          value={itineraryData.tags}
          onChange={handleChange}
          required
        />
        <FormControlLabel
          control={
            <Switch
              name="accessibility"
              checked={itineraryData.accessibility}
              onChange={handleChange}
            />
          }
          label="Accessibility"
          sx={{ marginTop: '10px', marginBottom: '10px',marginLeft:'10px'}}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#192959',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            width: '100%',
            '&:hover': { backgroundColor: '#4b5a86' },
            marginTop: '20px',
          }}
        >
          Create Itinerary
        </Button>
      </form>
    </Box>
  );
};

export default CreateItinerary;
