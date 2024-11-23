import React, { useState,useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
import AssignmentIcon from "@mui/icons-material/Assignment";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import MapIcon from "@mui/icons-material/Map";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BlockIcon from '@mui/icons-material/Block';
import axios from 'axios';


const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
      backgroundColor: "#e6e7ed",
    },
    topMenu: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#192959",
      color: "#e6e7ed",
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 3,
    },
    logo: {
      fontWeight: "bold",
      color: "#e6e7ed",
    },
    topMenuRight: {
      display: "flex",
      alignItems: "left",
      gap: "30px",
      marginRight:"70px"
    },
    sidebar: {
      backgroundColor: "#4d587e",
      color: "#e6e7ed",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: "60px",
      height: "calc(100vh - 60px)",
      width: "60px",
      transition: "width 0.3s ease",
      overflowX: "hidden",
      padding: "10px",
      zIndex: 2,
    },
    sidebarExpanded: {
      width: "280px",
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
      marginRight: "10px",
      fontSize: "20px",
    },
    content: {
      flex: 1,
      marginLeft: "60px",
      marginTop: "60px",
      padding: "20px",
      transition: "margin-left 0.3s ease",
    },
    infoBox: {
      backgroundColor: "#4d587e",
      color: "#e6e7ed",
      borderRadius: "15px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      cursor: "pointer",
      "&:hover": {
        transform: "scale(1.05)",
      },
    },
    menuButton: {
        color: '#e6e7ed',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#e6e7ed', // Set background color on hover
          color: '#192959',           // Set text color on hover
          marginRight:"110px",
          marginLeft:"30px"
        },
      
      }, 
  };

