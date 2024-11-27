import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton,Tooltip, TextField, InputAdornment, Modal,MenuItem,Select,FormControl,InputLabel,} from '@mui/material';
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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; // For the shopping cart icon
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarHalfIcon from '@mui/icons-material/StarHalf';

import axios from 'axios';

function TouristPurchasedProducts() {
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
const [products, setProducts] = useState([]);
const [currency, setCurrency] = useState('EGP'); // Default currency is EGP
const [expanded, setExpanded] = React.useState({});
const [wishlistStatus, setWishlistStatus] = useState({});
const [wishlist, setWishlist] = useState([]); 

const [commentModalOpen, setCommentModalOpen] = useState(false);
const [currentActivityId, setCurrentActivityId] = useState(null);
const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle fetching or searching activities
    const fetchOrSearchActivities = async () => {
      if (!searchQuery) {
        // Fetch all activities when there's no search query
        await fetchProducts();
      } else {
        // Perform search when there's a query
        await searchProducts(searchQuery);
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
  }, [currency, products]);

  const convertActivityPrices = async () => {
    const newConvertedPrices = {};
    await Promise.all(
      products.map(async (product) => {
        try {
          const response = await axios.post('/convertCurr', {
            priceEgp: product.Price,
            targetCurrency: currency,
          });
          // Use a unique key for each activity
          newConvertedPrices[product._id] = response.data.convertedPrice;
        } catch (error) {
          console.error(`Error converting price for product ${product.Name}:`, error);
        }
      })
    );
    setConvertedPrices(newConvertedPrices);
  };
  
  const checkWishlistStatus = async (productName) => {
    const username = localStorage.getItem("username");
    try {
      const response = await axios.get("/api/checkIfInWishlist", {
        params: { touristUsername:username, productName },
      });
      return response.data.inWishlist;
    } catch (error) {
      console.error("Error checking wishlist status:", error);
      return false;
    }
  };


  const removeFromWishlist = async (productName) => {
    const username = localStorage.getItem("username");
    try {
      const response = await axios.post("/removeFromWishlist", {
        touristUsername: username,
        productName,
      });
      return response.data;
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      throw error;
    }
  };

  const addToWishList = async (productName) => {
    const username = localStorage.getItem("username");
    try {
      const response = await axios.post("/addToWishList", {
        touristUsername: username,
        productName,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      throw error;
    }
  };
  
  const handleToggleWishlist = async (productName, productId) => {
    const isInWishlist = wishlist[productId];
  
    // Optimistically update the UI
    setWishlist((prev) => ({ ...prev, [productId]: !isInWishlist }));
  
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist(productName);
      } else {
        // Add to wishlist
        await addToWishList(productName);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      // Revert UI change on failure
      setWishlist((prev) => ({ ...prev, [productId]: isInWishlist }));
    }
  };
  
  
  

  // Fetch all products and initialize wishlist status
// const fetchProducts = async () => {
//     try {
//       const response = await axios.get('/api/viewAllProductsSeller'); // Adjust endpoint as needed
//       const fetchedProducts = response.data;
  
//       // Initialize wishlist status
//       const wishlistStatuses = {};
//       for (const product of fetchedProducts) {
//         wishlistStatuses[product.Name] = await fetchWishlistStatus(product.Name);
//       }
//       setWishlistStatus(wishlistStatuses);
//       setProducts(fetchedProducts);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };



const fetchProducts = async () => {
    try {
      const username = localStorage.getItem('username'); // Retrieve the logged-in username
  
      if (!username) {
        console.error('User not logged in.');
        return;
      }
  
      // Fetch purchased products using the username
      const response = await axios.get('/api/viewPurchasedProducts', {
        params: { Username: username }, // Send the username as a query parameter
      });
  
      const purchasedProducts = response.data; // Response contains the product details
      setProducts(purchasedProducts); // Set the products state with the fetched data
    } catch (error) {
      console.error('Error fetching purchased products:', error);
    }
  };
  
  

  const searchProducts = async (query) => {
    try {
      const response = await axios.post('/api/searchProductTourist', { ProductName: query });
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]); // Clear activities if no results or error
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
      [name]: name === "MinimumPrice" || name === "MaximumPrice" // Ensure numerical values are parsed
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
  
      // Map frontend filter inputs to backend field names
      const backendPayload = {
        MinimumPrice: sanitizedInputs.MinimumPrice,
        MaximumPrice: sanitizedInputs.MaximumPrice,
      };
  
      const response = await axios.post('/filterProductByPriceTourist', backendPayload);
      setProducts(response.data); // Update products with the filtered results
      setFilterModalOpen(false); // Close the modal after applying filters
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No products found
        setProducts([]); // Clear products list
        setFilterModalOpen(false); // Close the modal
      } else {
        console.error('Error filtering products:', error);
      }
    }
  };
  


  const handleSortChange = async (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);

    try {
      let response;
      switch (selectedOption) {
        case "ratingAsc":
          response = await axios.get("/api/sortProductsAscendingTourist");
          break;
        case "ratingDesc":
          response = await axios.get("/api/sortProductsDescendingTourist");
          break;
        default:
          return; // Do nothing if no valid option is selected
      }

      if (response && response.data) {
        setProducts(response.data); // Update the activities with the sorted data
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
  
  

  const handleRatingClick = async (productId, rating) => {
    const username = localStorage.getItem('username');
    const product = products.find((product) => product._id === productId); // Find the product by ID
  
    if (!username || !product) {
      alert('User not logged in or product not found.');
      return;
    }
  
    try {
      const response = await axios.put('/ratePurchasedProduct', {
        touristUsername: username,
        productName: product.Name, // Use the product name as expected by the backend
        rating,
      });
  
      const { newAverageRating } = response.data;
  
      // Update state: show user rating and "Add Comment" button
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod._id === productId
            ? {
                ...prod,
                userRating: rating,
                Ratings: newAverageRating,
                showCommentButton: true, // Explicitly set this to true
              }
            : prod
        )
      );
    } catch (error) {
      console.error('Error submitting product rating:', error);
      alert(error.response?.data?.msg || 'Failed to submit rating.');
    }
  };
  
  
  

  const handleCommentSubmit = async () => {
    const username = localStorage.getItem('username');
    const product = products.find((product) => product._id === currentActivityId); // Find the product by ID
  
    if (!username || !product) {
      alert('User not logged in or product not found.');
      return;
    }
  
    try {
      const response = await axios.put('/reviewPurchasedProduct', {
        touristUsername: username,
        productName: product.Name, // Use the product name as expected by the backend
        review: commentText,      // Pass the comment text as the review
      });
  
      const { review } = response.data;
  
      // Update the reviews in the product state
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod._id === currentActivityId
            ? { ...prod, Reviews: [...(prod.Reviews || []), { touristUsername: username, Review: commentText }] }
            : prod
        )
      );
  
      setCommentModalOpen(false); // Close the modal
      setCommentText('');         // Clear the comment input
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.msg || 'Failed to submit review.');
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

  //Description
  const handleToggleDescription = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddToCart = async (productName) => {
    const touristUsername = localStorage.getItem('username');
    try {
      const response = await axios.post('/addToCart', { touristUsername, productName });
      alert(response.data.msg);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add product to cart');
    }
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
        onClick={() => navigate('/upcoming-historical-places')}
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
    alignItems: 'center',           // Align items vertically in the center
    marginBottom: '20px',
    marginTop: '20px',
    marginLeft: '150px',
    marginRight: '60px',           // Add margin to the right for consistent spacing
  }}
