// src/files/Tourist/TouristHomePage.jsx
// src/files/Tourist/TouristHomePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TouristHomePage() {
  const [activeModal, setActiveModal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  //fetchHotelsByCity search
  const [searchKeywordHotel, setSearchKeywordHotel] = useState('');
  const [showHotelSearch, setShowHotelSearch] = useState(false);
  const [hotels, setHotels] = useState([]); // Initialize hotels state
  //fetchHotels 
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adults, setAdults] = useState('');
  const [hotelOffers, setHotelOffers] = useState([])
  
  const navigate = useNavigate();

  useEffect(() => {
    if (activeModal === 'profile') {
      const fetchProfile = async () => {
        try {
          const Username = localStorage.getItem('username');
          if (!Username) {
            setErrorMessage('Username not found. Please log in.');
            setActiveModal('error');
            return;
          }
          const response = await axios.get('/api/viewTourist', { params: { Username } });
          if (response.data) {
            setProfile(response.data);
          } else {
            setErrorMessage('Profile data could not be retrieved.');
            setActiveModal('error');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setErrorMessage('An error occurred while loading your profile.');
          setActiveModal('error');
        }
      };
      fetchProfile();
    }
  }, [activeModal]);
  const updateProfile = async () => {
    try {
      // Prepare payload with editable fields
      const payload = {
        Username: profile.Username,
        Email: profile.Email,
        Password: profile.Password,
        MobileNumber: profile.MobileNumber,
        Nationality: profile.Nationality,
        Occupation: profile.Occupation,
      };
      const response = await axios.put('/api/updateTourist', payload);
      if (response.status === 200) {
        alert('Profile updated successfully!');
        setActiveModal(null); // Close the modal on success
      } else {
        setErrorMessage('Failed to update profile.');
        setActiveModal('error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('An error occurred while updating your profile.');
      setActiveModal('error');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/viewProductsSeller', { params: { Name: searchKeyword } });
      if (response.data && response.data.length > 0) {
        setFilteredResults(response.data);
        setActiveModal('searchResults');
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage('No products found matching the search criteria.');
        setActiveModal('error'); // Show error message in modal or UI
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('No products found matching the search criteria.');
      } else {
        // Handle other errors (e.g., network issues, server errors)
        setErrorMessage('An error occurred while searching for products.');
      }  
      setActiveModal('error'); // Show error message in modal or UI
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.post('/api/filterProductByPriceTourist', {
        MinimumPrice: minPrice ? parseFloat(minPrice) : undefined,
        MaximumPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      });
      if (response.data && response.data.length > 0) {
        setFilteredResults(response.data);
        setActiveModal('searchResults');
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage('No products found in the specified price range.');
        setActiveModal('error'); // Show error message in modal or UI
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('No products found in the specified price range.');
      } else {
        // Handle other errors (e.g., network issues, server errors)
        setErrorMessage('An error occurred while filtering products.');
      }
      setActiveModal('error'); // Show error message in modal or UI
  }
  };

  const handleHotelSearchToggle = () => {
    setShowHotelSearch((prev) => !prev); // Toggle hotel search bar visibility
  };

  const handleHotelSearch = async () => {
    try {
      // First API call to fetch hotels by city
      const responseByCity = await axios.post('/fetchHotelsByCity', { city: searchKeywordHotel });
      setHotels(responseByCity.data); // Set hotel IDs or full hotel details as per your preference
      
      // Second API call to fetch hotels with additional parameters
      const responseByDetails = await axios.post('/fetchHotels', {
        checkInDate,
        checkOutDate,
        adults,
        ids: responseByCity.data.map(hotel => hotel.id) // Assuming you get hotel IDs from the first response
      });
      setHotelOffers(responseByDetails.data); // Set the hotel offers to state

      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || 'Error fetching hotels');
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h5" component="h1" sx={styles.title}>
        Beyond Borders
      </Typography>

      <Box sx={styles.buttonContainer}>
        <Button sx={styles.button} onClick={() => navigate('/touristProducts')}>View All Products</Button>
        <Button sx={styles.button} onClick={() => navigate('/touristActivities')}>View All Activities</Button>
        <Button sx={styles.button} onClick={() => navigate('/touristMuseums')}>View All Museums</Button>
        <Button sx={styles.button} onClick={() => navigate('/touristItineraries')}>View All Itineraries</Button>
        <Button sx={styles.button} onClick={() => navigate('/TouristComplaintsModal')}>File a complaint</Button>
        <Button sx={styles.button} onClick={() => navigate('/touristHistorical')}>View All Historical Places</Button>
        <Button sx={styles.button} onClick={handleHotelSearchToggle}>Hotels</Button>
        <Button sx={styles.profileButton} onClick={() => setActiveModal('profile')}>My Profile</Button>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 3 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
          Search
        </Button>
        <TextField
          label="Min Price"
          variant="outlined"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <TextField
          label="Max Price"
          variant="outlined"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <Button variant="contained" onClick={handleFilter} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
          Filter
        </Button>
      </Box>


      

      {/* Profile Modal */}
      {activeModal === 'profile' && (
        <Modal open={true} onClose={() => setActiveModal(null)}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">My Profile</Typography>
            {errorMessage ? (
              <Typography color="error">{errorMessage}</Typography>
            ) : profile ? (
              <Box sx={styles.profileInfo}>
                <Typography><strong>Username:</strong> {profile.Username}</Typography>
                
                <TextField
                  label="Email"
                  value={profile.Email}
                  onChange={(e) => setProfile({ ...profile, Email: e.target.value })}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Password"
                  type="password"
                  value={profile.Password}
                  onChange={(e) => setProfile({ ...profile, Password: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                
                <TextField
                  label="Mobile Number"
                  value={profile.MobileNumber}
                  onChange={(e) => setProfile({ ...profile, MobileNumber: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                
                <Typography><strong>Date of Birth:</strong> {profile.DoB}</Typography>
                
                <TextField
                  label="Nationality"
                  value={profile.Nationality}
                  onChange={(e) => setProfile({ ...profile, Nationality: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                
                <TextField
                  label="Occupation"
                  value={profile.Occupation}
                  onChange={(e) => setProfile({ ...profile, Occupation: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                
                <Typography><strong>Wallet Balance:</strong> ${profile.Wallet}</Typography>

                <Button
                  variant="contained"
                  onClick={updateProfile}
                  sx={{ marginTop: '20px', backgroundColor: '#4CAF50', color: 'white' }}
                >
                  Save Changes
                </Button>
              </Box>
            ) : (
              <Typography>Loading...</Typography>
            )}
            <Button variant="contained" onClick={() => setActiveModal(null)} sx={styles.doneButton}>Done</Button>
          </Box>
        </Modal>
      )}

      {activeModal === 'searchResults' && (
        <Modal open={true} onClose={() => setActiveModal(null)}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">Search Results</Typography>
            {filteredResults.length > 0 ? (
              <Box sx={styles.resultsContainer}>
                {filteredResults.map((result, index) => (
                  <Box key={index} sx={styles.resultItem}>
                    <Typography variant="subtitle1"><strong>{result.Name}</strong></Typography>
                    <Typography>Price: ${result.Price}</Typography>
                    <Typography>{result.Description}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No results found.</Typography>
            )}
            <Button variant="contained" onClick={() => setActiveModal(null)} sx={styles.doneButton}>Close</Button>
          </Box>
        </Modal>
      )}

      {/* Error Modal */}
      {activeModal === 'error' && (
        <Modal open={true} onClose={() => setActiveModal(null)}>
          <Box sx={styles.modalContent}>
            <Typography color="error" variant="h6">{errorMessage}</Typography>
            <Button variant="contained" onClick={() => setActiveModal(null)} sx={styles.doneButton}>Close</Button>
          </Box>
        </Modal>
      )}

 {/* Hotel Search Bar */}
 {showHotelSearch && (
        <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 3 }}>
          <TextField
            label="City"
            variant="outlined"
            value={searchKeywordHotel}
            onChange={(e) => setSearchKeywordHotel(e.target.value)}
          />
          <TextField
            label="Check-in Date"
            type="date"
            variant="outlined"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Check-out Date"
            type="date"
            variant="outlined"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Adults"
            type="number"
            variant="outlined"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
          />
          <Button variant="contained" onClick={handleHotelSearch}>
            Search
          </Button>
        </Box>
      )}

     {/* Display Results */}
    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    
    {hotelOffers.length > 0 && (
      <Box>
      <Typography variant="h6">Hotel Offers:</Typography>
      {hotelOffers.map((hotel, index) => (
        <Box key={index} sx={styles.resultItem}>
          <Typography variant="subtitle1"><strong>{hotel.hotelName}</strong></Typography>
          {hotel.roomOffers.map((room, roomIndex) => (
            <Box key={roomIndex} sx={{ mt: 1 }}>
              <Typography>Price: ${room.price}</Typography>
              <Typography>Check-in: {room.checkInDate}</Typography>
              <Typography>Check-out: {room.checkOutDate}</Typography>
              <Typography>Adults: {room.adults}</Typography>
              <Typography>City Code: {room.cityCode}</Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
    
    )}
  </Box>
  );
}

// Styles object remains unchanged


const styles = {
  container: {
    backgroundColor: '#00c853',
    color: 'white',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    marginBottom: 3,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 2,
    mt: 2,
  },
  button: {
    backgroundColor: 'white',
    color: '#00c853',
    borderRadius: '20px',
    padding: '10px 20px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#69f0ae',
    },
  },
  profileButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '20px',
    padding: '10px 20px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#69f0ae',
    },
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
  profileInfo: {
    mt: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#00c853',
    color: 'white',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: '#69f0ae',
    },
  },
  resultsContainer: {
    mt: 2,
  },
  resultItem: {
    borderBottom: '1px solid #ccc',
    paddingBottom: 2,
    mb: 2,
  },
};

export default TouristHomePage;
