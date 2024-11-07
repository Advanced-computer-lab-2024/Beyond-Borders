// src/files/Tourist/TouristHomePage.jsx
// src/files/Tourist/TouristHomePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormControlLabel, Checkbox } from '@mui/material';


function TouristHomePage() {
  const [activeModal, setActiveModal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tags, setTags] = useState([]); 
  const [preferenceTags, setPreferenceTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]); 
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

  //flights
const [origin, setOrigin] = useState('');
const [destination, setDestination] = useState('');
const [departureDate, setDepartureDate] = useState('');
const [returnDate, setReturnDate] = useState('');
const [direct, setDirect] = useState(false); // Checkbox for direct flights
const [showFlightSearch, setShowFlightSearch] = useState(false); // Toggle for flight search form visibility
const [flightOffers, setFlightOffers] = useState([]); // Holds flight search results

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
      setHotels(responseByCity.data); // Assuming the response contains hotel IDs or full details

      // Second API call to fetch hotels based on additional parameters (check-in, check-out, adults)
      const responseByDetails = await axios.post('/fetchHotels', {
        checkInDate,
        checkOutDate,
        adults,
        ids: responseByCity.data.map((hotel) => hotel.id) // Assuming hotel IDs are returned in the first response
      });

      setHotelOffers(responseByDetails.data); // Set the hotel offers to the state
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || 'Error fetching hotels');
    }
  };

  const handleBookHotel = async (hotelNumber) => {
    const touristUsername = localStorage.getItem('username'); // Retrieve the username from local storage
    console.log(touristUsername);
    // Ensure touristUsername is available
    if (!touristUsername) {
      alert('You must be logged in to book a hotel.');
      return;
    }
  
    try {
      const response = await axios.post('/bookHotel', {
        hotelNumber,
        touristUsername,
      });
      alert(response.data.msg); // Show success message
    } catch (error) {
      console.error('Error booking hotel:', error);
      alert(error.response?.data?.msg || 'An error occurred.');
    }
  };

  const handleBookFlight = async (flightID) => {
    const touristUsername = localStorage.getItem('username'); // Get touristUsername from local storage
    console.log(touristUsername);
    //const flightID = flightGroup[0].flightID; // Assuming the flightID is available in the first flight object in the group
  
    // Validate the data
    if (!touristUsername || !flightID) {
      alert("Username or Flight ID is missing.");
      return;
    }
  
    try {
      // Send a POST request to your backend API to book the flight
      const response = await axios.post('/bookFlight', {
        touristUsername,
        flightID
      });
  
      // Handle successful response
      if (response.status === 200) {
        alert('Flight booked successfully!');
      }
    } catch (error) {
      console.error('Error booking flight:', error);
      alert('An error occurred while booking the flight.');
    }
  };

  const handleFlightSearchToggle = () => setShowFlightSearch((prev) => !prev);
  const handleFlightSearch = async () => {
    try {
      const response = await axios.post('/fetchFlights', {
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        direct,
      });
  
      setFlightOffers(response.data); // Set the flight offers to the state
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || 'Error fetching flights');
    }
  };

  const viewPreferenceTags = async () => {
    try {
      const response = await axios.get('/viewPreferenceTags');
      if (response.data && response.data.length > 0) {
        setPreferenceTags(response.data);
        setActiveModal('tags'); // Open tags modal when data is fetched
      } else {
        setErrorMessage('No preference tags found');
        setActiveModal('error'); // Show error if no tags are found
      }
    } catch (error) {
      console.error('Error fetching preference tags:', error);
      setErrorMessage('An error occurred while fetching preference tags.');
      setActiveModal('error');
    }
  };

  const handleTagChange = (tagName) => {
    // Toggle the tag in the selectedTags array
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const addPreferences = async () => {
    const touristUsername = localStorage.getItem('username'); // Get username from localStorage

    if (!touristUsername || selectedTags.length === 0) {
      setErrorMessage('Please select at least one preference.');
      return;
    }
    console.log(selectedTags);
    try {
      // Send the selected tags and username to the backend
      const response = await axios.put('/addPreferences', {
        touristUsername,
        preferences: selectedTags,
      });
      // Handle success response (e.g., show confirmation or update profile state)
      setErrorMessage('');
      setActiveModal(null); // Close the modal
      alert('Preferences added successfully!');
    } catch (error) {
      setErrorMessage('An error occurred while adding preferences.');
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
        <Button sx={styles.button} onClick={() => navigate('/CompletedItineraries')}>View All completed Itineraries</Button>
        <Button sx={styles.button} onClick={() => navigate('/CompletedActivity')}>View All completed Activities</Button>
        <Button sx={styles.button} onClick={() => navigate('/CompletedMuseums')}>View All completed Museums</Button>
        <Button sx={styles.button} onClick={() => navigate('/CompletedHistorical')}>View All completed Historical Places</Button>
        <Button sx={styles.button} onClick={() => navigate('/PurchasedProducts')}>View All Purchased Products</Button>
        <Button sx={styles.button} onClick={() => navigate('/TouristComplaintsModal')}>File a complaint</Button>
        <Button sx={styles.button} onClick={() => navigate('/touristHistorical')}>View All Historical Places</Button>
        <Button sx={styles.button} onClick={handleHotelSearchToggle}>Hotels</Button>
        <Button sx={styles.button} onClick={handleFlightSearchToggle}>Flights</Button>
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
                 {/* Button to view preference tags */}
                 <Button
                  variant="contained"
                  onClick={viewPreferenceTags}
                  sx={{ marginTop: '10px', backgroundColor: '#1976d2', color: 'white' }}
                >
                  View Preference Tags
                </Button>

              </Box>
            ) : (
              <Typography>Loading...</Typography>
            )}
            <Button variant="contained" onClick={() => setActiveModal(null)} sx={styles.doneButton}>Done</Button>
          </Box>
        </Modal>
      )}
      
