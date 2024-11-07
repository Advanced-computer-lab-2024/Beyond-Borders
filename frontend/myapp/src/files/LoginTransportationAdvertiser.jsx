import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const LoginTransportationAdvertiser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    setResponseMessage('');

    try {
      const response = await axios.post('http://localhost:8000/loginTransportationAdvertiser', formData);
      const result = response.data;
        
      if (response.status === 200) {
        setResponseMessage('Login successful! Redirecting...');
        localStorage.setItem('username', formData.username);

        
        setTimeout(() => {
          window.location.href = '/HomePageTransportationAdvertiser'; // Adjust this route to your dashboard
        }, 2000);   
      } else {
        setResponseMessage(result.error || 'Failed to log in.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
      console.error('Error logging in:', error);
    }
  };

  return (
    <Box
      className="container"
      sx={{
        maxWidth: '400px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        marginTop: '100px',
      }}
    >
      <h2>Login as Transportation Advertiser</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          name="username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
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
            cursor: 'pointer',
            width: '100%',
            '&:hover': {
              backgroundColor: '#218838',
            },
          }}
        >
          Login
        </Button>
      </form>
      <div
        className="message"
        style={{
          marginTop: '20px',
          textAlign: 'center',
          color: responseMessage && responseMessage.includes('Error') ? 'red' : 'green',
        }}
      >
        {responseMessage}
      </div>
    </Box>
  );
};

export default LoginTransportationAdvertiser;
