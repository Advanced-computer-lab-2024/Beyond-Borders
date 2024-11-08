// src/files/Tourist/TouristMuseumsModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristMuseumsModal({ currency, onClose }) {
  const [museums, setMuseums] = useState([]); // Store fetched museum data here
  const [filteredMuseums, setFilteredMuseums] = useState([]);
  const [selectedMuseum, setSelectedMuseum] = useState(null); // For displaying a single museum in detail
  const [searchKeyword, setSearchKeyword] = useState('');
  const [tags, setTags] = useState('');
  const [email, setEmail] = useState(''); // State for the email input
  const [convertedPrices, setConvertedPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch museums data from the API
    const fetchMuseums = async () => {
      try {
        const response = await axios.get('/api/ViewAllUpcomingMuseumEventsTourist');
        setMuseums(response.data); // Set the entire fetched data
        setFilteredMuseums(response.data); // Set initial filtered museums to all fetched data
      } catch (error) {
        console.error('Error fetching museums:', error);
      }
    };
    fetchMuseums();
  }, []);
  
  useEffect(() => {
    if (currency !== 'EGP') {
      convertMuseumPrices();
    }
  }, [currency, museums]);


  const handleSearch = () => {
    const keyword = searchKeyword.toLowerCase();
    const filtered = museums.filter(museum => 
      museum.name.toLowerCase().includes(keyword)
    );
    setFilteredMuseums(filtered);
  };

  const handleFilterByTags = () => {
    const tagsArray = tags.toLowerCase().split(',').map(tag => tag.trim());
    const filtered = museums.filter(museum => 
      museum.tags?.some(tag => tagsArray.includes(tag.toLowerCase()))
    );
    setFilteredMuseums(filtered);
  };

  const handleViewDetails = (museum) => {
    setSelectedMuseum(museum); // Set selected museum for detail view
  };

  const handleCloseDetails = () => {
    setSelectedMuseum(null); // Reset selected museum to go back to list view
  };

  // Function to handle sharing the museum link with the entered email
  const handleShare = async (museumName) => {
    try {
      const frontendLink = `http://localhost:3000/museum/details/${encodeURIComponent(museumName)}`;

      // Send request to the backend to generate a link
      const response = await axios.post('/getCopyLink', {
        entityType: 'museum',
        entityName: museumName,
        email: email // Use the email from the text field
      });
      const { msg } = response.data;

      // Copy the frontend link to the clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(frontendLink)
          .then(() => alert(`Link copied to clipboard successfully!\n${msg}`))
          .catch(err => alert(`Failed to copy link: ${err}`));
      } else {
        alert(`Here is the link to share: ${frontendLink}\n${msg}`);
      }
    } catch (error) {
      console.error('Error sharing link:', error);
      alert('An error occurred while generating the share link.');
    }
  };
  const handleBookMuseum = async (museum) => {
    const touristUsername = localStorage.getItem('username');
    console.log(touristUsername);
    console.log(museum); 
  
    if (!touristUsername || !museum) {
      alert("Please log in and select a museum event to book.");
      return;
    }
  
    try {
      const response = await axios.put('/bookMuseum', {
        touristUsername,
        museumName: museum.name 
      });
  
      if (response.status === 201) {
        alert(`Museum event booked successfully! Total Cost: $${response.data.ticketPrice}`);
        navigate('/PaymentPage', {
          state: {
            type: 'museum', 
            name: museum.name,
            totalCost: response.data.ticketPrice
          }
        });
      } else {
        alert(response.data.msg || 'Failed to book museum event.');
      }
    } catch (error) {
      console.error('Error booking museum event:', error);
      alert('An error occurred while booking the museum event.');
    }
  };
  
  const convertMuseumPrices = async () => {
    const newConvertedPrices = {};

    await Promise.all(
      museums.map(async (museum) => {
        try {
          const [foreignerResponse, nativeResponse, studentResponse] = await Promise.all([
            axios.post('/convertCurr', {
              priceEgp: museum.ticketPrices?.foreigner || 0,
              targetCurrency: currency,
            }),
            axios.post('/convertCurr', {
              priceEgp: museum.ticketPrices?.native || 0,
              targetCurrency: currency,
            }),
            axios.post('/convertCurr', {
              priceEgp: museum.ticketPrices?.student || 0,
              targetCurrency: currency,
            }),
          ]);

          newConvertedPrices[museum._id] = {
            foreigner: foreignerResponse.data.convertedPrice,
            native: nativeResponse.data.convertedPrice,
            student: studentResponse.data.convertedPrice,
          };
        } catch (error) {
          console.error(`Error converting prices for ${museum.name}:`, error);
        }
      })
    );

    setConvertedPrices(newConvertedPrices);
  };
  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          Upcoming Museum Events
        </Typography>

        {/* Search and Filter Section */}
        <Box sx={styles.searchContainer}>
          <TextField
            label="Search Museum Events"
            variant="outlined"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleSearch} variant="contained" sx={styles.searchButton}>
            Search
          </Button>

          <TextField
            label="Filter by Tags (comma-separated)"
            variant="outlined"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleFilterByTags} variant="contained" sx={styles.filterButton}>
            Apply Tag Filter
          </Button>
        </Box>

        {selectedMuseum ? (
          <Box sx={styles.detailView}>
            <Typography variant="h6">{selectedMuseum.name}</Typography>
            <Typography><strong>Description:</strong> {selectedMuseum.description}</Typography>
            <Typography><strong>Pictures:</strong> {selectedMuseum.pictures?.join(', ')}</Typography>
            <Typography><strong>Location:</strong> {selectedMuseum.location}</Typography>
            <Typography><strong>Opening Hours:</strong> {selectedMuseum.openingHours}</Typography>
            <Typography variant="body2">
                  <strong>Ticket Prices:</strong> 
                  Foreigner: {currency === 'EGP' ? `${selectedMuseum.ticketPrices?.foreigner || 0} EGP` : `${convertedPrices[selectedMuseum._id]?.foreigner || 'Loading...'} ${currency}`}, 
                  Native: {currency === 'EGP' ? `${selectedMuseum.ticketPrices?.native || 0} EGP` : `${convertedPrices[selectedMuseum._id]?.native || 'Loading...'} ${currency}`}, 
                  Student: {currency === 'EGP' ? `${selectedMuseum.ticketPrices?.student || 0} EGP` : `${convertedPrices[selectedMuseum._id]?.student || 'Loading...'} ${currency}`}
                </Typography>
            <Typography><strong>Author:</strong> {selectedMuseum.author}</Typography>
            <Typography>
              <strong>Historical Tags:</strong> {selectedMuseum.tags?.length > 0 ? selectedMuseum.tags.join(', ') : 'No tags available'}
            </Typography>
            <Typography><strong>Date of Event:</strong> {new Date(selectedMuseum.date).toLocaleDateString()}</Typography>
            <Button variant="contained" onClick={handleCloseDetails} sx={styles.closeDetailsButton}>Back</Button>
          </Box>
        ) : (
          // List View of Filtered Museums
          <Box sx={styles.listContainer}>
            {filteredMuseums.map(museum => (
              <Box key={museum.id} sx={styles.item}>
                <Typography variant="body1"><strong>{museum.name}</strong></Typography>
                <Button variant="contained" sx={styles.detailsButton} onClick={() => handleViewDetails(museum)}>
                  View Details
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleShare(museum.name)}
                  sx={styles.shareButton}
                >
                  Share
                </Button>
                
                {/* Email Input for Sharing (placed below the Share button) */}
                <TextField
                  label="Email for Sharing"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleBookMuseum(museum)}
                  sx={styles.bookButton}
                >
                  Book
                </Button>
              </Box>
            ))}
          </Box>
        )}
        
        {!selectedMuseum && (
          <Button variant="contained" sx={styles.doneButton} onClick={() => navigate('/touristHome')}>
            Done
          </Button>
        )}
      </Box>
    </Modal>
  );
}

const styles = {
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    mt: 2,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': { backgroundColor: '#388E3C' },
    mt: 1,
  },
  filterButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': { backgroundColor: '#388E3C' },
    mt: 1,
  },
  listContainer: {
    maxHeight: 300,
    overflowY: 'auto',
    mt: 2,
  },
  item: {
    display: 'flex',
    flexDirection: 'column', // Make the item layout vertical
    gap: 1,
    alignItems: 'flex-start', // Align items to the start for a vertical layout
    p: 2,
    borderBottom: '1px solid #ddd',
  },
  detailsButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': { backgroundColor: '#388E3C' },
  },
  detailView: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    mt: 2,
  },
  closeDetailsButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    mt: 2,
    '&:hover': { backgroundColor: '#388E3C' },
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#00c853',
    color: 'white',
    '&:hover': { backgroundColor: '#69f0ae' },
  },
  shareButton: {
    mt: 1,
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': { backgroundColor: '#63a4ff' },
  },
};

export default TouristMuseumsModal;
