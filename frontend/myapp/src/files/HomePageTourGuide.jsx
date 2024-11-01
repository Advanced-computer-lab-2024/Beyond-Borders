import React, { useState } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';

const HomePageTourGuide = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        mobileNum: '',
        yearsOfExperience: '',
        previousWork: ''
    });

    // Open and fetch profile data
    const readMyProfile = async () => {
        const username = localStorage.getItem('username'); // Retrieve username from localStorage
        if (!username) {
            alert('You need to log in first.');
            return;
        }

        try {
            // Make an Axios request to fetch profile data with username as a query parameter
            const response = await axios.get(`/api/TourGuideProfile?username=${encodeURIComponent(username)}`);

            if (response.status === 200) {
                const data = response.data.TourGuide;

                // Update state with the retrieved profile data
                setProfileData({
                    username: data.Username || '',
                    email: data.Email || '',
                    mobileNum: data.MobileNum || '',
                    yearsOfExperience: data.YearsOfExperience || '',
                    previousWork: data.PreviousWork || ''
                });

                // Open modal to show profile information
                setIsModalOpen(true);
            } else {
                alert(response.data.error || 'Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('An error occurred while loading the profile.');
        }
    };

    // Function to close the modal
    const closeModal = () => setIsModalOpen(false);

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
            {/* Title */}
            <Typography variant="h5" component="h1" sx={{ margin: 0 }}>
                Beyond Borders
            </Typography>

            {/* Navigation Links */}
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
                            onClick={() => console.log('Load My Itineraries')}
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
                            onClick={() => console.log('Open Create New Itinerary Modal')}
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

            {/* Profile Button */}
            <Button 
                variant="contained" 
                sx={{ 
                    backgroundColor: '#00c853',   
                    color: 'white',
                    borderRadius: '20px',
                    '&:hover': { backgroundColor: '#69f0ae' }
                }}
                onClick={readMyProfile} // Fetch profile data and open modal
            >
                My Profile
            </Button>

            {/* Modal for Profile */}
            <Modal open={isModalOpen} onClose={closeModal}>
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
                            InputProps={{ readOnly: true }}
                            margin="dense"
                        />
                        <TextField
                            fullWidth
                            label="Mobile Number"
                            id="mobileNum"
                            value={profileData.mobileNum}
                            InputProps={{ readOnly: true }}
                            margin="dense"
                        />
                        <TextField
                            fullWidth
                            label="Years of Experience"
                            id="yearsOfExperience"
                            value={profileData.yearsOfExperience}
                            InputProps={{ readOnly: true }}
                            margin="dense"
                        />
                        <TextField
                            fullWidth
                            label="Previous Work"
                            id="previousWork"
                            type="url"
                            value={profileData.previousWork}
                            InputProps={{ readOnly: true }}
                            margin="dense"
                        />
                        <Button
                            variant="contained"
                            onClick={closeModal}
                            sx={{ mt: 2 }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default HomePageTourGuide;
