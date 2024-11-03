import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminProductModal from './AdminProductModal';

function HomePageAdmin() {
  const [activeModal, setActiveModal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [tagName, setTagName] = useState(''); // New state for tag name
  const [categoryName, setCategoryName] = useState('');
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

 
  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/viewProductsSeller', { params: { Name: searchKeyword } });
      if (response.data && response.data.length > 0) {
        setFilteredResults(response.data);
        setActiveModal('filteredProducts'); // Set to 'searchResults' to show only search results in the modal
      } else {
        setErrorMessage('No products found matching the search criteria.');
        setActiveModal('error');
      }
    } catch (error) {
      setErrorMessage('An error occurred while searching for products.');
      setActiveModal('error');
    }
  };
  const handleFilter = async () => {
    try {
      const response = await axios.post('/api/filterProductByPriceSeller', {
        MinimumPrice: minPrice ? parseFloat(minPrice) : undefined,
        MaximumPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      });
      if (response.data && response.data.length > 0) {
        setFilteredResults(response.data); // Set filtered results
        setActiveModal('filteredProducts'); // Open the products modal to display filtered results
      } else {
        setErrorMessage('No products found in the specified price range.');
        setActiveModal('error');
      }
    } catch (error) {
      setErrorMessage('An error occurred while filtering products.');
      setActiveModal('error');
    }
  };

  const saveNewTag = async () => {
    if (!tagName.trim()) {
      alert('Tag name cannot be empty.');
      return;
    }
  
    try {
      console.log("Tag name:", tagName); // Debugging line
      const response = await axios.post('/api/createNewTag', {
        NameOfTags: tagName.trim(),
      });
  
      if (response.status === 200) {
        alert('Tag created successfully!');
        setActiveModal(null);
      } else {
        throw new Error('Error creating tag');
      }
    } catch (error) {
      if (error.response) {
        const serverMessage = error.response.data?.error; // Access the "error" field from backend response
  
        if (error.response.status === 400 && serverMessage === "Tag already exists!") {
          alert(`Failed to create tag: ${serverMessage}`);
        } else if (error.response.status === 400) {
          alert(`Failed to create tag: ${serverMessage || 'Invalid input.'}`);
        } else {
          alert(`Failed to create tag: ${serverMessage || 'An unexpected error occurred.'}`);
        }
      } else {
        console.error('Error:', error);
        alert('Failed to create tag: ' + error.message);
      }
    }
  };
  
  


  const saveNewCategory = async () => {
    if (!categoryName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
  
    try {
      console.log("Category name being sent:", categoryName); // Debugging line
      const response = await axios.post('/api/createNewCategory', {
        NameOfCategory: categoryName.trim(),
      });
  
      if (response.status === 200) {
        alert('Category created successfully!');
        setActiveModal(null);
      } else {
        throw new Error('Error creating category');
      }
    } catch (error) {
      if (error.response) {
        const serverMessage = error.response.data?.error; // Access the "error" field from backend response
  
        if (error.response.status === 400 && serverMessage === "Category already exists!") {
          alert(`Failed to create category: ${serverMessage}`);
        } else if (error.response.status === 400) {
          alert(`Failed to create category: ${serverMessage || 'Invalid input.'}`);
        } else {
          alert(`Failed to create category: ${serverMessage || 'An unexpected error occurred.'}`);
        }
      } else {
        console.error('Error:', error);
        alert('Failed to create category: ' + error.message);
      }
    }
  };



  
  
  return (
    <Box sx={styles.container}>
      <Typography variant="h5" component="h1" sx={styles.title}>
        Beyond Borders
      </Typography>

      <Box sx={styles.buttonContainer}>
        
        <Button sx={styles.button} onClick={() => setActiveModal('createTag')}>Add New Tag</Button>
        <Button sx={styles.button} onClick={() => setActiveModal('createCategory')}>Add New Category</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminAddAdmin')}>Add admin</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminAddGov')}>Add Tourism governor</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminAddProduct')}>Add Product</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminProductModal')}>View All Products</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminTagsModal')}>View All tags</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminActivityModal')}>View All Activity Categories</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminDeleteAccount')}>Delete account</Button>
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
      
      {/* Create Tag Modal */}
      {activeModal === 'createTag' && (
        <Modal open={true} onClose={() => setActiveModal(null)}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">Create New Tag</Typography>
            <TextField
              label="Name of Tag"
              variant="outlined"
              fullWidth
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={saveNewTag} sx={styles.doneButton}>Create Tag</Button>
          </Box>
        </Modal>
      )}
      {/* Create Category Modal */}
      {activeModal === 'createCategory' && (
        <Modal open={true} onClose={() => setActiveModal(null)}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">Create New Category</Typography>
            <TextField
              label="Name of Category"
              variant="outlined"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={saveNewCategory} sx={styles.doneButton}>Create Category</Button>
          </Box>
        </Modal>
      )}



 {/* Admin Product Modal */}
{/* Admin Product Modal */}
{activeModal === 'viewAllProducts' || activeModal === 'filteredProducts' || activeModal === 'searchResults' ? (
        <AdminProductModal
          filteredProducts={activeModal === 'filteredProducts' || activeModal === 'searchResults' ? filteredResults : null}
          onClose={() => setActiveModal(null)}
        />
      ) : null}

      {activeModal === 'profile' && (
        <Modal open={true} onClose={() => setActiveModal(null)}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">My Profile</Typography>
            {errorMessage ? (
              <Typography color="error">{errorMessage}</Typography>
            ) : profile ? (
              <Box sx={styles.profileInfo}>
                <Typography><strong>Username:</strong> {profile.Username}</Typography>
                <Typography><strong>Email:</strong> {profile.Email}</Typography>
                <Typography><strong>Mobile Number:</strong> {profile.MobileNumber}</Typography>
                <Typography><strong>Date of Birth:</strong> {profile.DoB}</Typography>
                <Typography><strong>Nationality:</strong> {profile.Nationality}</Typography>
                <Typography><strong>Occupation:</strong> {profile.Occupation}</Typography>
                <Typography><strong>Wallet Balance:</strong> ${profile.Wallet}</Typography>
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
    variant: 'contained',           // Set to "contained" to support background color
    backgroundColor: 'white',       // White background color
    color: '#00c853',               // Green text color
    borderRadius: '20px',           // Rounded corners
    padding: '10px 20px',           // Padding for spacing
    fontWeight: 'bold',             // Bold font
    border: '1px solid #00c853',    // Optional: add green border if needed
    '&:hover': {
      backgroundColor: '#69f0ae',   // Lighter green on hover
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

export default HomePageAdmin;
