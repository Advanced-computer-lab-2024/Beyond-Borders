import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminComplaintsModal({ filteredComplaints, onClose }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [activeModal, setActiveModal] = useState('complaints');
  const navigate = useNavigate();

  
   
  
    useEffect(() => {
      // Use filtered complaints if provided, otherwise fetch all complaints
      if (filteredComplaints) {
        setComplaints(filteredComplaints);
      } else {
        fetchComplaints();
      }
    }, [filteredComplaints]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/getAllComplaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const saveReply = async () => {
    if (!replyText) {
      alert('Please enter a reply.');
      return;
    }

    try {
      const response = await axios.put('/replyToComplaint', {
        Title: selectedComplaint.Title,
        Reply: replyText,
      });

      if (response.status === 200) {
        alert('Reply saved successfully!');
        fetchComplaints(); // Refresh complaints after reply is saved
        setActiveModal('complaints');
      } else {
        throw new Error('Error saving reply');
      }
    } catch (error) {
      console.error('Error saving reply:', error);
      alert('Failed to save reply: ' + error.message);
    }
  };

  const toggleResolvedStatus = (complaintId) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint._id === complaintId
          ? { ...complaint, Status: complaint.Status === 'Resolved' ? 'Pending' : 'Resolved' }
          : complaint
      )
    );
  };

  const saveStatus = async (complaint) => {
    const newStatus = complaint.Status === 'Resolved' ? 'Resolved' : 'Pending';

    try {
      const response = await axios.put('/updateComplaintStatus', {
        Title: complaint.Title,
        newStatus,
      });

      if (response.status === 200) {
        alert('Complaint status updated successfully!');
        fetchComplaints(); // Refresh complaints after updating status
      } else {
        throw new Error('Error updating status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + error.message);
    }
  };

  return (
    <Box>
      {activeModal === 'complaints' && (
        <Modal open={true} onClose={onClose || (() => navigate('/HomePageAdmin'))}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">
              All Complaints
            </Typography>
            <Box sx={styles.listContainer}>
              {complaints.length > 0 ? (
                complaints.map((complaint, index) => (
                  <Box key={index} sx={styles.item}>
                    <Typography variant="body1"><strong>Title:</strong> {complaint.Title}</Typography>
                    <Typography variant="body2"><strong>Body:</strong> {complaint.Body}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {new Date(complaint.Date).toLocaleDateString()}</Typography>
                    <Typography variant="body2"><strong>Reply:</strong> {complaint.Reply || 'No reply yet'}</Typography>
                    <Typography variant="body2"><strong>Tourist Username:</strong> {complaint.TouristUsername}</Typography>
                    
                    {/* Editable Checkbox for marking as resolved */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={complaint.Status === 'Resolved'}
                          onChange={() => toggleResolvedStatus(complaint._id)}
                        />
                      }
                      label={<Typography><strong>Status:</strong> Resolved</Typography>}
                    />

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setReplyText(complaint.Reply || '');
                          setActiveModal('replyComplaint');
                        }}
                        sx={styles.editButton}
                      >
                        Reply
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => saveStatus(complaint)}
                        sx={styles.editButton}
                      >
                        Save Status
                      </Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography>No complaints found.</Typography>
              )}
            </Box>
            <Button variant="contained" sx={styles.doneButton} onClick={onClose || (() => navigate('/HomePageAdmin'))}>
              Done
            </Button>
          </Box>
        </Modal>
      )}

      {activeModal === 'replyComplaint' && selectedComplaint && (
        <Modal open={true} onClose={() => setActiveModal('complaints')}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6">Reply to Complaint</Typography>
            <TextField
              label="Complaint Title"
              value={selectedComplaint.Title}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              variant="contained"
              onClick={saveReply}
              sx={{ mt: 2, backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#45a049' } }}
            >
              Save Reply
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

const styles = {
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 600,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
  listContainer: {
    maxHeight: 450,
    overflowY: 'auto',
    mt: 2,
  },
  item: {
    p: 2,
    borderBottom: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1,
    mb: 2,
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#00c853',
    color: 'white',
    '&:hover': { backgroundColor: '#69f0ae' },
  },
  editButton: {
    borderColor: '#4CAF50',
    color: '#4CAF50',
    '&:hover': {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
  },
};

export default AdminComplaintsModal;
