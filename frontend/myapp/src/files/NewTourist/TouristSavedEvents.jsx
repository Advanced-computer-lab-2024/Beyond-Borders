import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton,Tooltip,Divider,TextField, InputAdornment, Modal,MenuItem,Select,FormControl,InputLabel,} from '@mui/material';
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
import SearchIcon from '@mui/icons-material/Search';
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
import  FeedbackIcon  from '@mui/icons-material/Feedback';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircleRounded';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PaymentIcon from '@mui/icons-material/Payment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IosShareIcon from '@mui/icons-material/IosShare';
import ShareIcon from '@mui/icons-material/Share';
import LanguageIcon from '@mui/icons-material/Language';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';

function TouristSavedEvents() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [scrollPositions, setScrollPositions] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false); // State for button visibility
  //done for categories and tags
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [itinerariesOpen, setItinerariesOpen] = useState(false);
  const [historicalPlacesOpen, setHistoricalPlacesOpen] = useState(false);
  const [museumsOpen, setMuseumsOpen] = useState(false);
  const [transportationOpen, setTransportationOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [complaintsOpen, setComplaintsOpen] = useState(false);
  const [currentMuseumId, setCurrentMuseumId] = useState(null);
  //search bar
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  //filter activities
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterInputs, setFilterInputs] = useState({
  Category: '',
  minPrice: '',
  maxPrice: '',
  InputDate: '',
  Rating: '',
});
//sort activties
const [sortOption, setSortOption] = useState(""); // State for the selected sorting option
//share
const [isShareModalOpen, setShareModalOpen] = useState(false); // Modal state
const [email, setEmail] = useState(''); // Email input state
const [showEmailField, setShowEmailField] = useState(false); // State for toggling email input
const [sharedLink, setSharedLink] = useState(''); // Shared link state
const [currentActivityName, setCurrentActivityName] = useState(''); // Trac
const [convertedPrices, setConvertedPrices] = useState({});
const [currency, setCurrency] = useState('EGP'); // Default currency is EGP

