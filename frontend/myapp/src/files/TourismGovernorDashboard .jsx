// src/files/Tourist/TourismGovernorDashboard.jsx
import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import axios from 'axios';

const TourismGovernorDashboard = () => {
  const [tagName, setTagName] = useState('');
  const [showTagForm, setShowTagForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // New states for password update
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');

  // Toggle the Add Tag form visibility
  const toggleTagForm = () => {
    setShowTagForm(!showTagForm);
    setResponseMessage('');
    setErrorMessage('');
  };

  // Toggle the Update Password modal visibility
  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
    setPasswordUpdateMessage('');
    setErrorMessage('');
  };

  // Handle form submission for adding a new tag
  const handleTagFormSubmit = async (event) => {
    event.preventDefault();

    setResponseMessage('');
    setErrorMessage('');

    const formData = { NameOfHistoricalTags: tagName };

    try {
      const response = await fetch('/createHistoricalTag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage('Historical Tag added successfully!');
        setErrorMessage('');
        setTagName(''); // Reset the form
      } else {
        setErrorMessage(`Error: ${result.error}`);
        setResponseMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setResponseMessage('');
    }
  };

  // Handle form submission for updating the password
  const handlePasswordFormSubmit = async (event) => {
    event.preventDefault();
  
    setPasswordUpdateMessage('');
    setErrorMessage('');
  
    const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
    const formData = { Username: username, newPassword };
  
    try {
      const response = await axios.put('/updateGovernorPassword', formData);
  
      if (response.status === 200) {
        setPasswordUpdateMessage('Password updated successfully!');
        setErrorMessage('');
        setNewPassword(''); // Reset the password field
        window.alert('Password updated successfully!'); // Show alert
        togglePasswordModal(); // Close the modal
      } else {
        setErrorMessage(`Error: ${response.data.error}`);
        setPasswordUpdateMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the password.');
      setPasswordUpdateMessage('');
    }
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tourism Governor Dashboard</h2>
      <button
        style={styles.button}
        onClick={() => (window.location.href = '/MuseumTG')}
      >
        Museums
      </button>
      <button
        style={styles.button}
        onClick={() => (window.location.href = '/HistoricalPlaceTG')}
      >
        Historical Places
      </button>
      <button style={styles.button} onClick={toggleTagForm}>
        Add New Historical Tag
      </button>
      <button style={styles.button} onClick={togglePasswordModal}>
        Change Password
      </button>

      {showTagForm && (
        <div style={styles.tagForm}>
          <h2 style={styles.heading}>Add New Historical Tag</h2>
          <form onSubmit={handleTagFormSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="name">Tag Name:</label>
              <input
                type="text"
                id="name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Tag Name"
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Add Historical Tag
            </button>
            {responseMessage && (
              <div style={{ ...styles.message, color: 'green' }}>
                {responseMessage}
              </div>
            )}
            {errorMessage && (
              <div style={{ ...styles.message, color: 'red' }}>
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Password Update Modal */}
      <Modal open={showPasswordModal} onClose={togglePasswordModal}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6" component="h2">
            Update Password
          </Typography>
          <form onSubmit={handlePasswordFormSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="newPassword">New Password:</label>
              <TextField
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                fullWidth
                sx={{ mt: 2 }}
              />
            </div>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Update Password
            </Button>
            {passwordUpdateMessage && (
              <div style={{ ...styles.message, color: 'green' }}>
                {passwordUpdateMessage}
              </div>
            )}
            {errorMessage && (
              <div style={{ ...styles.message, color: 'red' }}>
                {errorMessage}
              </div>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    maxWidth: '600px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    margin: '20px auto',
  },
  heading: {
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
    fontSize: '16px',
    width: '80%',
  },
  tagForm: {
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    backgroundColor: '#40be5b',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px',
  },
  message: {
    marginTop: '20px',
    textAlign: 'center',
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
};

export default TourismGovernorDashboard;
