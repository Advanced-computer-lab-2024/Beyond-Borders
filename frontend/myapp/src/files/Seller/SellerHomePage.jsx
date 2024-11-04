import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';

function SellerHomePage() {
  const [activeModal, setActiveModal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', quantity: '', picture: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (activeModal === 'profile') {
      fetchProfile();
    }
  }, [activeModal]);

  const fetchProfile = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      setErrorMessage('Username not found. Please log in.');
      setActiveModal('error');
      return;
    }
    try {
      const response = await axios.get('/api/readSellerProfile', { params: { Username: username } });
      setProfile(response.data || {});
    } catch (error) {
      setErrorMessage('An error occurred while loading your profile.');
      setActiveModal('error');
    }
  };

  const editProfile = async () => {
    // Check if the password fields are provided and match
    if (profile.newPassword && profile.confirmPassword) {
      if (profile.newPassword !== profile.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      // Only add the new password to the update payload if provided and matched
      profile.Password = profile.newPassword;
    }
  
    try {
      const response = await axios.put('/api/updateSeller', profile);
      if (response.status === 200) {
        alert('Profile updated successfully!');
        setActiveModal(null);
        fetchProfile(); // Refresh profile data after update
      } else {
        setErrorMessage('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile: ' + (error.response?.data?.error || error.message));
    }
  };
  

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/viewAllProductsSeller');
      setSearchResults(response.data || []);
      setActiveModal('searchResults');
    } catch (error) {
      setErrorMessage('An error occurred while fetching products.');
      setActiveModal('error');
    }
  };

  const fetchMyProducts = async () => {
    const username = localStorage.getItem('username');
    console.log("Username from localStorage:", username); // Debugging output to check if username is retrieved
  
    if (!username) {
      alert('Please log in to view your products.');
      return;
    }
  
    try {
      const response = await axios.get('/api/getProductsBySeller', { params: { Seller: username } });
      console.log("API Response:", response.data); // Debugging output to check the API response
      setMyProducts(response.data || []);
      setActiveModal('myProducts');
    } catch (error) {
      console.error("Error fetching products:", error.response || error.message); // Detailed error logging
      setErrorMessage('An error occurred while loading your products.');
      setActiveModal('error');
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      alert('Please enter a product name to search.');
      return;
    }
    try {
      const response = await axios.get('/api/viewProductsSeller', { params: { Name: searchKeyword.trim() } });
      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
        setActiveModal('searchResults');
      } else {
        setErrorMessage('No products found matching the search criteria.');
        setActiveModal('error');
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
    if (!minPrice && !maxPrice) {
      alert('Please enter at least one price.');
      return;
    }
    try {
      const response = await axios.post('/api/filterProductByPriceSeller', {
        MinimumPrice: minPrice ? parseFloat(minPrice) : undefined,
        MaximumPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      });
      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
        setActiveModal('searchResults');
      } else {
        setErrorMessage('No products found in the specified price range.');
        setActiveModal('error');
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

  const addProduct = async () => {
    const seller = localStorage.getItem('username');
    if (!seller) {
        alert('You need to log in first.');
        return;
    }

    try {
        const payload = {
            Name: newProduct.name,
            Description: newProduct.description,
            Price: parseFloat(newProduct.price) || 0,       // Ensure Price is a number
            Quantity: parseInt(newProduct.quantity) || 0,   // Ensure Quantity is an integer
            Seller: seller,
            Picture: newProduct.picture
        };

        console.log("Sending payload to backend:", payload); // Log payload for debugging

        const response = await axios.post('/api/addProductSeller', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
            alert(response.data.msg || 'Product created successfully!');
            setNewProduct({ name: '', description: '', price: '', quantity: '', picture: '' });
            fetchMyProducts();
            setActiveModal(null);
        } else {
            alert('Failed to add product.');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product: ' + (error.response?.data?.error || error.message));
    }
};

  const editProduct = async () => {
    try {
      await axios.put('/api/editProductSeller', selectedProduct);
      alert('Product updated successfully!');
      fetchMyProducts();
      setActiveModal(null);
    } catch (error) {
      alert('Failed to update product.');
    }
  };
  
  const sortProductsDescending = async () => {
    try {
      const response = await axios.get('/api/sortProductsDescendingSeller');
      if (response.status === 200) {
        setSearchResults(response.data); // Update the state with sorted products
        setActiveModal('searchResults'); // Open the search results modal
      } else {
        alert('Failed to sort products.');
      }
    } catch (error) {
      console.error('Error fetching sorted products:', error);
      alert('An error occurred while sorting products.');
    }
  };

  const sortProductsAscending = async () => {
    try {
      const response = await axios.get('/api/sortProductsAscendingSeller');
      if (response.status === 200) {
        setSearchResults(response.data); // Update the state with sorted products
        setActiveModal('searchResults'); // Open the search results modal
      } else {
        alert('Failed to sort products.');
      }
    } catch (error) {
      console.error('Error fetching sorted products:', error);
      alert('An error occurred while sorting products.');
    }
  };

  const RequestDeleteAccount = async () => {
    try {
      const username = localStorage.getItem('username');
      console.log('Username :' , username)
      const response = await axios.post('/api/requestDeleteAccountSeller', { Username: username });
      
      if (response.status === 200) {
        alert('Account deletion request submitted successfully!');
        setActiveModal(null); 
      } else {
        setErrorMessage('Failed to submit account deletion request.');
        setActiveModal('error');
      }
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      setErrorMessage('An error occurred while requesting the deletion of your account.');
      setActiveModal('error');
    }
  };
  
  
  return (
    <Box sx={styles.container}>
      <Typography variant="h5" component="h1" sx={styles.title}>
        Beyond Borders - Seller Portal
      </Typography>

      <Box sx={styles.buttonContainer}>
        <Button sx={styles.button} onClick={fetchProducts}>View All Products</Button>
        <Button sx={styles.button} onClick={fetchMyProducts}>View My Products</Button>
        <Button sx={styles.button} onClick={sortProductsDescending}>Sort by Rating Descending</Button>
        <Button sx={styles.button} onClick={sortProductsAscending}>Sort by Rating Ascending</Button>
        <Button sx={styles.button} onClick={() => setActiveModal('addProduct')}>Add New Product</Button>
        <Button sx={styles.profileButton} onClick={() => setActiveModal('profile')}>My Profile</Button>
        <Button 
  sx={{ ...styles.button, backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: '#ff6666' } }} 
  onClick={RequestDeleteAccount}
>
  Request Account Deletion
</Button>
        <Button
  sx={styles.button}
  onClick={() => {
    if (!profile) {
      // Fetch profile data if it's not already loaded
      fetchProfile().then(() => setActiveModal('editProfile'));
    } else {
      setActiveModal('editProfile');
    }
  }}
>
  Edit Profile
</Button>
      </Box>

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
                <Typography><strong>Phone:</strong> {profile.MobileNumber}</Typography>
              </Box>
            ) : (
              <Typography>Loading...</Typography>
            )}
            <Button variant="contained" onClick={() => setActiveModal(null)} sx={styles.doneButton}>Close</Button>
          </Box>
        </Modal>
      )}

