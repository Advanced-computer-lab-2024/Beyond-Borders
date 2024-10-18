import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';

const RegisterAdvertiser = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    Email: '',
    Username: '', // Ensure the field name matches what the backend expects
    Password: '',
    Website: '',
    Hotline: '',
    CompanyProfile: '',
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

    try {
      // Send the POST request to register the advertiser
      const response = await axios.post('http://localhost:8000/addUnregisteredAdvertiser', formData);
      const result = response.data; // Access the response data

      // Check if the response is successful
      if (response.status === 200) { // Assuming a 200 status indicates success
        setResponseMessage('Advertiser registered successfully!');

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/loginAdvertiser'; // Redirect to login page
        }, 2000);
      } else {
        // Handle error case if the response doesn't indicate success
        setResponseMessage(`Error: ${result.error || 'Failed to register advertiser.'}`);
      }
    } catch (error) {
      // Handle Axios errors
      if (error.response && error.response.data) {
        setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
      console.error('Error registering advertiser:', error); // Log the error for debugging
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
      <h2>Register Advertiser</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <Box className="form-group" key={key} sx={{ marginBottom: '15px' }}>
            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type={key === 'Password' ? 'password' : 'text'}
              id={key}
              name={key} // Ensure `name` attribute matches the formData key
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
      <div className="message" style={{ marginTop: '20px', textAlign: 'center', color: responseMessage && responseMessage.includes('Error') ? 'red' : 'green' }}>
        {responseMessage}
      </div>
    </Box>
  );
};

export default RegisterAdvertiser;
