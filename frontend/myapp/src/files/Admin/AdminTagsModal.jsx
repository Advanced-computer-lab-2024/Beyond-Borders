import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminTagsModal() {
  const [tags, setTags] = useState([]); // State to store tags
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/readAllTags');
        setTags(response.data); // Set tags data from API response
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  return (
    <Modal open={true} onClose={() => navigate('/HomePageAdmin')}>
      <Box sx={styles.modalContent}>
        <Typography variant="h6" component="h2">
          All Created Tags
        </Typography>
        <Box sx={styles.listContainer}>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <Box key={index} sx={styles.item}>
                <Typography variant="body1"><strong>Tag Name:</strong> {tag.NameOfTags}</Typography>
              </Box>
            ))
          ) : (
            <Typography>No tags found.</Typography>
          )}
        </Box>
        <Button variant="contained" sx={styles.doneButton} onClick={() => navigate('/HomePageAdmin')}>
          Done
        </Button>
      </Box>
    </Modal>
  );
}

const styles = {
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
    backgroundColor: '#00c853',
    color: 'white',
    '&:hover': { backgroundColor: '#69f0ae' },
  },
};

export default AdminTagsModal;
