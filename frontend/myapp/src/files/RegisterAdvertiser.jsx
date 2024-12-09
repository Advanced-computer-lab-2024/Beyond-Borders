import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import axios from "axios";

const RegisterAdvertiser = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Username: "",
    Password: "",
    Website: "",
    Hotline: "",
    CompanyProfile: "",
    AdvertiserDocument: null, // New field for the uploaded document
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
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.files[0],
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
        "http://localhost:8000/addUnregisteredAdvertiser",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        setResponseMessage("Advertiser registered successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setResponseMessage(
          `Error: ${response.data.error || "Failed to register advertiser."}`
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
        Register Advertiser
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
          label="Website"
          name="Website"
          value={formData.Website}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Hotline"
          name="Hotline"
          value={formData.Hotline}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Company Profile"
          name="CompanyProfile"
          value={formData.CompanyProfile}
          onChange={handleChange}
        />

        <Typography variant="h6" sx={{
            marginTop: "20px",
            textAlign: "left",
            fontSize: "14px",
          }}>
          Upload Documents:
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: "10px" }}>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ textTransform: "none" }}
            >
              Upload ID & Taxation Registry
              <input
                type="file"
                name="AdvertiserDocument"
                accept="application/pdf"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {formData.AdvertiserDocument && (
              <Typography variant="body2" sx={{ marginTop: "5px" }}>
                Selected: {formData.AdvertiserDocument.name}
              </Typography>
            )}
          </Grid>
        </Grid>

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

export default RegisterAdvertiser;
