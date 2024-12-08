import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton,Tooltip, TextField, InputAdornment, Modal,MenuItem,Select,FormControl,InputLabel,Divider, CircularProgress} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ChurchIcon from '@mui/icons-material/Church';
import AccountCircleIcon from '@mui/icons-material/AccountCircleRounded';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import LanguageIcon from '@mui/icons-material/Language';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function GuestMuseumPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [museums, setMuseums] = useState([]);
  const [scrollPositions, setScrollPositions] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false); // State for button visibility
  //done for categories and tags
  const [categories, setCategories] = useState([]);
  //const [searchQuery, setSearchQuery] = useState(''); // Search query state
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
const [currentMuseumName, setCurrentMuseumName] = useState(''); // Trac
const [convertedPrices, setConvertedPrices] = useState({});
const [currency, setCurrency] = useState('EGP'); // Default currency is EGP
const [expanded, setExpanded] = useState({});
const [bookmarkStatuses, setBookmarkStatuses] = useState({});
const [subscriptionStatus, setSubscriptionStatus] = useState({});
const location = useLocation();
const [loading, setIsLoading] = useState(true);

const queryParams = new URLSearchParams(location.search);
const initialSearchQuery = queryParams.get('search') || '';
const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle fetching or searching activities
    const fetchOrSearchMuseums = async () => {
      if (!searchQuery) {
        // Fetch all activities when there's no search query
        await fetchMuseums();
      } else {
        // Perform search when there's a query
        await searchMuseums(searchQuery);
      }
    };
  
    fetchOrSearchMuseums(); // Call the fetch or search logic
  
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
    // Trigger search logic if the search query exists
    if (initialSearchQuery) {
      searchMuseums(initialSearchQuery);
    }
  }, [initialSearchQuery]);
  const fetchSubscriptionStatus = async () => {
    const username = localStorage.getItem('username'); // Current user's username
    if (!username) return;
  
    const newSubscriptionStatus = {};
  
    await Promise.all(
      museums.map(async (museum) => {
        try {
          const response = await axios.get('/api/checkTouristSubscription', {
            params:{username:username,
            eventName: museum.name,
            eventType: "Museum"},
          });
  
          // Save subscription status with hp._id as the key
          newSubscriptionStatus[museum._id] = response.data.message.includes('is subscribed');
        } catch (error) {
          console.error(`Error checking subscription for ${museum._id}:`, error);
          newSubscriptionStatus[museum._id] = false; // Default to not subscribed in case of error
        }
      })
    );
  
    setSubscriptionStatus(newSubscriptionStatus);
  };

  useEffect(() => {
    if (museums.length > 0) {
      fetchSubscriptionStatus();
    }
  }, [museums]);
    

  useEffect(() => {
    if (currency !== 'EGP') {
      convertActivityPrices();
    }
  }, [currency, museums]);

  const convertActivityPrices = async () => {
    const newConvertedPrices = {};
  
    await Promise.all(
      museums.map(async (museum) => {
        try {
          // Convert ticket prices for each category: foreigner, native, and student
          const responses = await Promise.all(
            Object.entries(museum.ticketPrices).map(async ([category, priceEgp]) => {
              const response = await axios.post('/convertCurr', {
                priceEgp,
                targetCurrency: currency,
              });
              return { category, convertedPrice: response.data.convertedPrice };
            })
          );
  
          // Organize the converted prices by category
          newConvertedPrices[museum._id] = responses.reduce((acc, { category, convertedPrice }) => {
            acc[category] = convertedPrice;
            return acc;
          }, {});
        } catch (error) {
          console.error(`Error converting prices for museum ${museum.name}:`, error);
        }
      })
    );
  
    setConvertedPrices(newConvertedPrices);
  };
  
  
  
  

  const fetchMuseums = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/ViewAllUpcomingMuseumEventsTourist");
      const fetchedMuseums = response.data;
  
      // Fetch bookmark status for each museum
      const bookmarkStatuses = {};
      for (const museum of fetchedMuseums) {
        const isBookmarked = await checkBookmarkStatus(museum.name);
        bookmarkStatuses[museum._id] = isBookmarked; // Use museum ID to track status
      }
  
      setBookmarkStatuses(bookmarkStatuses); // Update state with bookmark statuses
      setMuseums(fetchedMuseums); // Set museums state
    } catch (error) {
      console.error("Error fetching museums:", error);
    } finally{
      setIsLoading(false);
    }
  };
  

  const toggleReadMore = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the state for the specific index
    }));
  };
  

  const searchMuseums = async (query) => {
    try {
      const response = await axios.post('/api/MuseumSearchAll', { searchString: query });
      setMuseums(response.data);
    } catch (error) {
      console.error('Error searching museums:', error);
      setMuseums([]); // Clear activities if no results or error
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
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
      const response = await axios.post('/api/getMuseumsByTagTourist', sanitizedInputs);
  
      // Update the museums state with the filtered results
      setMuseums(response.data);
      setFilterModalOpen(false); // Close the modal
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No museums found
        setMuseums([]); // Clear the museums list
      } else {
        console.error('Error filtering museums:', error);
      }
      setFilterModalOpen(false); // Close the modal in case of an error
    }
  };
  
 
  
  
  const handleSendEmail = async (museumName) => {
    if (!email || !sharedLink) {
      alert('Please provide a valid email and ensure the link is generated.');
      return;
    }
  
    try {
      const response = await axios.post('/getCopyLink', {
        entityType: 'museum',
        entityName: museumName,
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


  //bookmark
  const checkBookmarkStatus = async (eventName) => {
    const username = localStorage.getItem("username");
    try {
      const response = await axios.get("/api/checkIfInBookmarkedEvents", {
        params: { touristUsername: username, eventName },
      });
      return response.data.inBookmarkedEvents; // Returns true/false
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      return false;
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
  <Button onClick={() => navigate('/homeGuest')} sx={styles.sidebarButton}>
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
  <TextField
    label="Search"
    variant="outlined"
    value={searchQuery}
    onChange={handleSearchChange}
    sx={{
      width: '30%',
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#192959', // Default outline color
          borderWidth: '2px',
        },
        '&:hover fieldset': {
          borderColor: '#192959', // Hover outline color
          borderWidth: '2.5px',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#192959', // Focused outline color
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
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#192959', paddingLeft: '5px' }}>
          <SearchIcon />
        </Box>
      ),
    }}
  />

  {/* Sort Dropdown and Filter Icon */}
  <Box sx={{ display: 'flex', alignItems: 'right', gap: '10px', marginLeft: '100px'}}>
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
    <Tooltip title="Filter" placement="bottom" arrow>
      <IconButton
        onClick={() => setFilterModalOpen(true)}
        sx={{
          color: '#192959',
          '&:hover': { backgroundColor: '#e6e7ed', color: '#33416b' },
        }}
      >
        <FilterAltIcon fontSize="large" />
      </IconButton>
    </Tooltip>
  </Box>
</Box>





      
{/* Main Content Area with Museums */}
<Box sx={styles.activitiesContainer}>
  {museums.map((museum, index) => (
    <Box key={index} sx={{ marginBottom: '20px' }}>
      <Box
        sx={{
          ...styles.museumCard,
          position: 'relative',
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
                backgroundColor: '#f3f4f6',
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
            paddingRight: '80px', // Add padding to avoid overlap with buttons
            alignItems: 'flex-start',
          }}
        >
          {/* Description Label */}
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

          {/* Description Content */}
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

        {/* Ratings */}
        <Box sx={styles.museumRating}>
          {renderRating(museum.Ratings || 0)}
        </Box>

    
        <Box
  sx={{
    position: 'absolute',
    top: '60px',
    right: '60px',
    display: 'flex',
    flexDirection: 'row', // Arrange buttons in a row
    alignItems: 'center', // Align buttons vertically centered
    gap: 5, // Add spacing between icons
  }}
>

</Box>
      </Box>



      {/* Comments Section */}
      <Box sx={styles.commentsSection}>
        {museum.Comments && museum.Comments.length > 0 ? (
          <>
            {/* Show the scroll left button only if there's content to scroll back */}
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

            {/* Show the scroll right button only if there are 3 or more comments */}
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
</Box>;


<Box sx={styles.activitiesContainer}>
      {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {/* Circular Progress for loading */}
        <CircularProgress />
      </Box>
    ) : museums.length > 0 ? (
      museums.map((product, index) => (
      <Box key={index} sx={{ marginBottom: '40px' }}>
        {/* Your product card code */}
      </Box>
    ))
  ) : (
    <Typography
      variant="h6"
      sx={{ textAlign: 'center', color: '#192959', marginTop: '20px' }}
    >
      No Museum events available
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
      Share Museum
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
          onClick={() => handleSendEmail(currentMuseumName)} // Pass activityName
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
      Filter Museums
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
  museumCard: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    padding: '50px', // Uniform padding
    borderRadius: '10px',
    backgroundColor: '#ffffff', // White background for each card
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for cards
  },  
  activityInfo: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  quickFacts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  infoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // Light grey for inner sections
    borderRadius: '16px',
    padding: '5px 10px',
  },
  museumRating: {
    position: 'absolute',
    bottom: '80px',
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
  quickFacts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  infoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '16px',
    padding: '5px 10px',
  },
  
};

export default GuestMuseumPage;
