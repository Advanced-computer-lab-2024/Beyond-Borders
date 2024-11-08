import React, { useState } from 'react';
import { Box, Button, Typography, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const HomePageTourGuide = () => {
    const [isItinerariesModalOpen, setIsItinerariesModalOpen] = useState(false);
    const [isDeactivatedItinerariesModalOpen, setIsDeacivatedItinerariesModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
                params: { username }
            });
            const data = response.data.TourGuide;

            setProfileData({
                username: data.Username || '',
                email: data.Email || '',
                password: data.Password ||'',
                mobileNum: data.MobileNum || '',
                yearsOfExperience: data.YearsOfExperience || '',
                previousWork: data.PreviousWork || ''
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
        const { username, password, email, mobileNum, yearsOfExperience, previousWork } = profileData;

        try {
            const response = await axios.put('/api/updateTourGuideProfile', {
                Username: username,
                Password: password,
                Email: email,
                MobileNum: mobileNum,
                YearsOfExperience: yearsOfExperience,
                PreviousWork: previousWork
            });

            alert('Profile updated successfully!');
            setIsProfileModalOpen(false);
        } catch (error) {
            console.error('Error:', error);
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
        <Box 
    sx={{ 
        backgroundColor: '#00c853', 
        color: 'white', 
        padding: '15px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
    }}
>
    <Typography variant="h5" component="h1" sx={{ margin: 0 }}>
        Beyond Borders
    </Typography>

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

    <Button 
        variant="contained" 
        sx={{ 
            backgroundColor: '#00c853',   
            color: 'white',
            borderRadius: '20px',
            '&:hover': { backgroundColor: '#69f0ae' }
        }}
        onClick={readMyProfile}
    >
                My Profile
            </Button>

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
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 400,
                    bgcolor: 'background.paper', p: 4, borderRadius: 1,
                }}>
                    <Typography variant="h6" component="h2">
                        My Profile
                    </Typography>
                    <Box component="form" sx={{ mt: 2 }}>
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
                                )
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
                            type="url"
                            value={profileData.previousWork}
                            onChange={(e) => setProfileData({ ...profileData, previousWork: e.target.value })}
                            margin="dense"
                        />
                        <Button
                            variant="outlined"
                            onClick={saveProfile}
                            sx={{
                                mt: 2,
                                borderColor: '#00c853',    
                                color: '#00c853',           
                                backgroundColor: 'white',   
                                borderRadius: '20px',       
                                '&:hover': {
                                    backgroundColor: '#e0f2f1', 
                                    borderColor: '#00c853',     
                                    color: '#00c853'            
                                }
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
