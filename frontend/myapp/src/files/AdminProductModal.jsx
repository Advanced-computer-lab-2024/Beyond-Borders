import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminProductModal() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/viewAllProductsSeller');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Modal open={true} onClose={() => navigate('/HomePageAdmin')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          All Products
        </Typography>
        <Box sx={styles.listContainer}>
          {products.map(product => (
            <Box key={product.id} sx={styles.item}>
              <Typography variant="body1"><strong>Name:</strong> {product.Name}</Typography>
              <Typography variant="body2"><strong>Price:</strong> ${product.Price}</Typography>
              <Typography variant="body2"><strong>Description:</strong> {product.Description}</Typography>
            </Box>
          ))}
        </Box>
        <Button variant="contained" sx={styles.doneButton} onClick={() => navigate('/HomePageAdmin')}>
          Done
        </Button>
      </Box>
    </Modal>
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
    p: 2, borderBottom: '1px solid #ddd',
  },
  doneButton: {
    mt: 2, backgroundColor: '#00c853', '&:hover': { backgroundColor: '#69f0ae' },
  },
};

export default AdminProductModal;
