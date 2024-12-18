import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const RegisterTourist = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    Email: '',
    Username: '',
    Password: '',
    MobileNumber: '',
    DoB: '',
    Nationality: '',
    Occupation: '',
    Wallet: 0, // Initialize wallet to 0
  });

  const [responseMessage, setResponseMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setResponseMessage(''); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:8000/addTourist', formData);
      const result = response.data; // Access the response data

      if (result.user) {
        localStorage.setItem('touristId', result.user._id); // Store the ID
        localStorage.setItem('touristData', JSON.stringify(result.user)); // Store the full data
        setResponseMessage('Tourist registered successfully!');

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = `/`; // Redirect to login page
        }, 2000);
      } else {
        setResponseMessage(`Error: ${result.error || 'Failed to register tourist.'}`);
      }
    } catch (error) {
      // Handle Axios errors
      if (error.response && error.response.data) {
        setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
      console.error('Error registering tourist:', error); // Log the error for debugging
    }
  };

  return (
    <Box
      className="container"
      sx={{
        maxWidth: '600px',
        margin: 'auto',
        //background: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" align="center">Register Tourist</Typography>
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
          name="MobileNumber"
          required
          value={formData.MobileNumber}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date of Birth"
          type="date"
          name="DoB"
          required
          value={formData.DoB}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Nationality"
          name="Nationality"
          required
          value={formData.Nationality}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Occupation"
          name="Occupation"
          value={formData.Occupation}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Wallet Amount"
          type="number"
          name="Wallet"
          value={formData.Wallet} // Display wallet amount
          readOnly // Make the wallet input readonly
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
          }}
        >
          Register
        </Button>
      </form>
      {responseMessage && (
        <Typography
          variant="body1"
          align="center"
          sx={{
            marginTop: '20px',
            color: responseMessage.includes('Error') ? 'red' : 'green',
          }}
        >
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterTourist;
