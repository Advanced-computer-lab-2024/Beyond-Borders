import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, Modal, TextField, Divider   } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import BlockIcon from '@mui/icons-material/Block';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


import axios from 'axios';

function Deactivated() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [scrollPositions, setScrollPositions] = useState({});
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [selectedActivity, setSelectedActivity] = useState(null); // State for selected activity
  const [showBackToTop, setShowBackToTop] = useState(false); // State for button visibility
  //done for categories and tags
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  //done for categories and tags
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  //done for categories and tags
  const [editMode, setEditMode] = useState(null); // Tracks which category is in edit mode
  const [editModeTags, setEditModeTags] = useState(null); // Tracks which category is in edit mode
  //done for categories and tags
  const [editingCategoryName, setEditingCategoryName] = useState(''); // Tracks the name being edited
  const [editingTagName, setEditingTagName] = useState(''); // Tracks the name being edited
  //done for categories and tags
  const [addMode, setAddMode] = useState(false); // Tracks if add mode is active
  const [addModeTags, setAddModeTags] = useState(false); // Tracks if add mode is active
  //done for categories and tags
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogOpenTags, setDeleteDialogOpenTags] = useState(false);
  //done for categories and tags
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [tagToDelete, setTagToDelete] = useState(null);

  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState({});
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
const [itineraryToDeactivate, setItineraryToDeactivate] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
    fetchCategories();
    fetchTags();
    const handleScroll = () => {
      // Check if the user is near the bottom of the page
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchActivities = async () => {
    const username = localStorage.getItem('username');
        if (!username) {
            alert('You need to log in first.');
            return;
        }
    try {
        const response = await axios.get(`/api/viewMyDeactivatedItinerariesTourGuide`, {
            params: { TourGuide: username }
        });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/readAllActivityCategories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  
  const handleUpdateItinerary = async (index) => {
    const updatedItinerary = activities[index]; // Get the updated activity data
  
    try {
      const response = await axios.put('/api/updateItinerary', updatedItinerary);
      alert(response.data.msg || "Itinerary updated successfully.");
    } catch (error) {
      console.error("Error updating itinerary:", error);
      alert(`An error occurred while updating the itinerary: ${error.response?.data?.error || "Unknown error"}`);
    }
  };
  
  
  
  const handleEditFieldChange = (index, field, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index][field] = value; // Update the specific field
    setActivities(updatedActivities);
  };
  
  const toggleEditing = (index) => {
    setEditing((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the editing state for this index
    }));
  };
  
  

  // Fetch tags from backend
  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/readAllTags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  


  const handleFlagClick = (itinerary) => {
    setSelectedActivity(itinerary);
    setOpenDialog(true); // Open dialog when flag button is clicked
  };

  const confirmFlagActivity = async () => {
    if (selectedActivity) {
      try {
        const response = await axios.post('/api/flagItinerary', { title: selectedActivity.Title });
        if (response.status === 200) {
          //alert(response.data.message);
          fetchActivities();
        }
      } catch (error) {
        console.error('Error flagging activity:', error);
        alert('An error occurred while flagging the activity.');
      }
    }
    setOpenDialog(false); // Close the dialog after confirming
  };

  const renderRating = (Ratings) => {
    const roundedRating = Math.round(Ratings * 10) / 10;
    const fullStars = Math.floor(Ratings);
    const halfStars = roundedRating > fullStars ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
  
    return (
      <Box sx={styles.ratingContainer}>
        <Typography variant="body2" sx={{ fontSize: '24px', position: 'absolute', right: '170px', bottom: '2px' }}>
          {roundedRating}
        </Typography>
        {[...Array(fullStars)].map((_, index) => (
          <StarIcon key={`full-${index}`} sx={{ fontSize: '32px' }} />
        ))}
        {[...Array(halfStars)].map((_, index) => (
          <StarIcon key={`half-${index}`} sx={{ fontSize: '32px' }} />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <StarBorderIcon key={`empty-${index}`} sx={{ fontSize: '32px' }} />
        ))}
      </Box>
    );
  };
  

  const scrollCommentsLeft = (index) => {
    const container = document.getElementById(`commentsContainer-${index}`);
    container.scrollLeft -= 200; // Adjust scroll amount as needed
    updateScrollPosition(index, container.scrollLeft - 200);
  };
  
  const scrollCommentsRight = (index) => {
    const container = document.getElementById(`commentsContainer-${index}`);
    container.scrollLeft += 200; // Adjust scroll amount as needed
    updateScrollPosition(index, container.scrollLeft + 200);
  };
  
  const updateScrollPosition = (index, scrollLeft) => {
    setScrollPositions((prev) => ({ ...prev, [index]: scrollLeft }));
  };
  
   // Scroll to top function
   const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return alert('Please enter a category name.');
    try {
      const response = await axios.post('/api/createNewCategory', { NameOfCategory: newCategoryName });
      if (response.status === 200) {
        //alert('Category created successfully!');
        fetchCategories();
        setNewCategoryName('');
        setAddMode(false); // Exit add mode after adding
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to create category');
    }
  };

  const handleAddTag = async () => {
    if (!newTagName) return alert('Please enter a preference tag.');
    try {
      const response = await axios.post('/api/createNewTag', { NameOfTags: newTagName });
      if (response.status === 200) {
        //alert('Tag created successfully!');
        fetchTags();
        setNewTagName('');
        setAddModeTags(false); // Exit add mode after adding
      }
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Failed to create tag');
    }
  };

  const handleEditCategory = async (category) => {
    try {
      const response = await axios.put('/api/updateCategory', {
        oldCategoryName: category.NameOfCategory,
        newCategoryName: editingCategoryName,
      });
      if (response.status === 200) {
        //alert('Category updated successfully!');
        fetchCategories();
        setEditMode(null); // Exit edit mode after saving
        setEditingCategoryName(''); // Reset editing name
        fetchActivities();
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  const handleEditTag = async (tag) => {
    try {
      const response = await axios.put('api/updateTag', {
        oldTagName: tag.NameOfTags,
        newTagName: editingTagName,
      });
      if (response.status === 200) {
        //alert('Category updated successfully!');
        fetchTags();
        setEditModeTags(null); // Exit edit mode after saving
        setEditingTagName(''); // Reset editing name
        fetchActivities();
      }
    } catch (error) {
      console.error('Error updating tag:', error);
      alert('Failed to update tag');
    }
  };

  const handleDeleteCategory = (categoryName) => {
    setCategoryToDelete(categoryName);
    setDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleDeleteItinerary = (categoryName) => {
    setCategoryToDelete(categoryName);
    setDeleteDialogOpen(true); // Open the delete confirmation dialog
  };


  const handleDeactivateItinerary = (itineraryName) => {
    setItineraryToDeactivate(itineraryName);
    setDeactivateDialogOpen(true); // Open the deactivate confirmation dialog
  };
  







  const handleDeleteTag = (tagName) => {
    setTagToDelete(tagName);
    setDeleteDialogOpenTags(true); // Open the delete confirmation dialog
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const response = await axios.post('/api/deleteActivityCategory', { CategoryName: categoryToDelete });
        if (response.status === 200) {
          //alert('Category deleted successfully!');
          fetchCategories(); // Refresh categories
          fetchActivities(); // Refresh activities
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
      setDeleteDialogOpen(false); // Close the dialog
      setCategoryToDelete(null); // Reset the category to delete
    }
  };

  const confirmDeleteItinerary = async () => {
    if (categoryToDelete) {
        try {
            const tourguideName = localStorage.getItem('username');

            if (!tourguideName) {
                console.error('Tour guide username not found. Please log in again.');
                return;
            }

            const response = await axios.delete('/api/deleteItinerary', {
                data: { Title: categoryToDelete, AuthorUsername: tourguideName }
            });

            if (response.status === 200) {
                fetchActivities(); // Refresh activities list
            }
        } catch (error) {
            console.error('Error deleting itinerary:', error);

            if (error.response?.data?.error === "Cannot delete a booked itinerary.") {
                console.error(`The itinerary "${categoryToDelete}" is booked and cannot be deleted.`);
            } else {
                console.error(`An error occurred while deleting the itinerary "${categoryToDelete}". Please try again.`);
            }
        } finally {
            setDeleteDialogOpen(false); // Close the dialog
            setCategoryToDelete(null); // Reset the itinerary to delete
        }
    }
};






  const confirmDeleteTag = async () => {
    if (tagToDelete) {
      try {
        const response = await axios.post('/api/deleteTag', { TagName: tagToDelete });
        if (response.status === 200) {
          //alert('Category deleted successfully!');
          fetchTags(); // Refresh categories
          fetchActivities(); // Refresh activities
        }
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Failed to delete tag');
      }
      setDeleteDialogOpenTags(false); // Close the dialog
      setTagToDelete(null); // Reset the category to delete
    }
  };


  const confirmDeactivateItinerary = async () => {
    if (itineraryToDeactivate) {
      try {
        const response = await axios.post('/api/deactivateItinerary', { title: itineraryToDeactivate });
        if (response.status === 200) {
          alert('Itinerary has been deactivated!');
          fetchActivities(); // Refresh list of itineraries
        } else {
          alert('Failed to deactivate itinerary.');
        }
      } catch (error) {
        console.error('Error deactivating itinerary:', error);
        alert(`Failed to deactivate itinerary: ${error.response?.data?.error || error.message}`);
      } finally {
        setDeactivateDialogOpen(false); // Close the dialog
        setItineraryToDeactivate(null); // Reset the itinerary to deactivate
      }
    }
  };


  const activateItinerary = async (title) => {
    try {
      const response = await axios.post('/api/activateItinerary', { title: title });
      if (response.status === 200) {
        alert('Itinerary has been activated!');
        fetchActivities(); // Refresh product list after archiving
        
      } else {
        alert('Failed to activate itinerary.');
      }
    } catch (error) {
      console.error('Error activating itinerary:', error);
      alert(`Failed to activate itinerary: ${error.response?.data?.error || error.message}`);
    }
  };
  
  


  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <Box sx={styles.container}>
      {/* Dim overlay when sidebar is open */}
      {sidebarOpen && <Box sx={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Top Menu Bar */}
      <Box sx={styles.topMenu}>
        <Box sx={styles.menuIconContainer}>
          <IconButton onMouseEnter={() => setSidebarOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={styles.logo}>
            Beyond Borders
          </Typography>
          
        </Box>
        <Box sx={styles.topMenuRight}>
        {/* <Button onClick={() => setActiveModal('viewCategories')} sx={styles.menuButton}>
          Activity Categories
        </Button> */}


        <Button
          onClick={() => window.location.href = `/CreateItinerary`}
          sx={styles.menuButton}
          startIcon={<AddIcon />}
        >
          Create new itinerary
        </Button>


     
          {/* <IconButton sx={styles.iconButton}>
            <NotificationsIcon />
          </IconButton>
          <IconButton sx={styles.iconButton}>
            <LogoutIcon />
          </IconButton> */}
        </Box>
      </Box>

      {/* Collapsible Sidebar */}
      <Box
        sx={{
          ...styles.sidebar,
          width: sidebarOpen ? '280px' : '60px',
        }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Button
    sx={{
      color: '#e6e7ed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textAlign: 'left',
      width: '100%',
      padding: '10px 20px',
      fontSize: '16px',
      '&:hover': {
        backgroundColor: '#192959',
      },
    }}
    onClick={() => window.location.href = `/CreateItinerary`}
  >
    <AddCircleIcon style={styles.icon} />
    {sidebarOpen && "Create New Itinerary"}
  </Button>
        
        <Button onClick={() => navigate('/ItinerariesTourguide')} sx={styles.sidebarButton}>
          <MapIcon sx={styles.icon} />
          {sidebarOpen && 'Itineraries'}
        </Button>
        <Button onClick={() => navigate('/HomePageTourGuide')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button>
      </Box>
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#192959', fontSize: '20px' }}>
            Are you sure you want to flag this activity?
          </DialogContentText>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#33416b', marginTop: '10px' }}>
            This action is non-reversible and this itinerary will no longer be visible to tourists.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmFlagActivity} 
            sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/*Dialogue for deleting an activity category*/}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#192959', fontSize: '20px' }}>
            Are you sure you want to delete this Itinerary?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteItinerary}
            sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
  <DialogContent>
    <DialogContentText sx={{ fontWeight: 'bold', color: '#192959', fontSize: '20px' }}>
      Are you sure you want to deactivate this itinerary?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setDeactivateDialogOpen(false)} // Close the dialog
      sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
    >
      Cancel
    </Button>
    <Button
      onClick={confirmDeactivateItinerary} // Confirm the deactivation
      sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>






      {/*Dialogue for deleting a preference tag*/}
      <Dialog open={deleteDialogOpenTags} onClose={() => setDeleteDialogOpenTags(false)}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#192959', fontSize: '20px' }}>
            Are you sure you want to delete this tag?
          </DialogContentText>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#33416b', marginTop: '10px' }}>
            This action cannot be reversed and will delete the tag from existing activities and itineraries that have it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpenTags(false)}
            sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteTag}
            sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    
      {/* Main Content Area with Activities */}
      <Box sx={styles.activitiesContainer}>
      {activities.map((activity, index) => (
  <Box key={index} sx={{ marginBottom: '40px' }}>
    <Box
      sx={{
        ...styles.activityCard,
        backgroundColor: 'white',
      }}
    >
     <Box
  sx={{
    display: 'flex',
    flexDirection: 'row', // Stack buttons vertically
    alignItems: 'flex-end', // Align to the right
    gap: '10px', // Space between buttons
    position: 'absolute', // To maintain original positioning
    top: '40px', // Align with top position
    right: '50px', // Align with right position
  }}
>





<Tooltip title="Activate" arrow>
  <IconButton
    onClick={() => activateItinerary(activity.Title)}
    sx={{
      color: '#192959', // Icon color
      backgroundColor: '#f0f0f0', // Greyish background
      '&:hover': {
        backgroundColor: '#e6e7ed', // Lighter hover background
      },
      width: '40px', // Ensure square icon button
      height: '40px',
    }}
  >
    <PowerSettingsNewIcon />
  </IconButton>
</Tooltip>


</Box>



       {/* Activity Content */}
      <Box sx={styles.activityContent}>
        {/* Left Side */}
        <Box sx={styles.activityLeft}>
          {editing[index] ? (
            <>
              <TextField
                label="Title"
                value={activity.Title}
                disabled 
                onChange={(e) =>
                  handleEditFieldChange(index, 'Title', e.target.value)
                }
                sx={{ marginBottom: '10px' }}
              />
              <TextField
                label="Locations"
                value={activity.Locations}
                onChange={(e) =>
                  handleEditFieldChange(index, 'Locations', e.target.value)
                }
                sx={{ marginBottom: '10px' }}
              />
              <TextField
                label="Author"
                value={activity.AuthorUsername}
                onChange={(e) =>
                  handleEditFieldChange(index, 'AuthorUsername', e.target.value)
                }
                sx={{ marginBottom: '10px' }}
              />
              <TextField
                label="Price"
                value={activity.Price}
                onChange={(e) =>
                  handleEditFieldChange(index, 'Price', e.target.value)
                }
                sx={{ marginBottom: '10px' }}
              />
              <TextField
                label="Date"
                type="date"
                value={new Date(activity.Date).toISOString().split('T')[0]}
                onChange={(e) =>
                  handleEditFieldChange(index, 'Date', e.target.value)
                }
                sx={{ marginBottom: '10px' }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
          label="Tags"
          value={activity.Tags.join(', ')} // Join tags into a single comma-separated string
          onChange={(e) =>
            handleEditFieldChange(index, 'Tags', e.target.value.split(',').map((tag) => tag.trim())) // Split input into array
          }
          sx={{ marginBottom: '10px' }}
        />
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                sx={{ display: 'flex', fontWeight: 'bold', fontSize: '24px', marginBottom: '5px' }}
              >
                {activity.Title}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'left' }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                {activity.Locations || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'left' }}>
                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                {activity.AuthorUsername}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'left' }}>
                <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                {activity.Price}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'left' }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                {new Date(activity.Date).toLocaleDateString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Tags:
          </Typography>
          <Box sx={styles.tagContainer}>
            {activity.Tags.map((tag, tagIndex) => (
              <Typography
                key={tagIndex}
                sx={{
                  ...styles.tag,
                  backgroundColor: activity.flagged ? '#b3b8c8' : '#cccfda',
                  color: activity.flagged ? '#192959' : '#192959',
                }}
              >
                {tag}
              </Typography>
            ))}
          </Box>
        </Box>
            </>
          )}
        </Box>

          {/* Divider Line */}
          <Divider orientation="vertical" flexItem sx={styles.verticalDivider} />

          {/* Right Side */}
          {/* Right Side */}
  <Box sx={styles.activityRight}>
    {editing[index] ? (
      <>
        <TextField
          label="Activities"
          value={activity.Activities}
          onChange={(e) =>
            handleEditFieldChange(index, 'Activities', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
        <TextField
          label="Language"
          value={activity.Language}
          onChange={(e) =>
            handleEditFieldChange(index, 'Language', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={activity.accessibility}
              onChange={(e) =>
                handleEditFieldChange(index, 'accessibility', e.target.checked)
              }
            />
          }
          label="Accessibility"
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          label="Pickup Location"
          value={activity.pickupLocation}
          onChange={(e) =>
            handleEditFieldChange(index, 'pickupLocation', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
        <TextField
          label="Drop-off Location"
          value={activity.dropoffLocation}
          onChange={(e) =>
            handleEditFieldChange(index, 'dropoffLocation', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
      </>
    ) : (
      <>
        <Typography variant="body2" sx={{ fontSize: '16px', wordBreak: 'break-word', maxWidth: '300px' }}>
        <strong>Activities:</strong> {activity.Activities}
      </Typography>
        <Typography variant="body2" sx={{ fontSize: '16px' }}>
          <strong>Language:</strong> {activity.Language}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '16px' }}>
          <strong>Accessibility:</strong> {activity.accessibility ? 'Accessible' : 'Not Accessible'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '16px' }}>
          <strong>Pickup Location:</strong> {activity.pickupLocation}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '16px' }}>
          <strong>Drop-off Location:</strong> {activity.dropoffLocation}
        </Typography>
      </>
    )}
  </Box>

        </Box>

        {/* Ratings */}
        <Box sx={styles.activityRating}>
    {renderRating(activity.Ratings)}
  </Box>

       {/* Timeline with Read More / Read Less */}
  {editing[index] ? (
    <TextField
      label="Timeline"
      value={activity.Timeline}
      onChange={(e) => handleEditFieldChange(index, 'Timeline', e.target.value)}
      multiline
      fullWidth
      sx={{ marginTop: '10px' }}
    />
  ) : (
    <Typography
      variant="body2"
      sx={{
        display: 'flex',
        fontSize: '18px',
        alignItems: 'flex-start',
        textAlign: 'left',
        cursor: activity.Timeline.length > 45 ? 'pointer' : 'default',
        marginTop: '10px',
      }}
      onClick={() => {
        if (activity.Timeline.length > 45) {
          setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
        }
      }}
    >
      <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
      {expanded[index] || activity.Timeline.length <= 45 ? (
        <span>
          {activity.Timeline}
          {activity.Timeline.length > 45 && (
            <span
              style={{
                color: '#8088a3',
                marginLeft: '5px',
                fontWeight: 'bold',
              }}
            >
              {" "}Read Less
            </span>
          )}
        </span>
      ) : (
        <span>
          {activity.Timeline.substring(0, 45)}...
          <span
            style={{
              color: '#8088a3',
              marginLeft: '5px',
              fontWeight: 'bold',
            }}
          >
            {" "}Read More
          </span>
        </span>
      )}
    </Typography>
  )}
</Box>

      {/* Comments Section */}
      <Box sx={styles.commentsSection}>
        {activity.Comments && activity.Comments.length > 0 ? (
          <>
            {scrollPositions[index] > 0 && (
              <IconButton sx={styles.scrollButton} onClick={() => scrollCommentsLeft(index)}>
                <ArrowBackIcon />
              </IconButton>
            )}

            <Box
              sx={styles.commentsContainer}
              id={`commentsContainer-${index}`}
              onScroll={(e) => updateScrollPosition(index, e.target.scrollLeft)}
            >
              {activity.Comments.map((comment, idx) => (
                <Box key={idx} sx={styles.commentCard}>
                  <Typography variant="body2">{comment.Comment || 'No comment available'}</Typography>
                  <Typography variant="caption">@ {comment.touristUsername || 'Anonymous'}</Typography>
                </Box>
              ))}
            </Box>

            {activity.Comments.length >= 3 && (
              <IconButton sx={styles.scrollButton} onClick={() => scrollCommentsRight(index)}>
                <ArrowForwardIcon />
              </IconButton>
            )}
          </>
        ) : (
          <Typography variant="body2">No comments available</Typography>
        )}
      </Box>
    </Box>
  ))}
</Box>




      {/* Back to Top Button */}
      {showBackToTop && (
        <Button onClick={scrollToTop} sx={styles.backToTop}>
          Back to Top
        </Button>
      )}

      {/* Categories Modal */}
      {activeModal === 'viewCategories' && (
        <Box>
        <Modal
    open={true}
    onClose={() => {
      setActiveModal(null);
      setEditMode(null);              // Reset editMode
      setEditingCategoryName('');      // Reset editingCategoryName
      setAddMode(false);               // Reset addMode
    }}
  >
          <Box sx={styles.modalContent}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Activity Categories</Typography>
            <IconButton onClick={() => setAddMode(true)} sx={{ color: '#192959' }}>
              <AddIcon />
            </IconButton>
        </Box>
            <Box sx={styles.listContainer}>
              {categories.map((category, index) => (
                <Box key={index} sx={styles.categoryItem}>
                  {editMode === category.NameOfCategory ? (
                    <TextField
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    <Typography>{category.NameOfCategory}</Typography>
                  )}
                  <Box sx={styles.iconContainer}>
                    {editMode === category.NameOfCategory ? (
                      <IconButton onClick={() => handleEditCategory(category)}>
                        <CheckIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => {
                        setEditMode(category.NameOfCategory);
                        setEditingCategoryName(category.NameOfCategory); // Set current name in edit mode
                      }}>
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDeleteCategory(category.NameOfCategory)}>
                      <DeleteIcon />
                    </IconButton>

                  </Box>
                </Box>
              ))}
            </Box>
            {addMode && (
              <Box sx={styles.inputContainer}>
                <TextField
                  label="Category Name"
                  variant="outlined"
                  fullWidth
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button onClick={handleAddCategory} sx={styles.actionButton}>
                  Save
                </Button>
              </Box>
            )}
          </Box>
        </Modal>
      </Box>
      )}

      {/* Tags Modal */}
      {activeModal === 'viewTags' && (
        <Box>
        <Modal
    open={true}
    onClose={() => {
      setActiveModal(null);
      setEditModeTags(null);              // Reset editMode
      setEditingTagName('');      // Reset editingCategoryName
      setAddModeTags(false);               // Reset addMode
    }}
  >
          <Box sx={styles.modalContent}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Preference Tags</Typography>
            <IconButton onClick={() => setAddModeTags(true)} sx={{ color: '#192959' }}>
              <AddIcon />
            </IconButton>
        </Box>
            <Box sx={styles.listContainer}>
              {tags.map((tag, index) => (
                <Box key={index} sx={styles.categoryItem}>
                  {editModeTags === tag.NameOfTags ? (
                    <TextField
                      value={editingTagName}
                      onChange={(e) => setEditingTagName(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    <Typography>{tag.NameOfTags}</Typography>
                  )}
                  <Box sx={styles.iconContainer}>
                    {editModeTags === tag.NameOfTags ? (
                      <IconButton onClick={() => handleEditTag(tag)}>
                        <CheckIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => {
                        setEditModeTags(tag.NameOfTags);
                        setEditingTagName(tag.NameOfTags); // Set current name in edit mode
                      }}>
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDeleteTag(tag.NameOfTags)}>
                      <DeleteIcon />
                    </IconButton>

                  </Box>
                </Box>
              ))}
            </Box>
            {addModeTags && (
              <Box sx={styles.inputContainer}>
                <TextField
                  label="Tag Name"
                  variant="outlined"
                  fullWidth
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
                <Button onClick={handleAddTag} sx={styles.actionButton}>
                  Save
                </Button>
              </Box>
            )}
          </Box>
        </Modal>
      </Box>
      )}
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#e6e7ed',
    color: '#192959',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  topMenu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#192959',
    color: '#e6e7ed',
    position: 'sticky',
    top: 0,             // Sticks to the top of the viewport
    zIndex: 2,
  },
  menuIconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  logo: {
    fontWeight: 'bold',
    color: '#e6e7ed',
  },
  topMenuRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  iconButton: {
    color: '#e6e7ed',  // Initial color
    '&:hover': {
      backgroundColor: '#e6e7ed', // Background color on hover
      color: '#192959',           // Text color on hover
    },
  },
  menuButton: {
    color: '#e6e7ed',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#e6e7ed', // Set background color on hover
      color: '#192959',           // Set text color on hover
    },
  },  
  sidebar: {
    backgroundColor: '#4d587e',
    color: '#e6e7ed',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 60,
    height: 'calc(100vh - 60px)',
    width: '60px',
    transition: 'width 0.3s ease',
    overflowX: 'hidden',
    padding: '10px',
    zIndex: 2,
  },
  sidebarButton: {
    color: '#e6e7ed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left',
    width: '100%',
    padding: '10px 20px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },
  icon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  activitiesContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px 70px 20px 90px',
    marginLeft: '60px',
    transition: 'margin-left 0.3s ease',
  },
  languageContainer: {
    position: 'absolute',
    bottom: '190px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  accessibilityContainer: {
    position: 'absolute',
    bottom: '150px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  pickupLocationContainer: {
    position: 'absolute',
    bottom: '110px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dropoffLocationContainer: {
    position: 'absolute',
    bottom: '70px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  bookingOpenContainer: {
    position: 'absolute',
    bottom: '30px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  activityCard: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    padding: '50px 50px', // Increase padding for top/bottom and left/right
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },  
  activityInfo: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  quickFacts: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    marginTop: '10px',
  },
  infoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '16px',
    padding: '5px 10px',
    marginRight: '10px', // Add spacing between containers if needed
  },
  activityRating: {
    position: 'absolute', // Fix the position of the rating section
    top: '250px', // Adjust this value to set the vertical position
    right: '50px', // Adjust this value to set the horizontal position
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  flagButton: {
    backgroundColor: '#ff5722',
    color: 'white',
    '&:hover': { backgroundColor: '#ff8a50' },
    gap: '5px', // Maintain button spacing within the button itself
  },
  
  activityInfoLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  
  activityInfoRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    alignItems: 'flex-end',
  },
  commentsSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px', // Add space between itinerary and comments
    overflow: 'hidden',
    width: '100%',
  },
  commentsContainer: {
    display: 'flex',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    width: '100%',
    padding: '10px',
    '&::-webkit-scrollbar': {
      display: 'none', // Hide scrollbar for a cleaner look
    },
  },
  scrollButton: {
    color: '#192959',
    backgroundColor: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#d1d5db',
    },
  },
  commentCard: {
    minWidth: '400px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '10px',
    marginRight: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left', // Align comments text to the left
  },
  backToTop: {
    position: 'fixed',
    bottom: '20px',
    right: '70px',
    backgroundColor: '#192959',
    color: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#e6e7ed',
      color: '#192959',
    },
    padding: '5px 50px',
    borderRadius: '30px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
  },
  addButton: {
    color: '#192959',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    maxHeight: 400,
    overflowY: 'auto',
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  inputContainer: {
    display: 'flex',
    gap: 2,
    mt: 2,
  },
  actionButton: {
    backgroundColor: '#e6e7ed', // Background color on hover
    color: '#192959',           // Text color on hover
    '&:hover': {
      backgroundColor: '#192959', // Background color on hover
      color: '#e6e7ed',           // Text color on hover
    },
  },
  activityCard: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  activityContent: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px', // Adjust spacing between left and right sections
  },
  activityLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '45%', // Adjust as necessary
    paddingRight: '10px',
    textAlign: 'left', // Align text to the left
  },
  verticalDivider: {
    backgroundColor: '#d1d5db',
    width: '1px',
    margin: '40px 15px 0 15px', // Adjust the top margin to position the start
  },
  activityRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '55%', // Adjust as necessary
    paddingTop: '50px',
    textAlign: 'left', // Align text to the left
  },
  tagContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    textAlign: 'left', // Align text within tags to the left
  },
  tag: {
    borderRadius: '16px',
    padding: '5px 10px',
    fontSize: '14px',
    textAlign: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
};

export default Deactivated;


