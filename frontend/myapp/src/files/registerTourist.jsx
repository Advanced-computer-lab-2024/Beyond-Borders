import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';

const RegisterTourist = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    Email: '',
    Username: '',
    Password: '',
    MobileNumber: '',
    DoB: '',
    Nationality: '',
    Occupation: '',
    Wallet: 0, // Initialize wallet to 0
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

    try {
      const response = await axios.post('http://localhost:8000/addTourist', formData);
      const result = response.data; // Access the response data

      if (result.user) {
        localStorage.setItem('touristId', result.user._id); // Store the ID
        localStorage.setItem('touristData', JSON.stringify(result.user)); // Store the full data
        setResponseMessage('Tourist registered successfully!');

        // Redirect or perform any other action
        setTimeout(() => {
          window.location.href = '/login'; // Redirect after 2 seconds
        }, 2000);
      } else {
        setResponseMessage(`Error: ${result.error || 'Failed to register tourist.'}`);
      }
    } catch (error) {
      // Handle Axios errors
      if (error.response && error.response.data) {
        setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
      console.error('Error registering tourist:', error); // Log the error for debugging
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
        marginTop: '100px', // Adjust as needed
      }}
    >
      <h2>Register Tourist</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          key !== 'Wallet' && ( // Exclude the Wallet field from the input
            <Box className="form-group" key={key} sx={{ marginBottom: '15px' }}>
              <label htmlFor={key}>{key}:</label>
              <input
                type={key === 'Password' ? 'password' : key === 'DoB' ? 'date' : 'text'}
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
          )
        ))}
        <Box className="form-group" sx={{ marginBottom: '15px' }}>
          <label htmlFor="wallet">Wallet Amount:</label>
          <input
            type="number"
            id="wallet"
            name="Wallet"
            value={formData.Wallet} // Display wallet amount
            readOnly // Make the wallet input readonly
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </Box>
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
      <div className="message" style={{ marginTop: '20px', textAlign: 'center' }}>
        {responseMessage}
      </div>
    </Box>
  );
};

export default RegisterTourist;
