import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const RegisterSeller = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Username: '',
        Password: '',
        Name: '',
        Description: '',
      });

  const [responseMessage, setResponseMessage] = useState('');

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
        // Send the POST request to register the tour guide
        const response = await axios.post('http://localhost:8000/addUnregisteredSeller', formData);
        const result = response.data; // Access the response data

        // Check if the response is successful
        if (response.status === 200) { // Assuming a 200 status indicates success
            setResponseMessage('Seller registered successfully!');

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/loginSeller'; // Redirect to login page
            }, 2000);
        } else {
            // Handle error case if the response doesn't indicate success
            setResponseMessage(`Error: ${result.error || 'Failed to register Seller.'}`);
        }
    } catch (error) {
        // Handle Axios errors
        if (error.response && error.response.data) {
            setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
        } else {
            setResponseMessage('An error occurred. Please try again.');
        }
        console.error('Error registering seller:', error); // Log the error for debugging
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
      <Typography variant="h4" align="center">Register Seller</Typography>
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
          label="Name"
          name="Name"
          required
          value={formData.Name}
          onChange={handleChange}
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="Description"
          value={formData.Description}
          onChange={handleChange}
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
        <Typography variant="body1" align="center" sx={{ marginTop: '20px', color: responseMessage.includes('Error') ? 'red' : 'green' }}>
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterSeller;
