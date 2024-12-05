import React, { useState, useEffect } from 'react';
import { Box, Button, Typography,Menu, MenuItem,Tooltip, IconButton, Modal, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, Drawer,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar, Grid,
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
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import StarsIcon from '@mui/icons-material/Stars';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import PriorityHighIcon from '@mui/icons-material/PriorityHigh'; // Icon for generic user type
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import DoneAllIcon from '@mui/icons-material/DoneAll';



import axios from 'axios';

function NewTouristHomePage() {
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
  
//notifications
const [notifications, setNotifications] = useState([]);
const [isNotificationsSidebarOpen, setNotificationsSidebarOpen] = useState(false);
const [allNotificationsRead, setAllNotificationsRead] = useState(true);

useEffect(() => {
  checkNotificationsStatus();

},);


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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItineraryData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const AuthorUsername = localStorage.getItem('username');
    if (!AuthorUsername) {
      alert('You need to log in first.');
      return;
    }

    const tagsArray = itineraryData.tags.split(',').map((tag) => tag.trim());
    const dataToSubmit = {
      AuthorUsername,
      Title: itineraryData.title,
      Date: itineraryData.date,
      Timeline: itineraryData.timeline,
      Price: itineraryData.price,
      Locations: itineraryData.locations,
      Activities: itineraryData.activities,
      accessibility: itineraryData.accessibility,
      pickupLocation: itineraryData.pickupLocation,
      dropoffLocation: itineraryData.dropoffLocation,
      Tags: tagsArray,
      Language: itineraryData.language,
    };

    try {
      const response = await axios.post('/api/createItinerary', dataToSubmit);
      alert('Itinerary created successfully!');
      handleModalClose(); // Close modal on success

      // Clear form data
      setItineraryData({
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
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
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

  const fetchTouristProfile = async () => {
    const username = localStorage.getItem('username'); // Retrieve username from localStorage
  
    if (!username) {
      alert('You need to log in first.');
      return;
    }
  
    try {
      // Make the GET request to the backend API
      const response = await axios.get('/api/viewTourist', {
        params: { Username: username }, // Pass the username in the query parameters
      });
      const profile = response.data;
  
      // Format the date of birth (DoB) to 'YYYY-MM-DD'
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      };
  
      // Update the state with the fetched profile data
      setProfileData({
        username: profile.Username || '',
        email: profile.Email || '',
        password: profile.Password || '',
        mobileNumber: profile.MobileNumber || '',
        dateOfBirth: formatDate(profile.DoB), // Format the DoB before setting it
        nationality: profile.Nationality || '',
        occupation: profile.Occupation || '',
        wallet: profile.Wallet || 0,
        points: profile.Points || 0,
        badgeLevel: profile.BadgeLevelOfPoints || 0,
        preferences: profile.MyPreferences || [],
      });
  
      setIsProfileModalOpen(true); // Open the modal
    } catch (error) {
      // Handle errors appropriately
      if (error.response && error.response.status === 404) {
        alert('Profile not found.');
      } else {
        console.error('Error fetching profile:', error);
        alert('An error occurred while loading the profile.');
      }
    }
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

const updateProductQuantity = async (productName, newQuantity) => {
  if (newQuantity <= 0) {
    alert("Quantity must be greater than zero.");
    return;
  }

  try {
    const touristUsername = localStorage.getItem("username"); // Assuming tourist's username is stored in localStorage
    const response = await axios.post("/changeProductQuantityInCart", {
      touristUsername,
      productName,
      amount: newQuantity,
    });

    // Update the cart data with the new response
    setCartData((prevCartData) => 
      prevCartData.map((item) =>
        item.productDetails.Name === productName
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  } catch (error) {
    console.error("Error updating product quantity:", error);
    alert("Failed to update product quantity.");
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

const handleRemoveFromWishlist = async (productName) => {
  const touristUsername = localStorage.getItem("username"); // Assuming the username is stored in localStorage
  if (!touristUsername) {
    alert("You need to log in first.");
    return;
  }

  try {
    // Call the backend to remove the item
    const response = await axios.post("/removeFromWishlist", {
      touristUsername,
      productName,
    });

    if (response.status === 200) {
      // Fetch the updated wishlist after successful removal
      fetchWishlist();
    } else {
      alert("Failed to remove the product from wishlist.");
    }
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    alert("Failed to remove product from wishlist.");
  }
};

const handleAddToCartFromWishlist = async (productName) => {
  const touristUsername = localStorage.getItem("username");
  try {
    // Send request to add the product to the cart and remove from wishlist
    const response = await fetch("/addToCartFromWishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        touristUsername, // Replace with the actual logged-in user's username
        productName: productName,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Fetch the updated wishlist data after adding the product to the cart
      fetchWishlist();

      // Optionally, you can fetch the cart data too
      // fetchCartData();

      console.log(data.msg);
    } else {
      console.error(data.error || "Failed to add product to cart.");
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
};





const fetchCartData = async () => {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('You need to log in first.');
    return;
  }

  try {
    setIsLoadingCart(true);
    const response = await axios.get('/api/getTouristCartDetails', {
      params: { username },
    });
    setCartData(response.data);
    setIsLoadingCart(false);
  } catch (error) {
    console.error('Error fetching cart data:', error);
    alert('Failed to load cart data.');
    setIsLoadingCart(false);
  }
};

const toggleCartSidebar = () => {
  setIsCartSidebarOpen(!isCartSidebarOpen);
  if (!isCartSidebarOpen) {
    fetchCartData();
  }
};

const removeProductFromCart = async (productName) => {
  try {
    const touristUsername = localStorage.getItem("username");
    await axios.post("/removeFromCart", {
      touristUsername,
      productName,
    });

    // Re-fetch the updated cart data
    fetchCartData();
  } catch (error) {
    console.error("Error removing product from cart:", error);
    alert("Failed to remove product from cart.");
  }
};

// Reject request function
const handleRejectRequest = async (username) => {
  try {
    await axios.post('/api/rejectRequestDeleteAccout', { Username: username }); // Consistent property name
    setDeleteRequests((prev) =>
      prev.filter((req) => req.Username !== username) // Corrected state update
    );
    setRequestToDelete(null);
    fetchDeleteRequests();
  } catch (error) {
    console.error("Error rejecting request:", error);
  }
};

// Close Delete Requests Modal and reset state
const closeDeleteRequestsModal = () => {
  setDeleteRequestsModal(false);
  setRequestToDelete(null);
};

const fetchNotifications = async () => {
  const username = localStorage.getItem('username');
  if (!username) return;

  try {
    const response = await axios.get(`/api/getTouristNotifications`, {
      params: { username },
    });
    setNotifications(response.data.notifications); // Assuming backend sends an array of notifications
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

const toggleNotificationsSidebar = () => {
  setNotificationsSidebarOpen((prev) => !prev);
  if (!isNotificationsSidebarOpen) {
    fetchNotifications(); // Fetch notifications when opening
    checkNotificationsStatus(); // Update notification icon status
  }
};


const checkNotificationsStatus = async () => {
  const username = localStorage.getItem('username');
  if (!username) return;

  try {
    const response = await axios.get('/api/areAllTouristNotificationsRead', {
      params: { username },
    });

    setAllNotificationsRead(response.data.allRead);
  } catch (error) {
    console.error('Error checking notification status:', error);
  }
};

const markAllAsRead = async () => {
  const username = localStorage.getItem('username'); // Get the username from localStorage
  if (!username) {
    alert('You need to log in first.');
    return;
  }

  try {
    const response = await axios.put('/api/allNotificationsTouristRead', { username });
    if (response.status === 200) {
      //alert('All notifications marked as read.');
      checkNotificationsStatus(); // Update notification icon status
    } else {
      alert('Failed to mark notifications as read.');
    }
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    alert('An error occurred while marking notifications as read.');
  }
};


  return (
    <Box sx={styles.container}>
      {sidebarOpen && <Box sx={styles.overlay} onClick={() => setSidebarOpen(false)} />}
      {isNotificationsSidebarOpen && (
  <>
    <Box
  sx={{
    position: 'fixed',
    top: '60px',
    right: 0,
    width: '350px',
    height: 'calc(100% - 60px)',
    backgroundColor: '#cccfda',
    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto', // Enable vertical scrolling
    scrollbarWidth: 'thin', // Firefox scrollbar styling
    '&::-webkit-scrollbar': {
      width: '8px', // Scrollbar width
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#e6e7ed', // Scrollbar track color
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#192959', // Scrollbar thumb color
      borderRadius: '4px', // Rounded edges
    },
  }}
>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    }}
  >
    <Typography variant="h6" textAlign="left" sx={{ color: '#192959' }}>
      Notifications
    </Typography>
    <Button
      variant="outlined"
      size="small"
      sx={{
        color: '#192959',
        borderColor: '#192959',
        '&:hover': {
          backgroundColor: '#192959',
          color: '#ffffff',
        },
      }}
      startIcon={<DoneAllIcon />} // Adds the DoneAllIcon to the left of the text
      onClick={async () => {
        await markAllAsRead();
        fetchNotifications(); // Refresh notifications after marking all as read
      }}
    >
      Mark all as read
    </Button>
  </Box>
  {notifications.length > 0 ? (
    notifications.map((notification, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: notification.Read ? '#f0f0f0' : '#ffbaba',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body1" textAlign="left" sx={{ color: '#192959' }}>
          {notification.NotificationText}
        </Typography>
        {!notification.Read && <PriorityHighIcon sx={{ color: 'red' }} />}
      </Box>
    ))
  ) : (
    <Typography variant="body1" textAlign="left" sx={{ color: '#192959' }}>No notifications</Typography>
  )}
</Box>

    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 5,
      }}
      onClick={toggleNotificationsSidebar}
    />
  </>
)}
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
          {/* <Button onClick={() => setChangePasswordModal(true)} sx={styles.menuButton}>
            Change My Password
          </Button> */}
          <Button
  sx={{
    ...styles.menuButton,
    '&:hover': {
      backgroundColor: '#e6e7ed', // Background color on hover
      color: '#192959',           // Text color on hover
    },
  }}
  startIcon={<AccountCircleIcon />}
  onClick={fetchTouristProfile} // Fetch profile data and open modal
>
  My Profile
</Button>


<Tooltip title="Notifications" arrow>
        <IconButton
    onClick={toggleNotificationsSidebar}
    sx={styles.iconButton}
  >
    {allNotificationsRead ? (
      <NotificationsIcon />
    ) : (
      <NotificationImportantIcon sx={{ color: 'red' }} />
    )}
  </IconButton>
        </Tooltip>

         
        
          <Tooltip title="Shopping Cart" arrow>
  {/* Shopping Cart Button */}
  <IconButton
        onClick={toggleCartSidebar}
        sx={{
          ...styles.menuButton,
          '&:hover': {
            backgroundColor: '#e6e7ed',
            color: '#192959',
          },
          width: '40px',
          height: '40px',
        }}
      >
        <ShoppingCartOutlinedIcon />
      </IconButton>
</Tooltip>
{/* Cart Sidebar */}
<Drawer
  anchor="right"
  open={isCartSidebarOpen}
  onClose={toggleCartSidebar}
  sx={{ zIndex: 1300 }}
>
  <Box
    sx={{
      width: 400,
      p: 3,
      backgroundColor: "#f9f9f9",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    {/* Header */}
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#192959", fontWeight: "bold" }}
        >
          My Cart
        </Typography>
        <IconButton onClick={toggleCartSidebar}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Cart Items */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "calc(100vh - 170px)", // Adjust height to reduce gap
          overflowY: "auto", // Enable scrolling for long lists
        }}
      >
        {isLoadingCart ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : cartData.length > 0 ? (
          cartData.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                position: "relative",
                alignItems: "center",
              }}
            >
              {/* Remove Icon */}
              <Tooltip title="Remove Product" arrow>
                <IconButton
                  onClick={() => removeProductFromCart(item.productDetails.Name)}
                  sx={{
                    color: "#192959", // Dark grey color
                    position: "absolute",
                    top: 8,
                    right: 8,
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "rgba(85, 85, 85, 0.1)", // Background on hover
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

              {/* Product Image */}
              <Avatar
                variant="square"
                src={item.productDetails?.Picture || "/placeholder.jpg"}
                alt={item.productDetails?.Name || "Product"}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />

              {/* Product Details */}
              <Box sx={{ flex: 1, position: "relative" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    mb: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.productDetails?.Name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  EGP {item.productDetails?.Price?.toFixed(2)}
                </Typography>

                {/* Quantity Controls */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() =>
                      updateProductQuantity(
                        item.productDetails?.Name,
                        item.quantity - 1
                      )
                    }
                    size="small"
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#e0e0e0",
                      "&:hover": {
                        backgroundColor: "#d0d0d0",
                      },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      paddingX: 1,
                      fontSize: "14px",
                    }}
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    onClick={() =>
                      updateProductQuantity(
                        item.productDetails?.Name,
                        item.quantity + 1
                      )
                    }
                    size="small"
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#e0e0e0",
                      "&:hover": {
                        backgroundColor: "#d0d0d0",
                      },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Total Price */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: "#192959",
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                  }}
                >
                  Total: EGP{" "}
                  {(item.productDetails?.Price * item.quantity || 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#555" }}
          >
            Your cart is empty.
          </Typography>
        )}
      </Box>
    </Box>

    {/* Footer */}
    <Box sx={{ mt: 1 }}>
      <Typography
        variant="h6"
        sx={{
          textAlign: "right",
          color: "#192959",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        Total: EGP{" "}
        {cartData
          .reduce(
            (total, item) =>
              total + item.productDetails?.Price * item.quantity,
            0
          )
          .toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#192959",
          color: "white",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#3a4a90",
          },
        }}
        onClick={() => navigate("/TouristProductPaymentPage")}
      >
        Checkout
      </Button>
    </Box>
  </Box>
</Drawer>








<Tooltip title="Wishlist" arrow>
  <IconButton
    onClick={toggleWishlistDrawer}
    sx={{
      ...styles.menuButton,
      '&:hover': {
        backgroundColor: '#e6e7ed',
        color: '#192959',
      },
      width: '40px',
      height: '40px',
    }}
  >
    <BookmarkBorderOutlinedIcon />
  </IconButton>
</Tooltip>

<Drawer
  anchor="right"
  open={isWishlistOpen}
  onClose={toggleWishlistDrawer}
  sx={{ zIndex: 1300 }}
>
  <Box
    sx={{
      width: 400,
      p: 3,
      backgroundColor: "#f9f9f9",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Header */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: "#192959", fontWeight: "bold" }}
      >
        My Wishlist
      </Typography>
      <IconButton onClick={toggleWishlistDrawer}>
        <CloseIcon />
      </IconButton>
    </Box>

    {/* Wishlist Items */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : wishlistData.length > 0 ? (
        wishlistData.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              backgroundColor: "#ffffff",
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Product Image */}
            <Avatar
              variant="square"
              src={item.Picture || "/placeholder.jpg"}
              alt={item.Name || "Product"}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                flexShrink: 0,
              }}
            />

            {/* Product Details */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                  mb: 0.5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.Name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 1 }}
              >
                EGP {item.Price?.toFixed(2)}
              </Typography>
            </Box>

            {/* Icons: Add to Cart and Remove */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Move to Cart" arrow>
                <IconButton
                  sx={{
                    color: "#192959",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                    },
                  }}
                  onClick={() => handleAddToCartFromWishlist(item.Name)}
                >
                  <ShoppingCartCheckoutIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Remove from Wishlist" arrow>
                <IconButton
                  sx={{
                    color: "#192959",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "rgba(85, 85, 85, 0.1)",
                    },
                  }}
                  onClick={() => handleRemoveFromWishlist(item.Name)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))
      ) : (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "#555" }}
        >
          Your wishlist is empty.
        </Typography>
      )}
    </Box>
  </Box>
</Drawer>









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

      {/* Collapsible Sidebar */}
      <Box
        sx={{
          ...styles.sidebar,
          width: sidebarOpen ? '280px' : '60px',
        }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Button onClick={() => navigate('/TouristFlights')} sx={styles.sidebarButton}>
          <FlightIcon sx={styles.icon} />
          {sidebarOpen && 'Flights'}
        </Button>

        <Button onClick={() => navigate('/TouristHotels')} sx={styles.sidebarButton}>
          <BedIcon sx={styles.icon} />
          {sidebarOpen && 'Hotels'}
        </Button>

        <Button onClick={() => navigate('/TouristComplaints')} sx={styles.sidebarButton}>
          <AssignmentIcon sx={styles.icon} />
          {sidebarOpen && 'Complaints'}
        </Button>

        <Button onClick={() => navigate('/TouristOrders')} sx={styles.sidebarButton}>
          <ShoppingBagIcon sx={styles.icon} />
          {sidebarOpen && 'Orders'}
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



        {/* <Button onClick={() => navigate('/YAdminDashboard')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button> */}
      </Box>
      <Box sx={{ ...styles.content, filter: sidebarOpen ? 'brightness(0.5)' : 'none' }}>
        <Box sx={styles.infoBox} onClick={() => navigate('/YAdminProductsPage')}>
          <img src="/images/products.jpg" alt="Products" style={styles.image} />
          <Typography variant="h6" sx={styles.text} className="text">Products</Typography>
        </Box>
        <Box sx={styles.infoBox} onClick={() => navigate('/YAdminActivitiesPage')}>
          <img src="/images/activity.jpg" alt="Activities" style={styles.image} />
          <Typography variant="h6" sx={styles.text} className="text">Activities</Typography>
        </Box>
        <Box sx={styles.infoBox} onClick={() => navigate('/YAdminItinerariesPage')}>
          <img src="/images/itinerary.jpg" alt="Itineraries" style={styles.image} />
          <Typography variant="h6" sx={styles.text} className="text">Itineraries</Typography>
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



      {/* Change Password Modal */}
      <Modal open={changePasswordModal} onClose={() => setChangePasswordModal(false)}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6" gutterBottom>Change Password</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>Current Password: {currentPassword}</Typography>
          <TextField
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
          <Button
            variant="contained"
            onClick={handleAddAdmin}
            fullWidth
            sx={styles.actionButton}
          >Save New Password</Button>
        </Box>
      </Modal>
      {/* Add Admin Modal */}
      <Modal open={addAdminModal} onClose={() => {setAddAdminModal(false); resetAddAdminModal();}}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6" gutterBottom>Add Admin</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>Give a new admin access to the system</Typography>
          <TextField
            label="Admin Username"
            fullWidth
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type={showAdminPassword ? 'text' : 'password'}
            fullWidth
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowAdminPassword(!showAdminPassword)}>
                    {showAdminPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmAdminPassword ? 'text' : 'password'}
            fullWidth
            value={confirmAdminPassword}
            onChange={(e) => setConfirmAdminPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmAdminPassword(!showConfirmAdminPassword)}>
                    {showConfirmAdminPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
          <Button
            variant="contained"
            onClick={handleAddAdmin}
            fullWidth
            sx={styles.actionButton}
          >Add Admin</Button>
        </Box>
      </Modal>

      {/* Add Tourism Governor Modal */}
<Modal open={addTourismGovModal} onClose={() => {setAddTourismGovModal(false); resetAddTourismGovModal();}}>
  <Box sx={styles.modalContent}>
    <Typography variant="h6" gutterBottom>Add Tourism Governor</Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>Grant access to a new tourism governor</Typography>
    <TextField
      label="Username"
      fullWidth
      value={govUsername}
      onChange={(e) => setGovUsername(e.target.value)}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Password"
      type={showGovPassword ? 'text' : 'password'}
      fullWidth
      value={govPassword}
      onChange={(e) => setGovPassword(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowGovPassword(!showGovPassword)}>
              {showGovPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Confirm Password"
      type={showConfirmGovPassword ? 'text' : 'password'}
      fullWidth
      value={confirmGovPassword}
      onChange={(e) => setConfirmGovPassword(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowConfirmGovPassword(!showConfirmGovPassword)}>
              {showConfirmGovPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
    {errorMessage && (
      <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>
    )}
    <Button
      variant="contained"
      onClick={handleAddTourismGov}
      fullWidth
      sx={styles.actionButton}
    >
      Add Governor
    </Button>
  </Box>
</Modal>

{/* Delete Requests Modal */}
<Modal open={deleteRequestsModal} onClose={closeDeleteRequestsModal}>
  <Box sx={styles.modalContent}>
    <Typography variant="h6" sx={{ mb: 2 }}>Delete Requests</Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      The following accounts have requested to be deleted off of the system:
    </Typography>

    <Box sx={styles.listContainer}>
      {deleteRequests.length > 0 ? (
        deleteRequests.map((request, index) => (
          <Box key={index} sx={styles.categoryItem}>
            <Typography variant="body1">
              <PersonIcon sx={{ mr: 1 }} />
              {request.Username} ({request.Type})
            </Typography>
            <Box sx={styles.iconContainer}>
              <IconButton onClick={() => handleConfirmDeleteRequest(request)}>
                <CheckIcon sx={{ color: "#4CAF50" }} />
              </IconButton>
              <IconButton onClick={() => handleRejectRequest(request.Username)}>
                <CloseIcon sx={{ color: "#FF5252" }} />
              </IconButton>
            </Box>

          </Box>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No delete requests available.
        </Typography>
      )}
    </Box>

    {/* <Button
      onClick={closeDeleteRequestsModal}
      variant="contained"
      sx={styles.closeButton}
    >
      CLOSE
    </Button> */}
  </Box>
</Modal>


      {/* Confirm Deletion Dialog */}
      <Dialog open={confirmDeleteDialog} onClose={() => setConfirmDeleteDialog(false)}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#192959', fontSize: '20px' }}>
            Are you sure you want to delete this user off of the system?
          </DialogContentText>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#33416b', marginTop: '10px' }}>
            This action cannot be reversed! You will delete this user and everything they've created from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)} sx={{ color: '#192959' }}>
            Cancel
          </Button>
          <Button onClick={() => { confirmDeleteRequest(); setConfirmDeleteDialog(false); }} sx={{ color: '#192959' }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    
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

export default NewTouristHomePage;
