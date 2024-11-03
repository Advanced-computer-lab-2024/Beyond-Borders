import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const AdminAddGov = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { Username: username, Password: password };

    try {
      const response = await axios.post('/addTourismGovernor', formData);


      if (response.status === 200) {
        setResponseMessage('Tourism Governor added successfully!');
        setUsername('');
        setPassword('');
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
      }}
    >
      <Typography variant="h4" align="center">Add Tourism Governor</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          placeholder="Username"
          required
          value={username}
          onChange={handleUsernameChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={handlePasswordChange}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#40be5b',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            width: '100%',
            marginTop: '20px',
            '&:hover': { backgroundColor: '#7ccf8e' },
          }}
        >
          Add Governor
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

export default AdminAddGov;
