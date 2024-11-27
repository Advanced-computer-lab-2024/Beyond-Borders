import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const username = localStorage.getItem('username') || 'User'; // Retrieve username from localStorage


const styles = {
  modalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    backgroundColor: "#fff",
    boxShadow: 24,
    borderRadius: "10px",
    padding: "20px",
  },
  actionButton: {
    backgroundColor: "#192959",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#192959",
    },
  },
};

function AddProductModalSeller({ open, handleClose, handleCreateProduct }) {
  const [newProduct, setNewProduct] = useState({
    Name: "",
    Description: "",
    Price: "",
    Quantity: "",
    Seller: username,
    Picture: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!newProduct.Name || !newProduct.Description || !newProduct.Price || !newProduct.Quantity || !newProduct.Seller || !newProduct.Picture) {
      setErrorMessage("All fields are required, including Picture!");
      return;
    }
  
    // Create FormData object to send the file
    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      formData.append(key, newProduct[key]);
    });
  
    // Call the handler to create the product
    handleCreateProduct(formData);
  
    // Reset the form
    setNewProduct({
      Name: "",
      Description: "",
      Price: "",
      Quantity: "",
      Seller: "",
      Picture: "",
    });
  
    setErrorMessage("");
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" gutterBottom>
          Add Product
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter the details for the new product
        </Typography>
        <TextField
          name="Name"
          label="Product Name"
          fullWidth
          value={newProduct.Name}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="Description"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={newProduct.Description}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="Price"
          label="Price"
          type="number"
          fullWidth
          value={newProduct.Price}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="Quantity"
          label="Quantity"
          type="number"
          fullWidth
          value={newProduct.Quantity}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        {/* <TextField
          name="Seller"
          label="Seller Username"
          fullWidth
          value={newProduct.Seller}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        /> */}
         <TextField
        name="Picture"
        type="file"
        fullWidth
        onChange={(e) => setNewProduct((prev) => ({ ...prev, Picture: e.target.files[0] }))}
        sx={{ mb: 2 }}
        inputProps={{ accept: "image/*" }} // Restrict to image files
        />

        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={styles.actionButton}
        >
          Create Product
        </Button>
      </Box>
    </Modal>
  );
}

export default AddProductModalSeller;