const [commentModalOpen, setCommentModalOpen] = useState(false);
const [currentActivityId, setCurrentActivityId] = useState(null);
const [commentText, setCommentText] = useState('');
const [expanded, setExpanded] = useState(false);
const [itineraries, setItineraries] = useState([]); // For itineraries
const [museums, setMuseums] = useState([]);         // For museums
const [HPs, setHPs] = useState([]);                 // For historical places
const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
const [selectedTourGuide, setSelectedTourGuide] = useState({
    username: '',
    itineraryName: '',
    rating: 0,
  }); // Track selected tour guide
  const [tourGuideCommentModalOpen, setTourGuideCommentModalOpen] = useState(false); // Manage modal visibility

  



  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle fetching or searching activities
    const fetchOrSearchActivities = async () => {
      if (!searchQuery) {
        // Fetch all activities when there's no search query
        await fetchBookmarks();
      } else {
        // Perform search when there's a query
        await searchActivities(searchQuery);
      }
    };
  
    fetchOrSearchActivities(); // Call the fetch or search logic
    fetchCategories(); // Fetch categories
    fetchTags(); // Fetch tags
  
    // Handle scroll to show/hide "Back to Top" button
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    // Cleanup event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchQuery]); // Depend on `searchQuery` to refetch activities when it changes


  useEffect(() => {
    if (currency !== 'EGP') {
      convertActivityPrices();
    }
  }, [currency, activities]);

  const convertActivityPrices = async () => {
    const newConvertedPrices = {};
    await Promise.all(
      activities.map(async (activity) => {
        try {
          const response = await axios.post('/convertCurr', {
            priceEgp: activity.Price,
            targetCurrency: currency,
          });
          // Use a unique key for each activity
          newConvertedPrices[activity._id] = response.data.convertedPrice;
        } catch (error) {
          console.error(`Error converting price for activity ${activity.Name}:`, error);
        }
      })
    );
    setConvertedPrices(newConvertedPrices);
  };
  
  const toggleReadMore = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the state for the specific index
    }));
  };
  

  const fetchBookmarks = async () => {
    try {
      // Retrieve the Username from localStorage or any other source
      const touristUsername = localStorage.getItem("username");
  
      if (!touristUsername) {
        console.error("Username not found. Please log in.");
        return;
      }
  
      // Make a GET request with the touristUsername as a query parameter
      const response = await axios.get(`/api/viewBookmarks`, {
        params: { touristUsername }, // Pass the Username as query parameters
      });
  
      // Categorize bookmarked events based on their type
      const bookmarkedActivities = response.data.filter(
        (event) => event.type === "Activity"
      );
      const bookmarkedItineraries = response.data.filter(
        (event) => event.type === "Itinerary"
      );
      const bookmarkedMuseums = response.data.filter(
        (event) => event.type === "Museum"
      );
      const bookmarkedHistoricalPlaces = response.data.filter(
        (event) => event.type === "Historical Place"
      );
  
      // Update the state
      setActivities(bookmarkedActivities.map((event) => event.details));
      setItineraries(bookmarkedItineraries.map((event) => event.details));
      setMuseums(bookmarkedMuseums.map((event) => event.details));
      setHPs(bookmarkedHistoricalPlaces.map((event) => event.details));
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };
  

  const searchActivities = async (query) => {
    try {
      const response = await axios.post('/api/ActivitiesSearchAll', { searchString: query });
      setActivities(response.data);
    } catch (error) {
      console.error('Error searching activities:', error);
      setActivities([]); // Clear activities if no results or error
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
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

  const handleFilterInputChange = (e) => {
    const { name, value } = e.target;
  
    setFilterInputs((prev) => ({
      ...prev,
      [name]: name === "minPrice" || name === "maxPrice" || name === "Rating" // Ensure numerical values are parsed
        ? parseFloat(value) || "" // Keep empty string if value is invalid
        : value,
    }));
  };
  
  const handleFilterSubmit = async () => {
    try {
      // Remove empty or invalid fields before sending to backend
      const sanitizedInputs = Object.fromEntries(
        Object.entries(filterInputs).filter(([_, value]) => value !== "" && value !== null)
      );
  
      const response = await axios.post('/api/filterActivities', sanitizedInputs);
      setActivities(response.data); // Update activities with the filtered results
      setFilterModalOpen(false); // Close the modal after applying filters
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No activities found
        setActivities([]); // Clear activities list
        setFilterModalOpen(false); // Close the modal
      } else {
        console.error('Error filtering activities:', error);
      }
    }
  };


  const handleSortChange = async (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);

    try {
      let response;
      switch (selectedOption) {
        case "priceAsc":
          response = await axios.get("/sortActivitiesPriceAscendingTourist");
          break;
        case "priceDesc":
          response = await axios.get("/sortActivitiesPriceDescendingTourist");
          break;
        case "ratingAsc":
          response = await axios.get("/sortActivitiesRatingAscendingTourist");
          break;
        case "ratingDesc":
          response = await axios.get("/sortActivitiesRatingDescendingTourist");
          break;
        default:
          return; // Do nothing if no valid option is selected
      }

      if (response && response.data) {
        setActivities(response.data); // Update the activities with the sorted data
      }
    } catch (error) {
      console.error("Error sorting activities:", error);
    }
  };
  //book
  const handleBookActivity = async (activityName) => {
    const touristUsername = localStorage.getItem('username'); // Assuming username is stored in localStorage
  
    if (!touristUsername) {
      alert('Please log in to book activities.');
      return;
    }
  
    try {
      const response = await axios.put('/bookActivity', { touristUsername, activityName });
      navigate('/TouristPaymentPage');
    } catch (error) {
      alert(error.response?.data?.msg || 'An error occurred while booking the activity.');
    }
  };

  //share

  const handleOpenShareModal = async (activityName) => {
    try {
      const response = await axios.post('/getCopyLink', {
        entityType: 'activity',
        entityName: activityName,
      });
      setSharedLink(response.data.link); // Set the generated link
      setCurrentActivityName(activityName); // Store the activity name in state
      setShareModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error generating link:', error);
      alert('An error occurred while generating the link.');
    }
  };
  
  
  const handleSendEmail = async (activityName) => {
    if (!email || !sharedLink) {
      alert('Please provide a valid email and ensure the link is generated.');
      return;
    }
  
    try {
      const response = await axios.post('/getCopyLink', {
        entityType: 'activity',
        entityName: activityName,
        email,
      });
      alert(response.data.msg); // Show success message
      setShareModalOpen(false); // Close modal
    } catch (error) {
      console.error('Error sending email:', error);
      alert(error.response?.data?.msg || 'An error occurred while sending the email.');
    }
  };
  
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sharedLink).then(() => {
      alert('Link copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy link: ', err);
      alert('Failed to copy link.');
    });
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

  
  

  const renderRating = (activityId, userRating, averageRating, handleRatingClick) => {
    const displayRating = userRating || averageRating || 0; // Use user rating first, then average
    const fullStars = Math.floor(displayRating);
    const halfStars = displayRating > fullStars ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
  
    return (
      <Box sx={styles.ratingContainer} display="flex" alignItems="center">
        {/* Display Rating Number */}
        <Typography
          variant="body2"
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginRight: '10px', // Spacing between number and stars
          }}
        >
          {displayRating.toFixed(2)}
        </Typography>
  
        {/* Render Full Stars */}
        {[...Array(fullStars)].map((_, index) => (
          <StarIcon
            key={`full-${index}`}
            sx={{ fontSize: '32px', cursor: 'pointer', color: '#192959' }}
            onClick={() => handleRatingClick(activityId, index + 1)}
          />
        ))}
  
        {/* Render Half Stars */}
        {[...Array(halfStars)].map((_, index) => (
          <StarHalfIcon
            key={`half-${index}`}
            sx={{ fontSize: '32px', cursor: 'pointer', color: '#192959' }}
            onClick={() => handleRatingClick(activityId, fullStars + 1)}
          />
        ))}
  
        {/* Render Empty Stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <StarBorderIcon
            key={`empty-${index}`}
            sx={{ fontSize: '32px', cursor: 'pointer', color: '#192959' }}
            onClick={() => handleRatingClick(activityId, fullStars + index + 1)}
          />
        ))}
      </Box>
    );
  };
  const renderTourGuideRating = (itineraryName, authorUsername, tourGuideRating, handleRatingClick) => {
    const fullStars = Math.floor(tourGuideRating || 0);
    const halfStars = tourGuideRating > fullStars ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
  
    return (
      <Box display="flex" alignItems="center" gap={1}>
        {/* Render Full Stars */}
        {[...Array(fullStars)].map((_, index) => (
          <StarIcon
            key={`full-${index}`}
            sx={{ fontSize: '24px', cursor: 'pointer', color: '#192959' }}
            onClick={() => handleRatingClick(itineraryName, authorUsername, index + 1)}
          />
        ))}
  
        {/* Render Half Stars */}
        {[...Array(halfStars)].map((_, index) => (
          <StarHalfIcon
            key={`half-${index}`}
            sx={{ fontSize: '24px', cursor: 'pointer', color: '#192959' }}
            onClick={() => handleRatingClick(itineraryName, authorUsername, fullStars + 1)}
          />
        ))}
  
        {/* Render Empty Stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <StarBorderIcon
            key={`empty-${index}`}
            sx={{ fontSize: '24px', cursor: 'pointer', color: '#192959' }}
            onClick={() => handleRatingClick(itineraryName, authorUsername, fullStars + index + 1)}
          />
        ))}
      </Box>
    );
  };
  
  
  
  const handleTourGuideRatingClick = async (itineraryName, authorUsername, rating) => {
    const touristUsername = localStorage.getItem('username');
  
    if (!rating || rating < 1 || rating > 5) {
      alert('Rating must be a number between 1 and 5.');
      return;
    }
  
    try {
      const response = await axios.put('/rateTourGuide', {
        touristUsername,
        itineraryName, // Include itinerary name as required by the backend
        rating,
      });
  
      alert(response.data.msg);
  
      // Update the activities to reflect the new tour guide rating
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.AuthorUsername === authorUsername
            ? { ...activity, tourGuideRating: response.data.newAverageRating, showTourGuideCommentButton: true }
            : activity
        )
      );
  
      // Update the selected tour guide rating in the modal
      if (selectedTourGuide.username === authorUsername) {
        setSelectedTourGuide((prev) => ({
          ...prev,
          rating: response.data.newAverageRating, // Update to the new average rating
          canComment: true, // Enable the comment button
        }));
      }
    } catch (error) {
      console.error('Error rating tour guide:', error);
      alert('An error occurred while submitting your rating.');
    }
  };



  const handleTourGuideCommentSubmit = async () => {
    const touristUsername = localStorage.getItem('username');
  
    if (!commentText || commentText.trim().length === 0) {
      alert('Comment cannot be empty.');
      return;
    }
  
    try {
      const response = await axios.put('/commentOnTourGuide', {
        touristUsername,
        itineraryName: selectedTourGuide.itineraryName,
        comment: commentText.trim(),
      });
  
      alert(response.data.msg);
  
      // Update the activities to include the new comment
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.AuthorUsername === selectedTourGuide.username
            ? { ...activity, tourGuideComments: response.data.comments }
            : activity
        )
      );
  
      setTourGuideCommentModalOpen(false); // Close the modal
      setCommentText(''); // Clear the input
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('An error occurred while submitting your comment.');
    }
  };
  
  
  

  const handleCommentSubmit = async () => {
    const username = localStorage.getItem('username');
    const activity = activities.find((activity) => activity._id === currentActivityId);
  
    if (!username || !activity) {
      alert('User not logged in or activity not found.');
      return;
    }
  
    try {
      const response = await axios.put('/commentOnItinerary', {
        touristUsername: username,
        itineraryName: activity.Title,
        comment: commentText,
      });
  
      const { comments } = response.data;
  
      // Update the comments in the activity state
      setActivities((prevActivities) =>
        prevActivities.map((act) =>
          act._id === currentActivityId ? { ...act, Comments: comments, showCommentButton: true } : act
        )
      );
  
      setCommentModalOpen(false); // Close the modal
      setCommentText(''); // Clear the comment input
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert(error.response?.data?.msg || 'Failed to submit comment.');
    }
  };
  
  
  

  const handleRatingClick = async (activityId, rating) => {
    const username = localStorage.getItem('username');
    const activity = activities.find((activity) => activity._id === activityId);
  
    if (!username || !activity) {
      alert('User not logged in or activity not found.');
      return;
    }
  
    try {
      const response = await axios.put('/rateCompletedItinerary', {
        touristUsername: username,
        itineraryName: activity.Title,
        rating,
      });
  
      const { newAverageRating } = response.data;
  
      // Update state: show user rating and "Add Comment" button
      setActivities((prevActivities) =>
        prevActivities.map((act) =>
          act._id === activityId
            ? { ...act, userRating: rating, averageRating: newAverageRating, showCommentButton: true }
            : act
        )
      );
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error.response?.data?.msg || 'Failed to submit rating.');
    }
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


  const handleToggleDescription = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle expanded state for the specific index
    }));
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
  <Button onClick={() => navigate('/NewTouristHomePage')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button>
</Box>
      </Box>




      <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between', // Ensure space between search bar and the rest
    alignItems: 'right',           // Align items vertically in the center
    marginBottom: '20px',
    marginTop: '20px',
    marginLeft: '1570px',         // Add margin to the right for consistent spacing
  }}
>


  {/* Sort Dropdown and Filter Icon */}
  <Box sx={{ display: 'flex', alignItems: 'right', gap: '10px', marginLeft: '150px',marginRight: '10px'}}>

    <TextField
  select
  label="Currency"
  value={currency}
  onChange={(e) => setCurrency(e.target.value)}
  variant="outlined"
  sx={{
    width: '120px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#192959', // Default border color
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#33416b', // Hover border color
        borderWidth: '2.5px',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#192959', // Focused border color
        borderWidth: '2.5px',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#192959', // Label color
      fontSize: '18px',
    },
  }}
  InputProps={{
    startAdornment: (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: '#192959',
          paddingLeft: '5px',
        }}
      >
        <LanguageIcon />
      </Box>
    ),
  }}
