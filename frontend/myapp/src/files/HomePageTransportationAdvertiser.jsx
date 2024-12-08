import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Box, Button, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, Modal, TextField,CircularProgress, Divider  } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';

import axios from 'axios';

function HomePageTransportationAdvertiser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [scrollPositions, setScrollPositions] = useState({});
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [selectedActivity, setSelectedActivity] = useState(null); // State for selected activity
  const [showBackToTop, setShowBackToTop] = useState(false); // State for button visibility
  const [editing, setEditing] = useState({});  // Initialize it as an empty object, or with indices if needed
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
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [tagToDelete, setTagToDelete] = useState(null);

  const [editableFields, setEditableFields] = useState({});

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [newActivityData, setNewActivityData] = useState({
    Name: '',
    Date: '',
    Time: '',
    SpecialDiscount: '',
    BookingOpen: false,
    Price: '',
    Location: '',
    Category: '',
    Tags: [],
  });
  const [activityErrorMessage, setActivityErrorMessage] = useState('');
  

  const username = localStorage.getItem('username') || 'User'; // Retrieve username from localStorage
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

  const handleActivityInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewActivityData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTransportation, setNewTransportation] = useState({
    advertiserName: localStorage.getItem('username'),
    serviceName: '',
    serviceType: '',
    price: '',
    capacity: '',
    startLocation: '',
    endLocation: '',
    schedule: [{ day: '', departureTime: '', arrivalTime: '' }],
  });
  const [showModal, setShowModal] = useState(false);

  const addSchedule = (e) => {
    e.preventDefault();
    setNewTransportation((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { day: '', departureTime: '', arrivalTime: '' }],
    }));
  };

  const updateSchedule = (index, field, value) => {
    const updatedSchedule = newTransportation.schedule.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setNewTransportation({ ...newTransportation, schedule: updatedSchedule });
  };

  const createNewTransportation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/createNewTransportation', newTransportation);
      if (response.status === 200) {
        alert('New transportation created successfully!');
        setShowCreateForm(false);
        setShowModal(false);
        navigate('/transportAdvertiserHome');
      } else {
        setError('Failed to create transportation');
      }
    } catch (err) {
      setError(`Error creating transportation: ${err.message}`);

    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent body from scrolling when modal is open
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto'; // Re-enable body scrolling when modal is closed
  };
  
  const fetchTransportations = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await axios.get('/api/viewMyTransportations', {
        params: { advertiserName: username }, // Use the `advertiserName` query parameter
      });
  
      // Extract transportations from the API response
      const transportationsWithTags = response.data.transportations.map((transportation) => ({
        ...transportation,
      }));
  
      setTransportations(transportationsWithTags);
    } catch (error) {
      console.error('Error fetching transportations:', error);
    }
  };
  
  useEffect(() => {
    fetchTransportations();
  }, []);
  