const HomePageTourGuide = () => {
    const [isItinerariesModalOpen, setIsItinerariesModalOpen] = useState(false);
    const [isDeactivatedItinerariesModalOpen, setIsDeacivatedItinerariesModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [deactivatedItineraries, setDeactivatedItineraries] = useState([]);
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        password: '',
        mobileNum: '',
        yearsOfExperience: '',
        previousWork: ''
    });

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    useEffect(() => {
        const fetchProfileData = async () => {
          const username = localStorage.getItem('username');
          if (!username) return;
      
          try {
            const response = await axios.get(`/api/TourGuideProfile`, {
              params: { username },
            });
            const data = response.data.TourGuide;
      
            setProfileData({
              username: data.Username || '',
              email: data.Email || '',
              password: data.Password || '',
              mobileNum: data.MobileNum || '',
              yearsOfExperience: data.YearsOfExperience || '',
              previousWork: data.PreviousWork || '',
              logo: data.Logo ? `${window.location.origin}${data.Logo}` : '', // Set full logo path
            });
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        };
      
        fetchProfileData();
      }, []);

    // Load itineraries from backend
    const loadMyActivities = async () => {
        const username = localStorage.getItem('username');
        if (!username) {
            alert('You need to log in first.');
            return;
        }

        try {
            const response = await axios.get(`/api/getallItinerarys`, {
                params: { AuthorUsername: username }
            });
            setItineraries(response.data); // Set the itineraries in state
            setIsItinerariesModalOpen(true); // Open the itineraries modal
        } catch (error) {
            console.error('Error fetching activities:', error);
            alert('An error occurred while loading itineraries');
        }
    };

    const loadMyDeactivatedItineraries = async () => {
        const username = localStorage.getItem('username');
        if (!username) {
            alert('You need to log in first.');
            return;
        }

        try {
            const response = await axios.get(`/api/viewMyDeactivatedItinerariesTourGuide`, {
                params: { TourGuide: username }
            });
            setDeactivatedItineraries(response.data); // Set the itineraries in state
            setIsDeacivatedItinerariesModalOpen(true); // Open the itineraries modal
        } catch (error) {
            console.error('Error fetching itineraries:', error);
            alert('An error occurred while loading itineraries');
        }
    };

    // Toggle details visibility for each itinerary
    const toggleDetails = (index) => {
        setItineraries((prevItineraries) =>
            prevItineraries.map((itinerary, i) =>
                i === index ? { ...itinerary, showDetails: !itinerary.showDetails } : itinerary
            )
        );
    };

    // Open and fetch profile data
    const readMyProfile = async () => {
        const username = localStorage.getItem('username');
        if (!username) {
          alert('You need to log in first.');
          return;
        }
      
        try {
          const response = await axios.get(`/api/TourGuideProfile`, {
            params: { username },
          });
          const data = response.data.TourGuide;
      
          setProfileData({
            username: data.Username || '',
            email: data.Email || '',
            password: data.Password || '',
            mobileNum: data.MobileNum || '',
            yearsOfExperience: data.YearsOfExperience || '',
            previousWork: data.PreviousWork || '',
            logo: data.Logo ? `${window.location.origin}${data.Logo}` : '', // Full path to display image
          });
      
          setIsProfileModalOpen(true);
        } catch (error) {
          console.error('Error fetching profile:', error);
          alert('An error occurred while loading the profile.');
        }
      };
      

    const RequestDeleteAccount = async () => {
        try {
          const username = localStorage.getItem('username');
          console.log('Username:', username);
          
          const response = await axios.post('/api/requestDeleteAccountTourGuide', { Username: username });
    
          if (response.status === 200) {
            alert('Account deletion request submitted successfully!');
            
          } else {
            alert('Failed to submit account deletion request.');
            
          }
        } catch (error) {
          console.error('Error requesting account deletion:', error);
          alert('An error occurred while requesting the deletion of your account.');
          
        }
      };

    // Save profile data to the backend
    const saveProfile = async () => {
        const { username, password, email, mobileNum, yearsOfExperience, previousWork, logoFile } = profileData;
      
        try {
          const formData = new FormData();
          formData.append('Username', username);
          formData.append('Password', password || '');
          formData.append('Email', email || '');
          formData.append('MobileNum', mobileNum || '');
          formData.append('YearsOfExperience', yearsOfExperience || '');
          formData.append('PreviousWork', previousWork || '');
      
          if (logoFile) {
            formData.append('Logo', logoFile); // Append the selected file
          }
      
          const response = await axios.put('/api/updateTourGuideProfile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
      
          alert('Profile updated successfully!');
          setIsProfileModalOpen(false);
          readMyProfile(); // Reload the profile to display the updated picture
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Failed to update profile: ' + error.message);
        }
      };
      

    // Delete activity
    const deleteActivity = async (activityName) => {
        const tourguideName = localStorage.getItem('username');

        if (!tourguideName) {
            alert('Tour guide username not found. Please log in again.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete the activity "${activityName}"?`)) {
            try {
                const response = await axios.delete(`/api/deleteItinerary`, {
                    data: { Title: activityName, AuthorUsername: tourguideName }
                });

                alert(response.data.message || 'Itinerary deleted successfully!');
                loadMyActivities(); // Refresh the list of activities
            } catch (error) {
                console.error('Delete error:', error);

                if (error.response?.data?.error === "Cannot delete a booked itinerary.") {
                    alert('This itinerary is booked and cannot be deleted.');
                } else {
                    alert('An error occurred while deleting the itinerary. Please try again.');
                }
            }
        }
    };

    const deactivateItinerary = async (title) => {
        try {
          const response = await axios.post('/api/deactivateItinerary', { title: title });
          if (response.status === 200) {
            alert('Itinerary has been deactivated!');
            loadMyDeactivatedItineraries(); // Refresh product list after archiving
            setIsItinerariesModalOpen(false);
          } else {
            alert('Failed to deactivate itinerary.');
          }
        } catch (error) {
          console.error('Error deactivating itinerary:', error);
          alert(`Failed to deactivate itinerary: ${error.response?.data?.error || error.message}`);
        }
      };

      const activateItinerary = async (title) => {
        try {
          const response = await axios.post('/api/activateItinerary', { title: title });
          if (response.status === 200) {
            alert('Itinerary has been activated!');
            loadMyActivities(); // Refresh product list after archiving
            setIsDeacivatedItinerariesModalOpen(false);
          } else {
            alert('Failed to activate itinerary.');
          }
        } catch (error) {
          console.error('Error activating itinerary:', error);
          alert(`Failed to activate itinerary: ${error.response?.data?.error || error.message}`);
        }
      };

    return (
        <Box style={styles.container}>
      {/* Header */}
      <Box style={styles.topMenu}>
        <Typography variant="h6" style={styles.logo}>
          Beyond Borders
        </Typography>
        <Box style={styles.topMenuRight}>

        <Button
                style={styles.menuButton}
                onClick={RequestDeleteAccount}
                
            >
                Request to delete account
            </Button>
            <Button
  style={styles.menuButton}
  startIcon={
    profileData.logo ? (
      <img
        src={profileData.logo}
        alt="Profile"
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #e6e7ed",
        }}
      />
    ) : (
      <AccountCircleIcon />
    )
  }
  onClick={readMyProfile}
>
  {"My Profile"}
</Button>


            
        </Box>

        
      </Box>

      <Box
  style={{
    ...styles.sidebar,
    ...(sidebarOpen ? styles.sidebarExpanded : {}),
  }}
  onMouseEnter={() => setSidebarOpen(true)}
  onMouseLeave={() => setSidebarOpen(false)}
>
  <Button
    sx={{
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
    }}
    onClick={() => window.location.href = `/CreateItinerary`}
  >
    <AddCircleIcon style={styles.icon} />
    {sidebarOpen && "Create New Itinerary"}
  </Button>

  <Button
    sx={{
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
    }}
    onClick={() => window.location.href = `/Deactivated`}
  >
    <BlockIcon style={styles.icon} />
    {sidebarOpen && "Deactivated Itineraries"}
  </Button>

  <Button
    sx={{
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
    }}
    onClick={() => window.location.href = `/ItinerariesTourGuide`}
  >
    <MapIcon style={styles.icon} />
    {sidebarOpen && "Itineraries"}
  </Button>
</Box>


    <Box
        component="nav"
        sx={{
            display: 'flex', 
            justifyContent: 'flex-end', 
        }}
    >
        <Box 
            component="ul" 
            sx={{ 
                listStyle: 'none', 
                display: 'flex', 
                gap: '25px', 
                margin: 0, 
                padding: 0, 
                justifyContent: 'flex-end'
            }}
        >
            <Box component="li">
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={loadMyActivities}
                    sx={{
                        borderColor: 'white',  
                        color: 'white',        
                        borderRadius: '20px',  
                        '&:hover': { 
                            backgroundColor: '#69f0ae'  
                        }
                    }}
                >
                    My Itineraries
                </Button>
            </Box>

            <Box component="li">
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={loadMyDeactivatedItineraries}
                    sx={{
                        borderColor: 'white',  
                        color: 'white',        
                        borderRadius: '20px',  
                        '&:hover': { 
                            backgroundColor: '#69f0ae'  
                        }
                    }}
                >
                    My Deactivated Itineraries
                </Button>
            </Box>

            <Box component="li">
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => window.location.href = `/CreateItinerary`}
                    sx={{
                        borderColor: 'white',   
                        color: 'white',         
                        borderRadius: '20px',   
                        '&:hover': { 
                            backgroundColor: '#69f0ae'  
                        }
                    }}
                >
                    Create New Itinerary
                </Button>
            </Box>

            {/* Add the Request Account Deletion button here */}
            <Box component="li">
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={RequestDeleteAccount} // Call the function to request account deletion
                    sx={{
                        borderColor: 'white',   
                        color: 'white',         
                        borderRadius: '20px',   
                        '&:hover': { 
                            backgroundColor: '#69f0ae'  
                        }
                    }}
                >
                    Request Account Deletion
                </Button>
            </Box>
        </Box>
    </Box>


            <Modal open={isItinerariesModalOpen} onClose={() => setIsItinerariesModalOpen(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: '80%', maxWidth: '800px',
                    bgcolor: 'background.paper', p: 4, borderRadius: 1,
                    boxShadow: 24, maxHeight: '80vh', overflowY: 'auto'
                }}>
                    <Typography variant="h6" component="h2">My Itineraries</Typography>
                    {itineraries.length > 0 ? (
                        itineraries.map((activity, index) => (
                            <Box
                                key={activity.Title}
                                sx={{
                                    mb: 3,
                                    padding: '20px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '10px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Typography variant="h6" sx={{ display: 'inline' }}>{activity.Title}</Typography>
                                <Button 
                                    onClick={() => deactivateItinerary(activity.Title)} 
                                    sx={{ ml: 1, color: '#00c853' }}
                                >
                                    Deactivate
                                </Button>
                                
                                <Button 
                                    onClick={() => deleteActivity(activity.Title)} 
                                    sx={{ ml: 1, color: '#00c853' }}
                                >
                                    Delete
                                </Button>

                                <Button 
                                    onClick={() => {
                                        const AuthorUsername = localStorage.getItem('username');
                                        if (!AuthorUsername) {
                                            alert('Author username not found. Please log in again.');
                                            return;
                                        }
                                        window.location.href = `/editItinerary?title=${encodeURIComponent(activity.Title)}&author=${encodeURIComponent(AuthorUsername)}`;
                                    }}
                                    sx={{ ml: 1, color: '#00c853' }}
                                >
                                    Update
                                </Button>

                                <Button onClick={() => toggleDetails(index)} sx={{ ml: 1, color: '#00c853' }}>View Details</Button>

                                {activity.showDetails && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2"><strong>Activities:</strong> {activity.Activities}</Typography>
                                        <Typography variant="body2"><strong>Locations:</strong> {activity.Locations}</Typography>
                                        <Typography variant="body2"><strong>Timeline:</strong> {activity.Timeline}</Typography>
                                        <Typography variant="body2"><strong>Language:</strong> {activity.Language}</Typography>
                                        <Typography variant="body2"><strong>Price:</strong> ${activity.Price}</Typography>
                                        <Typography variant="body2"><strong>Date:</strong> {new Date(activity.Date).toLocaleDateString()}</Typography>
                                        <Typography variant="body2"><strong>Accessible:</strong> {activity.accessibility ? 'Yes' : 'No'}</Typography>
                                        <Typography variant="body2"><strong>Pickup Location:</strong> {activity.pickupLocation}</Typography>
                                        <Typography variant="body2"><strong>Dropoff Location:</strong> {activity.dropoffLocation}</Typography>
                                        <Typography variant="body2"><strong>Booked:</strong> {activity.isBooked ? 'Yes' : 'No'}</Typography>
                                        <Typography variant="body2"><strong>Tags:</strong> {activity.Tags.join(', ')}</Typography>
                                        <Typography variant="body2"><strong>Author:</strong> {activity.AuthorUsername}</Typography>
                                    </Box>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1">No Itineraries found.</Typography>
                    )}
                </Box>
            </Modal>

            <Modal open={isDeactivatedItinerariesModalOpen} onClose={() => setIsDeacivatedItinerariesModalOpen(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: '80%', maxWidth: '800px',
                    bgcolor: 'background.paper', p: 4, borderRadius: 1,
                    boxShadow: 24, maxHeight: '80vh', overflowY: 'auto'
                }}>
                    <Typography variant="h6" component="h2">My Deactivated Itineraries</Typography>
                    {deactivatedItineraries.length > 0 ? (
                        deactivatedItineraries.map((activity, index) => (
                            <Box
                                key={activity.Title}
                                sx={{
                                    mb: 3,
                                    padding: '20px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '10px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Typography variant="h6" sx={{ display: 'inline' }}>{activity.Title}</Typography>
                                <Button 
                                    onClick={() => activateItinerary(activity.Title)} 
                                    sx={{ ml: 1, color: '#00c853' }}
                                >
                                    Activate
                                </Button>
                                
                                <Button 
                                    onClick={() => deleteActivity(activity.Title)} 
                                    sx={{ ml: 1, color: '#00c853' }}
                                >
                                    Delete
                                </Button>

                                <Button 
                                    onClick={() => {
                                        const AuthorUsername = localStorage.getItem('username');
                                        if (!AuthorUsername) {
                                            alert('Author username not found. Please log in again.');
                                            return;
                                        }
                                        window.location.href = `/editItinerary?title=${encodeURIComponent(activity.Title)}&author=${encodeURIComponent(AuthorUsername)}`;
                                    }}
                                    sx={{ ml: 1, color: '#00c853' }}
                                >
                                    Update
                                </Button>

                                <Button onClick={() => toggleDetails(index)} sx={{ ml: 1, color: '#00c853' }}>View Details</Button>

                                {activity.showDetails && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2"><strong>Activities:</strong> {activity.Activities}</Typography>
                                        <Typography variant="body2"><strong>Locations:</strong> {activity.Locations}</Typography>
                                        <Typography variant="body2"><strong>Timeline:</strong> {activity.Timeline}</Typography>
                                        <Typography variant="body2"><strong>Language:</strong> {activity.Language}</Typography>
                                        <Typography variant="body2"><strong>Price:</strong> ${activity.Price}</Typography>
                                        <Typography variant="body2"><strong>Date:</strong> {new Date(activity.Date).toLocaleDateString()}</Typography>
                                        <Typography variant="body2"><strong>Accessible:</strong> {activity.accessibility ? 'Yes' : 'No'}</Typography>
                                        <Typography variant="body2"><strong>Pickup Location:</strong> {activity.pickupLocation}</Typography>
                                        <Typography variant="body2"><strong>Dropoff Location:</strong> {activity.dropoffLocation}</Typography>
                                        <Typography variant="body2"><strong>Booked:</strong> {activity.isBooked ? 'Yes' : 'No'}</Typography>
                                        <Typography variant="body2"><strong>Tags:</strong> {activity.Tags.join(', ')}</Typography>
                                        <Typography variant="body2"><strong>Author:</strong> {activity.AuthorUsername}</Typography>
                                    </Box>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1">No Itineraries found.</Typography>
                    )}
                </Box>
            </Modal>

            <Modal open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      p: 4,
      borderRadius: 1,
      boxShadow: 24,
    }}
  >
    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
      My Profile
    </Typography>

    {/* Profile Picture Circle with Edit Icon */}
    <Box
      sx={{
        position: "relative",
        width: "120px",
        height: "120px",
        margin: "0 auto 20px",
      }}
    >
      {profileData.logo ? (
        <img
          src={profileData.logo}
          alt="Profile"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "2px solid #192959",
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: "#e6e7ed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #192959",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Profile Picture
          </Typography>
        </Box>
      )}

      {/* Edit Icon Overlay */}
      <IconButton
  sx={{
    position: "absolute",
    bottom: "5px",
    right: "5px",
    backgroundColor: "#192959",
    color: "#fff",
    padding: "5px", // Adjust the padding to make the button smaller
    fontSize: "14px", // Smaller font size for the icon
    "&:hover": {
      backgroundColor: "#3a4a90",
    },
  }}
  component="label"
>
  <input
    type="file"
    hidden
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setProfileData({ ...profileData, logoFile: file });
      }
    }}
  />
  <Typography
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px", // Reduce font size for the text/icon inside
    }}
  >
    ✎
  </Typography>
</IconButton>
    </Box>

    {/* Form Inputs */}
    <Box component="form">
      <TextField
        fullWidth
        label="Username"
        id="username"
        value={profileData.username}
        InputProps={{ readOnly: true }}
        margin="dense"
      />
      <TextField
        fullWidth
        label="Email Address"
        id="email"
        type="email"
        value={profileData.email}
        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
        margin="dense"
      />
      <TextField
        fullWidth
        label="Password"
        id="password"
        type={showPassword ? "text" : "password"}
        value={profileData.password}
        onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
        margin="dense"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label="Mobile Number"
        id="mobileNum"
        value={profileData.mobileNum}
        onChange={(e) => setProfileData({ ...profileData, mobileNum: e.target.value })}
        margin="dense"
      />
      <TextField
        fullWidth
        label="Years of Experience"
        id="yearsOfExperience"
        value={profileData.yearsOfExperience}
        onChange={(e) => setProfileData({ ...profileData, yearsOfExperience: e.target.value })}
        margin="dense"
      />
      <TextField
        fullWidth
        label="Previous Work"
        id="previousWork"
        value={profileData.previousWork}
        onChange={(e) => setProfileData({ ...profileData, previousWork: e.target.value })}
        margin="dense"
      />

      {/* Save Button */}
      <Button
        variant="outlined"
        onClick={saveProfile}
        sx={{
          mt: 2,
          borderColor: "#192959",
          color: "#192959",
          backgroundColor: "white",
          borderRadius: "20px",
          "&:hover": {
            backgroundColor: "#192959",
            borderColor: "white",
            color: "white",
          },
        }}
      >
        Save Changes
      </Button>
    </Box>
  </Box>
</Modal>


        </Box>
    );
};

export default HomePageTourGuide;
