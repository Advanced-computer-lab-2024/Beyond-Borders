import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristComplaintsModal() {
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintBody, setComplaintBody] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle complaint submission
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the TouristUsername from local storage
    const touristUsername = localStorage.getItem('username');
    if (!touristUsername) {
      setResponseMessage('You need to log in first.');
      return;
    }

    const complaintData = {
      Title: complaintTitle,
      Body: complaintBody,
      TouristUsername: touristUsername,
    };

    try {
      const response = await axios.post('/createComplaint', complaintData);

      if (response.status === 201) {
        setResponseMessage('Complaint created successfully!');
        setComplaintTitle(''); // Clear the form
        setComplaintBody('');
      } else {
        setResponseMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setResponseMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          Submit a Complaint
        </Typography>
        <form onSubmit={handleComplaintSubmit}>
          <TextField
            label="Title"
            value={complaintTitle}
            onChange={(e) => setComplaintTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Body"
            value={complaintBody}
            onChange={(e) => setComplaintBody(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#45a049' } }}
          >
            Submit Complaint
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
        <Button
          variant="contained"
          sx={styles.doneButton}
          onClick={() => navigate('/touristHome')}
        >
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
  doneButton: {
    mt: 2, backgroundColor: '#00c853', color: 'white', '&:hover': { backgroundColor: '#69f0ae' },
  },
};

export default TouristComplaintsModal;
