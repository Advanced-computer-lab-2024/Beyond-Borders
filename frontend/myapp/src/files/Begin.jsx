import React from 'react';
import Button from '@mui/material/Button'; // Import MUI Button
import Box from '@mui/material/Box'; // Import MUI Box
import { Link } from 'react-router-dom';

const Begin = () => {
  return (
    <Box
      className="container"
      sx={{
        textAlign: 'center',    // Center align text
        margin: '20px',        // Add margin
        padding: '25px',       // Add padding
        backgroundColor: '#fff', // Background color for the container
        borderRadius: '8px',    // Rounded corners
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', // Soft shadow
        width: '500px',        // Set width of the box
        height: 'auto',        // Set height to auto to fit content
        marginLeft: 'auto',    // Center the box horizontally
        marginRight: 'auto',    // Center the box horizontally
        marginTop: '150px'     // Margin from top
      }}
    >
      <h2>Select Registration Type</h2>
      <Box
        sx={{
          display: 'flex',         // Use flexbox for alignment
          flexDirection: 'column',  // Stack buttons vertically
          gap: '30px',             // Space between buttons
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
      </Box>
      <div>
      {/* Space between buttons and links */}
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
