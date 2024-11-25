import React, { useState, useEffect } from 'react';
import { Box,Checkbox, Button, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, Modal, TextField, Divider, FormControlLabel  } from '@mui/material';
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
import axios from 'axios';

function TouristFlights() {
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

const [errorMessage, setErrorMessage] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState('');
  const [directFlight, setDirectFlight] = useState(false); // Single state for the checkbox
  const [flightOffers, setFlightOffers] = useState([]);

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

  const fetchCityCode = async (cityName) => {
    try {
      const response = await axios.get("/fetchCityCode", { params: { cityName } });
      return response.data.cityCode; // Return the city code
    } catch (error) {
      throw new Error(error.response?.data?.msg || `Error fetching city code for ${cityName}`);
    }
  };

  const handleSearchFlights = async () => {
    try {
      setErrorMessage(""); // Clear previous errors
  
      // Fetch city codes for origin and destination
      const [originCode, destinationCode] = await Promise.all([
        fetchCityCode(origin),
        fetchCityCode(destination),
      ]);
  
      // Call the existing flight search function with city codes
      const response = await axios.post("/fetchFlights", {
        origin: originCode,
        destination: destinationCode,
        departureDate,
        returnDate,
        adults,
        direct: directFlight ? true : false, // Ensure boolean value
      });
  
      setFlightOffers(response.data); // Set the flight offers to the state
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "An error occurred while searching for flights.");
    }
  };
  

  const handleBookFlight = async (flightID) => {
    const touristUsername = localStorage.getItem('username');
    try {
      const response = await axios.post('/bookFlight', {
        touristUsername: touristUsername, // Replace with actual tourist username
        flightID: flightID, // Pass the flightID directly
      });
      alert(response.data.msg); // Success message
    } catch (error) {
      alert(error.response?.data?.msg || 'Error booking flight');
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
          <Typography variant="h6" component="div" sx={styles.logo}>
            Beyond Borders
          </Typography>
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
    <BookmarkBorderOutlinedIcon/>
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
  
      {/* Search Box */}
      <Box
        sx={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          marginTop: '40px', // Space between search box and containers
        }}
      >
        <Typography
          variant="h5"
          sx={{ marginBottom: '20px', color: '#192959', fontWeight: 'bold', textAlign: 'center' }}
        >
          Flights
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <TextField
            label="Origin"
            variant="outlined"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            sx={{ flex: '1 1 150px' }}
          />
          <TextField
            label="Destination"
            variant="outlined"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            sx={{ flex: '1 1 150px' }}
          />
          <TextField
            label="Departure Date"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: '1 1 150px' }}
          />
          <TextField
            label="Return Date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: '1 1 150px' }}
          />
          <TextField
            label="Adults"
            type="number"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            sx={{ flex: '1 1 100px' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={directFlight}
                onChange={(e) => setDirectFlight(e.target.checked)}
                color="primary"
              />
            }
            label="Direct"
            sx={{ flex: '1 1 auto', whiteSpace: 'nowrap' }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#192959',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#33416b',
              },
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 16px',
            }}
            onClick={handleSearchFlights}
          >
            Search
            <SearchIcon />
          </Button>
        </Box>
        {errorMessage && (
          <Typography color="error" sx={{ marginBottom: '20px' }}>
            {errorMessage}
          </Typography>
        )}
      </Box>
  
{/* Flight Offers */}
<Box
  sx={{
    marginTop: '70px', // Additional space from the top
    width: '80%',
    margin: '0 auto',
  }}