>
  <MenuItem value="EGP">EGP </MenuItem>
  <MenuItem value="USD">USD </MenuItem>
  <MenuItem value="EUR">EUR </MenuItem>
  <MenuItem value="GBP">GBP </MenuItem>
  <MenuItem value="JPY">JPY </MenuItem>
</TextField>


  </Box>
</Box>
  
<Box sx={styles.activitiesContainer}>
  {/* Activities */}
  {activities.length > 0 && (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px',marginLeft:'30px', textAlign:'left' }}>
        Activities:
      </Typography>
      {activities.map((activity, index) => (
        <Box key={index} sx={{ marginBottom: '20px' }}>
        <Box
          sx={{
            ...styles.activityCard,
            backgroundColor: 'white',
          }}
        >
          <Box sx={styles.activityInfo}>
            <Typography variant="h6" sx={{ fontWeight: 'bold',fontSize: '24px', marginBottom: '5px', display: 'flex', alignItems: 'center' }}>{activity.Name}</Typography>
            <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              {activity.Location?.address || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              {activity.AdvertiserName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
            <PaymentIcon fontSize="small" sx={{ mr: 1 }} />
            {currency === 'EGP'
              ? `${activity.Price} EGP`
              : `${convertedPrices[activity._id] || 'Loading...'} ${currency}`}
          </Typography>

            <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
              <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
              {new Date(activity.Date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
              {activity.Time}
            </Typography>
            <Box sx={styles.quickFacts}>
              <Box sx={{ ...styles.infoContainer, backgroundColor:  '#f3f4f6' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Category:</Typography>
                <Typography variant="body2">{activity.Category}</Typography>
              </Box>
              <Box sx={{ ...styles.infoContainer, backgroundColor:  '#f3f4f6' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Tags:</Typography>
                <Typography variant="body2">{activity.Tags.join(', ')}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={styles.activityRating}>
{renderRating(
activity._id,
activity.userRating,
activity.Rating,
handleRatingClick
)}

{/* Reserve space for the Add Comment button */}
<Box
sx={{
  height: '24px', // Fixed height to prevent shifting
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  //marginTop: '20px', // Adjust spacing below stars
}}
>
{activity.showCommentButton && (
  <Button
    variant="text"
    onClick={() => {
      setCurrentActivityId(activity._id);
      setCommentModalOpen(true);
    }}
    startIcon={<AddIcon />}
    sx={{
      fontSize: '14px', // Smaller font size
      padding: '2px 6px', // Compact padding
      color: '#192959',
      textTransform: 'none', // Keep the case unchanged
      '&:hover': {
        backgroundColor: 'rgba(25, 41, 89, 0.1)', // Hover background
      },
    }}
  >
    Add Comment
  </Button>
)}
</Box>
</Box>



    
        </Box>


        <Box sx={styles.commentsSection}>
{activity.Comments && activity.Comments.length > 0 ? (
<>
  {/* Show the scroll left button only if there's content to scroll back */}
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
  
  {/* Show the scroll right button only if there are 3 or more comments */}
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
  )}

  {/* Historical Places */}
  {HPs.length > 0 && (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px',textAlign:'left' }}>
        Historical Places:
      </Typography>
      {HPs.map((hp, index) => (
        <Box key={index} sx={{ marginBottom: '20px' }}>
        <Box
          sx={{
            ...styles.activityCard,
            backgroundColor: hp.flagged ? '#cccfda' : 'white',
            display: 'flex', // Ensures the children are laid out horizontally
          }}
        >
         {/* Flex Container for Left and Right Sections */}
  <Box sx={{ display: 'flex', flex: 1 }}>
    {/* Left Side: Activity Info */}
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          fontSize: '24px',
          marginBottom: '10px', // Increased spacing below the title
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {hp.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          fontSize: '18px',
          alignItems: 'center',
          marginBottom: '10px', // Added spacing between items
        }}
      >
        <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
        {hp.location || 'N/A'}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          fontSize: '18px',
          alignItems: 'center',
          marginBottom: '10px', // Added spacing between items
        }}
      >
        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
        {hp.AuthorUsername}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          fontSize: '18px',
          alignItems: 'center',
          marginBottom: '10px', // Added spacing between items
        }}
      >
        <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
        {hp.openingHours || 'N/A'}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          fontSize: '18px',
          alignItems: 'center',
          marginBottom: '10px', // Added spacing between items
        }}
      >
        <PaymentIcon fontSize="small" sx={{ mr: 1 }} />
        {currency === 'EGP'
          ? `Native: ${hp.ticketPrices?.native || 0} EGP | Foreigner: ${hp.ticketPrices?.foreigner || 0} EGP | Student: ${hp.ticketPrices?.student || 0} EGP`
          : `Native: ${convertedPrices[hp._id]?.native || 'Loading...'} ${currency} | Foreigner: ${convertedPrices[hp._id]?.foreigner || 'Loading...'} ${currency} | Student: ${convertedPrices[hp._id]?.student || 'Loading...'} ${currency}`}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          fontSize: '18px',
          alignItems: 'center',
          marginBottom: '10px', // Added spacing between items
        }}
      >
        <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
        {hp.dateOfEvent ? new Date(hp.dateOfEvent).toLocaleDateString() : 'N/A'}
      </Typography>
      <Box sx={{ ...styles.quickFacts, marginTop: '10px' /* Added spacing above quick facts */ }}>
      <Box sx={{ ...styles.infoContainer, backgroundColor: '#b3b8c8'  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Tags:</Typography>
                    <Typography variant="body2">{hp.Tags.join(', ')}</Typography>
                  </Box>
      </Box>
    </Box>
  
  {/* Divider */}
  <Divider orientation="vertical" flexItem sx={{ marginX: '20px', borderColor: '#ccc' }} />
  
  {/* Right Side: Description */}
  <Box sx={{ flex: 1, paddingLeft: '20px', textAlign: 'left' }}>
    <Typography variant="body2" sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px',marginTop:'40px' }}>
      Description:
    </Typography>
  
    <Typography
      variant="body2"
      sx={{
        fontSize: '18px',
        wordWrap: 'break-word', // Break long words
        whiteSpace: 'normal',  // Wrap text normally
        maxWidth: '550px',     // Ensure width consistency
      }}
    >
      {expanded[index] || (hp.description && hp.description.length <= 45) ? (
        <span>
          {hp.description || 'No description available'}
          {hp.description && hp.description.length > 45 && (
            <span
              style={{
                color: '#8088a3',
                marginLeft: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={() => handleToggleDescription(index)}
            >
              {" "}Read Less
            </span>
          )}
        </span>
      ) : (
        <span>
          {(hp.description || 'No description available').substring(0, 45)}...
          <span
            style={{
              color: '#8088a3',
              marginLeft: '5px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={() => handleToggleDescription(index)}
          >
            {" "}Read More
          </span>
        </span>
      )}
    </Typography>
  </Box>
  
          </Box>
  
  
          <Box sx={styles.activityRating}>
  {renderRating(
    hp._id,           // Pass hp._id for historical place
    hp.userRating,    // Use userRating for the user-specific rating
    hp.Ratings,        // Overall rating for the historical place
    handleRatingClick // Rating click handler
  )}

  {/* Reserve space for the Add Comment button */}
  <Box
    sx={{
      height: '24px', // Fixed height to prevent shifting
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      //marginTop: '20px', // Adjust spacing below stars
    }}
  >
    {hp.showCommentButton && (
      <Button
        variant="text"
        onClick={() => {
          setCurrentActivityId(hp._id); // Use hp._id for historical place identification
          setCommentModalOpen(true);   // Open the comment modal
        }}
        startIcon={<AddIcon />}
        sx={{
          fontSize: '14px', // Smaller font size
          padding: '2px 6px', // Compact padding
          color: '#192959',
          textTransform: 'none', // Keep the case unchanged
          '&:hover': {
            backgroundColor: 'rgba(25, 41, 89, 0.1)', // Hover background
          },
        }}
      >
        Add Comment
      </Button>
    )}
  </Box>
</Box>
          
         
  
  
  
       </Box>
              <Box sx={styles.commentsSection}>
    {hp.Comments && hp.Comments.length > 0 ? (
      <>
        {/* Show the scroll left button only if there's content to scroll back */}
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
          {hp.Comments.map((comment, idx) => (
            <Box key={idx} sx={styles.commentCard}>
              <Typography variant="body2">{comment.Comment || 'No comment available'}</Typography>
              <Typography variant="caption">@ {comment.touristUsername || 'Anonymous'}</Typography>
            </Box>
          ))}
        </Box>
        
        {/* Show the scroll right button only if there are 3 or more comments */}
        {hp.Comments.length >= 3 && (
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
  )}

  {/* Museums */}
  {museums.length > 0 && (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px',textAlign:'left' }}>
        Museums:
      </Typography>
      {museums.map((museum, index) => (
      <Box key={index} sx={{ marginBottom: '20px' }}>
      <Box
        sx={{
          ...styles.museumCard,
          position: 'relative',
          backgroundColor: 'white',
        }}
      >
        {/* Left Column: Museum Details */}
        <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Museum Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              fontSize: '24px',
              marginBottom: '5px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {museum.name}
          </Typography>

          {/* Museum Location */}
          <Typography
            variant="body2"
            sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}
          >
            <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
            {museum.location || 'N/A'}
          </Typography>

          {/* Author/Advertiser */}
          <Typography
            variant="body2"
            sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}
          >
            <PersonIcon fontSize="small" sx={{ mr: 1 }} />
            {museum.AuthorUsername || 'N/A'}
          </Typography>

          {/* Opening Hours */}
          <Typography
            variant="body2"
            sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}
          >
            <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
            {museum.openingHours || 'N/A'}
          </Typography>

          {/* Ticket Prices */}
          <Typography
            variant="body2"
            sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}
          >
            <PaymentIcon fontSize="small" sx={{ mr: 1 }} />
            Foreigner: {convertedPrices[museum._id]?.foreigner || museum.ticketPrices.foreigner} {currency} | 
            Native: {convertedPrices[museum._id]?.native || museum.ticketPrices.native} {currency} | 
            Student: {convertedPrices[museum._id]?.student || museum.ticketPrices.student} {currency}
          </Typography>

          {/* Date of Event */}
          <Typography
            variant="body2"
            sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}
          >
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
            {museum.dateOfEvent ? new Date(museum.dateOfEvent).toLocaleDateString() : 'No date available'}
          </Typography>

          {/* Tags */}
          <Box sx={styles.quickFacts}>
            <Box
              sx={{
                ...styles.infoContainer,
                backgroundColor: '#b3b8c8',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Tags:
              </Typography>
              <Typography variant="body2">
                {museum.HistoricalTags?.join(', ') || 'No Tags'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderRight: '2px solid #ddd',
            marginX: '20px',
          }}
        />

        {/* Right Column: Description */}
        <Box
          sx={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingRight: '100px',
            alignItems: 'flex-start',
          }}
        >
          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              marginTop: '30px',
              fontWeight: "bold",
              marginRight: "8px",
              marginLeft: "20px",
              fontSize: "18px",
            }}
          >
            Description:
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: '18px',
              textAlign: 'left',
              marginLeft: "20px",
            }}
          >
            {museum.description?.length > 50
              ? (
                <>
                  {expanded[index] ? museum.description : `${museum.description.substring(0, 50)}...`}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => toggleReadMore(index)}
                    sx={{ fontSize: '18px', textTransform: 'none', padding: 0, marginLeft: 1 , color: '#8088a3', fontWeight: 'bold', }}
                  >
                    {expanded[index] ? 'Read Less' : 'Read More'}
                  </Button>
                </>
              )
              : (museum.description || 'No description available.')}
          </Typography>
        </Box>

        {/* Ratings and Add Comment */}
        <Box sx={styles.museumRating}>
          {renderRating(
            museum._id,
            museum.userRating,
            museum.Ratings,
            handleRatingClick
          )}

          {/* Reserve space for the Add Comment button */}
          <Box
            sx={{
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {museum.showCommentButton && (
              <Button
                variant="text"
                onClick={() => {
                  setCurrentMuseumId(museum._id);
                  setCommentModalOpen(true);
                }}
                startIcon={<AddIcon />}
                sx={{
                  fontSize: '14px',
                  padding: '2px 6px',
                  color: '#192959',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 41, 89, 0.1)',
                  },
                }}
              >
                Add Comment
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Comments Section */}
      <Box sx={styles.commentsSection}>
        {museum.Comments && museum.Comments.length > 0 ? (
          <>
            {scrollPositions[index] > 0 && (
              <IconButton
                sx={styles.scrollButton}
                onClick={() => scrollCommentsLeft(index)}
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            <Box
              sx={styles.commentsContainer}
              id={`commentsContainer-${index}`}
              onScroll={(e) => updateScrollPosition(index, e.target.scrollLeft)}
            >
              {museum.Comments.map((comment, idx) => (
                <Box key={idx} sx={styles.commentCard}>
                  <Typography variant="body2">
                    {comment.Comment || 'No comment available'}
                  </Typography>
                  <Typography variant="caption">
                    @ {comment.touristUsername || 'Anonymous'}
                  </Typography>
                </Box>
              ))}
            </Box>

            {museum.Comments.length >= 3 && (
              <IconButton
                sx={styles.scrollButton}
                onClick={() => scrollCommentsRight(index)}
              >
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
  )}

  {/* Itineraries */}
  {itineraries.length > 0 && (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px',textAlign:'left' }}>
        Itineraries:
      </Typography>
      {itineraries.map((itinerary, index) => (
       <Box key={index} sx={{ marginBottom: '20px' }}>
       <Box
         sx={{
           ...styles.activityCard,
           backgroundColor: itinerary.flagged ? 'white' : 'white',
         }}
       >
         <Box sx={styles.activityInfo}>
           <Typography variant="h6" sx={{ fontWeight: 'bold',fontSize: '24px', marginBottom: '5px', display: 'flex', alignItems: 'center' }}>{itinerary.Title}</Typography>
           <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
             <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
             {itinerary.Locations|| 'N/A'}
           </Typography>
           <Typography
variant="body2"
sx={{
display: 'flex',
fontSize: '18px',
alignItems: 'center',
cursor: 'pointer',
transition: 'all 0.3s ease', // Smooth transition for hover effects
'&:hover': {
 //fontWeight: 'bold', // Make text bold on hover
 textDecoration: 'underline', // Underline text on hover
 color: '#192959', // Optional: Change color on hover
},
}}
onClick={() => {
setSelectedTourGuide({
 username: itinerary.AuthorUsername,
 itineraryName: itinerary.Title,
 rating: itinerary.tourGuideRating || 0, // Pass current rating
});
setIsModalOpen(true);
}}
>
<PersonIcon fontSize="small" sx={{ mr: 1 }} />
{itinerary.AuthorUsername}
</Typography>




           <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
           <PaymentIcon fontSize="small" sx={{ mr: 1 }} />
           {currency === 'EGP'
             ? `${itinerary.Price} EGP`
             : `${convertedPrices[itinerary._id] || 'Loading...'} ${currency}`}
         </Typography>

           <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
             <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
             {new Date(itinerary.Date).toLocaleDateString()}
           </Typography>
           <Box sx={{ flex: 1, textAlign: 'left' }}>
<Typography
variant="body2"
sx={{
 fontSize: '18px',
 wordWrap: 'break-word', // Break long words
 whiteSpace: 'normal',  // Wrap text normally
 maxWidth: '550px',     // Ensure width consistency
 cursor: itinerary.Timeline.length > 15 ? 'pointer' : 'default', // Make clickable only if necessary
 marginTop: '10px',
}}
>
<AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#8088a3' }} />
{expanded[index] || itinerary.Timeline.length <= 15 ? (
 <span>
   {itinerary.Timeline}
   {itinerary.Timeline.length > 15 && (
     <span
       style={{
         color: '#8088a3',
        
         fontWeight: 'bold',
         cursor: 'pointer',
       }}
       onClick={() => handleToggleDescription(index)} // Trigger toggle
     >
       {" "}Read Less
     </span>
   )}
 </span>
) : (
 <span>
   {itinerary.Timeline.substring(0, 15)}... {/* Truncate timeline */}
   <span
     style={{
       color: '#8088a3',
       marginLeft: '5px',
       fontWeight: 'bold',
       cursor: 'pointer'
     }}
     onClick={() => handleToggleDescription(index)} // Trigger toggle
   >
     {" "}Read More
   </span>
 </span>
)}
</Typography>
</Box>


           <Box sx={styles.quickFacts}>
             
           <Box sx={styles.quickFacts}>
<Box
sx={{
 ...styles.infoContainer,
 backgroundColor: itinerary.flagged ? '#f3f4f6' : '#f3f4f6',
}}
>
<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
 Tags:
</Typography>
<Typography variant="body2">
 {itinerary.Tags?.join(', ') || 'No Tags'}
</Typography>
</Box>
</Box>

           </Box>
         </Box>
        {/* Ratings and Add Comment */}
   <Box sx={styles.activityRating}>
     {renderRating(
       itinerary._id,
       itinerary.userRating,
       itinerary.Ratings,
       handleRatingClick
     )}

     {/* Reserve space for the Add Comment button */}
     <Box
       sx={{
         height: '24px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'flex-start',
       }}
     >
       {itinerary.showCommentButton && (
         <Button
           variant="text"
           onClick={() => {
           setCurrentActivityId(itinerary._id);
             setCommentModalOpen(true);
           }}
           startIcon={<AddIcon />}
           sx={{
             fontSize: '14px',
             padding: '2px 6px',
             color: '#192959',
             textTransform: 'none',
             '&:hover': {
               backgroundColor: 'rgba(25, 41, 89, 0.1)',
             },
           }}
         >
           Add Comment
         </Button>
       )}
     </Box>
   </Box>
          {/* Divider Line */}
          <Divider orientation="vertical" flexItem sx={{ marginRight: '10px', borderColor: '#ccc' }} />

          <Box
               sx={{
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'flex-start',
                   gap: '5px',
                   marginBottom: '60px',
                   marginRight: '450px',
                   marginTop: '40px', // Adjust this value to lower the entire section
               }}
               >
               <Typography
                   variant="body2"
                   sx={{
                   fontWeight: 'bold', // Bold for "Activities:"
                   fontSize: '16px', // Font size
                   color: '#192959', // Color for the label
                   marginBottom: '5px', // Spacing between items
                   }}
               >
                   Activities:{' '}
                   <span
                   style={{
                       fontWeight: 'normal', // Normal weight for the value
                       color: '#33416b', // Different color for the value
                   }}
                   >
                   {itinerary.Activities || 'N/A'}
                   </span>
               </Typography>



               <Box
                   sx={{
                       display: 'flex',
                       alignItems: 'center', // Vertically aligns items
                       gap: '5px', // Space between "Language:" and the value
                   }}
                   >
                   <Typography
                       variant="body2"
                       sx={{
                       fontWeight: 'bold', // Bold for "Language:"
                       fontSize: '16px', // Font size
                       }}
                   >
                       Language:
                   </Typography>
                   <Typography
                       variant="body2"
                       sx={{
                       fontSize: '16px', // Font size for value
                       color: '#192959', // Color for value
                       }}
                   >
                       {itinerary.Language || 'N/A'}
                   </Typography>
                   </Box>



                   <Box
                   sx={{
                       display: 'flex',
                       alignItems: 'center', // Vertically aligns items
                       gap: '5px', // Space between "Language:" and the value
                   }}
                   >
                   <Typography
                       variant="body2"
                       sx={{
                       fontWeight: 'bold', // Bold for "Language:"
                       fontSize: '16px', // Font size
                       }}
                   >
                       Accessibility:
                   </Typography>
                   <Typography
               variant="body2"
               sx={{
                   fontSize: '16px',
                   color: '#192959',
               }}
           >
               {itinerary.accessibility === true
                   ? 'Accessible'
                   : itinerary.accessibility === false
                   ? 'Not Accessible'
                   : 'N/A'}
           </Typography>

                   </Box>


                   <Box
                   sx={{
                       display: 'flex',
                       alignItems: 'center', // Vertically aligns items
                       gap: '5px', // Space between "Language:" and the value
                   }}
                   >
                   <Typography
                       variant="body2"
                       sx={{
                       fontWeight: 'bold', // Bold for "Language:"
                       fontSize: '16px', // Font size
                       }}
                   >
                       Pickup Location:
                   </Typography>
                   <Typography
                       variant="body2"
                       sx={{
                       fontSize: '16px', // Font size for value
                       color: '#192959', // Color for value
                       }}
                   >
                       {itinerary.pickupLocation || 'N/A'}
                   </Typography>
                   </Box>





                   <Box
                   sx={{
                       display: 'flex',
                       alignItems: 'center', // Vertically aligns items
                       gap: '5px', // Space between "Language:" and the value
                   }}
                   >
                   <Typography
                       variant="body2"
                       sx={{
                       fontWeight: 'bold', // Bold for "Language:"
                       fontSize: '16px', // Font size
                       }}
                   >
                       Drop-Off Location:
                   </Typography>
                   <Typography
                       variant="body2"
                       sx={{
                       fontSize: '18px', // Font size for value
                       color: '#192959', // Color for value
                       }}
                   >
                       {itinerary.dropoffLocation || 'N/A'}
                   </Typography>
                   </Box>



                   

           </Box>

         

         

         {/* <Button
     variant="contained"
     disabled={!activity.isBooked} // Disable button if booking is not open
     onClick={() => handleBookItinerary(activity.Title)}

     sx={{
       position: 'absolute',
       top: '60px', // Position at the top
       right: '60px', // Position at the right
       
       backgroundColor: '#192959',

       color: '#fff',
       '&:hover': { backgroundColor: '#33416b' },
     }}
   >
     Book
   </Button> */}
   


       </Box>
       <Box sx={styles.commentsSection}>
{itinerary.Comments && itinerary.Comments.length > 0 ? (
<>
 {/* Show the scroll left button only if there's content to scroll back */}
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
   {itinerary.Comments.map((comment, idx) => (
     <Box key={idx} sx={styles.commentCard}>
       <Typography variant="body2">{comment.Comment || 'No comment available'}</Typography>
       <Typography variant="caption">@ {comment.touristUsername || 'Anonymous'}</Typography>
     </Box>
   ))}
 </Box>
 
 {/* Show the scroll right button only if there are 3 or more comments */}
 {itinerary.Comments.length >= 3 && (
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
  )}
</Box>




<Modal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  aria-labelledby="rate-tour-guide-title"
  aria-describedby="rate-tour-guide-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: '10px',
    }}
  >
    <Typography id="rate-tour-guide-title" variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
      Rate Tour Guide: {selectedTourGuide.username}
    </Typography>

    {/* Show Updated Rating */}
    <Typography
      variant="body2"
      sx={{ marginBottom: '20px', fontSize: '18px', color: '#192959', fontWeight: 'bold' }}
    >
      Rating: {selectedTourGuide.rating ? selectedTourGuide.rating.toFixed(1) : 'N/A'}
    </Typography>

    {/* Rating Stars */}
    {renderTourGuideRating(
      selectedTourGuide.itineraryName,
      selectedTourGuide.username,
      selectedTourGuide.rating || 0,
      handleTourGuideRatingClick
    )}

    {/* Add Comment Section */}
    {selectedTourGuide.rating && (
      <Box sx={{ marginTop: '20px' }}>
        <Typography
          id="add-comment-title"
          variant="h6"
          component="h2"
          sx={{ marginBottom: '10px', fontSize: '16px', color: '#192959' }}
        >
          Add Comment
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write your comment here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          variant="outlined"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button
            variant="contained"
            onClick={handleTourGuideCommentSubmit}
            sx={{ backgroundColor: '#192959', color: '#fff' }}
          >
            Submit Comment
          </Button>
        </Box>
      </Box>
    )}

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
      <Button
        variant="outlined"
        onClick={() => setIsModalOpen(false)}
        sx={{
          color: '#192959',
          borderColor: '#192959',
          '&:hover': { backgroundColor: 'rgba(25, 41, 89, 0.1)', borderColor: '#192959' },
          marginRight: '10px',
        }}
      >
        Close
      </Button>
    </Box>
  </Box>
</Modal>


<Modal
  open={tourGuideCommentModalOpen}
  onClose={() => setTourGuideCommentModalOpen(false)}
  aria-labelledby="add-comment-title"
  aria-describedby="add-comment-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: '10px',
    }}
  >
    <Typography id="add-comment-title" variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
      Add Comment for {selectedTourGuide.username}
    </Typography>
    <TextField
      fullWidth
      multiline
      rows={4}
      placeholder="Write your comment here..."
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      variant="outlined"
    />
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
      <Button
        variant="outlined"
        onClick={() => setTourGuideCommentModalOpen(false)}
        sx={{
          color: '#192959',
          borderColor: '#192959',
          '&:hover': { backgroundColor: 'rgba(25, 41, 89, 0.1)', borderColor: '#192959' },
          marginRight: '10px',
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleTourGuideCommentSubmit}
        sx={{ backgroundColor: '#192959', color: '#fff' }}
      >
        Submit
      </Button>
    </Box>
  </Box>
</Modal>




<Modal
  open={commentModalOpen}
  onClose={() => setCommentModalOpen(false)}
  aria-labelledby="add-comment-title"
  aria-describedby="add-comment-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: '10px',
    }}
  >
    <Typography id="add-comment-title" variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
      Add Comment
    </Typography>
    <TextField
      fullWidth
      multiline
      rows={4}
      placeholder="Write your comment here..."
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      variant="outlined"
    />
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
      <Button
        variant="outlined"
        onClick={() => setCommentModalOpen(false)}
        sx={{
          color: '#192959',
          borderColor: '#192959',
          '&:hover': { backgroundColor: 'rgba(25, 41, 89, 0.1)', borderColor: '#192959' },
          marginRight: '10px',
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleCommentSubmit}
        sx={{ backgroundColor: '#192959', color: '#fff' }}
      >
        Submit
      </Button>
    </Box>
  </Box>
</Modal>



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
  museumCard: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    padding: '50px', // Uniform padding
    borderRadius: '10px',
    backgroundColor: '#ffffff', // White background for each card
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for cards
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
    position: 'absolute',
    bottom: '40px',
    right: '60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  flagButton: {
    position: 'absolute',
    top: '50px',
    right: '50px',
    backgroundColor: '#ff5722',
    color: 'white',
    '&:hover': { backgroundColor: '#ff8a50' },
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
    marginTop: '10px',
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
};

export default TouristSavedEvents;
