import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, TextField } from '@mui/material';

const LoginAdvertiser = () => {
  // State to manage form inputs and response message
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
    
    console.log("Form Data:", formData); // Log the form data for debugging
  
    try {
      const response = await axios.post('http://localhost:8000/loginAdvertiser', formData);
      const result = response.data; // Access the response data
  
      // Check if login was successful
      if (response.status === 200) { // Assuming 200 status indicates success
        // Save the username in local storage
        localStorage.setItem('username', result.advertiser.Username);
        
        // Display a welcome message
        setResponseMessage(`Welcome, ${result.advertiser.Username}!`);
  
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = '/homePageAdvertiser'; // Make sure this matches the route in App.js
        }, 2000);
      } else {
        // Handle error case if the response doesn't indicate success
        setResponseMessage(`Error: ${result.error || 'Failed to log in.'}`);
      }
    } catch (error) {
      // Log the error response for debugging
      console.error('Error logging in:', error.response ? error.response.data : error.message);
  
      // Handle Axios errors
      if (error.response && error.response.data) {
        setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
    }
  };


  // fix
  

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
      <Typography variant="h4" align="center">Login Advertiser</Typography>
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

export default LoginAdvertiser;