>
  {flightOffers.length > 0 && (
    <Box>
      {flightOffers.map((flightGroup, groupIndex) => (
        <Box
          key={groupIndex}
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
           
          </Typography>

          <Box sx={{ marginBottom: '20px', width: '100%' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              Outbound Flight
            </Typography>
            {flightGroup[0].segments.map((segment, segmentIndex) => (
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
              }}
            >
              Return Flight
            </Typography>
            {flightGroup[1]?.segments.map((segment, segmentIndex) => (
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
{/* Price and Book Now */}
<Box
  sx={{
    display: 'flex',
    justifyContent: 'flex-end', // Align content to the right
    alignItems: 'center',
    width: '100%',
  }}
>
  <Box sx={{ textAlign: 'center', marginRight: '10px' }}>
    
    <Typography
      variant="h6"
      sx={{
        fontWeight: 'bold',
        color: '#192959',
      }}
    >
      Total Price: {flightGroup[0].price} {flightGroup[0].currency}
    </Typography>
  </Box>
  <Button
    variant="contained"
    sx={{
      backgroundColor: '#192959',
      color: '#fff',
      '&:hover': { backgroundColor: '#33416b' },
    }}
    onClick={() => handleBookFlight(flightGroup[0].flightID)}
  >
    Book
  </Button>
</Box>

        </Box>
      ))}
    </Box>
  )}
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

        <Button onClick={() => navigate('/TouristHotels')} sx={styles.sidebarButton}>
          <BedIcon sx={styles.icon} />
          {sidebarOpen && 'Hotels'}
        </Button>
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
        onClick={() => navigate('/my-purchased-products')}
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
        onClick={() => navigate('/view-all-products')}
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
            onClick={() => setActivitiesOpen(!activitiesOpen)}
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
                onClick={() => navigate('/completed-activities')}
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
                onClick={() => navigate('/my-booked-activities')}
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
    onClick={() => setItinerariesOpen(!itinerariesOpen)} // Toggle dropdown for itineraries
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
        onClick={() => navigate('/completed-itineraries')}
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
        onClick={() => navigate('/my-booked-itineraries')}
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
    onClick={() => setHistoricalPlacesOpen(!historicalPlacesOpen)} // Toggle dropdown for historical places
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
        onClick={() => navigate('/visited-historical-places')}
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
        onClick={() => navigate('/saved-historical-places')}
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
    onClick={() => setMuseumsOpen(!museumsOpen)} // Toggle dropdown for museums
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
        onClick={() => navigate('/visited-museums')}
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
        onClick={() => navigate('/saved-museums')}
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
        onClick={() => navigate('/available-transportation')}
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
        onClick={() => navigate('/booked-transportation')}
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
<Box>
  <Button
    onClick={() => setComplaintsOpen(!complaintsOpen)} // Toggle dropdown for complaints
    sx={styles.sidebarButton}
  >
    <AssignmentIcon sx={styles.icon} /> {/* Complaints Icon */}
    {sidebarOpen && (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        Complaints
        {complaintsOpen ? (
          <KeyboardArrowUpIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ fontSize: '18px', marginLeft: '5px' }} />
        )}
      </Box>
    )}
  </Button>
  {complaintsOpen && (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '20px' : '0px' }}>
      {/* View All Complaints */}
      <Button
        onClick={() => navigate('/view-all-complaints')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <AddIcon sx={{ fontSize: '18px', marginRight: '10px' }} />
        {sidebarOpen && 'File Complaint'}
      </Button>
      
      {/* My Submitted Complaints */}
      <Button
        onClick={() => navigate('/my-submitted-complaints')}
        sx={{
          ...styles.sidebarButton,
          fontSize: '14px',
          paddingLeft: sidebarOpen ? '20px' : '10px',
          padding: '5px 20px',
        }}
      >
        <FeedbackIcon sx={{ fontSize: '18px', marginRight: '10px' }} /> {/* Feedback Icon */}
        {sidebarOpen && 'My Complaints'}
      </Button>
    </Box>
  )}
</Box>
        
        
      
        <Button onClick={() => navigate('/NewTouristHomePage')} sx={styles.sidebarButton}>
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


<Tooltip title={editing[index] ? "Save" : "Edit"} arrow>
  <IconButton
    onClick={() => {
      if (editing[index]) {
        handleUpdateItinerary(index);
      }
      setEditing((prev) => ({ ...prev, [index]: !prev[index] }));
    }}
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
    {editing[index] ? <SaveIcon /> : <EditIcon />}
  </IconButton>
</Tooltip>



<Tooltip title="Deactivate" arrow>
  <IconButton
    onClick={() => handleDeactivateItinerary(activity.Title)}
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
    <BlockIcon />
  </IconButton>
</Tooltip>

<Tooltip title="Delete" arrow>
  <IconButton
    onClick={() => handleDeleteItinerary(activity.Title)}
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
    <DeleteIcon />
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

export default TouristFlights;


