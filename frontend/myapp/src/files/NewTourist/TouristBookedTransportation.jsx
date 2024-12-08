import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton,Tooltip, TextField, InputAdornment, Modal,MenuItem,Select,FormControl,InputLabel,CircularProgress} from '@mui/material';
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
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import axios from 'axios';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function TouristBookedTransportation() {
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
const [transportation, setTransportation] = useState([]);
const [flightsOpen, setFlightsOpen] = useState(false); // Manage the dropdown state for Flights
const [hotelsOpen, setHotelsOpen] = useState(false); // Manage the dropdown state for Hotels
const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle fetching or searching activities
    const fetchOrSearchActivities = async () => {
      if (!searchQuery) {
        // Fetch all activities when there's no search query
        await fetchTransportation();
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
      transportation.map(async (transport) => {
        try {
          const response = await axios.post('/convertCurr', {
            priceEgp: transport.price, // Assuming 'price' is the price field in transportation
            targetCurrency: currency,
          });
          // Use a unique key for each transportation entry
          newConvertedPrices[transport._id] = response.data.convertedPrice;
        } catch (error) {
          console.error(`Error converting price for transportation ${transport.serviceName}:`, error);
        }
      })
    );
    setConvertedPrices(newConvertedPrices);
  };
  
  
  
  

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/ViewAllUpcomingActivities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchTransportation = async () => {
    setLoading(true); // Set loading to true before starting the fetch
    try {
      const username = localStorage.getItem('username'); // Retrieve logged-in user's username
      if (!username) {
        alert('User not logged in.');
        return;
      }
  
      // Call the API to fetch booked transportation details for the logged-in user
      const response = await axios.get('/api/viewMyBookedTransportation', {
        params: { Username: username }, // Pass the username as a query parameter
      });
  
      setTransportation(response.data); // Set the transportation state with the response data
    } catch (error) {
      console.error('Error fetching booked transportation:', error);
      alert(error.response?.data?.msg || 'Failed to fetch booked transportation.');
    }
    finally {
      setLoading(false); // Set loading to false after the fetch
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

  const handleBookTransportation = async (TranspName) => {
    const username = localStorage.getItem('username'); // Retrieve logged-in user's username
  
    if (!username) {
      alert('User not logged in.');
      return;
    }
  
    try {
      // Call the backend API to book the transportation
      const response = await axios.put('bookTransportation', {
        touristUsername: username,
        TranspName,
      });
  
      // Notify the user of successful booking
      alert(response.data.msg);
  
      // Optionally, update the transportation state to reflect the booking
      setTransportation((prevTransportations) =>
        prevTransportations.map((transp) =>
          transp.serviceName === TranspName
            ? { ...transp, capacity: transp.capacity - 1, available: transp.capacity - 1 > 0 }
            : transp
        )
      );
    } catch (error) {
      console.error('Error booking transportation:', error);
      alert(error.response?.data?.msg || 'Failed to book transportation.');
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
                onClick={() => navigate('/')}
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
    alignItems: 'center',           // Align items vertically in the center
    marginBottom: '20px',
    marginTop: '20px',
    marginLeft: '150px',
    marginRight: '60px',           // Add margin to the right for consistent spacing
  }}
>
  {/* Search Bar */}
 

  {/* Sort Dropdown and Filter Icon */}
  <Box sx={{ display: 'flex', alignItems: 'right', gap: '10px', marginLeft: '1560px',marginRight: '10px'}}>
    
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


    {/* Filter Icon */}
    
  </Box>
</Box>





     {/* Main Content Area with Transportation */}
<Box sx={styles.activitiesContainer}>
  {transportation.map((transportation, index) => (
    <Box key={index} sx={{ marginBottom: '20px' }}>
      <Box
        sx={{
          ...styles.activityCard,
          backgroundColor:  'white',
        }}
      >
        <Box sx={styles.activityInfo}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
            {transportation.serviceName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
            {transportation.routeDetails.startLocation} to {transportation.routeDetails.endLocation}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
            <PersonIcon fontSize="small" sx={{ mr: 1 }} />
            {transportation.advertiserName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
            <PaymentIcon fontSize="small" sx={{ mr: 1 }} />
            {currency === 'EGP'
              ? `${transportation.price} EGP`
              : `${convertedPrices[transportation._id] || 'Loading...'} ${currency}`}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
            {transportation.schedule.map((s, i) => (
              <span key={i}>
                {s.day}: {s.departureTime} - {s.arrivalTime}
                {i < transportation.schedule.length - 1 ? ', ' : ''}
              </span>
            ))}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
            <Box component="span" sx={{ fontWeight: 'bold' }}>
                Capacity Available:
            </Box> {" "}
            {transportation.capacity}
            </Typography>
          <Box sx={styles.quickFacts}>
            <Box sx={{ ...styles.infoContainer, backgroundColor: transportation.available ? '#f3f4f6' : '#b3b8c8' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Type:</Typography>
              <Typography variant="body2">{transportation.serviceType}</Typography>
            </Box>
          </Box>
        </Box>
       
        <Box sx={styles.discountContainer}>
          <Box sx={{ ...styles.infoContainer, backgroundColor: transportation.available ? '#f3f4f6' : '#b3b8c8' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Available:</Typography>
            <Typography variant="body2">{transportation.available ? 'Yes' : 'No'}</Typography>
          </Box>
        </Box>

       
       
      </Box>
    </Box>
  ))}
</Box>


      <Box sx={styles.activitiesContainer}>
      {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {/* Circular Progress for loading */}
        <CircularProgress />
      </Box>
    ) : transportation.length > 0 ? (
    transportation.map((transp, index) => (
      <Box key={index} sx={{ marginBottom: '20px' }}>
        {/* Your activity card code */}
      </Box>
    ))
  ) : (
    <Typography variant="h6" sx={{ textAlign: 'center', color: '#192959', marginTop: '20px' }}>
      No Transportations Available.
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
      Filter Activities
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <TextField
        label="Category"
        name="Category"
        variant="outlined"
        value={filterInputs.Category || ""}
        onChange={handleFilterInputChange}
      />
      <TextField
        label="Min Price"
        name="minPrice"
        type="number"
        variant="outlined"
        value={filterInputs.minPrice || ""}
        onChange={handleFilterInputChange}
      />
      <TextField
        label="Max Price"
        name="maxPrice"
        type="number"
        variant="outlined"
        value={filterInputs.maxPrice || ""}
        onChange={handleFilterInputChange}
      />
      <TextField
        label="Date"
        name="InputDate"
        type="date"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        value={filterInputs.InputDate || ""}
        onChange={handleFilterInputChange}
      />
      <TextField
        label="Rating"
        name="Rating"
        type="number"
        variant="outlined"
        value={filterInputs.Rating || ""}
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
    bottom: '50px',
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
    bottom: '140px',
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

export default TouristBookedTransportation;
