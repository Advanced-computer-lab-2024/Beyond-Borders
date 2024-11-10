import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';

function AdminDeleteRequestsModal({ onClose }) {
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch the delete requests from the backend
  useEffect(() => {
    const fetchDeleteRequests = async () => {
      try {
        const response = await axios.get('/api/readAllDeleteRequests'); // Endpoint to get pending delete requests
        setDeleteRequests(response.data);
      } catch (error) {
        setErrorMessage('Error fetching delete requests.');
        console.error('Error fetching delete requests:', error);
      }
    };

    fetchDeleteRequests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  // Handle accepting the deletion request (delete the account)
  const handleAccept = async (username) => {
    try {
      const response = await axios.post('/deleteAccount', { username: username });

      // Show success message
      alert(response.data.msg);

      // Remove the accepted request from the UI (update the state)
      setDeleteRequests((prevRequests) => 
        prevRequests.filter((request) => request.Username !== username)
      );
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error accepting delete request');
    }
  };

  // Handle rejecting the deletion request
  const handleReject = async (username) => {
    try {
      const response = await axios.post('/api/rejectRequestDeleteAccout', { Username: username });
      alert(response.data.msg);

      // Remove the rejected request from the state to update the UI
      setDeleteRequests((prevRequests) => prevRequests.filter(request => request.Username !== username));
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error rejecting delete request');
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={modalStyles.modalContent}>
        <Typography variant="h6" component="h2">
          Delete Requests
        </Typography>

        {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}

        {deleteRequests.length > 0 ? (
          <Box sx={modalStyles.listContainer}>
            {deleteRequests.map((request, index) => (
              <Box key={index} sx={modalStyles.item}>
                <Typography variant="body1">
                  <strong>Username:</strong> {request.Username}
                </Typography>
                <Typography variant="body2">
                  <strong>Request Date:</strong> {formatDate(request.createdAt)}
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> {request.Type}
                </Typography>

                <Box sx={modalStyles.buttonsContainer}>
                  <Button 
                    variant="contained" 
                    color="success" 
                    onClick={() => handleAccept(request.Username)} 
                    sx={modalStyles.acceptButton}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => handleReject(request.Username)} 
                    sx={modalStyles.rejectButton}
                  >
                    Reject
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>No delete requests found.</Typography>
        )}

        <Button variant="contained" onClick={onClose} sx={modalStyles.doneButton}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}

const modalStyles = {
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
  listContainer: {
    maxHeight: 300,
    overflowY: 'auto',
    mt: 2,
  },
  item: {
    p: 2,
    borderBottom: '1px solid #ddd',
    mb: 2,
  },
  buttonsContainer: {
    mt: 2,
    display: 'flex',
    gap: 2,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    '&:hover': { backgroundColor: '#388E3C' },
  },
  rejectButton: {
    backgroundColor: '#FF5252',
    '&:hover': { backgroundColor: '#D32F2F' },
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#FF0000',
    '&:hover': { backgroundColor: '#FF5252' },
  },
};

export default AdminDeleteRequestsModal;
