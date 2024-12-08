import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import axios from "axios";

const RegisterSeller = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Username: "",
    Password: "",
    Name: "",
    Description: "",
    CombinedDocument: null, // Single document field
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      CombinedDocument: e.target.files[0], // Only one document
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.post(
        "http://localhost:8000/addUnregisteredSeller",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        setResponseMessage("Seller registered successfully!");
        setTimeout(() => {
          window.location.href = "/loginSeller";
        }, 2000);
      } else {
        setResponseMessage(
          `Error: ${response.data.error || "Failed to register seller."}`
        );
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setResponseMessage(
          `Error: ${error.response.data.error || "An error occurred."}`
        );
      } else {
        setResponseMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "auto",
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" align="center">
        Register Seller
      </Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          name="Email"
          required
          value={formData.Email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="Username"
          required
          value={formData.Username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="Password"
          required
          value={formData.Password}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="Name"
          required
          value={formData.Name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="Description"
          value={formData.Description}
          onChange={handleChange}
        />

        {/* Single File Upload Field */}
        <Typography
          variant="h6"
          sx={{
            marginTop: "20px",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          Upload Document:
        </Typography>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ textTransform: "none", marginTop: "10px" }}
        >
          Upload ID & Taxation Registry
          <input
            type="file"
            name="CombinedDocument"
            accept="application/pdf"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {formData.CombinedDocument && (
          <Typography variant="body2" sx={{ marginTop: "5px" }}>
            Selected: {formData.CombinedDocument.name}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#192959",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            width: "100%",
            marginTop: "20px",
            "&:hover": { backgroundColor: "#4b5a86" },
          }}
        >
          Register
        </Button>
      </form>
      {responseMessage && (
        <Typography
          variant="body1"
          align="center"
          sx={{
            marginTop: "20px",
            color: responseMessage.includes("Error") ? "red" : "green",
          }}
        >
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterSeller;
