import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, IconButton,Tooltip, TextField, InputAdornment, Modal,MenuItem,Select,FormControl,InputLabel,CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
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
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ChurchIcon from '@mui/icons-material/Church';
import AccountCircleIcon from '@mui/icons-material/AccountCircleRounded';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PaymentIcon from '@mui/icons-material/Payment';
import LanguageIcon from '@mui/icons-material/Language';
import { useLocation } from "react-router-dom";
import axios from 'axios';

function GuestActivityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [scrollPositions, setScrollPositions] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State for button visibility
  //done for categories and tags
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  
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
const [bookmarkStatuses, setBookmarkStatuses] = useState({});
const [subscriptionStatus, setSubscriptionStatus] = useState({});
const location = useLocation();
const query = new URLSearchParams(location.search);
const targetName = query.get("Name");
const refs = useRef({});
const queryParams = new URLSearchParams(location.search);
const initialSearchQuery = queryParams.get('search') || ''; 
const [searchQuery, setSearchQuery] = useState(initialSearchQuery); // Search query state

  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle fetching or searching activities
    const fetchOrSearchActivities = async () => {
      if (!searchQuery) {
        // Fetch all activities when there's no search query
        await fetchActivities();
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
    // Trigger search logic if the search query exists
    if (initialSearchQuery) {
      searchActivities(initialSearchQuery);
    }
  }, [initialSearchQuery]); 
  useEffect(() => {
    if (targetName && refs.current[targetName]) {
      setTimeout(() => {
        refs.current[targetName].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100); // Delay to ensure refs are populated
    }
  }, [targetName, activities]); // Add HPs to dependencies
  
  const fetchSubscriptionStatus = async () => {
    const username = localStorage.getItem('username'); // Current user's username
    if (!username) return;
  
    const newSubscriptionStatus = {};
  
    await Promise.all(
      activities.map(async (activity) => {
        try {
          const response = await axios.get('/api/checkTouristSubscription', {
            params:{username:username,
            eventName: activity.Name,
            eventType: "Activity"},
          });
  
          // Save subscription status with hp._id as the key
          newSubscriptionStatus[activity._id] = response.data.message.includes('is subscribed');
        } catch (error) {
          console.error(`Error checking subscription for ${activity._id}:`, error);
          newSubscriptionStatus[activity._id] = false; // Default to not subscribed in case of error
        }
      })
    );
  
    setSubscriptionStatus(newSubscriptionStatus);
  };

  useEffect(() => {
    if (activities.length > 0) {
      fetchSubscriptionStatus();
    }
  }, [activities]);
    
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
  
  const checkBookmarkStatus = async (eventName) => {
    const username = localStorage.getItem("username");
    try {
      const response = await axios.get("/api/checkIfInBookmarkedEvents", {
        params: { touristUsername: username, eventName },
      });
      return response.data.inBookmarkedEvents;
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      return false;
    }
  };
  
 
  
  
  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/ViewAllUpcomingActivities");
      const fetchedActivities = response.data;
  
      // Fetch bookmark status for each activity
      const bookmarkStatuses = {};
      for (const activity of fetchedActivities) {
        const isBookmarked = await checkBookmarkStatus(activity.Name);
        bookmarkStatuses[activity._id] = isBookmarked; // Use activity ID to track status
      }
  
      setBookmarkStatuses(bookmarkStatuses); // Update state with bookmark statuses
      setActivities(fetchedActivities); // Set activities state
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    }finally {
      setIsLoading(false); // End loading
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
    </TextField>

    <TextField
  select
  label="Currency"
  value={currency}
  onChange={(e) => setCurrency(e.target.value)}
  variant="outlined"
  sx={{
    width: '210px',
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





      
{/* Main Content Area with Activities */}
<Box sx={styles.activitiesContainer}>
  {isLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress sx={{ color: '#192959' }} /> {/* Circular loader */}
    </Box>
  ) : activities.length > 0 ? (
    activities.map((activity, index) => (
      <Box
        key={index}
        ref={(el) => (refs.current[activity.Name] = el)}
        sx={{ marginBottom: '20px' }}
      >
        <Box
          sx={{
            ...styles.activityCard,
            backgroundColor: activity.flagged ? '#cccfda' : 'white',
          }}
        >
          <Box sx={styles.activityInfo}>
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
              {activity.Name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                fontSize: '18px',
                alignItems: 'center',
              }}
            >
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              {activity.Location?.address || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                fontSize: '18px',
                alignItems: 'center',
              }}
            >
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              {activity.AdvertiserName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                fontSize: '18px',
                alignItems: 'center',
              }}
            >
              <PaymentIcon fontSize="small" sx={{ mr: 1 }} />
              {currency === 'EGP'
                ? `${activity.Price} EGP`
                : `${convertedPrices[activity._id] || 'Loading...'} ${currency}`}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                fontSize: '18px',
                alignItems: 'center',
              }}
            >
              <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
              {new Date(activity.Date).toLocaleDateString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                fontSize: '18px',
                alignItems: 'center',
              }}
            >
              <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
              {activity.Time}
            </Typography>
            <Box sx={styles.quickFacts}>
              <Box
                sx={{
                  ...styles.infoContainer,
                  backgroundColor: activity.flagged ? '#b3b8c8' : '#f3f4f6',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Category:
                </Typography>
                <Typography variant="body2">{activity.Category}</Typography>
              </Box>
              <Box
                sx={{
                  ...styles.infoContainer,
                  backgroundColor: activity.flagged ? '#b3b8c8' : '#f3f4f6',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Tags:
                </Typography>
                <Typography variant="body2">{activity.Tags.join(', ')}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={styles.activityRating}>{renderRating(activity.Rating)}</Box>
          <Box sx={styles.discountContainer}>
            <Box
              sx={{
                ...styles.infoContainer,
                backgroundColor: '#f3f4f6',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Special Discount:
              </Typography>
              <Typography variant="body2">{activity.SpecialDiscount}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Comments Section */}
        <Box sx={styles.commentsSection}>
          {activity.Comments && activity.Comments.length > 0 ? (
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
                onScroll={(e) =>
                  updateScrollPosition(index, e.target.scrollLeft)
                }
              >
                {activity.Comments.map((comment, idx) => (
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
              {activity.Comments.length >= 3 && (
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
    ))
  ) : (
    <Typography
      variant="h6"
      sx={{ textAlign: 'center', color: '#192959', marginTop: '20px' }}
    >
      No Upcoming Activities
    </Typography>
  )}
</Box>


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

export default GuestActivityPage;
