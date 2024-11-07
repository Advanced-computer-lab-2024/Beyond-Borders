import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import axios from 'axios';

const LoginSeller = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [responseMessage, setResponseMessage] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loginCount, setLoginCount] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');

    try {
      const response = await axios.post('http://localhost:8000/loginSeller', formData);
      const result = response.data;

      if (result.seller) {
        setLoginCount(result.seller.LoginCount);
        localStorage.setItem('username', result.seller.Username);
        setResponseMessage(`Welcome, ${result.seller.Username}!`);

        if (result.seller.LoginCount === 1) {
          setShowTermsModal(true); // Show the modal if it's the first login
        } else {
          setTimeout(() => {
            window.location.href = '/homePageSeller';
          }, 2000);
        }
      } else {
        setResponseMessage(`Error: ${result.error || 'Failed to log in.'}`);
      }
    } catch (error) {
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
      window.location.href = '/homePageSeller';
    }, 2000);
  };

  const handleRejectTerms = async () => {
    setShowTermsModal(false);

    try {
      // Decrement login count on reject
      await axios.put('http://localhost:8000/decrementLoginCount', { username: formData.username });
    } catch (error) {
      console.error('Error decrementing login count:', error);
    }

    // Redirect to login page
    setTimeout(() => {
      window.location.href = '/loginSeller';
    }, 1000);
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
      <Typography variant="h4" align="center">Login Seller</Typography>
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
            sx={{ mt: 2, mr: 2 }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRejectTerms}
            sx={{ mt: 2 }}
          >
            Reject
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default LoginSeller;
