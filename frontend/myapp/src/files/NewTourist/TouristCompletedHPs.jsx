import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Divider,IconButton,Tooltip, TextField, InputAdornment, Modal,MenuItem,Select,FormControl,InputLabel,} from '@mui/material';
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
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import BookmarkIcon from '@mui/icons-material/Bookmark';

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

function TouristCompletedHPs() {
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
  const [currency, setCurrency] = useState('EGP'); // Default currency is EGP
  
  //hps
  const [HPs, setHPs] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showAverageRating, setShowAverageRating] = useState({}); // Track which activity shows average rating
  const [flightsOpen, setFlightsOpen] = useState(false); // Manage the dropdown state for Flights
 const [hotelsOpen, setHotelsOpen] = useState(false); // Manage the dropdown state for Hotels
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState({});
  
    useEffect(() => {
      // Function to handle fetching or searching activities
      const fetchOrSearchHPs = async () => {
        if (!searchQuery) {
          // Fetch all hps when there's no search query
          await fetchHistoricalPlaces();
        } else {
          // Perform search when there's a query
          await searchHPs(searchQuery);
        }
      };
    
      fetchOrSearchHPs(); // Call the fetch or search logic
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
  
    // useEffect(() => {
    //   fetchHistoricalPlaces();
    // }, []);
  
    useEffect(() => {
      if (currency !== 'EGP') {
        convertActivityPrices();
      }
    }, [currency, HPs]);
  

  
    const convertActivityPrices = async () => {
      const newConvertedPrices = {};
    
      await Promise.all(
        HPs.map(async (hp) => {
          try {
            // Convert ticket prices for each category: foreigner, native, and student
            const responses = await Promise.all(
              Object.entries(hp.ticketPrices).map(async ([category, priceEgp]) => {
                const response = await axios.post('/convertCurr', {
                  priceEgp,
                  targetCurrency: currency,
                });
                return { category, convertedPrice: response.data.convertedPrice };
              })
            );
    
            // Organize the converted prices by category
            newConvertedPrices[hp._id] = responses.reduce((acc, { category, convertedPrice }) => {
              acc[category] = convertedPrice;
              return acc;
            }, {});
          } catch (error) {
            console.error(`Error converting prices for museum ${hp.name}:`, error);
          }
        })
      );
    
      setConvertedPrices(newConvertedPrices);
    };
    
    
    const fetchHistoricalPlaces = async () => {
      try {
        const Username = localStorage.getItem('username');
        if (!Username) {
            console.error('Username not found. Please log in.');
            return;
          }

        const response = await axios.get(`/api/viewMyCompletedHistoricalPlaces`, {
        params: { Username }, // Pass the Username as query parameters
      });
        setHPs(response.data);
      } catch (error) {
        console.error('Error fetching hps:', error);
      }
    };
  
    const handleToggleDescription = (index) => {
      setExpanded((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };
  

  
    const searchHPs = async (query) => {
      try {
        const response = await axios.post('/api/HistoricalPlacesSearchAll', { searchString: query });
        setHPs(response.data);
      } catch (error) {
        console.error('Error searching hps:', error);
        setHPs([]); // Clear activities if no results or error
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
        [name]: value, // Update the corresponding field in the state
      }));
    };
    
    
    const handleFilterSubmit = async () => {
      try {
        // Format the tags input into an array
        const sanitizedInputs = {
          tags: filterInputs.Tags ? filterInputs.Tags.split(',').map(tag => tag.trim()) : [], // Split by commas and trim spaces
        };
    
        // Send the request to the backend
        const response = await axios.post('/getHistoricalPlacesByTagTourist', sanitizedInputs);
    
        // Update the hps state with the filtered results
        setHPs(response.data);
        setFilterModalOpen(false); // Close the modal
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // No hps found
          setHPs([]); 
        } else {
          console.error('Error filtering hps:', error);
        }
        setFilterModalOpen(false);
      }
    };
  
 
  
  
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
  
  
    //book
    const handleBookHistoricalPlace = async (historicalPlaceName) => {
      const touristUsername = localStorage.getItem('username'); // Assuming username is stored in localStorage
    
      if (!touristUsername) {
        alert('Please log in to book hps.');
        return;
      }
    
      try {
        const response = await axios.put('/bookHistoricalPlace', { touristUsername, historicalPlaceName });
        navigate('/TouristPaymentPage');
      } catch (error) {
        alert(error.response?.data?.msg || 'An error occurred while booking the HP.');
      }
    };
    //share
  
    const handleOpenShareModal = async (activityName) => {
      try {
        const response = await axios.post('/getCopyLink', {
          entityType: 'historicalPlace',
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
          entityType: 'historicalPlace',
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
  
    
    
  
    // const renderRating = (activityId, userRating, averageRating, handleRatingClick) => {
    //     const displayRating = userRating || averageRating || 0; // Use user rating first, then average
    //     const fullStars = Math.floor(displayRating);
    //     const halfStars = displayRating > fullStars ? 1 : 0;
    //     const emptyStars = 5 - fullStars - halfStars;
      
    //     return (
    //       <Box sx={styles.ratingContainer} display="flex" alignItems="center">
    //         {/* Display Rating Number */}
    //         <Typography
    //           variant="body2"
    //           sx={{
    //             fontSize: '18px',
    //             fontWeight: 'bold',
    //             marginRight: '10px', // Spacing between number and stars
    //           }}
    //         >
    //           {displayRating.toFixed(2)}
    //         </Typography>
      
    //         {/* Render Full Stars */}
    //         {[...Array(fullStars)].map((_, index) => (
    //           <StarIcon
    //             key={`full-${index}`}
    //             sx={{ fontSize: '32px', cursor: 'pointer', color: '#192959' }}
    //             onClick={() => handleRatingClick(activityId, index + 1)}
    //           />
    //         ))}
      
    //         {/* Render Half Stars */}
    //         {[...Array(halfStars)].map((_, index) => (
    //           <StarHalfIcon
    //             key={`half-${index}`}
    //             sx={{ fontSize: '32px', cursor: 'pointer', color: '#192959' }}
    //             onClick={() => handleRatingClick(activityId, fullStars + 1)}
    //           />
    //         ))}
      
    //         {/* Render Empty Stars */}
    //         {[...Array(emptyStars)].map((_, index) => (
    //           <StarBorderIcon
    //             key={`empty-${index}`}
    //             sx={{ fontSize: '32px', cursor: 'pointer', color: '#192959' }}
    //             onClick={() => handleRatingClick(activityId, fullStars + index + 1)}
    //           />
    //         ))}
    //       </Box>
    //     );
    //   };

    const renderRating = (activityId, userRating, averageRating, handleRatingClick) => {
      const displayRating = userRating || 0; // Display user rating or default to 0
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
            {userRating ? displayRating.toFixed(2) : "Rate Now"} {/* Show "Rate Now" when no rating */}
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
    
    
    const handleRatingClick = async (hpId, rating) => {
      const username = localStorage.getItem('username');
      const hp = HPs.find((hp) => hp._id === hpId); // Find the specific historical place by ID
    
      if (!username || !hp) {
        alert('User not logged in or historical place not found.');
        return;
      }
    
      try {
        const response = await axios.put('/rateCompletedHP', {
          touristUsername: username,
          HPname: hp.name, // Use the name of the historical place as expected by the backend
          rating,
        });
    
        const { newAverageRating } = response.data;
    
        // Temporarily show user rating
        setHPs((prevHPs) =>
          prevHPs.map((historicalPlace) =>
            historicalPlace._id === hpId
              ? { ...historicalPlace, userRating: rating }
              : historicalPlace
          )
        );
    
        // Wait for 2 seconds, then switch to showing the average rating
        setTimeout(() => {
          setHPs((prevHPs) =>
            prevHPs.map((historicalPlace) =>
              historicalPlace._id === hpId
                ? { ...historicalPlace, userRating: 0, Ratings: newAverageRating ,showCommentButton:true} // Reset userRating, show average
                : historicalPlace
            )
          );
    
          // Update state to show average rating
          setShowAverageRating((prev) => ({ ...prev, [hpId]: true }));
        }, 2000); // 2-second delay
      } catch (error) {
        console.error('Error submitting rating:', error);
        alert(error.response?.data?.msg || 'Failed to submit rating.');
      }
    };
    

    const renderAverageRating = (averageRating) => {
      const fullStars = Math.floor(averageRating);
      const halfStars = averageRating > fullStars ? 1 : 0;
      const emptyStars = 5 - fullStars - halfStars;
    
      return (
        <Box sx={styles.ratingContainer} display="flex" alignItems="center">
          {/* Display Average Rating Number */}
          <Typography
            variant="body2"
            sx={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginRight: '10px',
            }}
          >
            {averageRating.toFixed(2)}
          </Typography>
    
          {/* Render Full Stars */}
          {[...Array(fullStars)].map((_, index) => (
            <StarIcon
              key={`full-average-${index}`}
              sx={{ fontSize: '32px', color: '#192959' }}
            />
          ))}
    
          {/* Render Half Stars */}
          {[...Array(halfStars)].map((_, index) => (
            <StarHalfIcon
              key={`half-average-${index}`}
              sx={{ fontSize: '32px', color: '#192959' }}
            />
          ))}
    
          {/* Render Empty Stars */}
          {[...Array(emptyStars)].map((_, index) => (
            <StarBorderIcon
              key={`empty-average-${index}`}
              sx={{ fontSize: '32px', color: '#192959' }}
            />
          ))}
        </Box>
      );
    };
    
    

      const handleCommentSubmit = async () => {
        const username = localStorage.getItem('username');
        const hp = HPs.find((hp) => hp._id === currentActivityId);
      
        if (!username || !hp) {
          alert('User not logged in or historical place not found.');
          return;
        }
      
        try {
          const response = await axios.put('/commentOnHP', {
            touristUsername: username,
            HPname: hp.name, // Use HPname as expected by the backend
            comment: commentText,
          });
      
          const { comments } = response.data;
      
          // Update the comments in the HP state
          setHPs((prevHPs) =>
            prevHPs.map((historicalPlace) =>
              historicalPlace._id === currentActivityId
                ? { ...historicalPlace, Comments: comments, showCommentButton: true }
                : historicalPlace
            )
          );
      
          setCommentModalOpen(false); // Close the modal
          setCommentText(''); // Clear the comment input
        } catch (error) {
          console.error('Error submitting comment:', error);
          alert(error.response?.data?.msg || 'Failed to submit comment.');
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
  
  
  
        <Box
    sx={{
        display: 'flex',
        justifyContent: 'space-between', // Ensure space between search bar and the rest
        alignItems: 'right',           // Align items vertically in the center
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '1620px',      // Add margin to the right for consistent spacing
    }}
  >
   
  
    {/* Sort Dropdown and Filter Icon */}
    <Box sx={{ display: 'flex', alignItems: 'right', gap: '10px', marginLeft: '100px'}}>
      {/* <TextField
        select
        label={
          <Box sx={{ display: 'flex', alignItems: 'right', gap: '8px' }}>
            Sort By
          </Box>
        }
        variant="outlined"
        value={sortOption}
        onChange={handleSortChange}
        sx={{
          width: '80%',
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
              <SwapVertIcon />
            </Box>
          ),
        }}
      >
        <MenuItem value="priceAsc">Price: Low to High</MenuItem>
        <MenuItem value="priceDesc">Price: High to Low</MenuItem>
        <MenuItem value="ratingAsc">Rating: Low to High</MenuItem>
        <MenuItem value="ratingDesc">Rating: High to Low</MenuItem>
      </TextField> */}
  
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
  
  
  
  
  
        
  {/* Main Content Area with Historical Places */}
  <Box sx={styles.activitiesContainer}>
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
  {showAverageRating[hp._id]
    ? renderAverageRating(hp.Ratings) // Show average rating after submission
    : renderRating(hp._id, hp.userRating, hp.Ratings, handleRatingClick)} {/* Initial render */}


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
  
        <Box sx={styles.activitiesContainer}>
    {activities.length > 0 ? (
      activities.map((activity, index) => (
        <Box key={index} sx={{ marginBottom: '20px' }}>
          {/* Your activity card code */}
        </Box>
      ))
    ) : (
      <Typography variant="h6" sx={{ textAlign: 'center', color: '#192959', marginTop: '20px' }}>
        
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
      <Typography id="filter-modal-title" variant="h6" sx={{ marginBottom: '20px' }}>
        Filter HIstorical Places
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <TextField
          label="Tags"
          name="Tags" // This must match the key in filterInputs
          variant="outlined"
          value={filterInputs.Tags || ""} // Ensure the Tags field exists in filterInputs
          onChange={handleFilterInputChange}
          helperText="Enter tags separated by commas"
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <Button
          variant="outlined"
          onClick={() => setFilterModalOpen(false)}
          sx={{
            color: '#192959',
            borderColor: '#192959',
            '&:hover': {
              backgroundColor: 'rgba(25, 41, 89, 0.1)',
              borderColor: '#192959',
            },
          }}
        >
          Cancel
        </Button>
  
        <Button
          variant="contained"
          onClick={handleFilterSubmit} // Call the submit handler
          sx={{ backgroundColor: '#192959', color: '#fff' }}
        >
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
      height: '200px',
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
      bottom: '60px',
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
    verticalDivider: {
      backgroundColor: '#d1d5db',
      width: '1px',
      margin: '40px 15px 0 15px', // Adjust the top margin to position the start
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

export default TouristCompletedHPs;
