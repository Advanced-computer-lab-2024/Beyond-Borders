import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MuseumIcon from "@mui/icons-material/Museum";
import HistoricalPlaceIcon from "@mui/icons-material/AccountBalance";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ImageIcon from "@mui/icons-material/Image";
import TagIcon from "@mui/icons-material/Label";
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';

const HistoricalPlaceTG = () => {
const [places, setPlaces] = useState([]);
const [errorMessage, setErrorMessage] = useState('');
const [sidebarOpen, setSidebarOpen] = useState(true);
const navigate = useNavigate();
const urlParams = new URLSearchParams(window.location.search);
const [editing, setEditing] = useState({});  // Initialize it as an empty object, or with indices if needed
const [isHistoricalModalOpen, setIsHistoricalModalOpen] = useState(false);
const [tagName, setTagName] = useState('');
const [showTagForm, setShowTagForm] = useState(false);
const [responseMessage, setResponseMessage] = useState('');
const [showPasswordModal, setShowPasswordModal] = useState(false);
const [newPassword, setNewPassword] = useState('');
const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');


  const handleLogout = () => {
    // Retrieve credentials from localStorage
    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
  
    // Redirect to the login page with credentials autofilled
    navigate('/login', { state: { username, password } });
  };
  
  const toggleTagForm = () => {
    setShowTagForm(!showTagForm);
    setResponseMessage('');
    setErrorMessage('');
  };

  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
    setPasswordUpdateMessage('');
    setErrorMessage('');
  };

  const handleTagFormSubmit = async (event) => {
    event.preventDefault();

    const formData = { NameOfHistoricalTags: tagName };

    try {
      const response = await fetch('/createHistoricalTag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage('Historical Tag added successfully!');
        setTagName(''); // Reset the form
      } else {
        setErrorMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };
  const username = localStorage.getItem('username') || 'User'; // Retrieve username from localStorage

  const handlePasswordFormSubmit = async (event) => {
    event.preventDefault();

    const username = localStorage.getItem('username');
    const formData = { Username: username, newPassword };

    try {
      const response = await axios.put('/updateGovernorPassword', formData);

      if (response.status === 200) {
        setPasswordUpdateMessage('Password updated successfully!');
        setNewPassword('');
        togglePasswordModal();
      } else {
        setErrorMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the password.');
    }
  };
const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: '',
    ticketPriceForeigner: '',
    ticketPriceNative: '',
    ticketPriceStudent: '',
    tag: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: '',
    ticketPriceForeigner: '',
    ticketPriceNative: '',
    ticketPriceStudent: '',
    tag: '',
  });

  // Validation function to check the input fields
  const validate = () => {
    let formErrors = {};
    let isValid = true;

    // Check for name
    if (!formData.name) {
      formErrors.name = 'Historical Place name is required';
      isValid = false;
    }

    // Check for description
    if (!formData.description) {
      formErrors.description = 'Description is required';
      isValid = false;
    }

    // Check for location
    if (!formData.location) {
      formErrors.location = 'Location is required';
      isValid = false;
    }

    // Check ticket prices for each field
    if (!formData.ticketPriceForeigner) {
        formErrors.ticketPriceForeigner = 'Price for Foreigner is required';
        isValid = false;
      }
    if (!formData.ticketPriceNative) {
        formErrors.ticketPriceNative = 'Price for Native is required';
        isValid = false;
      }
    if (!formData.ticketPriceStudent) {
        formErrors.ticketPriceStudent = 'Price for Student is required';
        isValid = false;
      }
    // Check for valid tags (comma-separated and no empty values)
    if (formData.tag && formData.tag.split(',').some(tag => tag.trim() === '')) {
      formErrors.tag = 'Tags must be comma-separated and non-empty';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const AuthorUsername = localStorage.getItem('username');
  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = formData.tag.split(',').map(tag => tag.trim());

    const payload = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      openingHours: formData.openingHours,
      ticketPrices: {
        foreigner: formData.ticketPriceForeigner,
        native: formData.ticketPriceNative,
        student: formData.ticketPriceStudent,
      },
      HistoricalTags: tagsArray,
      AuthorUsername,
    };

    try {
      const response = await axios.post('/addHistoricalPlace', payload);

      if (response.status === 201) {
        alert('Historical place created successfully!');
        navigate('/HistoricalPlaceTg');
      } else {
        alert('Error: ${response.data.error}');
      }
    } catch (error) {
        alert(`An error occurred: ${error.response?.data?.error || 'Please try again.'}`);
   } };

   const fetchHistoricalPlacesByAuthor = async () => {
    const AuthorUsername = localStorage.getItem('username');

    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post('/readAllHistoricalPlace', { AuthorUsername });

      if (response.status === 200) {
        if (response.data.length === 0) {
          setErrorMessage('You do not have Historical Places Created.');
          setPlaces([]);
        } else {
          setPlaces(response.data);
          setErrorMessage('');
        }
      } else {
        setErrorMessage('An unexpected response was received from the server.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage('An error occurred while fetching historical places. Please try again.');
    }
  };
  const handleUpdatePlace = async (index) => {
    const updatedPlace = places[index]; // Get the updated museum data
  
    // Log to ensure the data is correct
    console.log("Updated HIstorical Place:", updatedPlace);
  
    try {
      const response = await axios.put('/updateHistoricalPlace', updatedPlace);
      alert(response.data.msg || "Historical Place updated successfully.");
      window.location.href = "/HistoricalPlaceTG"; // Redirect or reload page after update
    } catch (error) {
      console.error("Error updating Historical Place:", error);
      alert(`An error occurred while updating the Historical Place: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  const removeHistoricalPlace = async (placeName) => {
    const AuthorUsername = localStorage.getItem('username');

    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this historical place?')) {
      try {
        const response = await axios.delete('/deleteHistoricalPlace', {
          data: { name: placeName, AuthorUsername },
        });

        alert(response.data.message);
        fetchHistoricalPlacesByAuthor();
      } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred while deleting the historical place. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchHistoricalPlacesByAuthor();
  }, []);
  const handleEditFieldChange = (index, field, value) => {
    setPlaces((prev) => {
      const updatedPlaces = [...prev];
      const place = { ...updatedPlaces[index] };
      
      // Update the specific field in the museum object
      if (field.includes(".")) {
        // For nested fields (like ticketPrices.foreigner), split the field path
        const fieldParts = field.split(".");
        place[fieldParts[0]][fieldParts[1]] = value;
      } else {
        place[field] = value;
      }
      
      updatedPlaces[index] = place; // Replace the old museum data with updated one
      return updatedPlaces;
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
              sx={styles.menuButton}
              onClick={() => setIsHistoricalModalOpen(true)}
            >
              Add New Historical Place
        </Button>
        <Button sx={styles.menuButton} onClick={toggleTagForm}>
              Add New Historical Tag
            </Button>
            <Button sx={styles.menuButton} onClick={togglePasswordModal}>
              Change Password
            </Button>
          <IconButton sx={styles.iconButton}>
            <NotificationsIcon />
          </IconButton>
          <IconButton onClick={() => navigate('/')}sx={styles.iconButton}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
      {/* Add Historical Tag Modal */}
      <Modal open={showTagForm} onClose={toggleTagForm}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6">Add New Historical Tag</Typography>
          <form onSubmit={handleTagFormSubmit}>
            <TextField
              label="Tag Name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              fullWidth
              required
              sx={{ mt: 2, mb: 2 }}
            />
            <Button type="submit" variant="contained" sx={styles.actionButton}>
              Add Tag
            </Button>
          </form>
          {responseMessage && (
            <Typography sx={{ color: 'green', mt: 2 }}>{responseMessage}</Typography>
          )}
          {errorMessage && (
            <Typography sx={{ color: 'red', mt: 2 }}>{errorMessage}</Typography>
          )}
        </Box>
      </Modal>
  
      {/* Change Password Modal */}
      <Modal open={showPasswordModal} onClose={togglePasswordModal}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6">Change Password</Typography>
          <form onSubmit={handlePasswordFormSubmit}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
              sx={{ mt: 2, mb: 2 }}
            />
            <Button type="submit" variant="contained" sx={styles.actionButton}>
              Update Password
            </Button>
          </form>
          {passwordUpdateMessage && (
            <Typography sx={{ color: 'green', mt: 2 }}>{passwordUpdateMessage}</Typography>
          )}
          {errorMessage && (
            <Typography sx={{ color: 'red', mt: 2 }}>{errorMessage}</Typography>
          )}
        </Box>
      </Modal>
      {/* Collapsible Sidebar */}
      <Box
        sx={{
          ...styles.sidebar,
          width: sidebarOpen ? '280px' : '60px',
        }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Button
          sx={styles.sidebarButton}
          onClick={() => (window.location.href = "/MuseumTG")}
        >
          <MuseumIcon sx={styles.icon} />
          {sidebarOpen && "Museums"}
        </Button>
        <Button
          sx={styles.sidebarButton}
          onClick={() => (window.location.href = "/HistoricalPlaceTG")}
        >
          <HistoricalPlaceIcon sx={styles.icon} />
          {sidebarOpen && "Historical Places"}
        </Button>
      </Box>

      {/* Main Content Area with Activities */}
      <Box sx={styles.activitiesContainer}>
  {places.map((place, index) => (
    <Box key={index} sx={{ marginBottom: '40px' }}> {/* Wrapper for each itinerary and comments */}
      
      {/* Itinerary Container */}
      <Box
        sx={{
          ...styles.activityCard,
          backgroundColor: 'white',
        }}
      >
        

        <Box sx={styles.activityContent}>
  {/* Left Side */}
  <Box sx={styles.activityLeft}>
    {editing[index] ? (
      <>
        {/* Editable Name */}
        <TextField
          label="Historical Place Name"
          value={place.name}
          onChange={(e) =>
            handleEditFieldChange(index, 'name', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px' }}
        />
        {/* Editable Location */}
        <TextField
          label="Location"
          value={place.location}
          onChange={(e) =>
            handleEditFieldChange(index, 'location', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px' }}
        />
         {/* Editable Description */}
        <TextField
          label="Description"
          value={place.description}
          onChange={(e) =>
            handleEditFieldChange(index, 'description', e.target.value)
          }
          fullWidth
          multiline
          rows={4}
          sx={{ marginBottom: '10px' }}
        />
        {/* Editable Tags */}
        <TextField
          label="Tags"
          value={place.Tags.join(', ')} // Join tags into a single comma-separated string
          onChange={(e) =>
            handleEditFieldChange(index, 'Tags', e.target.value.split(',').map((tag) => tag.trim())) // Split input into array
          }
          fullWidth
          sx={{ marginBottom: '10px' }}
        />
      </>
    ) : (
      <>
        {/* Display Museum Name */}
        <Typography variant="h6" sx={{ display: 'flex', fontWeight: 'bold', fontSize: '24px', marginBottom: '5px' }}>
          {place.name}
        </Typography>
        {/* Display Location */}
        <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'left' }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
          {place.location || 'N/A'}
        </Typography>
        {/* Display Tags */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Tags:
          </Typography>
          <Box sx={styles.tagContainer}>
            {place.Tags.map((tag, tagIndex) => (
              <Typography
                key={tagIndex}
                sx={{
                  ...styles.tag,
                  backgroundColor: '#cccfda',
                  color: '#192959',
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
  <Box sx={styles.activityRight}>
    {editing[index] ? (
      <>
        {/* Editable Ticket Prices */}
        <TextField
          label="Foreigner Ticket Price"
          value={place.ticketPrices.foreigner}
          onChange={(e) =>
            handleEditFieldChange(index, 'ticketPrices.foreigner', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
        <TextField
          label="Native Ticket Price"
          value={place.ticketPrices.native}
          onChange={(e) =>
            handleEditFieldChange(index, 'ticketPrices.native', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
        <TextField
          label="Student Ticket Price"
          value={place.ticketPrices.student}
          onChange={(e) =>
            handleEditFieldChange(index, 'ticketPrices.student', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
      </>
    ) : (
      <>
        {/* Display Ticket Prices */}
        <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'right' }}>
          <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
          Foreigner  ${place.ticketPrices.foreigner}, Native  $
          {place.ticketPrices.native}, Student  ${place.ticketPrices.student}
        </Typography>
        {/* Display Description */}
        <Typography variant="body2" sx={{ fontSize: '16px' }}>
          <strong>Description:</strong> {place.description || 'No description provided.'}
        </Typography>
        {/* Display Picture Count */}
        <Typography variant="body2" sx={styles.info}>
          <ImageIcon fontSize="small" sx={{ mr: 1 }} />
          Pictures: {place.pictures ? place.pictures.length : 0} available
        </Typography>
      </>
    )}
  </Box>

  {/* Edit/Delete Buttons */}
  <Box sx={styles.museumActions}>
    <IconButton
      onClick={() => {
        if (editing[index]) {
            handleUpdatePlace(index);
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
    <IconButton
      onClick={() => removeHistoricalPlace(place.name)}
      sx={{ ...styles.actionButton, ...styles.deleteButton }}
    >
      <DeleteIcon />
    </IconButton>
  </Box>
</Box>


      
      </Box>

      
    </Box>
  ))}
  
</Box>
<Modal open={isHistoricalModalOpen} onClose={() => setIsHistoricalModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "90%", // Adjusted for smaller screens
      maxWidth: "600px",
      maxHeight: "90vh", // Limit height to viewport height
      overflowY: "auto", // Enable vertical scrolling
      bgcolor: "background.paper",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
      Create New Historical Place
    </Typography>
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="Historical Place Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        rows="4"
        required
        value={formData.description} // Corrected value here
        error={!!errors.description}
        helperText={errors.description}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Opening Hours"
        name="openingHours"
        value={formData.openingHours}
        onChange={handleChange}
        error={!!errors.location}
        helperText={errors.location}
        required
      />
      <Typography variant="h6" align="left" sx={{ marginBottom: "0px" }}>
        Ticket Prices in USD($):
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Foreigner"
        name="ticketPriceForeigner"
        value={formData.ticketPriceForeigner}
        onChange={handleChange}
        error={!!errors.ticketPrice?.foreigner}
        helperText={errors.ticketPrice?.foreigner}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Native"
        name="ticketPriceNative"
        value={formData.ticketPriceNative}
        onChange={handleChange}
        error={!!errors.ticketPrice?.native}
        helperText={errors.ticketPrice?.native}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Student"
        name="ticketPriceStudent"
        value={formData.ticketPriceStudent}
        onChange={handleChange}
        error={!!errors.ticketPrice?.student}
        helperText={errors.ticketPrice?.student}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Tags (comma-separated)"
        name="tag"
        value={formData.tag}
        onChange={handleChange}
        error={!!errors.tag}
        helperText={errors.tag}
        required
      />
      
      {setErrorMessage && (
        <Typography color="error" sx={{ marginBottom: "10px" }}>
          {setErrorMessage}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#192959",
          color: "white",
          padding: "10px",
          borderRadius: "4px",
          width: "100%",
          "&:hover": { backgroundColor: "#4b5a86" },
          marginTop: "20px",
        }}
      >
        Create Historical Place
      </Button>
    </form>
  </Box>
</Modal>
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
    position: 'absolute',
    top: '40px',
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

export default HistoricalPlaceTG;


