import React, { useState, useEffect } from 'react';
import { Box, Button, Typography,Menu, MenuItem,Tooltip, IconButton, Modal, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, Drawer,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar, Grid,
  Tabs,
  Tab,
  AppBar,
  useTheme, Card, CardMedia, CardContent, CardActions,
  Avatar, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person'; // Icon for generic user type
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChecklistIcon from '@mui/icons-material/Checklist';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ChurchIcon from '@mui/icons-material/Church';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CommuteIcon from '@mui/icons-material/Commute';
import FlightIcon from '@mui/icons-material/Flight';
import BedIcon from '@mui/icons-material/Bed';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import  FeedbackIcon  from '@mui/icons-material/Feedback';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircleRounded';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import StarsIcon from '@mui/icons-material/Stars';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'; // Icon for generic user type
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import InfoIcon from '@mui/icons-material/Info';

//import Joyride from 'react-joyride';

import Joyride, { CallBackProps, any } from "react-joyride";
import axios from 'axios';

function HomePageGuest() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showManageAccessDropdown, setShowManageAccessDropdown] = useState(false);
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [addTourismGovModal, setAddTourismGovModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [govUsername, setGovUsername] = useState('');
  const [govPassword, setGovPassword] = useState('');
  const [confirmGovPassword, setConfirmGovPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  //const [errorMessage, setErrorMessage] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showConfirmAdminPassword, setShowConfirmAdminPassword] = useState(false);
  const [showGovPassword, setShowGovPassword] = useState(false);
  //const [showGovPassword, setShowGovPassword] = useState(false);
  const [showConfirmGovPassword, setShowConfirmGovPassword] = useState(false); // Add this line

  const [deleteRequests, setDeleteRequests] = useState([]);
  const [deleteRequestsModal, setDeleteRequestsModal] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null); // For confirmation dialog
  const [activitiesAnchorEl, setActivitiesAnchorEl] = useState(null);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [itinerariesOpen, setItinerariesOpen] = useState(false);
  const [historicalPlacesOpen, setHistoricalPlacesOpen] = useState(false);
  const [museumsOpen, setMuseumsOpen] = useState(false);
  const [transportationOpen, setTransportationOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [complaintsOpen, setComplaintsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
const [isEditable, setIsEditable] = useState(false);
const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility

const [availablePreferences, setAvailablePreferences] = useState([]); // Holds available preference tags
const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false); // Controls preference selection modal visibility
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
const [cartData, setCartData] = useState([]);
const [isLoadingCart, setIsLoadingCart] = useState(false);
  
const [wishlistData, setWishlistData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const tabs = ["Activities", "Itineraries", "Museums", "Historical Places"];
  const icons = [
    <LocalActivityIcon />,
    <MapIcon />,
    <AccountBalanceIcon />,
    <ChurchIcon />, // Replace with a suitable Historical Places icon
    <ShoppingCartIcon />,
  ];
  
  const tabHeadings = [
    "Explore Exciting Activities",
    "Plan Your Perfect Itinerary",
    "Discover Museums",
    "Visit Historical Places",
  ];

  const [itineraries, setItineraries] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [europeanTours, setEuropeanTours] = useState([]); // New state variable for European tours
  const [selectedActivities, setSelectedActivities] = useState([]);

  const [itineraryData, setItineraryData] = useState({
    title: '',
    activities: '',
    locations: '',
    timeline: '',
    language: '',
    price: '',
    date: '',
    accessibility: false,
    pickupLocation: '',
    dropoffLocation: '',
    tags: '',
  });

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    password: '',
    mobileNumber: '',
    dateOfBirth: '',
    nationality: '',
    occupation: '',
    wallet: 0,
    points: 0,
    badgeLevel: 0,
    preferences: [],
  });
  
  const [runTutorial, setRunTutorial] = useState(false); // To control the tutorial
  const [steps] = useState([
    {
        target: ".menuIconContainer",
        content: "This is the main navigation menu. Hover to expand it and explore the different sections.",
    },
    {
        target: ".searchQuery",
        content: "Use this search bar to quickly find activities, itineraries, or places.",
    },
    {
        target: ".tabsHeader",
        content: "Switch between different categories using these tabs.",
    },
    {
        target: ".tutorial-card", // Target the card elements
        content: "These are the available cards for activities, itineraries, and places. Click on them for more details.",
    },
    {
        target: ".registerButton",
        content: "Click here to register and unlock more features of the platform.",
    },
    {
        target: ".backToTop",
        content: "Use this button to quickly return to the top of the page.",
    },
]);

  



useEffect(() => {
  fetchUpcomingItineraries();
  fetchUpcomingHistoricalPlaces();
  fetchPopularEuropeanTours();
  fetchSelectedActivities();
}, []);


  // Method to handle opening the modal
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  // Method to handle closing the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const toggleWishlistDrawer = () => {
    setIsWishlistOpen(!isWishlistOpen);
    if (!isWishlistOpen) {
      fetchWishlist(); // Fetch wishlist data when opening the drawer
    }
  };

  

  const navigate = useNavigate();

  useEffect(() => {
    if (changePasswordModal) {
      fetchCurrentPassword();
    }
    if (deleteRequestsModal) {
      fetchDeleteRequests();
    }
  }, [changePasswordModal, deleteRequestsModal]);

  const fetchCurrentPassword = async () => {
    const username = localStorage.getItem('username');
    try {
      const response = await axios.get('/api/getAdminPassword', { params: { username } });
      setCurrentPassword(response.data);
    } catch (error) {
      console.error('Error fetching current password:', error);
      setErrorMessage('Error fetching current password');
    }
  };

  const handleActivitiesMenuClick = (event) => {
    setActivitiesAnchorEl(event.currentTarget); // Open the dropdown menu
  };
  
  const handleActivitiesMenuClose = () => {
    setActivitiesAnchorEl(null); // Close the dropdown menu
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    const username = localStorage.getItem('username');
    try {
      const response = await axios.put('/updateAdminPassword', { Username: username, newPassword });
      if (response.status === 200) {
        alert('Password updated successfully!');
        setChangePasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage('Failed to update password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage('Failed to update password.');
    }
  };

  const handleManageAccessHover = () => {
    setShowManageAccessDropdown(true);
  };

  const handleManageAccessLeave = () => {
    setShowManageAccessDropdown(false);
  };

  const handleAddAdmin = async () => {
    if (!adminUsername) {
      setErrorMessage("Please enter a username to continue.");
      return;
    }
    if (!adminPassword) {
      setErrorMessage("Please enter a password to continue.");
      return;
    }
    if (!confirmAdminPassword) {
      setErrorMessage("Please confirm the password to continue.");
      return;
    }
    if (adminPassword !== confirmAdminPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('/addAdmin', {
        Username: adminUsername,
        Password: adminPassword,
      });
      if (response.status === 200) {
        alert('Admin added successfully!');
        setAddAdminModal(false);
        setAdminUsername('');
        setAdminPassword('');
        setConfirmAdminPassword('');
        resetAddAdminModal();
      } else {
        setErrorMessage('Failed to add admin.');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      setErrorMessage('Failed to add admin.');
    }
  };

  const handleAddTourismGov = async () => {
    if (!govPassword) {
      setErrorMessage("Please enter a username to continue.");
      return;
    }
    if (!confirmGovPassword) {
      setErrorMessage("Please enter a password to continue.");
      return;
    }
    if (!confirmGovPassword) {
      setErrorMessage("Please confirm the password to continue.");
      return;
    }
    if (govPassword !== confirmGovPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }


    try {
      const response = await axios.post('/addTourismGovernor', {
        Username: govUsername,
        Password: govPassword,
      });
      if (response.status === 200) {
        alert('Tourism Governor added successfully!');
        setAddTourismGovModal(false);
        setGovUsername('');
        setGovPassword('');
        setConfirmGovPassword('');
        resetAddTourismGovModal();
      } else {
        setResponseMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setResponseMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };
  const fetchUpcomingItineraries = async () => {
    try {
      const response = await axios.get("/api/ViewAllUpcomingItinerariesTourist");
      // Filter only the required itineraries
      //console.log(response.data);
      const filteredItineraries = response.data.filter((itinerary) =>
        ["Cultural Heritage Tour", "Discover Ancient Egypt"].includes(itinerary.Title)
      );
      console.log(filteredItineraries);
      setItineraries(filteredItineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };
  
  const fetchUpcomingHistoricalPlaces = async () => {
    try {
      const response = await axios.get("/api/ViewAllUpcomingHistoricalPlacesEventsTourist");
      //console.log(response.data);
      // Filter only the required historical places
      const filteredHistoricalPlaces = response.data.filter((place) =>
        ["Sphinx", "The Great Pyramid of Giza"].includes(place.name)
      );
      console.log(filteredHistoricalPlaces);
      setHistoricalPlaces(filteredHistoricalPlaces);
    } catch (error) {
      console.error("Error fetching historical places:", error);
    }
  };

  const fetchPopularEuropeanTours = async () => {
    try {
      const response = await axios.get("/api/ViewAllUpcomingItinerariesTourist");
      const filteredTours = response.data.filter((tour) =>
        [
          "Canal Tour in Venice",
          "Explore Berlin's Landmarks",
          "Cycling Amsterdam Tour",
          "All Around Paris Tour",
        ].includes(tour.Title)
      );
      console.log(filteredTours);
      setEuropeanTours(filteredTours); // Updated state variable name
    } catch (error) {
      console.error("Error fetching popular European tours:", error);
    }
  };

  const fetchSelectedActivities = async () => {
    try {
      const response = await axios.get("/api/ViewAllUpcomingActivities");
      const filteredActivities = response.data.filter((activity) =>
        [
         "Hiking in Grand Canyon",
      "Surfing Lessons in Waikiki",
      "Painting Workshop in Paris",
      "Yoga at the Beach",
        ].includes(activity.Name)
      );
      setSelectedActivities(filteredActivities); // Set the state with fetched activities

    } catch (error) {
      console.error("Error fetching selected activities:", error);
    }
  };
  
  const renderContent = () => {
    return (
      
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {/* Search Input */}
        <TextField
          className="searchQuery"
          placeholder={`Search in ${tabs[activeTab]}...`}
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "70%" }}
        />
        
        {/* Search Button */}
        <Button
          variant="contained"
          onClick={handleSearch} // Calls the handleSearch function
          sx={{
            backgroundColor: '#192959',
            color: '#fff',
            '&:hover': { backgroundColor: '#33416b' },
          }}
        >
          Search <SearchIcon sx={{ marginLeft: "8px" }} />
        </Button>
      </Box>
    );
  };
  
  

  const getImageForItem = (item, type) => {
    // Provide unique default images based on type and name/Title
    if (type === "itinerary") {
      switch (item.Title) {
        case "Cultural Heritage Tour":
          return "/images/tour2.jpg";
        case "Discover Ancient Egypt":
          return "/images/pyramids-camel-ride.jpg";
        default:
          return "/images/default-itinerary.jpg";
      }
    } else if (type === "historical") {
      switch (item.name) {
        case "Sphinx":
          return "/images/sphinx2.jpg";
        case "The Great Pyramid of Giza":
          return "/images/pyramidsss.jpg";
        default:
          return "/images/sphinx.jpg";
      }
    }
  
    return "/images/default-placeholder.jpg"; // Fallback image
  };
  
  const getTourImage = (tour, type) => {
    if (type === "tour") {
      switch (tour.Title) {
        case "Canal Tour in Venice":
          return "/images/venice.jpg";
        case "Explore Berlin's Landmarks":
          return "/images/berlin2.jpeg";
        case "Cycling Amsterdam Tour":
          return "/images/amsterdam.jpg";
        case "All Around Paris Tour":
          return "/images/paris.jpg";
        default:
          return "/images/default-tour.jpg";
      }
    }
    return "/images/default-placeholder.jpg"; // Fallback image
  };
  
  const getActivityImage = (activity) => {
    switch (activity.Name) {
      case "Hiking in Grand Canyon":
        return "/images/hiking.jpg";
      case "Surfing Lessons in Waikiki":
        return "/images/surfing.jpg";
      case "Painting Workshop in Paris":
        return "/images/painting.jpg";
      case "Yoga at the Beach":
        return "/images/yoga.jpg";
      default:
        return "/images/default-activity.jpg";
    }
  };
  
 
  const handleSearch = () => {
    if (searchQuery.trim() === "") return; // Skip if the search query is empty
  
    const encodedQuery = encodeURIComponent(searchQuery); // Encode the search query for the URL
  
    // Switch based on the active tab
    switch (tabs[activeTab]) {
      case "Activities":
        navigate(`/GuestActivity?search=${encodedQuery}`);
        break;
      case "Itineraries":
        navigate(`/GuestItinerary?search=${encodedQuery}`);
        break;
      case "Historical Places":
        navigate(`/GuestHP?search=${encodedQuery}`);
        break;
      case "Museums":
        navigate(`/GuestMuseum?search=${encodedQuery}`);
        break;
      default:
        console.error("Unhandled tab:", tabs[activeTab]);
        break;
    }
  };
  
  
  const renderCard = (item, type) => {
    
  
    if (!item) return null; // Safeguard for null/undefined items
  
    // Function to generate star icons
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          i <= rating ? (
            <StarIcon key={i} sx={{ color: "#192959", fontSize: "20px" }} />
          ) : (
            <StarBorderIcon key={i} sx={{ color: "#192959", fontSize: "20px" }} />
          )
        );
      }
      return stars;
    };
  
    return (
      <Card
        key={item._id}
        className="tutorial-card" 
        onClick={() =>
          type === "itinerary"
            ? navigate(`/GuestItinerary?Title=${encodeURIComponent(item.Title)}`)
            : navigate(`/GuestHP?name=${encodeURIComponent(item.name)}`)
  
        }
        sx={{
          width: "350px",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          overflow: "hidden",
          cursor: "pointer", // Change cursor to pointer
          transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth scaling and shadow transition
          "&:hover": {
            transform: "scale(1.05)", // Slightly enlarge on hover
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Deeper shadow on hover
          },
        }}
      >
        {/* Image */}
        <CardMedia
          component="img"
          alt={item.name || item.Title || "Image"}
          height="240"
          image={getImageForItem(item, type)} // Use unique image function
        />
  
        {/* Content */}
        <CardContent sx={{ flexGrow: 1, paddingBottom: "0px" }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ marginBottom: "0px" }} // Reduce space between title and rating
          >
            {item.name || item.Title || "Unknown"}
          </Typography>
        </CardContent>
  
        {/* Footer */}
        <CardActions
          sx={{
            flexDirection: "column", // Stack rating and price vertically
            alignItems: "flex-start", // Align items to the left
          }}
        >
          {/* Rating */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            {renderStars(item.Ratings || 0)}
          </Box>
  
          {/* Price */}
          <Typography variant="body2" color="textSecondary">
            from EGP{" "}
            {type === "itinerary"
              ? item.Price || "Unknown price"
              : item.ticketPrices?.student || "Unknown price"}
          </Typography>
        </CardActions>
      </Card>
    );
  };
  
  const renderTourCard = (tour, type) => {
    if (!tour) return null;
  
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          i <= rating ? (
            <StarIcon key={i} sx={{ color: "#192959", fontSize: "20px" }} />
          ) : (
            <StarBorderIcon key={i} sx={{ color: "#192959", fontSize: "20px" }} />
          )
        );
      }
      return stars;
    };
  
    return (
      <Card
        key={tour._id}
        onClick={() =>
          type === "tour"
            ? navigate(`/GuestItinerary?Title=${encodeURIComponent(tour.Title)}`)
            : navigate(`/GuestHP?name=${encodeURIComponent(tour.name)}`)
        }
        sx={{
          width: "350px",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <CardMedia
          component="img"
          alt={tour.name || tour.Title || "Image"}
          height="240"
          image={getTourImage(tour, type)}
        />
        <CardContent sx={{ flexGrow: 1, paddingBottom: "0px" }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ marginBottom: "0px" }}
          >
            {tour.name || tour.Title || "Unknown"}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            {renderStars(tour.Ratings || 0)}
          </Box>
          <Typography variant="body2" color="textSecondary">
            from EGP{" "}
            {type === "tour"
              ? tour.Price || "Unknown price"
              : tour.ticketPrices?.student || "Unknown price"}
          </Typography>
        </CardActions>
      </Card>
    );
  };
  
  
  const renderActivityCard = (activity) => {
    if (!activity) return null;
  
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          i <= rating ? (
            <StarIcon key={i} sx={{ color: "#192959", fontSize: "20px" }} />
          ) : (
            <StarBorderIcon key={i} sx={{ color: "#192959", fontSize: "20px" }} />
          )
        );
      }
      return stars;
    };
  
    return (
      <Card
        key={activity._id}
        onClick={() =>
          navigate(`/GuestActivity?Name=${encodeURIComponent(activity.Name)}`)
        }
        sx={{
          width: "350px",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <CardMedia
          component="img"
          alt={activity.Name || "Image"}
          height="240"
          image={getActivityImage(activity)}
        />
        <CardContent sx={{ flexGrow: 1, paddingBottom: "0px" }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ marginBottom: "0px" }}
          >
            {activity.Name || "Unknown"}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            {renderStars(activity.Rating || 0)}
          </Box>
          <Typography variant="body2" color="textSecondary">
            from EGP {activity.Price || "Unknown price"}
          </Typography>
        </CardActions>
      </Card>
    );
  };
  

  
  
  
  

  const saveProfile = async () => {
    const username = localStorage.getItem('username');
  
    if (!username) {
      alert('You need to log in first.');
      return;
    }
  
    try {
      // Prepare the update payload excluding non-editable fields
      const updatePayload = {
        Username: profileData.username,
        Email: profileData.email,
        Password: profileData.password,
        MobileNumber: profileData.mobileNumber,
        Nationality: profileData.nationality,
        Occupation: profileData.occupation,
        Points: profileData.points,
        BadgeLevelOfPoints: profileData.badgeLevel,
        MyPreferences: profileData.preferences,
      };
  
      console.log("Update Payload:", updatePayload); // Debugging payload
  
      // Make the PUT request to update the profile
      const response = await axios.put('/api/updateTourist', updatePayload);
  
      console.log("Response Data:", response.data); // Debugging response
  
      alert(response.data.msg || 'Profile updated successfully!');
  
      // Optionally, fetch updated profile from the backend
      setProfileData((prev) => ({
        ...prev,
        username: response.data.Username || prev.username,
        email: response.data.Email || prev.email,
        password: response.data.Password || prev.password,
        mobileNumber: response.data.MobileNumber || prev.mobileNumber,
        nationality: response.data.Nationality || prev.nationality,
        occupation: response.data.Occupation || prev.occupation,
        points: response.data.Points || prev.points,
        badgeLevel: response.data.BadgeLevelOfPoints || prev.badgeLevel,
        preferences: response.data.MyPreferences || prev.preferences,
      }));
  
      setIsEditable(false); // Disable edit mode after saving
    } catch (error) {
      console.error('Error saving profile:', error);
  
      if (error.response) {
        alert(error.response.data.msg || 'An error occurred while saving the profile.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };
  
  
  
  

  

  // Reset function for Add Admin Modal
  const resetAddAdminModal = () => {
    setAdminUsername('');
    setAdminPassword('');
    setConfirmAdminPassword('');
    setShowAdminPassword(false);
    setShowConfirmAdminPassword(false);
    setErrorMessage('');
  };

  // Reset function for Add Tourism Governor Modal
  const resetAddTourismGovModal = () => {
    setGovUsername('');
    setGovPassword('');
    setConfirmGovPassword('');
    setShowGovPassword(false);
    setShowConfirmGovPassword(false);
    setErrorMessage('');
  };

  // Function to fetch delete requests
const fetchDeleteRequests = async () => {
  try {
    const response = await axios.get('/api/readAllDeleteRequests');
    setDeleteRequests(response.data);
  } catch (error) {
    console.error("Error fetching delete requests:", error);
  }
};

// Open Delete Requests Modal and fetch data
const openDeleteRequestsModal = () => {
  setDeleteRequestsModal(true);
  fetchDeleteRequests();
};

// Confirm delete dialog
const handleConfirmDeleteRequest = (request) => {
  setRequestToDelete(request);
  setConfirmDeleteDialog(true); // Open the confirmation dialog
};

// Final confirmation to delete request
const confirmDeleteRequest = async () => {
  try {
    await axios.post('/deleteAccount', { username: requestToDelete.Username });
    setDeleteRequests((prev) =>
      prev.filter((req) => req.Username !== requestToDelete.Username) // Corrected state update
    );
    setRequestToDelete(null);
    fetchDeleteRequests();
  } catch (error) {
    console.error("Error deleting request:", error);
  }
};

const handleOpenPreferencesModal = async () => {
  try {
    const response = await axios.get('/viewPreferenceTags'); // Adjust endpoint if necessary
    const tags = response.data;

    setAvailablePreferences(tags); // Populate the available preferences
    setIsPreferencesModalOpen(true); // Open the preferences modal
  } catch (error) {
    console.error('Error fetching preferences:', error);
    alert('An error occurred while fetching preferences. Please try again later.');
  }
};


  // Fetch wishlist data
  const fetchWishlist = async () => {
    const touristUsername = localStorage.getItem("username"); // Replace with your username logic
    setIsLoading(true);
    try {
      const response = await axios.get("/api/viewMyWishlist", {
        params: { touristUsername },
      });
  
      if (response.status === 200 && response.data.WishList) {
        setWishlistData(response.data.WishList);
      } else {
        setWishlistData([]); // Clear the wishlist if the response is not valid
        console.warn("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistData([]); // Clear wishlist on error
    } finally {
      setIsLoading(false);
    }
  };
  
  

  // Trigger fetching the wishlist data when the drawer opens
  const handleDrawerOpen = () => {
    if (!isWishlistOpen) return;
    fetchWishlist();
  }


const togglePreference = (preference) => {
  if (profileData.preferences.includes(preference)) {
    // Remove the preference
    setProfileData((prev) => ({
      ...prev,
      preferences: prev.preferences.filter((pref) => pref !== preference),
    }));
  } else {
    // Add the preference
    setProfileData((prev) => ({
      ...prev,
      preferences: [...prev.preferences, preference],
    }));
  }
};

const savePreferences = async () => {
  try {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('User not logged in.');
      return;
    }

    const response = await axios.put('/addPreferences', {
      touristUsername: username,
      preferences: profileData.preferences,
    });

    alert(response.data.msg || 'Preferences saved successfully!');
    setIsPreferencesModalOpen(false);
  } catch (error) {
    console.error('Error saving preferences:', error);
    alert(error.response?.data?.msg || 'An error occurred while saving preferences.');
  }
};

const handleAccountDeletion = async () => {
  const username = profileData.username; // Use the username from profile data

  if (!username) {
    alert('Username not found. Please try again.');
    return;
  }

  try {
    const response = await axios.post('/api/requestDeleteAccountTourist', {
      Username: username, // Pass the username to the backend
    });
    alert(response.data.msg || 'Your request to delete the account has been submitted!');
  } catch (error) {
    console.error('Error requesting account deletion:', error);
    alert(
      error.response?.data?.msg ||
        'An error occurred while requesting account deletion. Please try again later.'
    );
  }
};


const handleRedeemPoints = async () => {
  try {
    const response = await axios.put('/redeemPoints', {
      username: profileData.username,
    });
    alert(response.data.msg);
    setProfileData({
      ...profileData,
      wallet: response.data.walletBalance,
      points: response.data.remainingPoints,
    });
  } catch (error) {
    alert(
      error.response?.data?.msg || 'An error occurred while redeeming points.'
    );
  }
};


  return (
    
    <Box sx={styles.container}>
      
      {/* Top Menu Bar */}
      <Box sx={{
    position: 'fixed', // Make it fixed to stay visible on scroll
    top: 0, // Stick it to the top of the page
    left: 0,
    right: 0,
    height: '60px', // Adjust as per your top bar height
    backgroundColor: '#192959', // Background color
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Optional shadow for visibility
    zIndex: 1000, // Ensure it's above other elements
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px', // Horizontal padding
  }}>
        <Box className="menuIconContainer" sx={styles.menuIconContainer}>
          <IconButton onMouseEnter={() => setSidebarOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={styles.logo}>
            Beyond Borders
          </Typography>
        </Box>
        <Box sx={styles.topMenuRight}>
          {/* <Button onClick={() => setChangePasswordModal(true)} sx={styles.menuButton}>
            Change My Password
          </Button> */}
          
          <Button
          className="registerButton" 
          sx={{
            ...styles.menuButton,
            '&:hover': {
              backgroundColor: '#e6e7ed', // Background color on hover
              color: '#192959',           // Text color on hover
            },
          }}
          startIcon={<AccountCircleIcon />}
          onClick={() => navigate('/New')} // Fetch profile data and open modal
        >
          Register Now
        </Button>


</Box>
      </Box>

     {/* Collapsible Sidebar */}
<Box
  sx={{
    ...styles.sidebar,
    width: sidebarOpen ? "280px" : "60px",
  }}
  onMouseEnter={() => setSidebarOpen(true)}
  onMouseLeave={() => setSidebarOpen(false)}
>
  {/* Activities */}
  <Button
    onClick={() => navigate("/GuestActivity")}
    sx={styles.sidebarButton}
  >
    <LocalActivityIcon sx={styles.icon} />
    {sidebarOpen && "Activities"}
  </Button>

  {/* Itineraries */}
  <Button
    onClick={() => navigate("/GuestItinerary")}
    sx={styles.sidebarButton}
  >
    <MapIcon sx={styles.icon} />
    {sidebarOpen && "Itineraries"}
  </Button>

  {/* Historical Places */}
  <Button
    onClick={() => navigate("/GuestHP")}
    sx={styles.sidebarButton}
  >
    <ChurchIcon sx={styles.icon} />
    {sidebarOpen && "Historical Places"}
  </Button>

  {/* Museums */}
  <Button
    onClick={() => navigate("/GuestMuseum")}
    sx={styles.sidebarButton}
  >
    <AccountBalanceIcon sx={styles.icon} />
    {sidebarOpen && "Museums"}
  </Button>
</Box>

<Box
  sx={{
    width: "100%",
    margin: "0 auto",
    maxWidth: "1200px",
    marginTop: "120px", // Reduced marginTop to minimize space
  }}
>
  {/* Dynamic Heading */}
  <Typography
    variant="h4"
    sx={{
      textAlign: "center",
      marginBottom: "10px", // Reduced marginBottom
      color: "#192959",
      fontWeight: "bold",
    }}
  >
    {tabHeadings[activeTab]}
  </Typography>

  {/* Tabs Header */}
  <Box
    className="tabsHeader"
    sx={{
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      borderBottom: "2px solid #ddd",
      marginBottom: "10px", // Reduced marginBottom
      marginTop: "20px", // Reduced marginTop
    }}
  >
    {tabs.map((tab, index) => (
      <Button
        key={index}
        onClick={() => setActiveTab(index)}
        sx={{
          flex: 1,
          fontWeight: activeTab === index ? "bold" : "normal",
          borderBottom: activeTab === index ? "2px solid #192959" : "none",
          color: activeTab === index ? "#192959" : "#555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {icons[index]} {tab}
      </Button>
    ))}
  </Box>


{/* Content Section */}
<Box
  sx={{
    overflow: "hidden",
    position: "relative",
    minHeight: "100px",
    padding: "20px",
    borderRadius: "8px",
  }}
>
  {/* Sliding Tabs Content */}
  <Box
    sx={{
      display: "flex",
      transition: "transform 0.5s ease-in-out",
      transform: `translateX(-${activeTab * 100}%)`,
    }}
  >
    {tabs.map((tab, index) => (
      <Box
        key={index}
        sx={{
          width: "100%",
          flexShrink: 0,
        }}
      >
        {/* Render the Content for Each Tab */}
        {renderContent()}
      </Box>
    ))}
  </Box>
</Box>

</Box>

<Box
  sx={{
    padding: "20px 20px", // Reduced padding
    textAlign: "center",
   // marginTop: "10px", // Reduced marginTop to minimize space
  }}
>
  {/* Title */}
  <Typography
    variant="h4"
    sx={{
      textAlign: "left",
      fontWeight: "bold",
      marginLeft: "200px",
      marginBottom: "10px", // Reduced marginBottom for title
      color: "#192959",
    }}
  >
    Ways to Tour Cairo
  </Typography>

  {/* Subtitle */}
  <Typography
    variant="subtitle1"
    color="textSecondary"
    sx={{
      textAlign: "left",
      marginBottom: "10px", // Reduced marginBottom for subtitle
      marginLeft: "200px",
      color: "#555",
    }}
  >
    Book these experiences for a close-up look at Cairo.
  </Typography>

  {/* Cards Container */}
  <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    maxWidth: "1800px",
    minWidth: "500px",
    margin: "0 auto",
  }}
>
  {/* Render Itineraries */}
  {itineraries &&
    itineraries.map((itinerary) =>
      ["Cultural Heritage Tour", "Discover Ancient Egypt"].includes(itinerary.Title)
        ? renderCard(itinerary, "itinerary")
        : null
    )}

  {/* Render Historical Places */}
  {historicalPlaces &&
    historicalPlaces.map((place) =>
      ["Sphinx", "The Great Pyramid of Giza"].includes(place?.name)
        ? renderCard(place, "historical")
        : null
    )}
</Box>

</Box>

<Box
  sx={{
    padding: "20px 20px",
    textAlign: "center",
  }}
>
  <Typography
    variant="h4"
    sx={{
      textAlign: "left",
      fontWeight: "bold",
      marginLeft: "200px",
      marginBottom: "10px",
      color: "#192959",
    }}
  >
    Popular European Tours
  </Typography>

  <Typography
    variant="subtitle1"
    color="textSecondary"
    sx={{
      textAlign: "left",
      marginBottom: "10px",
      marginLeft: "200px",
      color: "#555",
    }}
  >
    Explore the best of Europe with these amazing tours.
  </Typography>

  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
      maxWidth: "1800px",
      minWidth: "500px",
      margin: "0 auto",
    }}
  >
    {europeanTours.map((tour) =>
      renderTourCard(tour, "tour")
    )}
  </Box>
</Box>

<Box
  sx={{
    padding: "20px 20px",
    textAlign: "center",
  }}
>
  <Typography
    variant="h4"
    sx={{
      textAlign: "left",
      fontWeight: "bold",
      marginLeft: "200px",
      marginBottom: "10px",
      color: "#192959",
    }}
  >
    Unique Activities to Explore
  </Typography>

  <Typography
    variant="subtitle1"
    color="textSecondary"
    sx={{
      textAlign: "left",
      marginBottom: "10px",
      marginLeft: "200px",
      color: "#555",
    }}
  >
    Book these unforgettable experiences for your next adventure.
  </Typography>

  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
      maxWidth: "1800px",
      minWidth: "500px",
      margin: "0 auto",
    }}
  >
    {selectedActivities.map((activity) =>
      renderActivityCard(activity)
    )}
  </Box>
</Box>





{/* Profile Modal */}
<Modal open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: 900,
      bgcolor: 'background.paper',
      borderRadius: 1,
      boxShadow: 24,
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        maxHeight: '90vh',
        overflowY: 'auto',
        p: 4,
      }}
    >
      {/* Header with Profile Picture and Edit/Save Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        {/* Profile Picture and Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src="/images/girl.jpg"
            alt={profileData.username}
            sx={{ width: 70, height: 70 }}
          />
          <Box>
            <Typography variant="h6">{profileData.username}</Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          onClick={() => {
            if (isEditable) saveProfile();
            setIsEditable(!isEditable);
          }}
          sx={{
            borderColor: '#192959',
            color: '#192959',
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#192959',
              borderColor: 'white',
              color: 'white',
            },
          }}
          startIcon={isEditable ? <SaveIcon /> : <EditIcon />}
        >
          {isEditable ? 'Save Changes' : 'Edit'}
        </Button>
      </Box>

      {/* Profile Fields */}
      <Box component="form">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              id="username"
              value={profileData.username}
              InputProps={{ readOnly: true }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              InputProps={{ readOnly: !isEditable }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={profileData.password}
              onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
              InputProps={{
                readOnly: !isEditable,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              id="dateOfBirth"
              type="date"
              value={profileData.dateOfBirth}
              InputProps={{ readOnly: true }}
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              id="mobileNumber"
              value={profileData.mobileNumber}
              onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })}
              InputProps={{ readOnly: !isEditable }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nationality"
              id="nationality"
              value={profileData.nationality}
              onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
              InputProps={{ readOnly: !isEditable }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Occupation"
              id="occupation"
              value={profileData.occupation}
              onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
              InputProps={{ readOnly: !isEditable }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Wallet"
              id="wallet"
              value={`${profileData.wallet} EGP`}
              InputProps={{ readOnly: true }}
              margin="dense"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
  <Grid container spacing={2}>
    {/* Points and Redeem Button */}
    <Grid item xs={12} sm={6}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
  fullWidth
  label="Points"
  id="points"
  value={profileData.points}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <StarsIcon sx={{ color: '#192959' }} />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <Button
          onClick={handleRedeemPoints}
          sx={{
            backgroundColor: 'white',
            color: '#192959',
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '8px', // Rounded edges
            boxShadow: 'none', // Removes any shadow
            minWidth: '50px', // Ensures button is not too wide
            '&:hover': {
              backgroundColor: '#f0f0f0', // Slight grey on hover
              boxShadow: 'none', // Prevents hover shadow
            },
          }}
        >
          Redeem
        </Button>
      </InputAdornment>
    ),
    readOnly: true,
  }}
  margin="dense"
/>

      </Box>
    </Grid>

    {/* Badge Level */}
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Badge Level"
        id="badgeLevel"
        value={profileData.badgeLevel}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MilitaryTechIcon sx={{ color: '#192959' }} />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        margin="dense"
      />
    </Grid>
  </Grid>

  {/* Preferences Section */}
<Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
  {profileData.preferences.length > 0 ? (
    <>
      <Typography variant="body1" sx={{ flexBasis: '100%' }}>
        My Preferences:
      </Typography>
      {profileData.preferences.map((preference, index) => (
        <Box
          key={index}
          sx={{
            padding: '5px 10px',
            borderRadius: '12px',
            backgroundColor: '#f0f0f0',
            color: '#192959',
            fontSize: '14px',
            border: '1px solid #192959',
          }}
        >
          {preference}
        </Box>
      ))}
      {isEditable && (
        <Tooltip title="Add Preferences">
          <IconButton
            onClick={handleOpenPreferencesModal}
            sx={{
              backgroundColor: '#192959',
              color: 'white',
              padding: '6px',
              '&:hover': {
                backgroundColor: '#3a4a90',
              },
            }}
          >
            <AddIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </Tooltip>
      )}
    </>
  ) : (
    isEditable && (
      <Button
        variant="outlined"
        onClick={handleOpenPreferencesModal}
        sx={{
          mt: 2,
          borderColor: '#192959',
          color: '#192959',
          width: '50%',
          '&:hover': {
            backgroundColor: '#192959',
            borderColor: 'white',
            color: 'white',
          },
        }}
        startIcon={<AddIcon />}
      >
        Select Your Preferences
      </Button>
    )
  )}
</Box>

</Box>
</Box>
      {/* Delete Account Button */}
      <Button
        variant="contained"
        onClick={() => setIsDeleteDialogOpen(true)}
        sx={{
          marginTop: '20px',
          backgroundColor: '#ff7b7b',
          color: '#a70000',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#a70000',
            color: '#ff7b7b',
          },
        }}
      >
        REQUEST TO DELETE ACCOUNT
      </Button>
    </Box>
  </Box>
</Modal>

<Joyride
  steps={steps}
  run={runTutorial}
  continuous
  scrollToFirstStep={false}
  showSkipButton
  disableScrolling={true}
  styles={{
    options: {
      arrowColor: "#fff",
      backgroundColor: "#192959",
      overlayColor: "rgba(25, 41, 89, 0.5)",
      primaryColor: "#e6e7ed",
      textColor: "#fff",
      zIndex: 1000,
    },
    buttonBack: {
      color: "#ffffff", // White text for Back button
      background: "transparent", // Transparent background for consistency
    },
    buttonNext: {
      backgroundColor: "#192959", // Ensure Next button styling is intact
      color: "#ffffff",
      borderRadius: "20px",
      padding: "10px 20px",
    },
  }}
  callback={(data) => {
    const finishedStatuses = ["finished", "skipped"];
    if (finishedStatuses.includes(data.status)) {
      setRunTutorial(false);
    }
  }}
/>





<Modal
  open={isPreferencesModalOpen}
  onClose={() => setIsPreferencesModalOpen(false)}
  aria-labelledby="preferences-modal-title"
  aria-describedby="preferences-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: 500,
      bgcolor: 'background.paper',
      borderRadius: 1,
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography
      id="preferences-modal-title"
      variant="h6"
      sx={{ mb: 2, color: '#192959', textAlign: 'center' }}
    >
      Select Your Preferences
    </Typography>

    {/* Available Preferences */}
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
      }}
    >
      {availablePreferences.map((tag) => (
        <Box
          key={`available-${tag._id}`}
          sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            borderRadius: '12px',
            backgroundColor: profileData.preferences.includes(tag.NameOfTags)
              ? '#3a4a90'
              : '#f0f0f0',
            color: profileData.preferences.includes(tag.NameOfTags)
              ? 'white'
              : '#192959',
            fontSize: '14px',
            border: '1px solid #192959',
            cursor: 'pointer',
          }}
          onClick={() => togglePreference(tag.NameOfTags)}
        >
          {tag.NameOfTags}
            <IconButton
              sx={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: profileData.preferences.includes(tag.NameOfTags)
                  ? 'white' // White button for remove (-)
                  : '#192959', // Dark blue button for add (+)
                color: profileData.preferences.includes(tag.NameOfTags)
                  ? '#192959' // Dark blue "-"
                  : 'white', // White "+"
                width: '20px',
                height: '20px',
                border: profileData.preferences.includes(tag.NameOfTags)
                  ? '2px solid #192959' // Add dark blue outline for remove (-)
                  : 'none', // No border for add (+)
                borderRadius: '50%', // Rounded button
                '&:hover': {
                  backgroundColor: profileData.preferences.includes(tag.NameOfTags)
                    ? '#e0e0e0' // Light gray hover for remove (-)
                    : '#3a4a90', // Darker blue hover for add (+)
                },
              }}
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click
                togglePreference(tag.NameOfTags);
              }}
            >
              {profileData.preferences.includes(tag.NameOfTags) ? (
                <RemoveIcon sx={{ fontSize: '14px', color: '#192959' }} />
              ) : (
                <AddIcon fontSize="small" />
              )}
            </IconButton>
          
        </Box>
      ))}
    </Box>

    {/* Save Preferences Button */}
    <Button
      variant="contained"
      onClick={savePreferences}
      sx={{
        mt: 3,
        backgroundColor: '#192959',
        color: 'white',
        width: '100%',
        '&:hover': {
          backgroundColor: '#3a4a90',
        },
      }}
    >
      Save Preferences
    </Button>
  </Box>
