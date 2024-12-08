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
import { FormControlLabel, Switch } from '@mui/material';

const MuseumTG = () => {
  const [museums, setMuseums] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const [editing, setEditing] = useState({});  // Initialize it as an empty object, or with indices if needed
  const [isMuseumModalOpen, setIsMuseumModalOpen] = useState(false);
  const museumName = urlParams.get('name');
  const navigate = useNavigate();
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

  const [museumData, setMuseumData] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: '',
    ticketPrices: {
      foreigner: '',
      native: '',
      student: ''
    },
    historicalTags: '',
    BookingOpen:false,
    dateOfEvent: ''
   
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    location: '',
    ticketPrices: {
      foreigner: '',
      native: '',
      student: ''
    },
    historicalTags: '',
    dateOfEvent: '',
    BookingOpen:''
  });

  const validate = () => {
    let formErrors = {};
    let isValid = true;
  
    // Check for name
    if (!museumData.name) {
      formErrors.name = 'Museum name is required';
      isValid = false;
    }
  
    // Check for description
    if (!museumData.description) {
      formErrors.description = 'Description is required';
      isValid = false;
    }
  
    // Check for location
    if (!museumData.location) {
      formErrors.location = 'Location is required';
      isValid = false;
    }
  
    // Check ticket prices for each field
    for (const key in museumData.ticketPrices) {
      if (!museumData.ticketPrices[key]) {
        formErrors.ticketPrices = formErrors.ticketPrices || {};
        formErrors.ticketPrices[key] = `${key} ticket price is required`;
        isValid = false;
      }
    }
  
    // Check for valid tags (comma-separated and non-empty)
    if (museumData.historicalTags && museumData.historicalTags.split(',').some(tag => tag.trim() === '')) {
      formErrors.historicalTags = 'Tags must be comma-separated and non-empty';
      isValid = false;
    }
  
    // Check for date
    if (!museumData.dateOfEvent) {
      formErrors.dateOfEvent = 'Date of event is required';
      isValid = false;
    }
    if (!museumData.BookingOpen) {
      formErrors.BookingOpen = 'Booking Open is required';
      isValid = false;
    }
    setErrors(formErrors);
    return isValid;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    // Check if the field is a ticket price field
    if (name === 'foreigner' || name === 'native' || name === 'student') {
      setMuseumData((prevData) => ({
        ...prevData,
        ticketPrices: {
          ...prevData.ticketPrices,
          [name]: value // Directly updating the correct ticket price
        }
      }));
    }
    // Handle boolean fields like BookingOpen
    else if (type === 'checkbox') {
      setMuseumData((prevData) => ({
        ...prevData,
        [name]: checked // If it's a checkbox, use the checked value (true/false)
      }));
    }
    // For other fields (general case)
    else {
      setMuseumData((prevData) => ({
        ...prevData,
        [name]: value // Update other fields as usual
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const AuthorUsername = localStorage.getItem("username");
    const historicalTags = museumData.historicalTags.split(',').map(tag => tag.trim());

    const dataToSubmit = {
      ...museumData,
      AuthorUsername,
      HistoricalTags: historicalTags
    };

    try {
      const response = await axios.post('/addMuseum', dataToSubmit);
      alert("Museum created successfully!");
      window.location.href = "/MuseumTG"; // Redirect to museumsTG.html
    } catch (error) {
      alert(`An error occurred: ${error.response?.data?.error || 'Please try again.'}`);

    }
  };
  // Fetch museums
  const fetchMuseumsByAuthor = async () => {
    const AuthorUsername = localStorage.getItem("username");

    if (!AuthorUsername) {
      setErrorMessage("Author username not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post("/readAllMuseums", { AuthorUsername });

      if (response.status === 200) {
        if (response.data.length === 0) {
          setErrorMessage("You do not have any museums created.");
          setMuseums([]);
        } else {
          setMuseums(response.data);
          setErrorMessage("");
        }
      } else {
        setErrorMessage("Unexpected server response.");
      }
    } catch (error) {
      console.error("Error fetching museums:", error);
      setErrorMessage("An error occurred while fetching museums. Please try again.");
    }
  };
 

  const handleUpdateMuseum = async (index) => {
    const updatedMuseum = museums[index]; // Get the updated museum data
  
    // Log to ensure the data is correct
    console.log("Updated Museum:", updatedMuseum);
  
    try {
      const response = await axios.post('/updateMuseumByName', updatedMuseum);
      alert(response.data.msg || "Museum updated successfully.");
      window.location.href = "/MuseumTG"; // Redirect or reload page after update
    } catch (error) {
      console.error("Error updating museum:", error);
      alert(`An error occurred while updating the museum: ${error.response?.data?.error || "Unknown error"}`);
    }
  };
  const toggleEditMode = (index) => {
    setEditing((prevEditing) => ({
      ...prevEditing,
      [index]: !prevEditing[index],
    }));
  };
  
  

  // Delete a museum
  const removeMuseum = async (museumName) => {
    const AuthorUsername = localStorage.getItem("username");

    if (!AuthorUsername) {
      setErrorMessage("Author username not found. Please log in again.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this museum?")) {
      try {
        const response = await axios.post("/deleteMuseumByName", {
          name: museumName,
          AuthorUsername,
        });

        if (response.status === 200) {
          alert(response.data.message);
          fetchMuseumsByAuthor();
        } else {
          alert("Unexpected response while deleting the museum.");
        }
      } catch (error) {
        console.error("Error deleting museum:", error);
        alert("An error occurred while deleting the museum. Please try again.");
      }
    }
  };
  const handleEditFieldChange = (index, field, value) => {
    setMuseums((prevMuseums) => {
      const updatedMuseums = [...prevMuseums];
      const museum = { ...updatedMuseums[index] };
      
      // Update the specific field in the museum object
      if (field.includes(".")) {
        // For nested fields (like ticketPrices.foreigner), split the field path
        const fieldParts = field.split(".");
        museum[fieldParts[0]][fieldParts[1]] = value;
      } else {
        museum[field] = value;
      }
      
      updatedMuseums[index] = museum; // Replace the old museum data with updated one
      return updatedMuseums;
    });
  };

  // Fetch museums on component mount
  useEffect(() => {
    fetchMuseumsByAuthor();
  }, []);

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
              onClick={() => setIsMuseumModalOpen(true)}
            >
              Add New Museum
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
  {museums.map((museum, index) => (
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
          label="Museum Name"
          value={museum.name}
          onChange={(e) =>
            handleEditFieldChange(index, 'name', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px' }}
        />
        {/* Editable Location */}
        <TextField
          label="Location"
          value={museum.location}
          onChange={(e) =>
            handleEditFieldChange(index, 'location', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px' }}
        />
        {/* Editable Description */}
        <TextField
          label="Description"
          value={museum.description}
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
          value={museum.HistoricalTags.join(', ')} // Join tags into a single comma-separated string
          onChange={(e) =>
            handleEditFieldChange(index, 'HistoricalTags', e.target.value.split(',').map((tag) => tag.trim())) // Split input into array
          }
          fullWidth
          sx={{ marginBottom: '10px' }}
        />
      </>
    ) : (
      <>
        {/* Display Museum Name */}
        <Typography variant="h6" sx={{ display: 'flex', fontWeight: 'bold', fontSize: '24px', marginBottom: '5px' }}>
          {museum.name}
        </Typography>
        {/* Display Location */}
        <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'left' }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
          {museum.location || 'N/A'}
        </Typography>
        {/* Display Tags */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Tags:
          </Typography>
          <Box sx={styles.tagContainer}>
            {museum.HistoricalTags.map((tag, tagIndex) => (
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
          value={museum.ticketPrices.foreigner}
          onChange={(e) =>
            handleEditFieldChange(index, 'ticketPrices.foreigner', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
        <TextField
          label="Native Ticket Price"
          value={museum.ticketPrices.native}
          onChange={(e) =>
            handleEditFieldChange(index, 'ticketPrices.native', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
        <TextField
          label="Student Ticket Price"
          value={museum.ticketPrices.student}
          onChange={(e) =>
            handleEditFieldChange(index, 'ticketPrices.student', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
        />
                <Box sx={styles.bookingOpenContainer}>
       <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Booking Open:</Typography>
    {editing[index] ? (
      <select
        value={museum.BookingOpen ? 'true' : 'false'}
        onChange={(e) =>
          handleEditFieldChange(index, "BookingOpen", e.target.value === "true")
        }
        style={{ padding: "4px", fontSize: "14px" }}
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    ) : (
      <>{museum.BookingOpen ? "Yes" : "No"}</>
    )}
  </Typography>
</Box>
       
      

             
        {/* Editable Event Date */}
        <TextField
          label="Event Date"
          type="date"
          value={new Date(museum.dateOfEvent).toISOString().split('T')[0]}
          onChange={(e) =>
            handleEditFieldChange(index, 'dateOfEvent', e.target.value)
          }
          fullWidth
          sx={{ marginBottom: '10px', maxWidth: '400px' }}
          InputLabelProps={{ shrink: true }}
        />
      </>
    ) : (
      <>
        {/* Display Ticket Prices */}
        <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'right' }}>
          <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
          Foreigner  ${museum.ticketPrices.foreigner}, Native  $
          {museum.ticketPrices.native}, Student  ${museum.ticketPrices.student}
        </Typography>
        <Box sx={styles.bookingOpenContainer}>
       <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'center' }}>
    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Booking Open:</Typography>
    {editing[index] ? (
      <select
        value={museum.BookingOpen ? 'true' : 'false'}
        onChange={(e) =>
          handleEditFieldChange(index, "BookingOpen", e.target.value === "true")
        }
        style={{ padding: "4px", fontSize: "14px" }}
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    ) : (
      <>{museum.BookingOpen ? "Yes" : "No"}</>
    )}
  </Typography>
</Box>

{/* <IconButton
  onClick={() => {
    if (editing[index]) {
      handleUpdateMuseum(index); // Save changes
    }
    toggleEditMode(index); // Toggle editing state
  }}
>
  {editing[index] ? <SaveIcon /> : <EditIcon />}
</IconButton> */}



        
        {/* Display Event Date */}
        <Typography variant="body2" sx={{ display: 'flex', fontSize: '18px', alignItems: 'right' }}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
          {new Date(museum.dateOfEvent).toLocaleDateString()}
        </Typography>
        {/* Display Description */}
        <Typography variant="body2" sx={{ fontSize: '16px' }}>
          <strong>Description:</strong> {museum.description || 'No description provided.'}
        </Typography>
        {/* Display Picture Count */}
        <Typography variant="body2" sx={styles.info}>
          <ImageIcon fontSize="small" sx={{ mr: 1 }} />
          Pictures: {museum.pictures ? museum.pictures.length : 0} available
        </Typography>
      </>
    )}
  </Box>

  {/* Edit/Delete Buttons */}
  <Box sx={styles.museumActions}>
    <IconButton
      onClick={() => {
        if (editing[index]) {
          handleUpdateMuseum(index);
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
      onClick={() => removeMuseum(museum.name)}
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
<Modal open={isMuseumModalOpen} onClose={() => setIsMuseumModalOpen(false)}>
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
      Create New Museum
    </Typography>
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="Museum Name"
        name="name"
        value={museumData.name}
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
        value={museumData.description} // Corrected value here
        error={!!errors.description}
        helperText={errors.description}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Location"
        name="location"
        value={museumData.location}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Opening Hours"
        name="openingHours"
        value={museumData.openingHours}
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
  name="foreigner"
  value={museumData.ticketPrices.foreigner}
  onChange={handleChange}
  error={!!errors.ticketPrices?.foreigner}
  helperText={errors.ticketPrices?.foreigner}
  required
/>
<TextField
  fullWidth
  margin="normal"
  label="Native"
  name="native"
  value={museumData.ticketPrices.native}
  onChange={handleChange}
  error={!!errors.ticketPrices?.native}
  helperText={errors.ticketPrices?.native}
  required
/>
<TextField
  fullWidth
  margin="normal"
  label="Student"
  name="student"
  value={museumData.ticketPrices.student}
  onChange={handleChange}
  error={!!errors.ticketPrices?.student}
  helperText={errors.ticketPrices?.student}
  required
/>

      <TextField
      fullWidth
      margin="normal"
      label="Historical Tags (comma-separated)"
      name="historicalTags"
      value={museumData.historicalTags}
      onChange={handleChange}
      error={!!errors.historicalTags}  // Check for historicalTags error
      helperText={errors.historicalTags}  // Show error message for historicalTags
      required
      />
        <FormControlLabel
        control={
          <Switch
            name="BookingOpen"
            checked={museumData.BookingOpen}  // Ensure it's properly bound to the state
            onChange={(e) => handleChange(e)} // Handle the change to update state
          />
        }
        label="Booking Open"
      />

      <TextField
        fullWidth
        margin="normal"
        name="dateOfEvent"
        type="date"
        value={museumData.dateOfEvent}
        onChange={handleChange}
        error={!!errors.dateOfEvent}
        helperText={errors.dateOfEvent}
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
        Create Museum
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

export default MuseumTG;


