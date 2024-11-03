import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminActivityModal() {
  const [categories, setCategories] = useState([]); // State to store categories
  const [selectedCategory, setSelectedCategory] = useState(null); // State to hold the selected category for editing
  const [newCategoryName, setNewCategoryName] = useState(''); // State for new category name input
  const [activeModal, setActiveModal] = useState('categories'); // Modal view toggle ('categories' or 'editCategory')
  const navigate = useNavigate();

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/readAllActivityCategories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Update category name
  const saveUpdatedCategory = async () => {
    if (!newCategoryName) {
      alert('Please enter a new category name.');
      return;
    }

    try {
      const response = await axios.put('/api/updateCategory', {
        oldCategoryName: selectedCategory,
        newCategoryName,
      });

      if (response.status === 200) {
        alert('Category updated successfully!');
        fetchCategories(); // Refresh categories after update
        setActiveModal('categories'); // Return to categories list view
      } else {
        throw new Error('Error updating category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category: ' + error.message);
    }
  };

  // Delete a category
  const deleteCategory = async (categoryName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the category "${categoryName}"?`);
    if (!confirmDelete) return;

    try {
      const response = await axios.post('/api/deleteActivityCategory', { CategoryName: categoryName });

      if (response.status === 200) {
        alert('Category deleted successfully!');
        fetchCategories(); // Refresh categories after deletion
      } else {
        throw new Error('Error deleting category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category: ' + error.message);
    }
  };

  return (
    <Box>
      {/* Categories List Modal */}
      {activeModal === 'categories' && (
        <Modal open={true} onClose={() => navigate('/HomePageAdmin')}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6" component="h2">
              All Created Categories
            </Typography>
            <Box sx={styles.listContainer}>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <Box key={index} sx={styles.item}>
                    <Typography variant="body1"><strong>Category Name:</strong> {category.NameOfCategory}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSelectedCategory(category.NameOfCategory);
                          setNewCategoryName(category.NameOfCategory); // Initialize new name with current name
                          setActiveModal('editCategory'); // Open edit modal
                        }}
                        sx={styles.editButton}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => deleteCategory(category.NameOfCategory)}
                        sx={styles.deleteButton}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography>No categories found.</Typography>
              )}
            </Box>
            <Button variant="contained" sx={styles.doneButton} onClick={() => navigate('/HomePageAdmin')}>
              Done
            </Button>
          </Box>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {activeModal === 'editCategory' && selectedCategory && (
        <Modal open={true} onClose={() => setActiveModal('categories')}>
          <Box sx={styles.modalContent}>
            <Typography variant="h6">Update Category</Typography>
            <TextField
              label="Old Category Name"
              value={selectedCategory}
              InputProps={{
                readOnly: true, // Make the old category name read-only
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              variant="contained"
              onClick={saveUpdatedCategory}
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

export default AdminActivityModal;
