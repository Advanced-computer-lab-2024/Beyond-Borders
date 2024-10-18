import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const RegisterTourGuide = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Username: '',
    Password: '',
    MobileNum: '',
    YearsOfExperience: '',
    PreviousWork: '',
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(''); // Clear previous messages

    try {
      // Send the POST request to register the tour guide
      const response = await fetch('/addUnregisteredTourGuide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure formData is correctly structured
      });

      const result = await response.json(); // Parse the response

      // Check if the response is successful
      if (response.ok) {
        setResponseMessage('Tour Guide registered successfully!');
        setTimeout(() => {
          window.location.href = '/login'; // Redirect to login page
        }, 2000); // Redirect after 2 seconds
      } else {
        setResponseMessage(`Error: ${result.error || 'Failed to register tour guide.'}`);
      }
    } catch (error) {
      // Handle fetch errors
      setResponseMessage('An error occurred. Please try again.');
    }
  };

  return (
    <Box
      className="container"
      sx={{
        maxWidth: '600px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" align="center">Register Tour Guide</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          name="Email"
          required
          value={formData.Email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="Username"
          required
          value={formData.Username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="Password"
          required
          value={formData.Password}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mobile Number"
          name="MobileNum"
          required
          value={formData.MobileNum}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Years of Experience"
          type="number"
          name="YearsOfExperience"
          required
          value={formData.YearsOfExperience}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Previous Work"
          name="PreviousWork"
          value={formData.PreviousWork}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            width: '100%',
            '&:hover': { backgroundColor: '#218838' },
          }}
        >
          Register
        </Button>
      </form>
      {responseMessage && (
        <Typography variant="body1" align="center" sx={{ marginTop: '20px', color: responseMessage.includes('Error') ? 'red' : 'green' }}>
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterTourGuide;
