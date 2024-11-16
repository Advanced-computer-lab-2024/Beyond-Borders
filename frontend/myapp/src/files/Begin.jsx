import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link } from 'react-router-dom';

const registrationTypes = [
  { label: 'Tourist', path: 'addTourist' },
  { label: 'Tour Guide', path: 'addUnregisteredTourGuide' },
  { label: 'Seller', path: 'addUnregisteredSeller' },
  { label: 'Advertiser', path: 'addUnregisteredAdvertiser' },
  { label: 'Transportation Advertiser', path: 'addTransportationAdvertiser' },
];

const Begin = () => {
  const [text, setText] = useState('');
  const fullText = 'Weelcome to Beyond Borders!';
  const [value, setValue] = useState(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRegister = () => {
    window.location.href = registrationTypes[value].path;
  };

  return (
    <Box>
      <Box
        sx={{
          textAlign: 'center',
          marginTop: '50px',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#283593',
        }}
      >
        {text}
      </Box>

      <Box
        className="container"
        sx={{
          textAlign: 'center',
          margin: '20px',
          padding: '25px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          width: '600px',
          height: 'auto',
          minHeight:'400px',
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
        
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#00c853',
            color: 'white',
            borderRadius: '20px',
            '&:hover': { backgroundColor: '#69f0ae' },
          }}
          onClick={handleRegister}
        >
          Register as {registrationTypes[value].label}
        </Button>

        <div>
          <p>
            <Link to="/login">Already have an account? Login here</Link>
          </p>
          <p>
            <Link to="/homeGuest">Continue as guest? Click here</Link>
          </p>
        </div>
      </Box>
    </Box>
  );
};

export default Begin;