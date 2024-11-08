// src/files/Tourist/TouristProductModal.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function TouristProductModal({ currency, onClose }) {
  const [products, setProducts] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState({});
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

  // Fetch converted prices when currency changes
  useEffect(() => {
    const convertProductPrices = async () => {
      const newConvertedPrices = {};

      await Promise.all(
        products.map(async (product) => {
          try {
            const response = await axios.post('/convertCurr', {
              priceEgp: product.Price || 0,
              targetCurrency: currency,
            });
            newConvertedPrices[product.id] = response.data.convertedPrice;
          } catch (error) {
            console.error(`Error converting price for ${product.Name}:`, error);
          }
        })
      );

      setConvertedPrices(newConvertedPrices);
    };

    if (currency !== 'EGP') {
      convertProductPrices();
    }
  }, [currency, products]);

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          All Products
        </Typography>
        <Box sx={styles.listContainer}>
          {products.map(product => (
            <Box key={product.id} sx={styles.item}>
              <Typography variant="body1"><strong>Name:</strong> {product.Name}</Typography>
              <Typography variant="body2">
                <strong>Price:</strong> {currency === 'EGP' ? `${product.Price || 0} EGP` : `${convertedPrices[product.id] || 'Loading...'} ${currency}`}
              </Typography>
              <Typography variant="body2"><strong>Description:</strong> {product.Description}</Typography>
              
              <Typography variant="body2"><strong>Quantity:</strong> {product.Quantity}</Typography>
              <Typography variant="body2"><strong>Seller:</strong> {product.Seller}</Typography>
              <Typography variant="body2"><strong>Ratings:</strong> {product.Ratings}</Typography>  
            </Box>
          ))}
        </Box>
        <Button variant="contained" sx={styles.doneButton} onClick={onClose}>
          Done
        </Button>
      </Box>
    </Modal>
  );
}

TouristProductModal.propTypes = {
  currency: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
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

export default TouristProductModal;