</Modal>

<Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
  <DialogContent>
    <Typography
      variant="h6"
      sx={{ fontWeight: 'bold', color: '#192959', mb: 2 }}
    >
      Are you sure you want to request the deletion of your account?
    </Typography>
    <Typography variant="body2" sx={{ color: '#555' }}>
      This action cannot be reversed! If you decide to continue, our admins
      will review your profile and decide whether to proceed with your request.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setIsDeleteDialogOpen(false)}
      sx={{
        color: '#192959',
        backgroundColor: '#e6e7ed',
        '&:hover': {
          backgroundColor: '#d1d3d6',
        },
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={async () => {
        await handleAccountDeletion();
        setIsDeleteDialogOpen(false);
      }}
      sx={{
        color: '#fff',
        backgroundColor: '#a70000',
        '&:hover': {
          backgroundColor: '#8b0000',
        },
      }}
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>
<Tooltip title="Start Tutorial" arrow>
  <IconButton
    onClick={() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
      setRunTutorial(true); // Trigger the tutorial
    }}
    sx={{
      position: "fixed", // Fixed position
      bottom: "20px", // Distance from the bottom of the screen
      right: "20px", // Distance from the right of the screen
      backgroundColor: "#ffffff", // White background
      color: "#192959", // Icon color
      borderRadius: "50%", // Circular shape
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
      padding: "12px", // Internal spacing for button
      fontSize: "32px", // Icon size
      zIndex: 1500, // High z-index to stay above other components
      "&:hover": {
        backgroundColor: "#f0f0f0", // Slightly grey on hover
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)", // Enhanced shadow on hover
      },
      "&:focus": {
        outline: "none", // Remove focus outline
        backgroundColor: "#e0e0e0", // Background color on focus
      },
      cursor: "pointer", // Pointer cursor for interactivity
    }}
  >
    <InfoIcon sx={{ fontSize: "32px" }} /> {/* Icon size */}
  </IconButton>
