import React from 'react';
import Button from '@mui/material/Button'; // Import MUI Button
import Box from '@mui/material/Box'; // Import MUI Box


const Begin = () => {
  return (
    <Box
      className="container"
      sx={{
        textAlign: 'center',    // Center align text
        margin: '20px',        // Add margin
        padding: '20px',       // Add padding
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
      <h2>Select a login Type</h2>
      <Box
        sx={{
          display: 'flex',         // Use flexbox for alignment
          flexDirection: 'column',  // Stack buttons vertically
          gap: '30px',             // Space between buttons
        }}
      >
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`loginTourist`}>
          Login as Tourist
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}onClick={() => window.location.href=`loginTourGuide`}>
          Login as Tour Guide
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`loginSeller`}>
          Login as Seller
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`loginAdvertiser`}>
          Login as Advertiser
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`loginAdmin`}>
          Login as Admin
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`loginTourismGovernor`}>
          Login as Tourism governor
        </Button>
      </Box>
      <div>
      {/* Space between buttons and links */}
     
    </div>
    </Box>
  );
};

export default Begin;
