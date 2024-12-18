import React, { useState } from 'react';
import { Box, Button, Typography, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminProductModal from './AdminProductModal';
import AdminItineraryModal from './AdminItineraryModal';
import AdminComplaintsModal from './AdminComplaintsModal';
import AdminDeleteRequestsModal from './AdminDeleteRequestsModal';

function HomePageAdmin() {
  const [activeModal, setActiveModal] = useState(null);
 
  const [errorMessage, setErrorMessage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [tagName, setTagName] = useState(''); // New state for tag name
  const [newPassword, setNewPassword] = useState('');
  

  const [categoryName, setCategoryName] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // State for complaint status filter
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const navigate = useNavigate();

 
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



  const sortProductsDescending = async () => {
    try {
      const response = await axios.get('/api/sortProductsDescendingSeller');
      if (response.status === 200) {
        setFilteredResults(response.data); // Update with sorted products
        setActiveModal('filteredProducts'); // Set to display sorted products
      } else {
        alert('Failed to sort products.');
      }
    } catch (error) {
      alert('An error occurred while sorting products.');
    }
  };

  const sortProductsAscending = async () => {
    try {
      const response = await axios.get('/api/sortProductsAscendingSeller');
      if (response.status === 200) {
        setFilteredResults(response.data); // Update with sorted products
        setActiveModal('filteredProducts'); // Set to display sorted products
      } else {
        alert('Failed to sort products.');
      }
    } catch (error) {
      alert('An error occurred while sorting products.');
    }
  };


  const sortComplaintsByRecent = async () => {
    try {
      const response = await axios.get('/sortComplaintsByRecent');
      if (response.status === 200) {
        setFilteredComplaints(response.data); // Update with sorted complaints by recent
        setActiveModal('filteredComplaints'); // Set to display sorted complaints
      } else {
        alert('Failed to sort complaints by recent.');
      }
    } catch (error) {
      alert('An error occurred while sorting complaints by recent.');
      console.error(error);
    }
  };
  
  const sortComplaintsByOldest = async () => {
    try {
      const response = await axios.get('/sortComplaintsByOldest');
      if (response.status === 200) {
        setFilteredComplaints(response.data); // Update with sorted complaints by oldest
        setActiveModal('filteredComplaints'); // Set to display sorted complaints
      } else {
        alert('Failed to sort complaints by oldest.');
      }
    } catch (error) {
      alert('An error occurred while sorting complaints by oldest.');
      console.error(error);
    }
  };
  


  const handleFilterComplaints = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/filterComplaintsByStatus', { Status: statusFilter });
        if (response.data && response.data.length > 0) {
            setFilteredComplaints(response.data);
            setActiveModal('filteredComplaints');
        } else {
            alert('No complaints found with the selected status.');
        }
    } catch (error) {
        alert('An error occurred while filtering complaints.');
        console.error(error);
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

  const changePassword = async () => {
    // Retrieve username from local storage
    const username = localStorage.getItem('username');
    if (!username) {
      setErrorMessage('Username not found in local storage');
      return;
    }
  
    try {
      // Use the full route path
      const response = await axios.put('/updateAdminPassword', { Username: username, newPassword:newPassword });
      if (response.status === 200) {
        alert('Password updated successfully!');
        setActiveModal(null); // Close the modal after a successful update
      } else {
        setErrorMessage('Failed to update password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to update password.');
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
        <Button sx={styles.button} onClick={() => navigate('/AdminArchivedProducts')}>View All Archived Products</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminTagsModal')}>View All tags</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminComplaintsModal')}>View All Complaints</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminActivityModal')}>View All Activity Categories</Button>
        {/* <Button sx={styles.button} onClick={() => navigate('/AdminDeleteAccount')}>Delete account</Button> */}
        <Button sx={styles.button} onClick={() => setActiveModal('viewAllItineraries')}>View All Itineraries</Button>
        <Button sx={styles.button} onClick={() => navigate('/AdminActivitiesModal')}>View All Activity </Button>
        <Button sx={styles.button} onClick={() => setActiveModal('changemypassword')}>Change My password</Button>
        <Button sx={styles.button} onClick={() => setActiveModal('viewAllDeleteRequests')}>
  View All Delete Requests
</Button>

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
          Filter Products
        </Button>




        <Button variant="contained" onClick={sortProductsAscending} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
          Sort Ascending
        </Button>




        <Button variant="contained" onClick={sortProductsDescending} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
         Sort Descneding
        </Button>


                <Button 
          variant="contained" 
          onClick={sortComplaintsByRecent} 
          sx={{ backgroundColor: '#4CAF50', color: 'white', marginRight: '10px' }}
        >
          Sort by Most Recent
        </Button>

        <Button 
          variant="contained" 
          onClick={sortComplaintsByOldest} 
          sx={{ backgroundColor: '#4CAF50', color: 'white' }}
        >
          Sort by Oldest
        </Button>






        <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleFilterComplaints} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
          Filter Complaints
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
      {/* Change Password Modal */}
      {activeModal === 'changemypassword' && (
        <Modal open={true} onClose={() => setActiveModal(null)}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">Change My Password</Typography>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {errorMessage && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <Button variant="contained" onClick={changePassword} sx={styles.doneButton}>
              Change My Password
            </Button>
          </Box>
        </Modal>
      )}
      {activeModal === 'viewAllDeleteRequests' && (
  <AdminDeleteRequestsModal onClose={() => setActiveModal(null)} />
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
            {activeModal === 'viewAllItineraries' && (
        <AdminItineraryModal
          activeModal="itineraries"
          onClose={() => setActiveModal(null)}
        />
      )}


 
{activeModal === 'viewAllProducts' || activeModal === 'filteredProducts' || activeModal === 'searchResults' || activeModal === 'sortedProducts' ? (
        <AdminProductModal
          filteredProducts={activeModal === 'filteredProducts' || activeModal === 'searchResults' || activeModal === 'sortedProducts' ? filteredResults : null}
          onClose={() => setActiveModal(null)}
        />
      ) : null}

     

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



     {/* Complaints Modal Handling Similar to Products */} 
{activeModal === 'viewAllComplaints' || activeModal === 'filteredComplaints' || activeModal === 'searchResults' || activeModal === 'sortedComplaints' ? (
  <AdminComplaintsModal
    filteredComplaints={
      activeModal === 'filteredComplaints' || activeModal === 'searchResults' || activeModal === 'sortedComplaints'
        ? filteredComplaints
        : null
    }
    onClose={() => setActiveModal(null)}
  />
) : null}

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
