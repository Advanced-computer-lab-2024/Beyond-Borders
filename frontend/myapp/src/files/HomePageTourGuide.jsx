import React, { useState } from 'react';
import { Box, Button, Typography, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const HomePageTourGuide = () => {
    const [isItinerariesModalOpen, setIsItinerariesModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [itineraries, setItineraries] = useState([]);
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
            const response = await fetch(`/api/getallItinerarys?AuthorUsername=${encodeURIComponent(username)}`);
            const activities = await response.json();

            if (response.ok) {
                setItineraries(activities); // Set the itineraries in state
                setIsItinerariesModalOpen(true); // Open the itineraries modal
            } else {
                alert(activities.error);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
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
            const response = await axios.get(`/api/TourGuideProfile?username=${encodeURIComponent(username)}`);
            if (response.status === 200) {
                const data = response.data.TourGuide;

                setProfileData({
                    username: data.Username || '',
                    email: data.Email || '',
                    password: '',
                    mobileNum: data.MobileNum || '',
                    yearsOfExperience: data.YearsOfExperience || '',
                    previousWork: data.PreviousWork || ''
                });

                setIsProfileModalOpen(true);
            } else {
                alert(response.data.error || 'Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('An error occurred while loading the profile.');
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

            if (response.status === 200) {
                alert('Profile updated successfully!');
                setIsProfileModalOpen(false);
            } else {
                const errorData = response.data;
                throw new Error(errorData.error || 'Error updating tour guide information');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update profile: ' + error.message);
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
                                <Button onClick={() => console.log(`Delete ${activity.Title}`)} sx={{ ml: 1, color: '#00c853' }}>Delete</Button>
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
