import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, TextField, Modal } from '@mui/material';

const LoginAdvertiser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loginCount, setLoginCount] = useState(null);

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
      const response = await axios.post('http://localhost:8000/loginAdvertiser', formData);
      const result = response.data;

      if (result.advertiser) {
        setLoginCount(result.advertiser.LoginCount);
        localStorage.setItem('username', result.advertiser.Username);
        setResponseMessage(`Welcome, ${result.advertiser.Username}!`);

        if (result.advertiser.LoginCount === 1) {
          setShowTermsModal(true);
        } else {
          setTimeout(() => {
            window.location.href = '/YAdvertiserDashboard';
          }, 2000);
        }
      } else {
        setResponseMessage(`Error: ${result.error || 'Failed to log in.'}`);
      }
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);

      if (error.response && error.response.data) {
        setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
    }
  };

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    setTimeout(() => {
      window.location.href = '/YAdvertiserDashboard';
    }, 2000);
  };

  const handleRejectTerms = async () => {
    try {
      // Call API to decrement LoginCount
      await axios.put('http://localhost:8000/decrementLoginCountAdvertiser', {
        username: formData.username,
      });
      setShowTermsModal(false);
      setLoginCount(loginCount - 1);
      window.location.href = '/loginAdvertiser'; // Redirect to login page
    } catch (error) {
      console.error('Error decrementing login count:', error);
      setResponseMessage('Failed to decrement login count. Please try again.');
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

      <Modal open={showTermsModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>Terms and Conditions</Typography>
          <Typography variant="body2" gutterBottom>
            Please accept our terms and conditions to proceed to the homepage.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAcceptTerms}
            sx={{ mt: 2 }}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRejectTerms}
            sx={{ mt: 1 }}
          >
            Reject
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default LoginAdvertiser;