{/* Tags Modal */}
{activeModal === 'tags' && (
  <Modal open={true} onClose={() => setActiveModal(null)}>
    <Box sx={styles.modalContent}>
      <Typography variant="h6" component="h2">Preference Tags</Typography>
      
      {/* Handle rendering of preference tags with checkboxes */}
      {preferenceTags.length > 0 ? (
        <Box>
          {preferenceTags.map((tag, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedTags.includes(tag.NameOfTags)}
                  onChange={() => handleTagChange(tag.NameOfTags)} // Handle checkbox change
                />
              }
              label={tag.NameOfTags}
            />
          ))}
        </Box>
      ) : (
        <Typography>No tags found.</Typography>
      )}

      {/* Button to submit selected preferences */}
      <Button 
        variant="contained" 
        onClick={addPreferences} 
        sx={styles.doneButton}
      >
        Save Preferences
      </Button>

      <Button variant="contained" onClick={() => setActiveModal(null)} sx={styles.doneButton}>
        Close
      </Button>
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
          <Button variant="contained" onClick={handleHotelSearch} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
            Search Hotels
          </Button>
        </Box>
      )}

     {/* Display Results */}
    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    
{/* Hotel Offers Modal */}
{hotelOffers.length > 0 && (
  <Modal open={true} onClose={() => setHotelOffers([])}>
    <Box sx={styles.modalContent}>
      <Typography variant="h6" component="h2">Hotel Offers</Typography>
      
      {/* Scrollable container for results */}
      <Box sx={{ ...styles.resultsContainer, maxHeight: '60vh', overflowY: 'auto' }}>
        {hotelOffers.map((hotel, index) => (
          <Box key={index} sx={styles.resultItem}>
            <Typography variant="h6">{hotel.hotelName}</Typography>
            <Box>
              {hotel.roomOffers.map((offer, offerIndex) => (
                <Box key={offerIndex} sx={styles.roomOffer}>
                  <Typography variant="subtitle1">Room Number: {offer.hotelNumber}</Typography>
                  <Typography>Price: {offer.price}</Typography>
                  <Typography>Check-in: {offer.checkInDate}</Typography>
                  <Typography>Check-out: {offer.checkOutDate}</Typography>
                  <Typography>Adults: {offer.adults}</Typography>
                  <Typography>City: {offer.cityCode}</Typography>
                  
                  {/* Book Now button */}
                  <Button
                    variant="contained"
                    onClick={() => handleBookHotel(offer.hotelNumber)} // Pass the hotelNumber to the function
                    sx={styles.bookNowButton}
                  >
                    Book Now
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Close button */}
      <Button variant="contained" onClick={() => setHotelOffers([])} sx={styles.doneButton}>Close</Button>
    </Box>
  </Modal>
)}

{/* Flight Search Form */}
{showFlightSearch && (
      <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 3 }}>
        <TextField
          label="Origin"
          variant="outlined"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <TextField
          label="Destination"
          variant="outlined"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <TextField
          label="Departure Date"
          type="date"
          variant="outlined"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Return Date"
          type="date"
          variant="outlined"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Adults"
          type="number"
          variant="outlined"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={direct}
              onChange={(e) => setDirect(e.target.checked)}
            />
          }
          label="Direct Flights Only"
        />
        <Button variant="contained" onClick={handleFlightSearch} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
          Search Flights
        </Button>
      </Box>
    )}

{/* Flight Offers Modal */}
{flightOffers.length > 0 && (
  <Modal open={true} onClose={() => setFlightOffers([])}>
    <Box sx={styles.modalContent}>
      <Typography variant="h6" component="h2">Flight Offers</Typography>
      <Box sx={{ ...styles.resultsContainer, maxHeight: '60vh', overflowY: 'auto' }}>
        {flightOffers.map((flightGroup, groupIndex) => (
          <Box key={groupIndex} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Flight ID: {flightGroup[0].flightID}</Typography>
            <Typography>Price: {flightGroup[0].price} {flightGroup[0].currency}</Typography>

            {/* Outbound Flight */}
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Outbound Flight</Typography>
            {flightGroup[0].segments.map((segment, segmentIndex) => (
              <Box key={segmentIndex} sx={{ mb: 1, pl: 2 }}>
                <Typography>
                  Departure: {segment.departure.iataCode} (Terminal {segment.departure.terminal || 'N/A'}) at {new Date(segment.departure.at).toLocaleString()}
                </Typography>
                <Typography>
                  Arrival: {segment.arrival.iataCode} (Terminal {segment.arrival.terminal || 'N/A'}) at {new Date(segment.arrival.at).toLocaleString()}
                </Typography>
              </Box>
            ))}

            {/* Return Flight */}
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Return Flight</Typography>
            {flightGroup[1].segments.map((segment, segmentIndex) => (
              <Box key={segmentIndex} sx={{ mb: 1, pl: 2 }}>
                <Typography>
                  Departure: {segment.departure.iataCode} (Terminal {segment.departure.terminal || 'N/A'}) at {new Date(segment.departure.at).toLocaleString()}
                </Typography>
                <Typography>
                  Arrival: {segment.arrival.iataCode} (Terminal {segment.arrival.terminal || 'N/A'}) at {new Date(segment.arrival.at).toLocaleString()}
                </Typography>
              </Box>
            ))}

            {/* Book Now Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="contained" onClick={() => handleBookFlight(flightGroup[0].flightID)} sx={styles.bookButton}>Book Now</Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Close button */}
      <Button variant="contained" onClick={() => setFlightOffers([])} sx={styles.doneButton}>Close</Button>
    </Box>
  </Modal>
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
