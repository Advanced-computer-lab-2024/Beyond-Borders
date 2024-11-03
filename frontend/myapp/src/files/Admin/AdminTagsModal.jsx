import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminTagsModal() {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [activeModal, setActiveModal] = useState('tags');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/readAllTags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const saveUpdatedTag = async () => {
    if (!newTagName) {
      alert('Please enter a new tag name.');
      return;
    }

    try {
      const response = await axios.put('/api/updateTag', {
        oldTagName: selectedTag,
        newTagName,
      });

      if (response.status === 200) {
        alert('Tag updated successfully!');
        fetchTags();
        setActiveModal('tags');
      } else {
        throw new Error('Error updating tag');
      }
    } catch (error) {
      console.error('Error updating tag:', error);
      alert('Failed to update tag: ' + error.message);
    }
  };

  const deleteTag = async (tagName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the tag "${tagName}"?`);
    if (!confirmDelete) return;

    try {
      const response = await axios.post('/api/deleteTag', { TagName: tagName });

      if (response.status === 200) {
        alert('Tag deleted successfully!');
        fetchTags();
      } else {
        throw new Error('Error deleting tag');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Failed to delete tag: ' + error.message);
    }
  };

  return (
    <Box>
      {activeModal === 'tags' && (
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
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSelectedTag(tag.NameOfTags);
                          setNewTagName(tag.NameOfTags);
                          setActiveModal('editTag');
                        }}
                        sx={styles.editButton}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => deleteTag(tag.NameOfTags)}
                        sx={styles.deleteButton}
                      >
                        Delete
                      </Button>
                    </Box>
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
      )}

      {activeModal === 'editTag' && selectedTag && (
        <Modal open={true} onClose={() => setActiveModal('tags')}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6">Update Tag</Typography>
            <TextField
              label="Old Tag Name"
              value={selectedTag}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="New Tag Name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              variant="contained"
              onClick={saveUpdatedTag}
              sx={{ mt: 2, backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#45a049' } }}
            >
              Save Changes
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  deleteButton: {
    borderColor: '#d32f2f',
    color: '#d32f2f',
    '&:hover': {
      backgroundColor: '#d32f2f',
      color: 'white',
    },
  },
};

export default AdminTagsModal;
