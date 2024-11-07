import React from 'react';
import Button from '@mui/material/Button'; // Import MUI Button
import Box from '@mui/material/Box'; // Import MUI Box
import { Link } from 'react-router-dom';

const Begin = () => {
  return (
    <Box
      className="container"
      sx={{
        textAlign: 'center',
        margin: '20px',
        padding: '25px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        width: '500px',
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '150px'
      }}
    >
      <h2>Select Registration Type</h2>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`addTourist`}>
          Register as Tourist
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}onClick={() => window.location.href=`addUnregisteredTourGuide`}>
          Register as Tour Guide
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`addUnregisteredSeller`}>
          Register as Seller
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`addUnregisteredAdvertiser`}>
          Register as Advertiser
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`addTransportationAdvertiser`}>
          Register as Transportation Advertiser
        </Button>
      </Box>
      <div>
      <p>
        <Link to="/login">Already have an account? Login here</Link>
      </p>
      
      <p>
        <Link to="/homeGuest">Continue as guest? Click here</Link>
      </p>
    </div>
    </Box>
  );
};

export default Begin;
