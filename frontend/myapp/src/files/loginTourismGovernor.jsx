import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios'; // Import axios for making HTTP requests

const LoginTourismGovernor = () => {
  // State to manage form inputs and response messages
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
      const response = await axios.post('http://localhost:8000/loginGoverner', formData);
      const result = response.data; // Access the response data

      if (result.TourismGoverner) {
        localStorage.setItem('username', result.TourismGoverner.Username);
        setResponseMessage(`Welcome, ${result.TourismGoverner.Username}!`);
        setTimeout(() => {
          window.location.href = '/MuseumTG';
        }, 2000);
      } else {
        setResponseMessage(`Error: ${result.error || 'Failed to log in.'}`);
      }
      
    } catch (error) {
      // Handle Axios errors
      if (error.response && error.response.data) {
        setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
      console.error('Error logging in:', error); // Log the error for debugging
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
      <Typography variant="h4" align="center">Login Tourism Governor</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="password"
          required
          value={formData.password}
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
          Login
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

export default LoginTourismGovernor;
