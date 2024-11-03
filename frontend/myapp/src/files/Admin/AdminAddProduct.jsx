import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const AdminAddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPicture, setProductPicture] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is logged in
    const seller = localStorage.getItem('username');
    if (!seller) {
      setResponseMessage('You need to log in first.');
      return;
    }

    const formData = {
      Seller: seller,
      Name: productName,
      Description: productDescription,
      Price: parseFloat(productPrice),
      Quantity: parseInt(productQuantity, 10),
      Picture: productPicture,
    };

    try {
      const response = await axios.post('/api/addProductSeller', formData);

      if (response.status === 200) {
        setResponseMessage('Product created successfully!');
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setProductQuantity('');
        setProductPicture('');
        setTimeout(() => {
            window.location.href = `HomePageAdmin`;
          }, 900);
      } else {
        setResponseMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setResponseMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <Box
      className="container"
      sx={{
        maxWidth: '600px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" align="center">Add New Product</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Product Name"
          name="productName"
          placeholder="Enter product name"
          required
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="productDescription"
          placeholder="Enter product description"
          required
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Price"
          name="productPrice"
          type="number"
          placeholder="Enter product price"
          required
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Quantity"
          name="productQuantity"
          type="number"
          placeholder="Enter product quantity"
          required
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Picture URL"
          name="productPicture"
          placeholder="Enter picture URL"
          required
          value={productPicture}
          onChange={(e) => setProductPicture(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#40be5b',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            width: '100%',
            marginTop: '20px',
            '&:hover': { backgroundColor: '#7ccf8e' },
          }}
        >
          Add Product
        </Button>
      </form>
      {responseMessage && (
        <Typography
          variant="body1"
          align="center"
          sx={{
            marginTop: '20px',
            color: responseMessage.includes('Error') ? 'red' : 'green',
          }}
        >
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default AdminAddProduct;
