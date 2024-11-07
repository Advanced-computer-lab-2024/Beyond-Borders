import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';

const RegisterTransportationAdvertiser = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Username: '',
    Password: '',
    CompanyName: '', // Added CompanyName field
    Website: '',
    Hotline: '',
    CompanyProfile: '',
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
      const response = await axios.post('http://localhost:8000/createUnregisteredTranspAdvertiser', formData);
      const result = response.data;

      if (response.status === 200) {
        setResponseMessage('Transportation Advertiser registered successfully!');
        setTimeout(() => {
          window.location.href = '/loginTransportationAdvertiser';
        }, 2000);
      } else {
        setResponseMessage(`Error: ${result.error || 'Failed to register transportation advertiser.'}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
      console.error('Error registering transportation advertiser:', error);
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
        marginTop: '100px',
      }}
    >
      <h2>Register Transportation Advertiser</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <Box className="form-group" key={key} sx={{ marginBottom: '15px' }}>
            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type={key === 'Password' ? 'password' : 'text'}
              id={key}
              name={key}
              required
              value={formData[key]}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </Box>
        ))}
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
          Register
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

export default RegisterTransportationAdvertiser;
