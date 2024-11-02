import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const AdminAddAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { Username: username, Password: password };

    try {
      const response = await axios.post('/addAdmin', formData);

      if (response.status === 200) {
        setResponseMessage('Admin added successfully!');
        setTimeout(() => {
          window.location.href = `HomePageAdmin`;
        }, 900);
      } else {
        setResponseMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setResponseMessage(error.response?.data?.error || 'An error occurred. Please try again.');
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
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Typography variant="h4" align="center">Add Admin</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          placeholder="Enter username"
          name="username"
          required
          value={username}
          onChange={handleUsernameChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          placeholder="Enter password"
          name="password"
          required
          value={password}
          onChange={handlePasswordChange}
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
            fontSize: '16px',
            marginTop: '10px',
            '&:hover': { backgroundColor: '#218838' },
          }}
        >
          Add
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

export default AdminAddAdmin;