const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/readAllActivities', { params: { AuthorUsername: username } });
      const activitiesWithTags = response.data.map((activity) => ({
        ...activity,
        Tags: activity.Tags || [], // Ensure Tags is always an array
      }));
      setActivities(activitiesWithTags);
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

  // Fetch tags from backend
  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/readAllTags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const flagActivity = async (name) => {
    try {
      const response = await axios.post('/api/flagActivity', { title: name });
      if (response.status === 200) {
        alert(response.data.message);
        fetchActivities();
      }
    } catch (error) {
      console.error('Error flagging activity:', error);
      alert('An error occurred while flagging the activity.');
    }
  };

  const handleFlagClick = (activity) => {
    setSelectedActivity(activity);
    setOpenDialog(true); // Open dialog when flag button is clicked
  };

  const confirmFlagActivity = async () => {
    if (selectedActivity) {
      try {
        const response = await axios.post('/api/flagActivity', { title: selectedActivity.Name });
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

  const renderRating = (rating) => {
    const roundedRating = Math.round(rating * 10) / 10;
    const fullStars = Math.floor(rating);
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
          <StarIcon key={`empty-${index}`}sx={{ fontSize: '32px' }} />
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
    const container = document.getElementById('commentsContainer-${index}');
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

  const handleDeleteActivity = (activityName) => {
    setActivityToDelete(activityName);
    setDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleDeleteTag = (tagName) => {
    setTagToDelete(tagName);
    setDeleteDialogOpenTags(true); // Open the delete confirmation dialog
  };

  const confirmDeleteActivity = async () => {
    if (activityToDelete) {
      try {
        const response = await axios.post('/api/deleteActivity', { AdvertiserName: username, Name: activityToDelete });
        if (response.status === 200) {
          alert('Activity deleted successfully!');
          setDeleteDialogOpen(false); // Close the delete confirmation dialog
          fetchActivities(); // Refresh the activities list
          setActivityToDelete(null); // Reset the selected activity
        }
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity.');
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

const toggleEditMode = (activity) => {
    if (!activity.editMode) {
      setEditableFields((prev) => ({
        ...prev,
        [activity.Name]: {
          Date: activity.Date,
          Time: activity.Time,
          SpecialDiscount: activity.SpecialDiscount,
          BookingOpen: activity.BookingOpen,
          Location: activity.Location?.address || '',
          Category: activity.Category,
          Tags: activity.Tags || [], // Ensure Tags is initialized as an array
        },
      }));
    }
    setActivities((prevActivities) =>
      prevActivities.map((a) =>
        a.Name === activity.Name ? { ...a, editMode: !a.editMode } : a
      )
    );
  };
  
const handleFieldChange = (field, value, activityName) => {
    setEditableFields((prev) => {
      // Ensure activityName exists in the state
      const updatedFields = prev[activityName] || {};
  
      return {
        ...prev,
        [activityName]: {
          ...updatedFields,
          [field]: field === 'Tags' ? [...value] : value, // If 'Tags', ensure value is stored as an array
        },
      };
    });
  };
  
const saveActivity = async (activity) => {
    const fields = editableFields[activity.Name];
    const updatedFields = {
      AdvertiserName: username,
      Name: activity.Name,
      Date: fields.Date,
      Time: fields.Time,
      SpecialDiscount: fields.SpecialDiscount,
      BookingOpen: fields.BookingOpen,
      Price: fields.Price,
      Location: fields.Location,
      Category: fields.Category,
      Tags: fields.Tags, // Already an array from multi-select
    };
  
    try {
      const response = await axios.put('/api/updateActivity', updatedFields);
      if (response.status === 200) {
        alert(response.data.msg);
        fetchActivities(); // Refresh activities
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Failed to save activity changes.');
    }
  
    toggleEditMode(activity); // Exit edit mode
  };
  
  
  return (
    <Box sx={styles.container}>
      {/* Dim overlay when sidebar is open */}
      

      
      <Box sx={styles.topMenu}>
        <Box sx={styles.menuIconContainer}>
          
        <Box sx={{ display: 'flex', alignItems: 'right', gap: 1 }}>
  {/* Add your image here */}
  <img
    src="/images/logo.png" // Replace with the actual path to your image
    alt="Logo"
    style={{
      height: '40px', // Adjusted size
      width: '200px',  // Adjusted size
      objectFit: 'contain', // Ensures the image doesn't get distorted
      marginLeft: '20px', // Moves the logo to the right
    }}
  />
</Box>
        </Box>
        <Box sx={styles.topMenuRight}>
        {/* <Button onClick={() => setActiveModal('viewCategories')} sx={styles.menuButton}>
          Activity Categories
        </Button> */}
        {/* <Button
            //onClick={handleModalOpen}
            sx={styles.menuButton}
            startIcon={<AddIcon />}
        >
            Create new activity
        </Button> */}
        <Button
  onClick={() => setIsActivityModalOpen(true)}
  sx={{
    backgroundColor: "#192959",
    color: "#e6e7ed",
    fontWeight:"bold",
    "&:hover": { color: "#192959",backgroundColor: "#e6e7ed" },
  }}
  startIcon={<AddIcon />}
>
  Create New Transportation
</Button>
<IconButton sx={styles.iconButton}>
            <NotificationsIcon />
          </IconButton>
          <IconButton onClick={() => navigate('/')}sx={styles.iconButton}>
            <LogoutIcon />
          </IconButton>

          {/* <IconButton sx={styles.iconButton}>
            <NotificationsIcon />
          </IconButton>
          <IconButton sx={styles.iconButton}>
            <LogoutIcon />
          </IconButton> */}
        </Box>
      </Box>

      
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#192959', fontSize: '20px' }}>
            Are you sure you want to flag this activity?
          </DialogContentText>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#33416b', marginTop: '10px' }}>
            This action is non-reversible and this activity will no longer be visible to tourists.
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
      {/* {/Dialogue for deleting an activity category/} */}
      <Dialog
  open={deleteDialogOpen}
  onClose={() => {
    setDeleteDialogOpen(false); // Close dialog when clicking outside or pressing Cancel
    setActivityToDelete(null); // Reset selected activity
  }}
>
  <DialogContent>
    <DialogContentText sx={{ fontWeight: 'bold', color: '#192959', fontSize: '20px' }}>
      Are you sure you want to delete this activity?
    </DialogContentText>
    <DialogContentText sx={{ fontWeight: 'bold', color: '#33416b', marginTop: '10px' }}>
      This action cannot be reversed, and the activity will be permanently deleted.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        setDeleteDialogOpen(false); // Close dialog when "Cancel" is clicked
        setActivityToDelete(null); // Reset selected activity
      }}
      sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
    >
      Cancel
    </Button>
    <Button
      onClick={confirmDeleteActivity} // Call confirmDeleteActivity on "Confirm"
      sx={{ color: '#192959', '&:hover': { backgroundColor: '#192959', color: '#e6e7ed' } }}
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>

      
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
      <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Transportation Listings
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {transportations.map((transportation, index) => (
  <Box key={index} sx={{ marginBottom: '15px' }}>
    <Box
      sx={{
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: transportation.flagged ? '#cccfda' : 'white',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {transportation.flagged && (
        <Button variant="contained" sx={{ marginBottom: '10px' }} disabled>
          FLAGGED BY ADMIN
        </Button>
      )}
      
      <Box>
        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '20px', textAlign: 'left' }}>
        {transportation.serviceName}
        </Typography>

        {/* Flex Container for Left and Right Sections */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          
          {/* Left Column: 3 Attributes */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography variant="body2" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              {`${transportation.routeDetails?.startLocation} to ${transportation.routeDetails?.endLocation || 'N/A'}`}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              {transportation.advertiserName}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
              {`$${transportation.price}`}
            </Typography>
          </Box>

          {/* Divider Line */}
  {/* Vertical Divider */}
  <Box sx={{ borderLeft: '1px solid #ccc', height: 'auto', margin: '0 20px' }} />

          {/* Right Column: 3 Attributes */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'right' }}>
  <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
  {transportation.schedule[0]?.day || 'N/A'}
</Typography>
<Typography variant="body2" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>
  <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
  {`${transportation.schedule[0]?.departureTime} to ${transportation.schedule[0]?.arrivalTime || 'N/A'}`}
</Typography>

            <Box sx={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Capacity:</Typography>
              {transportation.capacity || 'N/A'}
            </Box>
          </Box>
        </Box>
      </Box>
      </Box>
  </Box>
  ))}
</Box>

      )}
    </Box>

      {/* Main Content Area with Activities */}
      {/* Main Content Area with Activities */}


      {/* Back to Top Button */}
      {showBackToTop && (
        <Button onClick={scrollToTop} sx={styles.backToTop}>
          Back to Top
        </Button>
      )}

<Modal open={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "90%", // Adjusted for smaller screens
      maxWidth: "600px",
      maxHeight: "90vh", // Limit height to viewport height
      overflowY: "auto", // Enable vertical scrolling
      bgcolor: "background.paper",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
      Create New Transportation
    </Typography>
    <form onSubmit={createNewTransportation}>
      <TextField
        fullWidth
        margin="normal"
        label="Service Name"
        name="serviceName"
        value={newTransportation.serviceName}
        onChange={(e) => setNewTransportation({ ...newTransportation, serviceName: e.target.value })}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Service Type"
        name="serviceType"
        value={newTransportation.serviceType}
        onChange={(e) => setNewTransportation({ ...newTransportation, serviceType: e.target.value })}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Price"
        name="price"
        type="number"
        value={newTransportation.price}
        onChange={(e) => setNewTransportation({ ...newTransportation, price: e.target.value })}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Capacity"
        name="capacity"
        value={newTransportation.capacity}
        onChange={(e) => setNewTransportation({ ...newTransportation, capacity: e.target.value })}
        />
      <TextField
        fullWidth
        margin="normal"
        label="Start Location"
        name="startLocation"
        value={newTransportation.startLocation}
        onChange={(e) => setNewTransportation({ ...newTransportation, startLocation: e.target.value })}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="End Location"
        name="endLocation"
        value={newTransportation.endLocation}
        onChange={(e) => setNewTransportation({ ...newTransportation, endLocation: e.target.value })}
        required
      />
       <Typography variant="h6" sx={{ marginTop: "20px" }}>
          Schedule
        </Typography>
        {newTransportation.schedule.map((schedule, index) => (
          <Box key={index} sx={{ marginBottom: '10px' }}>
            <TextField
              fullWidth
              margin="normal"
             
              name={'day'}
              value={schedule.day}
              onChange={(e) => updateSchedule(index, 'day', e.target.value)}
              type="date"
            />
            <TextField
              fullWidth
              margin="normal"
              label={'Departure Time '}
              name={'departureTime'}
              type="time"
              value={schedule.departureTime}
              onChange={(e) => updateSchedule(index, 'departureTime', e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label={'Arrival Time '}
              name={'arrivalTime'}
              type="time"
              value={schedule.arrivalTime}
              onChange={(e) => updateSchedule(index, 'arrivalTime', e.target.value)}
            />
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={addSchedule}
          sx={{ marginBottom: "20px" }}
        >
          Add Schedule
        </Button>
        {error && <Typography color="error" sx={{ marginBottom: "10px" }}>{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#192959",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            width: "100%",
            "&:hover": { backgroundColor: "#4b5a86" },
            marginTop: "20px",
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Create Transportation"}
        </Button>
      
     
      {activityErrorMessage && (
        <Typography color="error" sx={{ marginBottom: "10px" }}>
          {activityErrorMessage}
        </Typography>
      )}
      
    </form>
  </Box>
</Modal>


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
  discountContainer: {
    position: 'absolute',
    bottom: '100px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  bookingOpenContainer: {
    position: 'absolute',
    bottom: '50px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  activityCard: {
    display: 'flex',
    flexDirection: 'column',  // Align elements vertically
    position: 'relative',
    justifyContent: 'flex-start',
    padding: '20px',          // Reduced padding for a smaller card
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    maxWidth: '300px',        // Set a max width for uniformity
    width: '100%',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  activityInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '5px',
  },
  activityTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    marginTop: '10px',
  },
  tag: {
    backgroundColor: '#cccfda',
    color: '#192959',
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '12px',
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
  verticalDivider: {
    backgroundColor: '#d1d5db',
    width: '1px',
    margin: '40px 15px 0 15px', // Adjust the top margin to position the start
  },
};



export default HomePageTransportationAdvertiser;