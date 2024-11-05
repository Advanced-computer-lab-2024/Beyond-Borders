import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function AdminProductModal({ filteredProducts, onClose }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModal, setActiveModal] = useState('products');
  const navigate = useNavigate();


  useEffect(() => {
    if (filteredProducts) {
      // Use filtered products if provided
      setProducts(filteredProducts);
    } else {
      // Otherwise, fetch all products
      fetchProducts();
    }
  }, [filteredProducts]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/viewAllProductsSeller');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const editProduct = async () => {
    if (!selectedProduct || !selectedProduct.Name || !selectedProduct.Seller) {
      alert('Product name and seller are required for editing.');
      return;
    }
    try {
      const response = await axios.put('/api/editProductSeller', selectedProduct);
      if (response.status === 200) {
        alert('Product updated successfully!');
        fetchProducts(); // Refresh product list after editing
        setActiveModal('products'); // Close edit modal
      } else {
        alert('Failed to update product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert(`Failed to update product: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Box>
      {/* Products Modal */}
      {activeModal === 'products' && (
        <Modal open={true} onClose={onClose}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">Products</Typography>
            <Box sx={styles.listContainer}>
              {products.length > 0 ? (
                products.map((product) => (
                  <Box key={product._id} sx={styles.item}>
                    {product.Picture && (
                      <img src={product.Picture} alt={product.Name} style={styles.productImage} />
                    )}
                    <Typography variant="body1"><strong>Name:</strong> {product.Name}</Typography>
                    <Typography variant="body2"><strong>Price:</strong> ${product.Price}</Typography>
                    <Typography variant="body2"><strong>Description:</strong> {product.Description}</Typography>
                    <Typography variant="body2"><strong>Quantity:</strong> {product.Quantity}</Typography>
                    <Typography variant="body2"><strong>Sales:</strong> {product.Sales}</Typography>
                    <Typography variant="body2"><strong>Total Price of Sales:</strong> ${product.TotalPriceOfSales}</Typography>
                    <Typography variant="body2"><strong>Seller:</strong> {product.Seller}</Typography>
                    <Typography variant="body2"><strong>Rating:</strong> {JSON.stringify(product.Ratings)}</Typography>
                    <Typography variant="body2"><strong>Reviews:</strong> {JSON.stringify(product.Reviews)}</Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedProduct(product); // Set selected product
                        setActiveModal('editProduct'); // Open edit modal
                      }}
                      sx={styles.editButton}
                    >
                      Edit
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography>No products found.</Typography>
              )}
            </Box>
            <Button variant="contained" sx={styles.doneButton} onClick={() => navigate('/HomePageAdmin')}>
              Done
            </Button>
          </Box>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {activeModal === 'editProduct' && selectedProduct && (
        <Modal open={true} onClose={() => setActiveModal('products')}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6">Edit Product</Typography>
            <TextField
              label="Name"
              value={selectedProduct.Name}
              InputProps={{
                readOnly: true, // Makes the field read-only but not visually disabled
              }}
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
              onClick={editProduct}
              sx={{ mt: 2, backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#45a049' } }}
            >
              Save Changes
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

const styles = {
  modalContent: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 500, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
  },
  listContainer: {
    maxHeight: 300, overflowY: 'auto', mt: 2,
  },
  item: {
    p: 2, borderBottom: '1px solid #ddd', display: 'flex', flexDirection: 'column', gap: 1,
  },
  productImage: {
    width: '100%', height: 'auto', marginBottom: 8,
  },
  doneButton: {
    mt: 2, backgroundColor: '#00c853', '&:hover': { backgroundColor: '#69f0ae' },
  },
  editButton: {
    backgroundColor: '#40be5b',
    color: 'white',
    mt: 1,
    '&:hover': {
      backgroundColor: '#7ccf8e', // Shade of green on hover
    },
  },
};

export default AdminProductModal;
