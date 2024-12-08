import React, { useState, useEffect } from 'react';
import { Box,Checkbox, Button, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, Modal, TextField, Divider, FormControlLabel, CircularProgress,  } from '@mui/material';
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
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircleRounded';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FlightIcon from '@mui/icons-material/Flight';
import BedIcon from '@mui/icons-material/Bed';
import InventoryIcon from '@mui/icons-material/Inventory';
import  FeedbackIcon  from '@mui/icons-material/Feedback';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChecklistIcon from '@mui/icons-material/Checklist';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ChurchIcon from '@mui/icons-material/Church';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CommuteIcon from '@mui/icons-material/Commute';
//import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import BlockIcon from '@mui/icons-material/Block';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from 'axios';

function TouristBookedFlights() {
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
  const [hotelsOpen, setHotelsOpen] = useState(false);
  const [flightsOpen, setFlightsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState({});
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
const [itineraryToDeactivate, setItineraryToDeactivate] = useState(null);

const [errorMessage, setErrorMessage] = useState('');
const [loading, setLoading] = useState(true); 
  const [bookedFlights, setBookedFlights] = useState([]);

  const [productsOpen, setProductsOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [itinerariesOpen, setItinerariesOpen] = useState(false);
  const [historicalPlacesOpen, setHistoricalPlacesOpen] = useState(false);
  const [museumsOpen, setMuseumsOpen] = useState(false);
  const [transportationOpen, setTransportationOpen] = useState(false);
  const [complaintsOpen, setComplaintsOpen] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchBookedFlights();
      setLoading(false); // Set loading to false after fetching data
    };
    fetchData();
  }, []);
  

  const fetchBookedFlights = async () => {
    const username = localStorage.getItem('username'); // Retrieve username from local storage
    if (!username) {
      setErrorMessage('You need to log in first.');
      return;
    }
  
    try {
      const response = await axios.get('/api/viewBookedFlights', {
        params: { touristUsername: username },
      });
      const flights = response.data.bookedFlights || [];
      console.log('Fetched flights:', flights); // Debugging log
      setBookedFlights(flights);
    } catch (error) {
      console.error('Error fetching booked flights:', error);
      setErrorMessage(
        error.response?.data?.msg || 'An error occurred while fetching booked flights.'
      );
    }
  };
  
  

  const fetchActivities = async () => {
    const username = localStorage.getItem('username');
        if (!username) {
            alert('You need to log in first.');
            return;
        }
    try {
        const response = await axios.get(`/api/getallItinerarys`, {
            params: { AuthorUsername: username }
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
  {/* Replace text with logo */}
  <img
    src="/images/logo.png" // Replace with your logo's actual path
    alt="Logo"
    style={{
      height: '30px', // Adjust the height as per your design
      width: 'auto', // Maintain aspect ratio
      marginLeft: '10px', // Add spacing from the MenuIcon
    }}
  />
</Box>

        <Box sx={styles.topMenuRight}>
        <Button
  sx={{
    ...styles.menuButton,
    '&:hover': {
      backgroundColor: '#e6e7ed', // Background color on hover
      color: '#192959',           // Text color on hover
    },
  }}
  startIcon={<AccountCircleIcon />}
>
  My Profile
</Button>
<Tooltip title="Notifications" arrow>
  <IconButton
    sx={{
      ...styles.menuButton,
      
      '&:hover': {
        backgroundColor: '#e6e7ed', // Lighter hover background
      color: '#192959',           // Text color on hover

      },
      width: '40px', // Ensure square icon button
      height: '40px',
    }}
  >
    <NotificationsNoneOutlinedIcon />
  </IconButton>
</Tooltip>
<Tooltip title="Shopping Cart" arrow>
  <IconButton
    sx={{
      ...styles.menuButton,
      
      '&:hover': {
        backgroundColor: '#e6e7ed', // Lighter hover background
      color: '#192959',           // Text color on hover

      },
      width: '40px', // Ensure square icon button
      height: '40px',
    }}
  >
    <ShoppingCartOutlinedIcon />
  </IconButton>
</Tooltip>
<Tooltip title="Wishlist" arrow>
            <IconButton
                sx={{
                ...styles.menuButton,
                
                '&:hover': {
                    backgroundColor: '#e6e7ed', // Lighter hover background
                color: '#192959',           // Text color on hover

                },
                width: '40px', // Ensure square icon button
                height: '40px',
                }}
            >
    <FavoriteBorderIcon/>
  </IconButton>
</Tooltip>

<Tooltip title="Logout" arrow>
            <IconButton
                sx={{
                ...styles.menuButton,
                
                '&:hover': {
                    backgroundColor: '#e6e7ed', // Lighter hover background
                color: '#192959',           // Text color on hover

                },
                width: '40px', // Ensure square icon button
                height: '40px',
                }}
            >
    <LogoutIcon />
  </IconButton>
</Tooltip>
        </Box>
      </Box>
      {/* Booked Flights */}
<Box
  sx={{
    marginTop: '150px', // Adjust based on space requirement
    width: '80%',
    margin: '0 auto',
    backdropFilter: 'blur(10px)',
  }}
>
  {loading ? (
    // Display loading spinner
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Center the loader vertically
        width: '100%',
      }}
    >
      <CircularProgress sx={{ color: '#192959' }} />
    </Box>
  ) : bookedFlights.length > 0 ? (
    <Box>
      {bookedFlights.map((flight, flightIndex) => (
        <Box
          key={flightIndex}
          sx={{
            marginTop: '50px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            marginBottom: '50px', // Space between containers
          }}
        >
          {/* Outbound Flight */}
          <Box sx={{ marginBottom: '20px', width: '100%' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                marginBottom: '10px',
                textAlign: 'center',
                color: '#192959',
              }}
            >
              Outbound Flight
            </Typography>
            {flight.flightDetails[0]?.segments.map((segment, segmentIndex) => (
              <Box
                key={segmentIndex}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  width: '100%',
                }}
              >
                <FlightTakeoffIcon sx={{ marginRight: '10px', color: '#192959' }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography>Departure: {segment.departure.iataCode}</Typography>
                  <Typography>Terminal: {segment.departure.terminal || 'N/A'}</Typography>
                  <Typography>
                    Time: {new Date(segment.departure.at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    borderBottom: '2px solid #192959',
                    margin: '0 20px',
                    width: '40%',
                  }}
                ></Box>
                <FlightLandIcon sx={{ marginLeft: '10px', marginRight: '10px', color: '#192959' }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography>Arrival: {segment.arrival.iataCode}</Typography>
                  <Typography>Terminal: {segment.arrival.terminal || 'N/A'}</Typography>
                  <Typography>
                    Time: {new Date(segment.arrival.at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Return Flight */}
          <Box sx={{ marginBottom: '20px', width: '100%' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                marginBottom: '10px',
                textAlign: 'center',
                color: '#192959',
              }}
            >
              Return Flight
            </Typography>
            {flight.flightDetails[1]?.segments.map((segment, segmentIndex) => (
              <Box
                key={segmentIndex}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  width: '100%',
                }}
              >
                <FlightTakeoffIcon sx={{ marginRight: '10px', color: '#192959' }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography>Departure: {segment.departure.iataCode}</Typography>
                  <Typography>Terminal: {segment.departure.terminal || 'N/A'}</Typography>
                  <Typography>
                    Time: {new Date(segment.departure.at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    borderBottom: '2px solid #192959',
                    margin: '0 20px',
                    width: '40%',
                  }}
                ></Box>
                <FlightLandIcon sx={{ marginLeft: '10px', marginRight: '10px', color: '#192959' }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography>Arrival: {segment.arrival.iataCode}</Typography>
                  <Typography>Terminal: {segment.arrival.terminal || 'N/A'}</Typography>
                  <Typography>
                    Time: {new Date(segment.arrival.at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  ) : (
    // No Flights Available
    <Typography variant="h6" sx={{ textAlign: 'center' }}>
      No booked flights available.
    </Typography>
  )}
</Box>

<Box
        sx={{
          ...styles.sidebar,
          width: sidebarOpen ? '280px' : '60px',
        }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Box>
  {/* Flights Button */}
  <Button
    onClick={() => setFlightsOpen(!flightsOpen)} // Toggle dropdown for flights
    sx={styles.sidebarButton}
  >
    <FlightIcon sx={styles.icon} /> {/* Flights Icon */}
    {sidebarOpen && (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        Flights
        {flightsOpen ? (
          <KeyboardArrowUpIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
        )}
      </Box>
    )}
  </Button>
  
  {/* Dropdown Menu */}
  {flightsOpen && (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '20px' : '0px' }}>
     
      {/* Find Flights */}
      <Button
        onClick={() => navigate('/TouristFlights')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <SearchIcon sx={{ fontSize: '18px', marginRight: '10px' }} /> {/* Icon for Find Flights */}
        {sidebarOpen && 'Find Flights'}
      </Button>
       {/* Booked Flights */}
       <Button
        onClick={() => navigate('/TouristBookedFlights')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <EventAvailableIcon sx={{ fontSize: '18px', marginRight: '10px' }} /> {/* Icon for Booked */}
        {sidebarOpen && 'Booked'}
      </Button>
      
    </Box>
    
  )}
</Box>


<Box>
  {/* Hotels Dropdown */}
  <Button
    onClick={() => setHotelsOpen(!hotelsOpen)}
    sx={styles.sidebarButton}
  >
    <BedIcon sx={styles.icon} />
    {sidebarOpen && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        Hotels
        {hotelsOpen ? (
          <KeyboardArrowUpIcon sx={{ fontSize: "18px", marginLeft: "5px" }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ fontSize: "18px", marginLeft: "5px" }} />
        )}
      </Box>
    )}
  </Button>
  {hotelsOpen && (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginLeft: sidebarOpen ? "20px" : "0px",
      }}
    >
     
      <Button
        onClick={() => navigate("/TouristHotels")}
        sx={{
          ...styles.sidebarButton,
          fontSize: "14px",
          paddingLeft: sidebarOpen ? "20px" : "10px",
          padding: "5px 20px",
        }}
      >
        <SearchIcon sx={{ fontSize: "18px", marginRight: "10px" }} />
        {sidebarOpen && "Find Hotels"}
      </Button>
      <Button
        onClick={() => navigate("/TouristBookedHotels")}
        sx={{
          ...styles.sidebarButton,
          fontSize: "14px",
          paddingLeft: sidebarOpen ? "20px" : "10px",
          padding: "5px 20px",
        }}
      >
        <EventAvailableIcon sx={{ fontSize: "18px", marginRight: "10px" }} />
        {sidebarOpen && "Reservations"}
      </Button>
    </Box>
  )}
</Box>


      

       
        <Box>
  <Button
    onClick={() => setProductsOpen(!productsOpen)} // Toggle dropdown for products
    sx={styles.sidebarButton}
  >
    <StorefrontIcon sx={styles.icon} /> {/* Products Icon */}
    {sidebarOpen && (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        Products
        {productsOpen ? (
          <KeyboardArrowUpIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
        )}
      </Box>
    )}
  </Button>
  {productsOpen && (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '20px' : '0px' }}>
      {/* My Purchased Products */}
      <Button
        onClick={() => navigate('/TouristPurchasedProducts')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: '18px', marginRight: '10px' }} /> {/* Shopping Cart Icon */}
        {sidebarOpen && 'My Purchased Products'}
      </Button>
      
      {/* View All Products */}
      <Button
        onClick={() => navigate('/TouristAllProducts')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <InventoryIcon sx={{ fontSize: '18px', marginRight: '10px' }} /> {/* Storefront Icon */}
        {sidebarOpen && 'All Products'}
      </Button>
    </Box>
  )}
</Box>

         {/* Activities Dropdown */}
        <Box>
        <Button
  onClick={async () => {
    try {
      // First, toggle the activities open/close state
      setActivitiesOpen(!activitiesOpen);

      // Get the username from localStorage
      const username = localStorage.getItem('username');

      if (!username) {
        alert('User not logged in.');
        return;
      }

      // Call the `addCompletedActivities` function via an API request
      const response = await axios.put('/addCompletedActivities', { touristUsername: username });

      if (response.status === 200) {
        // Handle success, maybe show a success message or update local state
        //alert('Completed activities updated successfully!');
      } else {
        //alert('Failed to update completed activities.');
      }
    } catch (error) {
      console.error('Error updating completed activities:', error);
      alert('An error occurred while updating completed activities.');
    }
  }}
  sx={styles.sidebarButton}
>
  <LocalActivityIcon sx={styles.icon} />
  {sidebarOpen && (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      Activities
      {activitiesOpen ? (
        <KeyboardArrowUpIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
      ) : (
        <KeyboardArrowDownIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
      )}
    </Box>
  )}
</Button>

        {activitiesOpen && (
            <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '20px' : '0px' }}>
            <Button
            onClick={() => navigate('/TouristUpcomingActivities')}
            sx={{
                ...styles.sidebarButton,
                fontSize: '14px',
                paddingLeft: sidebarOpen ? '20px' : '10px',
                padding: '5px 20px',
            }}
            >
            <ScheduleIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
            {sidebarOpen && 'Upcoming '}
            </Button>

            <Button
                onClick={() => navigate('/TouristCompletedActivities')}
                sx={{
                    ...styles.sidebarButton,
                    fontSize: '14px',
                    paddingLeft: sidebarOpen ? '20px' : '10px',
                    padding: '5px 20px',
                }}
                >
                <ChecklistIcon sx={{ fontSize: '18px', marginRight: '10px' }} /> {/* Add the icon here */}
                {sidebarOpen && 'Completed '}
                </Button>

                <Button
                onClick={() => navigate('/TouristBookedActivities')}
                sx={{
                    ...styles.sidebarButton,
                    fontSize: '14px',
                    paddingLeft: sidebarOpen ? '20px' : '10px',
                    padding: '5px 20px',
                }}
                >
                <EventAvailableIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
                {sidebarOpen && 'Booked '}
                </Button>

            </Box>
        )}
        </Box>

       {/* Itineraries Dropdown */}
<Box>
<Button
  onClick={async () => {
    try {
      // Toggle the itineraries dropdown open/close
      setItinerariesOpen(!itinerariesOpen);

      // Get the username from localStorage
      const username = localStorage.getItem('username');

      if (!username) {
        alert('User not logged in.');
        return;
      }

      // Call the `addCompletedItinerary` function via an API request
      const response = await axios.put('/addCompletedItinerary', { touristUsername: username });

      if (response.status === 200) {
        // Handle success, maybe show a success message or update local state
        //alert('Completed itineraries updated successfully!');
      } else {
        //alert('Failed to update completed itineraries.');
      }
    } catch (error) {
      console.error('Error updating completed itineraries:', error);
      alert('An error occurred while updating completed itineraries.');
    }
  }}
  sx={styles.sidebarButton}
>
  <MapIcon sx={styles.icon} />
  {sidebarOpen && (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      Itineraries
      {itinerariesOpen ? (
        <KeyboardArrowUpIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
      ) : (
        <KeyboardArrowDownIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
      )}
    </Box>
  )}
</Button>

  {itinerariesOpen && (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '20px' : '0px' }}>
      <Button
        onClick={() => navigate('/TouristUpcomingItineraries')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <ScheduleIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && 'Upcoming '}
      </Button>
      <Button
        onClick={() => navigate('/TouristCompletedItineraries')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <ChecklistIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && 'Completed '}
      </Button>
      <Button
        onClick={() => navigate('/TouristBookedItineraries')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <EventAvailableIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && ' Booked '}
      </Button>
    </Box>
  )}
</Box>
{/* Historical Places Dropdown */}
<Box>
<Button
  onClick={async () => {
    try {
      // Toggle the historical places dropdown open/close
      setHistoricalPlacesOpen(!historicalPlacesOpen);

      // Get the username from localStorage
      const username = localStorage.getItem('username');

      if (!username) {
        alert('User not logged in.');
        return;
      }

      // Call the `addCompletedHPEvents` function via an API request
      const response = await axios.put('/addCompletedHPEvents', { touristUsername: username });

      if (response.status === 200) {
        // Handle success, maybe show a success message or update local state
        //alert('Historical Place events updated successfully!');
      } else {
        //alert('Failed to update historical place events.');
      }
    } catch (error) {
      console.error('Error updating historical place events:', error);
      alert('An error occurred while updating historical place events.');
    }
  }}
  sx={styles.sidebarButton}
>
  <ChurchIcon sx={styles.icon} />
  {sidebarOpen && (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      Historical Places
      {historicalPlacesOpen ? (
        <KeyboardArrowUpIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
      ) : (
        <KeyboardArrowDownIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
      )}
    </Box>
  )}
</Button>

  {historicalPlacesOpen && (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '20px' : '0px' }}>
      <Button
        onClick={() => navigate('/TouristUpcomingHP')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <ScheduleIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && 'Upcoming '}
      </Button>
      <Button
        onClick={() => navigate('/TouristCompletedHPs')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <ChecklistIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && 'Visited '}
      </Button>
      <Button
        onClick={() => navigate('/TouristBookedHP')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <EventAvailableIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && 'Booked '}
      </Button>
      
    </Box>
  )}
</Box>


<Box>
<Button
  onClick={async () => {
    try {
      // Toggle the museums dropdown open/close
      setMuseumsOpen(!museumsOpen);

      // Get the username from localStorage
      const username = localStorage.getItem('username');

      if (!username) {
        alert('User not logged in.');
        return;
      }

      // Call the `addCompletedMuseumEvents` function via an API request
      const response = await axios.put('/addCompletedMuseumEvents', { touristUsername: username });

      if (response.status === 200) {
        // Handle success, maybe show a success message or update local state
        //alert('Museum events updated successfully!');
      } else {
        //alert('Failed to update museum events.');
      }
    } catch (error) {
      console.error('Error updating museum events:', error);
      alert('An error occurred while updating museum events.');
    }
  }}
  sx={styles.sidebarButton}
>
  <AccountBalanceIcon sx={styles.icon} /> {/* Suitable icon for Museums */}
  {sidebarOpen && (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      Museums
      {museumsOpen ? (
        <KeyboardArrowUpIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
      ) : (
        <KeyboardArrowDownIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
      )}
    </Box>
  )}
</Button>

  {museumsOpen && (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '20px' : '0px' }}>
      {/* Upcoming Museums */}
      <Button
        onClick={() => navigate('/TouristUpcomingMuseums')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <ScheduleIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && 'Upcoming '}
      </Button>
      
      {/* Visited Museums */}
      <Button
        onClick={() => navigate('/TouristCompletedMuseums')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <ChecklistIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && 'Visited '}
      </Button>
      
      {/* Saved Museums */}
      <Button
        onClick={() => navigate('/TouristBookedMuseum')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <EventAvailableIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && 'Booked '}
      </Button>
    </Box>
  )}
</Box>



<Box>
  <Button
    onClick={() => setTransportationOpen(!transportationOpen)} // Toggle dropdown for transportation
    sx={styles.sidebarButton}
  >
    <DirectionsBusIcon sx={styles.icon} /> {/* Transportation Icon */}
    {sidebarOpen && (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        Transportation
        {transportationOpen ? (
          <KeyboardArrowUpIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
        )}
      </Box>
    )}
  </Button>
  {transportationOpen && (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '20px' : '0px' }}>
      {/* Available Transportation */}
      <Button
        onClick={() => navigate('/TouristAllTransportation')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <CommuteIcon sx={{ fontSize: '18px', marginRight: '10px' }} /> {/* Commute Icon */}
        {sidebarOpen && 'Available Transportation'}
      </Button>
      
      {/* Booked Transportation */}
      <Button
        onClick={() => navigate('/TouristBookedTransportation')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <EventAvailableIcon sx={{ fontSize: '18px', marginRight: '10px' }} /> {/* Booked Icon */}
        {sidebarOpen && 'Booked '}
      </Button>
    </Box>
    
  )}
</Box>
<Button onClick={() => navigate('/TouristComplaints')} sx={styles.sidebarButton}>
          <AssignmentIcon sx={styles.icon} />
          {sidebarOpen && 'Complaints'}
        </Button>
        <Button onClick={() => navigate('/TouristSavedEvents')} sx={styles.sidebarButton}>
          <BookmarkIcon sx={styles.icon} />
          {sidebarOpen && 'Saved Events'}
        </Button>

        <Button
  onClick={async () => {
    try {
      // Call the markOrdersAsDelivered function via an API request
      await axios.put('/markOrdersAsDelivered'); // Assuming your API route is '/markOrdersAsDelivered'
      
      // Navigate to the orders page after successfully marking orders as delivered
      navigate('/TouristOrders');
    } catch (error) {
      console.error('Error marking orders as delivered:', error);
      alert('Failed to update orders. Please try again.');
    }
  }}
  sx={styles.sidebarButton}
>
  <ShoppingBagIcon sx={styles.icon} />
  {sidebarOpen && 'Orders'}
</Button>
<Button onClick={() => navigate('/NewTouristHomePage')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button>

</Box>

     




      {/* Back to Top Button */}
      {showBackToTop && (
        <Button onClick={scrollToTop} sx={styles.backToTop}>
          Back to Top
        </Button>
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

export default TouristBookedFlights;