</Tooltip>



    
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#e6e7ed',
    color: '#e6e7ed',
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
    position: 'relative',
    zIndex: 2,
  },
  menuIconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  reqDeleteButton: {
    marginTop: "10px",
    backgroundColor: '#ff7b7b',
    color: '#a70000',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#a70000', // Set background color on hover
      color: '#ff7b7b',           // Set text color on hover
    },
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
  manageAccessContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#192959',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 1,
  },
  dropdownItem: {
    color: '#e6e7ed',
    display: 'block',
    padding: '10px 20px',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: '#4d587e',
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
    padding: '5px 20px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },

  dropdownButton: {
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
    gap:'10px'
  },
  icon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  content: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    padding: '20px 70px 20px 90px',
    marginLeft: '60px',
    transition: 'margin-left 0.3s ease',
  },
  infoBox: {
    backgroundColor: '#4d587e',
    color: '#e6e7ed',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'left',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '&:hover .text': {
      transform: 'scale(1.5)',
    },
  },
  image: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '10px',
    transition: 'transform 0.2s',
  },
  text: {
    transition: 'transform 0.2s',
  },
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
  actionButton: {
    backgroundColor: '#99a0b5',
    color: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },
  acceptButton: {
    color: '#4CAF50',
  },
  rejectButton: {
    color: '#FF5252',
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#FF0000',
    '&:hover': { backgroundColor: '#FF5252' },
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    maxHeight: 400,
    overflowY: "auto",
  },
  categoryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  iconContainer: {
    display: "flex",
    gap: 1,
  },
  closeButton: {
    backgroundColor: "#FF5252",
    color: "#fff",
    mt: 2,
    "&:hover": { backgroundColor: "#D32F2F" },
  },
};

export default HomePageGuest;