>
  

  {/* Sort Dropdown and Filter Icon */}
  <Box sx={{ display: 'flex', alignItems: 'right', gap: '10px', marginLeft: '1550px',marginRight: '10px'}}>
   

    <TextField
  select
  label="Currency"
  value={currency}
  onChange={(e) => setCurrency(e.target.value)}
  variant="outlined"
  sx={{
    width: '130px',
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





      
{/* Main Content Area with Products */}
<Box sx={styles.activitiesContainer}>
  {products.map((product, index) => (
    <Box key={index} sx={{ marginBottom: '40px' }}>
      <Box
        sx={{
          ...styles.activityCard,
          backgroundColor: 'white', // No flagged logic for products
        }}
      >
         {/* Icons for Add to Cart and Add to Wishlist */}


        {/* Product Info */}
        <Box sx={styles.activityInfo}>
          {/* Product Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              fontSize: '24px',
              marginBottom: '5px',
              textAlign: 'left', // Align to the left
            }}
          >
            {product.Name}
          </Typography>

          {/* Product Seller */}
          <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
            <PersonIcon fontSize="small" sx={{ mr: 1 }} />
            {product.Seller || 'N/A'}
          </Typography>

          {/* Product Price */}
          <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
            <PaymentIcon fontSize="small" sx={{ mr: 1 }} />
            {currency === 'EGP'
                  ? `${product.Price} EGP`
                  : `${convertedPrices[product._id] || 'Loading...'} ${currency}`}
          </Typography>

          {/* Right Side: Description */}
          <Box sx={{ flex: 1, paddingLeft: '2px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
  {/* Description Label */}
  <Typography 
    variant="body2" 
    sx={{ fontSize: '18px', fontWeight: 'bold' }}
  >
    Description:
  </Typography>

  {/* Description Content */}
  <Typography
    variant="body2"
    sx={{
      fontSize: '18px',
      wordWrap: 'break-word', // Break long words
      whiteSpace: 'normal',  // Wrap text normally
      maxWidth: '550px',     // Ensure width consistency
    }}
  >
    {expanded[index] || (product.Description && product.Description.length <= 25) ? (
      <span>
        {product.Description || 'No description available'}
        {product.Description && product.Description.length > 25 && (
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
        {(product.Description || 'No description available').substring(0, 25)}...
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

        {/* Product Ratings */}
        <Box sx={styles.activityRating}>
  {renderRating(
    product._id,        // Pass activity._id for the activity
    product.userRating, // Use userRating for the user-specific rating
    product.Ratings,    // Overall rating for the activity
    handleRatingClick    // Rating click handler
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
    {product.showCommentButton && (
      <Button
        variant="text"
        onClick={() => {
          setCurrentActivityId(product._id); // Use activity._id for activity identification
          setCommentModalOpen(true);         // Open the comment modal
        }}
        startIcon={<AddIcon />}
        sx={{
          fontSize: '14px',  // Smaller font size
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

      {/* Reviews Section */}
      <Box
        sx={{
          ...styles.commentsSection,
          marginTop: '20px', // Adds space above reviews
          //padding: '15px', // Optional padding for better visuals
          //backgroundColor: '#f9f9f9', // Slight background color to separate reviews
          borderRadius: '10px', // Rounded corners for reviews container
          //boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', // Optional shadow
        }}
      >
        {product.Reviews && product.Reviews.length > 0 ? (
          <>
            {/* Scroll Left Button */}
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
              onScroll={(e) =>
                updateScrollPosition(index, e.target.scrollLeft)
              }
            >
              {product.Reviews.map((review, idx) => (
                <Box key={idx} sx={styles.commentCard}>
                  <Typography variant="body2">
                    {review.Review || 'No review available'}
                  </Typography>
                  <Typography variant="caption">
                    @ {review.touristUsername || 'Anonymous'}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Scroll Right Button */}
            {product.Reviews.length >= 3 && (
              <IconButton
                sx={styles.scrollButton}
                onClick={() => scrollCommentsRight(index)}
              >
                <ArrowForwardIcon />
              </IconButton>
            )}
          </>
        ) : (
          <Typography variant="body2">No reviews available</Typography>
        )}
      </Box>
    </Box>
  ))}
</Box>



      <Box sx={styles.activitiesContainer}>
  {products.length > 0 ? (
    products.map((product, index) => (
      <Box key={index} sx={{ marginBottom: '20px' }}>
        {/* Your activity card code */}
      </Box>
    ))
  ) : (
    <Typography variant="h6" sx={{ textAlign: 'center', color: '#192959', marginTop: '20px' }}>
      No Products Found .
    </Typography>
  )}
</Box>


<Modal
  open={isShareModalOpen}
  onClose={() => setShareModalOpen(false)}
  aria-labelledby="share-modal-title"
  aria-describedby="share-modal-description"
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <Typography id="share-modal-title" variant="h6" component="h2">
      Share Activity
    </Typography>

    {/* Copy to Clipboard Button */}
    <Button
      variant="contained"
      onClick={handleCopyToClipboard}
      sx={{
        backgroundColor: '#192959',
        color: '#fff',
        '&:hover': { backgroundColor: '#33416b' },
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
      }}
    >
      <ContentCopyIcon />
      Copy to Clipboard
    </Button>

    {/* Share via Email and Send Buttons */}
    {!showEmailField ? (
      <Button
        variant="contained"
        onClick={() => setShowEmailField(true)} // Toggle to show email input and "Send" button
        sx={{
          backgroundColor: '#192959',
          color: '#fff',
          '&:hover': { backgroundColor: '#33416b' },
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        <ShareIcon />
        Share via Email
      </Button>
    ) : (
      <>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => handleSendEmail(currentActivityName)} // Pass activityName
          sx={{
            backgroundColor: '#192959',
            color: '#fff',
            '&:hover': { backgroundColor: '#33416b' },
            width: '100%',
          }}
        >
          Send
        </Button>
      </>
    )}
  </Box>
</Modal>



      <Modal
  open={filterModalOpen}
  onClose={() => setFilterModalOpen(false)}
  aria-labelledby="filter-modal-title"
  aria-describedby="filter-modal-description"
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
    <Typography id="filter-modal-title" variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
      Filter Products
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
    <TextField
        label="Minimum Price"
        name="MinimumPrice"
        type="number"
        variant="outlined"
        value={filterInputs.MinimumPrice || ""}
        onChange={handleFilterInputChange}
        />
        <TextField
        label="Maximum Price"
        name="MaximumPrice"
        type="number"
        variant="outlined"
        value={filterInputs.MaximumPrice || ""}
        onChange={handleFilterInputChange}
        />

     
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
    <Button
  variant="outlined"
  onClick={() => setFilterModalOpen(false)}
  sx={{
    color: '#192959', // Text color
    borderColor: '#192959', // Outline color
    '&:hover': {
      backgroundColor: 'rgba(25, 41, 89, 0.1)', // Slight background highlight on hover
      borderColor: '#192959', // Outline color on hover
    },
  }}
>
  Cancel
</Button>

      <Button variant="contained" onClick={handleFilterSubmit} sx={{ backgroundColor: '#192959', color: '#fff' }}>
        Apply
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
    bottom: '45px',
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

export default TouristPurchasedProducts;
