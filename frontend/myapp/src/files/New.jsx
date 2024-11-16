import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import RegisterTourist from './registerTourist'; // Import the registration forms
import RegisterTourGuide from './RegisterTourGuide';
import RegisterSeller from './registerSeller';
import RegisterAdvertiser from './RegisterAdvertiser';
import RegisterTransportationAdvertiser from './RegisterTransportationAdvertiser';

const registrationTypes = [
  { label: 'Tourist' },
  { label: 'Tour Guide' },
  { label: 'Seller' },
  { label: 'Advertiser' },
  { label: 'Transportation Advertiser' },
];

const New = () => {
  const [text, setText] = useState(''); // Animated text state
  const fullText = 'Welcome to Beyond Borders!'; // Full text to display
  const [value, setValue] = useState(0); // Active tab value

  useEffect(() => {
    let index = 0; // Start index for animation
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1)); // Append one character at a time
        index++;
      } else {
        clearInterval(interval); // Stop the interval when done
      }
    }, 100); // Typing speed

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue); // Update active tab value
  };

  return (
    <Box>
      {/* Welcome Message */}
      <Box
        sx={{
          textAlign: 'center',
          marginTop: '50px',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#283593',
        }}
      >
        {text} {/* Display the animated text */}
      </Box>

      {/* Registration Tabs */}
      <Box
        className="container"
        sx={{
          textAlign: 'center',
          margin: '20px',
          padding: '25px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          width: '650px',
          height: 'auto',
          minHeight: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '50px',
        }}
      >
        <h2>Select Registration Type</h2>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ marginBottom: '20px', justifyContent: 'center' }}
        >
          {registrationTypes.map((type, index) => (
            <Tab key={index} label={type.label} />
          ))}
        </Tabs>

        {/* Conditional Rendering for Registration Forms */}
        {value === 0 && (
          <Box sx={{ marginTop: '20px' }}>
            <RegisterTourist />
          </Box>
        )}
        {value === 1 && (
          <Box sx={{ marginTop: '20px' }}>
            <RegisterTourGuide />
          </Box>
        )}
        {value === 2 && (
          <Box sx={{ marginTop: '20px' }}>
            <RegisterSeller />
          </Box>
        )}
        {value === 3 && (
          <Box sx={{ marginTop: '20px' }}>
            <RegisterAdvertiser />
          </Box>
        )}
        {value === 4 && (
          <Box sx={{ marginTop: '20px' }}>
            <RegisterTransportationAdvertiser />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default New;