{activeModal === 'editProfile' && (
  <Modal open={true} onClose={() => setActiveModal(null)}>
    <Box sx={styles.modalContent}>
      <Typography variant="h6">Edit Profile</Typography>
      <TextField
        label="Username"
        value={profile.Username}
        onChange={(e) => setProfile({ ...profile, Username: e.target.value })}
        fullWidth
        margin="normal"
        disabled // Assuming username is not editable
      />
      <TextField
        label="Email"
        value={profile.Email}
        onChange={(e) => setProfile({ ...profile, Email: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone Number"
        value={profile.MobileNumber}
        onChange={(e) => setProfile({ ...profile, MobileNumber: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="New Password"
        type="password"
        value={profile.newPassword || ''}
        onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={profile.confirmPassword || ''}
        onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
        fullWidth
        margin="normal"
       />

      <Button
        variant="contained"
        onClick={editProfile}
        sx={{ mt: 2, backgroundColor: '#4CAF50', color: 'white' }}
      >
        Save Changes
      </Button>
    </Box>
  </Modal>
)}


{activeModal === 'addProduct' && (
    <Modal open={true} onClose={() => setActiveModal(null)}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6">Add New Product</Typography>
        <TextField
          label="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          type="number"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Picture URL"
          value={newProduct.picture}
          onChange={(e) => setNewProduct({ ...newProduct, picture: e.target.value })}
          fullWidth
          margin="normal"
        />
        {/* Add fields for Ratings and RatingCount if needed */}
        <TextField
          label="Ratings"
          type="number"
          value={newProduct.ratings || 0}
          onChange={(e) => setNewProduct({ ...newProduct, ratings: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Rating Count"
          type="number"
          value={newProduct.ratingCount || 0}
          onChange={(e) => setNewProduct({ ...newProduct, ratingCount: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={addProduct} sx={{ mt: 2, backgroundColor: '#4CAF50', color: 'white' }}>Add Product</Button>
      </Box>
    </Modal>
)}


{activeModal === 'searchResults' && (
  <Modal open={true} onClose={() => setActiveModal(null)}>
    <Box sx={styles.modalContent}>
      <Typography variant="h6" component="h2">All Products</Typography>
      {searchResults.length > 0 ? (
        <Box sx={styles.resultsContainer}>
          {searchResults.map((product, index) => (
            <Box key={product._id || index} sx={styles.resultItem}>
              <img src={product.Picture} alt={product.Name} style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
              <Typography><strong>Name:</strong> {product.Name}</Typography>
              <Typography><strong>Price:</strong> ${product.Price}</Typography>
              <Typography><strong>Description:</strong> {product.Description}</Typography>
              <Typography><strong>Quantity:</strong> {product.Quantity}</Typography>
              <Typography><strong>Seller:</strong> {product.Seller}</Typography>
              <Typography><strong>Rating:</strong> {product.Ratings}</Typography>
              <Typography><strong>Reviews:</strong> {product.Reviews.length > 0 ? product.Reviews.join(', ') : 'No reviews'}</Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No results found.</Typography>
      )}
      <Button variant="contained" onClick={() => setActiveModal(null)} sx={styles.doneButton}>Done</Button>
    </Box>
  </Modal>
)}

{activeModal === 'myProducts' && (
  <Modal open={true} onClose={() => setActiveModal(null)}>
    <Box sx={styles.modalContent}>
      <Typography variant="h6" component="h2">My Products</Typography>
      {myProducts.length > 0 ? (
        <Box sx={styles.resultsContainer}>
          {myProducts.map((product, index) => (
            <Box key={product._id || index} sx={styles.resultItem}>
              <img src={product.Picture} alt={product.Name} style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
              <Typography><strong>Name:</strong> {product.Name}</Typography>
              <Typography><strong>Price:</strong> ${product.Price}</Typography>
              <Typography><strong>Description:</strong> {product.Description}</Typography>
              <Typography><strong>Quantity:</strong> {product.Quantity}</Typography>
              <Typography><strong>Sales:</strong> {product.Sales}</Typography>
              <Typography><strong>Total Price of Sales:</strong> ${product.TotalPriceOfSales}</Typography>
              <Typography><strong>Seller:</strong> {product.Seller}</Typography>
              <Typography><strong>Rating:</strong> {product.Ratings}</Typography>
              <Typography><strong>Reviews:</strong></Typography>

              {Array.isArray(product.Reviews) && product.Reviews.length > 0 ? (
                product.Reviews.map((review, idx) => (
                  <Box key={idx} sx={{ mt: 1, mb: 1, padding: '5px', borderBottom: '1px solid #ccc' }}>
                    <Typography><strong>Username:</strong> {review.touristUsername}</Typography>
                    <Typography><strong>Review:</strong> {review.Review}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No reviews available</Typography>
              )}

              <Button
                variant="contained"
                onClick={() => {
                  setSelectedProduct(product);
                  setActiveModal('editProduct');
                }}
                sx={{ mt: 1, backgroundColor: '#4CAF50', color: 'white' }}
              >
                Edit
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No products found.</Typography>
      )}
      <Button variant="contained" onClick={() => setActiveModal(null)} sx={styles.doneButton}>Done</Button>
    </Box>
  </Modal>
)}





{activeModal === 'editProduct' && selectedProduct && (
  <Modal open={true} onClose={() => setActiveModal(null)}>
    <Box sx={styles.modalContent}>
      <Typography variant="h6">Edit Product</Typography>
      <TextField
        label="Name"
        value={selectedProduct.Name}
        onChange={(e) => setSelectedProduct({ ...selectedProduct, Name: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={selectedProduct.Description}
        onChange={(e) => setSelectedProduct({ ...selectedProduct, Description: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        type="number"
        value={selectedProduct.Price}
        onChange={(e) => setSelectedProduct({ ...selectedProduct, Price: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantity"
        type="number"
        value={selectedProduct.Quantity}
        onChange={(e) => setSelectedProduct({ ...selectedProduct, Quantity: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Picture URL"
        value={selectedProduct.Picture}
        onChange={(e) => setSelectedProduct({ ...selectedProduct, Picture: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={() => {
          editProduct(selectedProduct); // Call editProduct with updated product
          setActiveModal(null);         // Close modal after editing
        }}
        sx={{ mt: 2, backgroundColor: '#4CAF50', color: 'white' }}
      >
        Save Changes
      </Button>
    </Box>
  </Modal>
)}
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
    title: { marginBottom: 3 },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: 2,
      mt: 2,
    },
    button: {
      backgroundColor: 'white',
      color: '#00c853',
      padding: '10px 20px',
      fontWeight: 'bold',
      '&:hover': { backgroundColor: '#69f0ae' },
    },
    profileButton: { 
      backgroundColor: '#4CAF50', 
      color: 'white', 
      padding: '10px 20px', 
      fontWeight: 'bold', 
      '&:hover': { backgroundColor: '#69f0ae' } 
    },
    modalContent: {
      position: 'absolute',
      top: '10%', // Positions the modal closer to the top
      left: '50%',
      transform: 'translate(-50%, 0)',
      width: '90%', // Takes up 90% of the screen width
      maxHeight: '80vh', // Limits height to 80% of the viewport height
      overflowY: 'auto', // Enables scrolling if content overflows
      bgcolor: 'background.paper',
      padding: '20px', // Adds padding for content spacing
      borderRadius: '8px',
      boxShadow: 24,
    },
    profileInfo: { 
      mt: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 1 
    },
    doneButton: { 
      mt: 2, 
      backgroundColor: '#00c853', 
      color: 'white', 
      '&:hover': { backgroundColor: '#69f0ae' } 
    },
    resultsContainer: { 
      mt: 2 
    },
    resultItem: { 
      borderBottom: '1px solid #ccc', 
      paddingBottom: 2, 
      mb: 2 
    },
  };
  

export default SellerHomePage;
