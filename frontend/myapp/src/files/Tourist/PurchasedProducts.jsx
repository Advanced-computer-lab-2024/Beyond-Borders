import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PurchasedProducts({ currency, onClose }) {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [productReviews, setProductReviews] = useState({});
  const [isReviewEnabled, setIsReviewEnabled] = useState({});
  const [convertedPrices, setConvertedPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.get(`/api/viewPurchasedProducts`, { params: { Username: username } });
        setPurchasedProducts(response.data);
      } catch (error) {
        console.error('Error fetching purchased products:', error);
      }
    };
    fetchPurchasedProducts();
  }, []);

  useEffect(() => {
    const convertProductPrices = async () => {
      const newConvertedPrices = {};

      await Promise.all(
        purchasedProducts.map(async (product) => {
          try {
            const response = await axios.post('/convertCurr', {
              priceEgp: product.Price || 0,
              targetCurrency: currency,
            });
            newConvertedPrices[product._id] = response.data.convertedPrice;
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
  }, [currency, purchasedProducts]);

  const handleRateProduct = async (productName) => {
    const touristUsername = localStorage.getItem('username');
    const ratingValue = parseInt(productRatings[productName], 10);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Rating must be a number between 1 and 5.");
      return;
    }

    try {
      const response = await axios.put('/ratePurchasedProduct', {
        touristUsername,
        productName,
        rating: ratingValue,
      });
      alert(response.data.msg);

      const updatedProducts = purchasedProducts.map(product =>
        product.Name === productName
          ? { ...product, Ratings: response.data.newAverageRating }
          : product
      );
      setPurchasedProducts(updatedProducts);

      // Enable review for the rated product
      setIsReviewEnabled((prev) => ({ ...prev, [productName]: true }));
    } catch (error) {
      console.error('Error rating product:', error);
      alert('An error occurred while submitting your rating.');
    }
  };

  const handleReviewProduct = async (productName) => {
    const touristUsername = localStorage.getItem('username');
    const review = productReviews[productName]?.trim();

    if (!review || review.length === 0) {
      alert("Review cannot be empty.");
      return;
    }

    try {
      const response = await axios.put('/reviewPurchasedProduct', {
        touristUsername,
        productName,
        review,
      });
      alert(response.data.msg);

      // Clear the review field after submission
      setProductReviews(prevReviews => ({ ...prevReviews, [productName]: '' }));
    } catch (error) {
      console.error('Error adding review:', error);
      alert('An error occurred while submitting your review.');
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          My Purchased Products
        </Typography>

        <Box sx={styles.listContainer}>
          {purchasedProducts.length > 0 ? (
            purchasedProducts.map(product => (
              <Box key={product._id} sx={styles.item}>
                <Typography variant="body1"><strong>Name:</strong> {product.Name}</Typography>
                <Typography variant="body2"><strong>Category:</strong> {product.Category}</Typography>
                <Typography variant="body2">
                  <strong>Price:</strong> {currency === 'EGP' ? `${product.Price || 0} EGP` : `${convertedPrices[product._id] || 'Loading...'} ${currency}`}
                </Typography>
                <Typography variant="body2"><strong>Current Rating:</strong> {product.Ratings || 'Not rated yet'}</Typography>

                {/* Rating Input for Product */}
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    label="Rate this Product"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={productRatings[product.Name] || ''}
                    onChange={(e) => setProductRatings({ ...productRatings, [product.Name]: e.target.value })}
                    inputProps={{ min: 1, max: 5 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleRateProduct(product.Name)}
                    sx={styles.rateButton}
                  >
                    Submit Rating
                  </Button>
                </Box>

                {/* Review Input for Product */}
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Write a Review"
                    variant="outlined"
                    size="small"
                    multiline
                    fullWidth
                    disabled={!isReviewEnabled[product.Name]} // Disable until rating is submitted
                    value={productReviews[product.Name] || ''}
                    onChange={(e) => setProductReviews({ ...productReviews, [product.Name]: e.target.value })}
                    rows={3}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleReviewProduct(product.Name)}
                    sx={styles.reviewButton}
                    disabled={!isReviewEnabled[product.Name]} // Disable button until rating is submitted
                  >
                    Submit Review
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No purchased products found.</Typography>
          )}
        </Box>

        <Button variant="contained" sx={styles.doneButton} onClick={onClose}>Done</Button>
      </Box>
    </Modal>
  );
}

PurchasedProducts.propTypes = {
  currency: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = {
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  listContainer: {
    maxHeight: '300px',
    overflowY: 'auto',
    borderTop: '1px solid #ddd',
    marginTop: '1rem',
    paddingTop: '1rem',
  },
  item: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #ddd',
  },
  doneButton: {
    marginTop: '1rem',
    backgroundColor: '#00c853',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#69f0ae',
    },
  },
  rateButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': { backgroundColor: '#63a4ff' },
  },
  reviewButton: {
    backgroundColor: '#89CFF0',
    color: 'white',
    marginTop: '0.5rem',
    '&:hover': { backgroundColor: '#A7DFFF' },
  },
};

export default PurchasedProducts;
