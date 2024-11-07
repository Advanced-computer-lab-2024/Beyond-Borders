import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristComplaintsViewModal() {
  const [complaints, setComplaints] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const touristUsername = localStorage.getItem('username');
    if (!touristUsername) {
      setErrorMessage('You need to log in first.');
      return;
    }

    try {
      const response = await axios.get('/api/getComplaintsByTouristUsername', {
        params: { TouristUsername: touristUsername }
      });

      if (response.status === 200) {
        setComplaints(response.data);
      } else {
        setErrorMessage(response.data.error || 'An error occurred while fetching complaints.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <Modal open={true} onClose={() => navigate('/touristHome')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          Your Issued Complaints
        </Typography>

        {errorMessage && (
          <Typography
            variant="body1"
            align="center"
            sx={{ color: 'red', marginTop: '20px' }}
          >
            {errorMessage}
          </Typography>
        )}

        {complaints.length > 0 ? (
          complaints.map((complaint, index) => (
            <Box key={index} sx={styles.complaintItem}>
              <Typography variant="body1"><strong>Title:</strong> {complaint.Title}</Typography>
              <Typography variant="body2"><strong>Body:</strong> {complaint.Body}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {complaint.Status}</Typography>
            </Box>
          ))
        ) : !errorMessage ? (
          <Typography align="center" sx={{ marginTop: '20px' }}>
            You haven't filed any complaints.
          </Typography>
        ) : null}

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
  complaintItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    marginBottom: '10px',
  },
  doneButton: {
    mt: 2, backgroundColor: '#00c853', color: 'white', '&:hover': { backgroundColor: '#69f0ae' },
  },
};

export default TouristComplaintsViewModal;
