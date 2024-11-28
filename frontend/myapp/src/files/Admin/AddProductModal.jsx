import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

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
    marginTop: "5px",
  },
  uploadButton: {
    display: "inline-block",
    border: "1px solid #007BFF",
    borderRadius: "5px",
    padding: "10px 0px", // Increase padding to make the button longer
    color: "#007BFF",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%", // Make the button span the full width
    marginBottom: "20px", // Add space below the button
  },
  hiddenInput: {
    display: "none",
  },
};

function AddProductModal({ open, handleClose, handleCreateProduct }) {
  const [newProduct, setNewProduct] = useState({
    Name: "",
    Description: "",
    Price: "",
    Quantity: "",
    Seller: "",
    Picture: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({ ...prev, Picture: file }));
    }
  };

  const handleSubmit = () => {
    if (
      !newProduct.Name ||
      !newProduct.Description ||
      !newProduct.Price ||
      !newProduct.Quantity ||
      !newProduct.Seller ||
      !newProduct.Picture
    ) {
      setErrorMessage("All fields are required, including Picture!");
      return;
    }

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      formData.append(key, newProduct[key]);
    });

    handleCreateProduct(formData);

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
        <TextField
          name="Seller"
          label="Seller Username"
          fullWidth
          value={newProduct.Seller}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          accept="image/*"
          id="upload-picture"
          style={styles.hiddenInput}
          onChange={handleFileChange}
        />
        <label htmlFor="upload-picture" style={styles.uploadButton}>
          Upload Picture
        </label>
        {newProduct.Picture && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected File: {newProduct.Picture.name}
          </Typography>
        )}

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

export default AddProductModal;
