import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const RegisterTourGuide = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Username: '',
    Password: '',
    MobileNum: '',
    YearsOfExperience: '',
    PreviousWork: '',
    IDDocument: null,
    CertificateDocument: null,
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0], // Store the selected file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setResponseMessage(''); // Clear previous messages

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]); // Append form data and files
      });

      // Send POST request to backend
      const response = await axios.post('http://localhost:8000/addUnregisteredTourGuide', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setResponseMessage('Tour Guide registered successfully!');
        setTimeout(() => {
          window.location.href = '/loginTourGuide'; // Redirect to login page
        }, 2000);
      } else {
        setResponseMessage(`Error: ${response.data.error || 'Failed to register tour guide.'}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
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
      <Typography variant="h4" align="center">
        Register Tour Guide
      </Typography>
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
        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          Upload ID Document (PDF):
        </Typography>
        <input type="file" name="IDDocument" accept="application/pdf" onChange={handleFileChange} />
        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          Upload Certificate Document (PDF):
        </Typography>
        <input type="file" name="CertificateDocument" accept="application/pdf" onChange={handleFileChange} />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#192959',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            width: '100%',
            marginTop: '20px',
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
          sx={{ marginTop: '20px', color: responseMessage.includes('Error') ? 'red' : 'green' }}
        >
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterTourGuide;
