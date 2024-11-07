import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Begin = () => {
  return (
    <Box
      className="container"
      sx={{
        textAlign: 'center',
        margin: '20px',
        padding: '20px',
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
      <h2>Select a login Type</h2>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`loginTourist`}>
          Login as Tourist
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }} onClick={() => window.location.href=`loginTourGuide`}>
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
          Login as Tourism Governor
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#00c853', color: 'white', borderRadius: '20px', '&:hover': { backgroundColor: '#69f0ae' } }}
        onClick={() => window.location.href=`loginTransportationAdvertiser`}>
          Login as Transportation Advertiser
        </Button>
      </Box>
    </Box>
  );
};

export default Begin;
