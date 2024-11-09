import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';

function AdminDeleteRequestsModal({ onClose }) {
  const [deleteRequests, setDeleteRequests] = useState([]);

  useEffect(() => {
    const fetchDeleteRequests = async () => {
      try {
        const response = await axios.get('/api/readAllDeleteRequests');
        setDeleteRequests(response.data);
      } catch (error) {
        console.error('Error fetching delete requests:', error);
      }
    };

    fetchDeleteRequests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={modalStyles.modalContent}>
        <Typography variant="h6" component="h2">
          Delete Requests
        </Typography>

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
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#FF0000',
    '&:hover': { backgroundColor: '#FF5252' },
  },
};

export default AdminDeleteRequestsModal;
