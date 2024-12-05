import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Modal, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, MenuItem} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import PriorityHighIcon from '@mui/icons-material/PriorityHigh'; // Icon for generic user type
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import PersonIcon from '@mui/icons-material/Person'; // Icon for generic user type
import axios from 'axios';

////////////////// SALES PAGE   
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);
//////////////////

function YAdvertiserSalesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showManageAccessDropdown, setShowManageAccessDropdown] = useState(false);
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [addTourismGovModal, setAddTourismGovModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [govUsername, setGovUsername] = useState('');
  const [govPassword, setGovPassword] = useState('');
  const [confirmGovPassword, setConfirmGovPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  //const [errorMessage, setErrorMessage] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showConfirmAdminPassword, setShowConfirmAdminPassword] = useState(false);
  const [showGovPassword, setShowGovPassword] = useState(false);
  //const [showGovPassword, setShowGovPassword] = useState(false);
  const [showConfirmGovPassword, setShowConfirmGovPassword] = useState(false); // Add this line

  const [deleteRequests, setDeleteRequests] = useState([]);
  const [deleteRequestsModal, setDeleteRequestsModal] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null); // For confirmation dialog

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [isNotificationsSidebarOpen, setNotificationsSidebarOpen] = useState(false);
  const [allNotificationsRead, setAllNotificationsRead] = useState(true);

  //////////// SALES PAGE
  const [highestRevenueItinerary, setHighestRevenueItinerary] = useState(null);
  const [highestRevenue, setHighestRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [totalTourists, setTotalTourists] = useState(0);
  const [itinerariesData, setItinerariesData] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  ////////////


  //MY PROFILE
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    password: '',
    Hotline: '',
    CompanyProfile: '',
    Website: '',
    logo: '', // URL for displaying the uploaded logo
    logoFile: null, // File to be uploaded
  });
  const [isEditable, setIsEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const username = localStorage.getItem('username') || 'User'; // Retrieve username from localStorage

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const navigate = useNavigate();

  ///////////////// SALES PAGE 
  const handleItineraryClick = (itinerary) => {
    setSelectedItinerary(itinerary);
  };
  
  const fetchTotalTourists = async () => {
    const username = localStorage.getItem("username");
    if (!username) return;
  
    try {
      const response = await axios.get("/api/getTotalTouristsForAdvertiser", {
        params: { username },
      });
  
      const finalCount = response.data.totalTourists || 0;
  
      // Start the animation from 0
      let currentCount = 0;
      setTotalTourists(0); // Explicitly set state to 0 initially
  
      // Increment by 1 every 50ms until we reach the final count
      const interval = setInterval(() => {
        currentCount += 1;
        setTotalTourists(currentCount);
  
        if (currentCount >= finalCount) {
          clearInterval(interval); // Stop the interval when the target is reached
        }
      }, 500); // Adjust speed as needed (50ms for smooth animation)
    } catch (error) {
      console.error("Error fetching total tourists:", error);
    }
  };

  useEffect(() => {
    console.log("Component mounted");
    fetchItinerariesWithDetails();
  }, []);
  
  const fetchItinerariesWithDetails = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('You need to log in first.');
      return;
    }
    try {
      const response = await axios.get(`/api/readAllActivities`, { params: { AuthorUsername: username } });
      console.log("API Response:", response.data);
      const itineraries = response.data;
      console.log("Itineraries fetched:", itineraries);
  
      const detailedItineraries = await Promise.all(
        itineraries.map(async (itinerary) => {
          const title = itinerary.Name;
          console.log(title);
          console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

          const [bookingsResponse, revenueResponse, monthRevenueResponse] = await Promise.all([
            axios.get('/api/getUsersWhoBookedActivity', { params: { username, name: title } }),
            axios.get('/api/getRevenueFromActivity', { params: { username, name: title } }),
            axios.get('/api/getTouristsByActivityAndMonth', { params: { activityName: title, month: new Date().getMonth() + 1 } })
          ]);

          //console.log(bookingsResponse);

          return {
            title,
            totalTourists: bookingsResponse.data.numberOfUsersBooked,
            totalRevenue: revenueResponse.data.totalRevenue,
            currentMonthRevenue: monthRevenueResponse.data.totalTourists * itinerary.Price,
          };
        })
      );
      console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
      console.log("Detailed Itineraries:", detailedItineraries);
      setItinerariesData(detailedItineraries);
    } catch (error) {
      console.error('Error fetching itinerary details:', error);
    }
  };
  
  const applyFilter = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('You need to log in first.');
      return;
    }
  
    try {
      // Step 1: Fetch filtered itineraries
      const response = await axios.get('/api/filterAdvertiserActivities', {
        params: {
          username,
          date: filterDate || undefined, // Pass date if selected
          month: filterMonth || undefined, // Pass month if selected
        },
      });
  
      const filteredItineraries = response.data;
      console.log("Filtered Itineraries:", filteredItineraries);
  
      // Step 2: Fetch additional details for each itinerary
      const detailedItineraries = await Promise.all(
        filteredItineraries.map(async (itinerary) => {
          const title = itinerary.Title;
          console.log("Fetching details for itinerary:", title);
  
          const [bookingsResponse, revenueResponse, monthRevenueResponse] = await Promise.all([
            axios.get('/api/getUsersWhoBookedActivity', { params: { username, title } }),
            axios.get('/api/getRevenueFromActivity', { params: { username, title } }),
            axios.get('/api/getAdvertisersByActivityAndMonth', {
              params: { itineraryTitle: title, month: filterMonth || new Date().getMonth() + 1 },
            }),
          ]);
  
          return {
            title,
            totalTourists: bookingsResponse.data.numberOfUsersBooked,
            totalRevenue: revenueResponse.data.totalRevenue,
            currentMonthRevenue: monthRevenueResponse.data.totalTourists * itinerary.Price,
          };
        })
      );
  
      console.log("Detailed Itineraries with Filter:", detailedItineraries);
  
      // Step 3: Update the state with the detailed data
      setItinerariesData(detailedItineraries);
      setIsFilterModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error filtering and fetching itinerary details:', error);
      alert('Failed to filter itineraries. Please try again.');
    }
  };
  

  
  //////////////////////////

  useEffect(() => {
    const fetchProfileData = async () => {
      const username = localStorage.getItem('username');
      if (!username) return;
  
      try {
        const response = await axios.get(`/api/AdvertiserProfile`, {
          params: { username },
        });
        const data = response.data.Advertiser;
  
        setProfileData({
            username: data.Username || '',
            email: data.Email || '',
            password: data.Password || '',
            CompanyProfile: data.CompanyProfile || '',
            Hotline: data.Hotline || '',
            Website: data.Website || '',
            logo: data.Logo ? `${window.location.origin}${data.Logo}` : '', // Full path to display image
          });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    /////////// SALES PAGE
    const fetchHighestRevenueItinerary = async () => {
        const username = localStorage.getItem('username');
        if (!username) return;
  
        try {
          const response = await axios.get('/api/getHighestRevenueActivity', {
            params: { username },
          });
  
          if (response.data) {
            setHighestRevenueItinerary(response.data.highestRevenueActivity);
            setHighestRevenue(response.data.revenue);
          }
        } catch (error) {
          console.error('Error fetching highest revenue itinerary:', error);
        }
      };
      const fetchRevenueData = async () => {
        const username = localStorage.getItem('username');
        if (!username) return;
    
        try {
          // Fetch total revenue
          const totalRevenueResponse = await axios.get('/api/calculateAdvertiserRevenue', {
            params: { username },
          });
          setTotalRevenue(totalRevenueResponse.data.totalRevenue);
    
          // Fetch current month revenue
          const currentMonthRevenueResponse = await axios.get('/api/calculateCurrentMonthRevenueForAdvertiser', {
            params: { username },
          });
          setCurrentMonthRevenue(currentMonthRevenueResponse.data.totalRevenue);
        } catch (error) {
          console.error('Error fetching revenue data:', error);
        }
      };
    ///////////////////////
  
    fetchProfileData();
    checkNotificationsStatus();
    /////////// SALES PAGE
    fetchHighestRevenueItinerary();
    fetchRevenueData();
    fetchTotalTourists();
    fetchItinerariesWithDetails();
    ///////////////////////


  }, []);

  ////////////// SALES PAGE
  function PieChart({ data }) {
    const chartData = {
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: data.map((d) => d.value),
          backgroundColor: ['#FFD700', '#C0C0C0'],
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Disable the legend
          },
          tooltip: {
            enabled: true, // Keep the tooltips enabled
          },
        },
      };
    
      return <Pie data={chartData} options={options} />;
  }
  
  /////////////////////////

  // Open and fetch profile data
  const readMyProfile = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('You need to log in first.');
      return;
    }
  
    try {
      const response = await axios.get(`/api/AdvertiserProfile`, {
        params: { username },
      });
      const data = response.data.Advertiser;
  
        setProfileData({
        username: data.Username || '',
        email: data.Email || '',
        password: data.Password || '',
        CompanyProfile: data.CompanyProfile || '',
        Hotline: data.Hotline || '',
        Website: data.Website || '',
        logo: data.Logo ? `${window.location.origin}${data.Logo}` : '', // Full path to display image
      });
  
      setIsProfileModalOpen(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('An error occurred while loading the profile.');
    }
  };

  const fetchNotifications = async () => {
    const username = localStorage.getItem('username');
    if (!username) return;
  
    try {
      const response = await axios.get(`/api/getAdvertiserNotifications`, {
        params: { username },
      });
      setNotifications(response.data.notifications); // Assuming backend sends an array of notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleNotificationsSidebar = () => {
    setNotificationsSidebarOpen((prev) => !prev);
    if (!isNotificationsSidebarOpen) {
      fetchNotifications(); // Fetch notifications when opening
      checkNotificationsStatus(); // Update notification icon status
    }
  };
  

  const checkNotificationsStatus = async () => {
    const username = localStorage.getItem('username');
    if (!username) return;
  
    try {
      const response = await axios.get('/api/areAllNotificationsRead', {
        params: { username },
      });
  
      setAllNotificationsRead(response.data.allRead);
    } catch (error) {
      console.error('Error checking notification status:', error);
    }
  };

  const markAllAsRead = async () => {
    const username = localStorage.getItem('username'); // Get the username from localStorage
    if (!username) {
      alert('You need to log in first.');
      return;
    }
  
    try {
      const response = await axios.put('/api/allNotificationsRead', { username });
      if (response.status === 200) {
        alert('All notifications marked as read.');
        checkNotificationsStatus(); // Update notification icon status
      } else {
        alert('Failed to mark notifications as read.');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      alert('An error occurred while marking notifications as read.');
    }
  };
  

  // Save profile data
//   const saveProfile = async () => {
//     try {
//       const response = await axios.put(`/api/updateAdvertiserProfile`, profileData);
//       if (response.status === 200) {
//         alert('Profile updated successfully!');
//         setIsEditable(false);
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Failed to update profile.');
//     }
//   };

// Save profile data to the backend
const saveProfile = async () => {
    const { username, email, password, Hotline, CompanyProfile, Website, logoFile } = profileData;
  
    try {
      const formData = new FormData();
      formData.append('Username', username);
      formData.append('Password', password || '');
      formData.append('Email', email || '');
      formData.append('Hotline', Hotline || '');
      formData.append('CompanyProfile', CompanyProfile || '');
      formData.append('Website', Website || '');
  
      if (logoFile) {
        formData.append('Logo', logoFile); // Append the selected file
      }
  
      const response = await axios.put('/api/updateAdvertiserProfile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      alert('Profile updated successfully!');
        //setIsProfileModalOpen(false);
        readMyProfile(); // Reload the profile to display the updated picture
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile: ' + error.message);
      }
    };
  


  const fetchCurrentPassword = async () => {
    const username = localStorage.getItem('username');
    try {
      const response = await axios.get('/api/getAdminPassword', { params: { username } });
      setCurrentPassword(response.data);
    } catch (error) {
      console.error('Error fetching current password:', error);
      setErrorMessage('Error fetching current password');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    const username = localStorage.getItem('username');
    try {
      const response = await axios.put('/updateAdminPassword', { Username: username, newPassword });
      if (response.status === 200) {
        alert('Password updated successfully!');
        setChangePasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage('Failed to update password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage('Failed to update password.');
    }
  };

  const handleManageAccessHover = () => {
    setShowManageAccessDropdown(true);
  };

  const handleManageAccessLeave = () => {
    setShowManageAccessDropdown(false);
  };

  const handleAddAdmin = async () => {
    if (!adminUsername) {
      setErrorMessage("Please enter a username to continue.");
      return;
    }
    if (!adminPassword) {
      setErrorMessage("Please enter a password to continue.");
      return;
    }
    if (!confirmAdminPassword) {
      setErrorMessage("Please confirm the password to continue.");
      return;
    }
    if (adminPassword !== confirmAdminPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('/addAdmin', {
        Username: adminUsername,
        Password: adminPassword,
      });
      if (response.status === 200) {
        alert('Admin added successfully!');
        setAddAdminModal(false);
        setAdminUsername('');
        setAdminPassword('');
        setConfirmAdminPassword('');
        resetAddAdminModal();
      } else {
        setErrorMessage('Failed to add admin.');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      setErrorMessage('Failed to add admin.');
    }
  };

  const handleAddTourismGov = async () => {
    if (!govPassword) {
      setErrorMessage("Please enter a username to continue.");
      return;
    }
    if (!confirmGovPassword) {
      setErrorMessage("Please enter a password to continue.");
      return;
    }
    if (!confirmGovPassword) {
      setErrorMessage("Please confirm the password to continue.");
      return;
    }
    if (govPassword !== confirmGovPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }


    try {
      const response = await axios.post('/addTourismGovernor', {
        Username: govUsername,
        Password: govPassword,
      });
      if (response.status === 200) {
        alert('Tourism Governor added successfully!');
        setAddTourismGovModal(false);
        setGovUsername('');
        setGovPassword('');
        setConfirmGovPassword('');
        resetAddTourismGovModal();
      } else {
        setResponseMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setResponseMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  // Reset function for Add Admin Modal
  const resetAddAdminModal = () => {
    setAdminUsername('');
    setAdminPassword('');
    setConfirmAdminPassword('');
    setShowAdminPassword(false);
    setShowConfirmAdminPassword(false);
    setErrorMessage('');
  };

  // Reset function for Add Tourism Governor Modal
  const resetAddTourismGovModal = () => {
    setGovUsername('');
    setGovPassword('');
    setConfirmGovPassword('');
    setShowGovPassword(false);
    setShowConfirmGovPassword(false);
    setErrorMessage('');
  };

  // Function to fetch delete requests
const fetchDeleteRequests = async () => {
  try {
    const response = await axios.get('/api/readAllDeleteRequests');
    setDeleteRequests(response.data);
  } catch (error) {
    console.error("Error fetching delete requests:", error);
  }
};

// Open Delete Requests Modal and fetch data
const openDeleteRequestsModal = () => {
  setDeleteRequestsModal(true);
  fetchDeleteRequests();
};

// Confirm delete dialog
const handleConfirmDeleteRequest = (request) => {
  setRequestToDelete(request);
  setConfirmDeleteDialog(true); // Open the confirmation dialog
};

// Final confirmation to delete request
const confirmDeleteRequest = async () => {
  try {
    await axios.post('/deleteAccount', { username: requestToDelete.Username });
    setDeleteRequests((prev) =>
      prev.filter((req) => req.Username !== requestToDelete.Username) // Corrected state update
    );
    setRequestToDelete(null);
    fetchDeleteRequests();
  } catch (error) {
    console.error("Error deleting request:", error);
  }
};

// Reject request function
const handleRejectRequest = async (username) => {
  try {
    await axios.post('/api/rejectRequestDeleteAccout', { Username: username }); // Consistent property name
    setDeleteRequests((prev) =>
      prev.filter((req) => req.Username !== username) // Corrected state update
    );
    setRequestToDelete(null);
    fetchDeleteRequests();
  } catch (error) {
    console.error("Error rejecting request:", error);
  }
};

// Close Delete Requests Modal and reset state
const closeDeleteRequestsModal = () => {
  setDeleteRequestsModal(false);
  setRequestToDelete(null);
};

const handleAccountDeletion = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('No username found in local storage.');
      return;
    }
    try {
      const response = await axios.post('/api/requestDeleteAccountTourGuide', {Username: username });
      if (response.status === 200) {
        alert('Your request for account deletion has been submitted successfully.');
        //navigate('/'); // Redirect after deletion, if required
      } else {
        alert('Failed to submit deletion request.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while submitting your deletion request.');
    }
  };
  

  return (
    <Box sx={styles.container}>
      {sidebarOpen && <Box sx={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {isNotificationsSidebarOpen && (
  <>
    <Box
  sx={{
    position: 'fixed',
    top: '66px',
    right: 0,
    width: '350px',
    height: 'calc(100% - 60px)',
    backgroundColor: '#cccfda',
    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto', // Enable vertical scrolling
    scrollbarWidth: 'thin', // Firefox scrollbar styling
    '&::-webkit-scrollbar': {
      width: '8px', // Scrollbar width
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#e6e7ed', // Scrollbar track color
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#192959', // Scrollbar thumb color
      borderRadius: '4px', // Rounded edges
    },
  }}
>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    }}
  >
    <Typography variant="h6" textAlign="left" sx={{ color: '#192959' }}>
      Notifications
    </Typography>
    <Button
      variant="outlined"
      size="small"
      sx={{
        color: '#192959',
        borderColor: '#192959',
        '&:hover': {
          backgroundColor: '#192959',
          color: '#ffffff',
        },
      }}
      startIcon={<DoneAllIcon />} // Adds the DoneAllIcon to the left of the text
      onClick={async () => {
        await markAllAsRead();
        fetchNotifications(); // Refresh notifications after marking all as read
      }}
    >
      Mark all as read
    </Button>
  </Box>
  {notifications.length > 0 ? (
    notifications.map((notification, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: notification.Read ? '#f0f0f0' : '#ffbaba',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body1" textAlign="left" sx={{ color: '#192959' }}>
          {notification.NotificationText}
        </Typography>
        {!notification.Read && <PriorityHighIcon sx={{ color: 'red' }} />}
      </Box>
    ))
  ) : (
    <Typography variant="body1" textAlign="left" sx={{ color: '#192959' }}>No notifications</Typography>
  )}
</Box>

    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 5,
      }}
      onClick={toggleNotificationsSidebar}
    />
  </>
)}

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
          {/* <Button onClick={readMyProfile} sx={styles.menuButton}>
            My Profile
          </Button> */}
          <Button
  sx={{
    ...styles.menuButton,
    '&:hover': {
      backgroundColor: '#e6e7ed', // Lighter hover background
      color: '#192959',           // Text color on hover
    },
  }}
  startIcon={
    profileData.logo ? (
      <img
        src={profileData.logo}
        alt="Profile"
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #e6e7ed',
        }}
      />
    ) : (
      <AccountCircleIcon />
    )
  }
  onClick={readMyProfile}
>
  My Profile
</Button>
          {/* <Button onClick={() => setChangePasswordModal(true)} sx={styles.menuButton}>
            Request Account Deletion
          </Button> */}
          {/* <Box
            onMouseEnter={() => setShowManageAccessDropdown(true)}
            onMouseLeave={() => setShowManageAccessDropdown(false)}
            sx={styles.manageAccessContainer}
          >
            <Button sx={styles.menuButton}>Manage Access</Button>
            {showManageAccessDropdown && (
              <Box sx={styles.dropdown}>
                <Button onClick={() => setAddAdminModal(true)} sx={styles.dropdownItem}>Add Admin</Button>
                <Button onClick={() => setAddTourismGovModal(true)} sx={styles.dropdownItem}>Add Tourism Governor</Button>
                <Button onClick={() => navigate('/requests')} sx={styles.dropdownItem}>Requests</Button>
                <Button onClick={() => setDeleteRequestsModal(true)} sx={styles.dropdownItem}>
                  Delete Requests
                </Button>

              </Box>
            )}
          </Box> */}
          <IconButton
            onClick={toggleNotificationsSidebar}
            sx={styles.iconButton}
          >
            {allNotificationsRead ? (
              <NotificationsIcon />
            ) : (
              <NotificationImportantIcon sx={{ color: 'red' }} />
            )}
          </IconButton>
          <IconButton onClick={() => navigate('/')}sx={styles.iconButton}>
            <LogoutIcon />
          </IconButton>
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
        {/* <Button onClick={() => navigate('/products')} sx={styles.sidebarButton}>
          <StorefrontIcon sx={styles.icon} />
          {sidebarOpen && 'Products'}
        </Button> */}
        <Button onClick={() => navigate('/ItinerariesTourGuide')} sx={styles.sidebarButton}>
          <MapIcon sx={styles.icon} />
          {sidebarOpen && ' My Itineraries'}
        </Button>
        <Button onClick={() => navigate('/YAdvertiserSalesPage')} sx={styles.sidebarButton}>
          <AssignmentIcon sx={styles.icon} />
          {sidebarOpen && 'Sales Reports'}
        </Button>
        {/* <Button onClick={() => navigate('/YAdminItinerariesPage')} sx={styles.sidebarButton}>
          <MapIcon sx={styles.icon} />
          {sidebarOpen && 'Itineraries'}
        </Button> */}
        {/* <Button onClick={() => navigate('/YAdminDashboard')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button> */}
      </Box>

      {/* Main Content Area with 2 Rows */}
        <Box sx={{ ...styles.mainContent, filter: sidebarOpen ? 'brightness(0.5)' : 'none' }}>
        {/* Top Row: Three Columns */}
        <Box sx={styles.row}>
            {/* Welcome Message: Top-Left Column */}
            <Box sx={styles.box}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#192959', textAlign: 'left' }}>
                Welcome back, {username}!
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '18px', lineHeight: '1.8', color: '#192959', textAlign: 'left' }}>
                Thank you for choosing Beyond Borders. Use your dashboard to track your itineraries,
                explore new opportunities, and stay connected with the vibrant tourism ecosystem.
                Let's create unforgettable experiences together!
            </Typography>
            </Box>

            {/* Second Column: Highest Revenue Container */}
            <Box sx={styles.revenueContainer}>
                <Typography
                    variant="h5"
                    sx={{
                    fontWeight: 'bold',
                    color: '#192959',
                    textAlign: 'center',
                    mb: 2,
                    }}
                >
                    Your top revenue-generating activity in {new Date().toLocaleString('default', { month: 'long' })} is...
                </Typography>
                <EmojiEventsIcon
                    sx={{
                    fontSize: 60,
                    color: '#FFD700',
                    display: 'block',
                    margin: '0 auto',
                    }}
                />
                {highestRevenueItinerary ? (
                    <Typography
                    variant="h6"
                    sx={{
                        mt: 2,
                        color: '#33416b',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                    >
                    "{highestRevenueItinerary}" generating a total revenue of ${highestRevenue.toLocaleString()}
                    </Typography>
                ) : (
                    <Typography
                    variant="body1"
                    sx={{
                        mt: 2,
                        color: '#555',
                        textAlign: 'center',
                    }}
                    >
                    No activities found for this month.
                    </Typography>
                )}
                </Box>

                            

                <Box sx={styles.revenueContainer}>
                    <Typography
                        variant="h5"
                        sx={{
                        fontWeight: 'bold',
                        color: '#192959',
                        textAlign: 'center',
                        paddingBottom: "20px",
                        mb: 2,
                        }}
                    >
                        Total Revenue: ${totalRevenue.toLocaleString()}
                    </Typography>
                    <Box
                        sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        }}
                    >
                        {/* Pie Chart */}
                        <Box sx={{ width: '100px', height: '100px', marginRight: '20px' }}>
                        <PieChart
                            data={[
                            {
                                id: 'Current Month Revenue',
                                label: `${new Date().toLocaleString('default', { month: 'long' })}`,
                                value: currentMonthRevenue,
                            },
                            {
                                id: 'Remaining Revenue',
                                label: 'Other Months',
                                value: totalRevenue - currentMonthRevenue,
                            },
                            ]}
                        />
                        </Box>

                        {/* Labels */}
                        <Box sx={{ textAlign: 'left' }}>
                        <Typography
                            variant="body1"
                            sx={{
                            color: '#192959',
                            fontWeight: 'bold',
                            }}
                        >
                            <Box
                            component="span"
                            sx={{
                                display: 'inline-block',
                                width: '15px',
                                height: '15px',
                                backgroundColor: '#FFD700',
                                borderRadius: '50%',
                                marginRight: '10px',
                            }}
                            />
                            {`${new Date().toLocaleString('default', { month: 'long' })}: $${currentMonthRevenue.toLocaleString()}`}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                            color: '#192959',
                            fontWeight: 'bold',
                            }}
                        >
                            <Box
                            component="span"
                            sx={{
                                display: 'inline-block',
                                width: '15px',
                                height: '15px',
                                backgroundColor: '#C0C0C0',
                                borderRadius: '50%',
                                marginRight: '10px',
                            }}
                            />
                            {`Other Months: $${(totalRevenue - currentMonthRevenue).toLocaleString()}`}
                        </Typography>
                        </Box>
                    </Box>
                </Box>
        </Box>

        {/* Bottom Row: Single Column */}
        <Box sx={styles.row2}>
            {/* Bottom Row: Left Box */}
            <Box sx={styles.revenueContainer}>
                <PersonIcon sx={{ fontSize: 80, color: '#C0C0C0', marginBottom: '10px' }} />
                <Typography
                    variant="h6"
                    sx={{
                    fontWeight: 'bold',
                    color: '#192959',
                    textAlign: 'center',
                    mb: 2,
                    }}
                >
                The total number of tourists that have booked your activities is...
                </Typography>
                <Typography
                    variant="h3"
                    sx={{
                    color: '#192959',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    }}
                >
                    {totalTourists}
                </Typography>
            </Box>



            {/* Right Column */}
            <Box sx={{ ...styles.revenueContainer, position: 'relative' }}>
  <Typography
    variant="h5"
    sx={{
      fontWeight: 'bold',
      color: '#192959',
      textAlign: 'center',
      mb: 2,
    }}
  >
    Activity Details
  </Typography>
  <FilterAltIcon
    onClick={() => setIsFilterModalOpen(true)} // Open the filter modal
    sx={{
      position: 'absolute', // Position the icon relative to the container
      top: '25px', // Adjust the top spacing as needed
      right: '30px', // Adjust the right spacing as needed
      color: '#192959',
      cursor: 'pointer', // Make the icon interactive
      fontSize: 30, // Adjust size if needed
    }}
  />
  <Box
    sx={{
      maxHeight: '270px', // Set fixed height for scrolling
      overflowY: 'auto', // Enable vertical scrolling
      position: 'relative', // Required for sticky positioning
    }}
  >
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={styles.tableHeader}>Activity Title</th>
          <th style={styles.tableHeader}>Total # of Tourists</th>
          <th style={styles.tableHeader}>Total Revenue</th>
          <th style={styles.tableHeader}>
            {`Revenue ${
                filterDate
                ? `(Date: ${new Date(filterDate).toLocaleDateString()})`
                : filterMonth
                ? `(Month: ${new Date(0, filterMonth - 1).toLocaleString('default', {
                    month: 'long',
                    })})`
                : `(Month: ${new Date().toLocaleString('default', { month: 'long' })})`
            }`}
            </th>

        </tr>
      </thead>
      <tbody>
  {itinerariesData.map((itinerary, index) => (
    <tr key={index}>
      <td
        style={{
          ...styles.tableCell,
          cursor: 'pointer',
          color: '#192959',
        }}
        onClick={() => handleItineraryClick(itinerary)} // Add this line
      >
        {itinerary.title}
      </td>
      <td style={styles.tableCell}>{itinerary.totalTourists}</td>
      <td style={styles.tableCell}>${itinerary.totalRevenue.toLocaleString()}</td>
      <td style={styles.tableCell}>
        ${itinerary.currentMonthRevenue.toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>

    </table>
  </Box>
</Box>


        </Box>


        </Box>


        ////////////////// SALES PAGE
        <Modal open={!!selectedItinerary} onClose={() => setSelectedItinerary(null)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
      width: '80%',
      maxWidth: '600px',
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: 'bold',
        color: '#192959',
        marginBottom: 2,
        textAlign: 'center',
      }}
    >
      Itinerary Details
    </Typography>
    {selectedItinerary && (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Itinerary Title</th>
            <th style={styles.tableHeader}>Total # of Tourists</th>
            <th style={styles.tableHeader}>Total Revenue</th>
            <th style={styles.tableHeader}>
              {`Revenue (${new Date().toLocaleString('default', {
                month: 'long',
              })})`}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.tableCell}>{selectedItinerary.title}</td>
            <td style={styles.tableCell}>
              {selectedItinerary.totalTourists}
            </td>
            <td style={styles.tableCell}>
              ${selectedItinerary.totalRevenue.toLocaleString()}
            </td>
            <td style={styles.tableCell}>
              ${selectedItinerary.currentMonthRevenue.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    )}
  </Box>
</Modal>

{/* Filter Modal */}
<Modal open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filter Itineraries
          </Typography>

          {/* Date Filter */}
          <TextField
            label="Select Date"
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setFilterMonth(''); // Clear month selection when date is selected
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Month Filter */}
          <TextField
            label="Select Month"
            select
            value={filterMonth}
            onChange={(e) => {
              setFilterMonth(e.target.value);
              setFilterDate(''); // Clear date selection when month is selected
            }}
            fullWidth
            sx={{ mb: 2 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </TextField>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFilterDate('');
                setFilterMonth('');
              }}
              sx={{ color: '#192959', borderColor: '#192959' }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={applyFilter}
              sx={{ backgroundColor: '#192959', color: '#fff' }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>

{/* Profile Modal */}
<Modal open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
  }}
>
        {/* <Typography variant="h6" component="h2">
            My Profile
        </Typography> */}
        <Typography variant="h6" component="h2">
            My Profile
        </Typography>
        <Button
            variant="outlined"
            onClick={() => {
            if (isEditable) {
                saveProfile();
            }
            setIsEditable(!isEditable);
            }}
            sx={{
            borderColor: '#192959',
            color: '#192959',
            backgroundColor: 'white',
            '&:hover': {
                backgroundColor: '#192959',
                borderColor: 'white',
                color: 'white',
            },
            }}
            startIcon={isEditable ? <SaveIcon /> : <EditIcon />}
        >
            {isEditable ? 'Save Changes' : 'Edit'}
        </Button>
        </Box>

    {/* Profile Picture Circle with Edit Icon */}
    <Box
      sx={{
        position: "relative",
        width: "80px",
        height: "80px",
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
      {isEditable && (
      <IconButton
        sx={{
          position: "absolute",
          bottom: "5px",
          right: "-10px",
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
      )}
    </Box>


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
              InputProps={{ readOnly: !isEditable }}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={profileData.password}
              onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
              InputProps={{
                readOnly: !isEditable,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Company Profile"
              id="CompanyProfile"
              value={profileData.CompanyProfile}
              onChange={(e) => setProfileData({ ...profileData, CompanyProfile: e.target.value })}
              InputProps={{ readOnly: !isEditable }}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Hotline"
              id="Hotline"
              value={profileData.Hotline}
              onChange={(e) => setProfileData({ ...profileData, Hotline: e.target.value })}
              InputProps={{ readOnly: !isEditable }}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Website"
              id="Website"
              value={profileData.Website}
              onChange={(e) => setProfileData({ ...profileData, Website: e.target.value })}
              InputProps={{ readOnly: !isEditable }}
              margin="dense"
            />


            <Button
                variant="outlined"
                onClick={() => setIsDeleteDialogOpen(true)}
                sx={styles.reqDeleteButton}
                >
                REQUEST TO DELETE ACCOUNT
            </Button>

      {/* Toggle Edit and Save Button
      <Button
        variant="outlined"
        onClick={() => {
          if (isEditable) {
            saveProfile(); // Save changes when editable
          }
          setIsEditable(!isEditable); // Toggle editable state
        }}
        sx={{
          mt: 2,
          borderColor: "#192959",
          color: "#192959",
          backgroundColor: "white",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            backgroundColor: "#192959",
            borderColor: "white",
            color: "white",
          },
        }}
        startIcon={isEditable ? <SaveIcon /> : <EditIcon />}
      >
        {isEditable ? "Save Changes" : "Edit"}
      </Button> */}
    </Box>
  </Box>
</Modal>

      {/* Change Password Modal */}
      <Modal open={changePasswordModal} onClose={() => setChangePasswordModal(false)}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6" gutterBottom>Change Password</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>Current Password: {currentPassword}</Typography>
          <TextField
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
          <Button
            variant="contained"
            onClick={handleAddAdmin}
            fullWidth
            sx={styles.actionButton}
          >Save New Password</Button>
        </Box>
      </Modal>
      {/* Add Admin Modal */}
      <Modal open={addAdminModal} onClose={() => {setAddAdminModal(false); resetAddAdminModal();}}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6" gutterBottom>Add Admin</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>Give a new admin access to the system</Typography>
          <TextField
            label="Admin Username"
            fullWidth
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type={showAdminPassword ? 'text' : 'password'}
            fullWidth
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowAdminPassword(!showAdminPassword)}>
                    {showAdminPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmAdminPassword ? 'text' : 'password'}
            fullWidth
            value={confirmAdminPassword}
            onChange={(e) => setConfirmAdminPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmAdminPassword(!showConfirmAdminPassword)}>
                    {showConfirmAdminPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
          <Button
            variant="contained"
            onClick={handleAddAdmin}
            fullWidth
            sx={styles.actionButton}
          >Add Admin</Button>
        </Box>
      </Modal>

      {/* Add Tourism Governor Modal */}
<Modal open={addTourismGovModal} onClose={() => {setAddTourismGovModal(false); resetAddTourismGovModal();}}>
  <Box sx={styles.modalContent}>
    <Typography variant="h6" gutterBottom>Add Tourism Governor</Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>Grant access to a new tourism governor</Typography>
    <TextField
      label="Username"
      fullWidth
      value={govUsername}
      onChange={(e) => setGovUsername(e.target.value)}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Password"
      type={showGovPassword ? 'text' : 'password'}
      fullWidth
      value={govPassword}
      onChange={(e) => setGovPassword(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowGovPassword(!showGovPassword)}>
              {showGovPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Confirm Password"
      type={showConfirmGovPassword ? 'text' : 'password'}
      fullWidth
      value={confirmGovPassword}
      onChange={(e) => setConfirmGovPassword(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowConfirmGovPassword(!showConfirmGovPassword)}>
              {showConfirmGovPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
    {errorMessage && (
      <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>
    )}
    <Button
      variant="contained"
      onClick={handleAddTourismGov}
      fullWidth
      sx={styles.actionButton}
    >
      Add Governor
    </Button>
  </Box>
</Modal>

{/* Delete Requests Modal */}
<Modal open={deleteRequestsModal} onClose={closeDeleteRequestsModal}>
  <Box sx={styles.modalContent}>
    <Typography variant="h6" sx={{ mb: 2 }}>Delete Requests</Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      The following accounts have requested to be deleted off of the system:
    </Typography>

    <Box sx={styles.listContainer}>
      {deleteRequests.length > 0 ? (
        deleteRequests.map((request, index) => (
          <Box key={index} sx={styles.categoryItem}>
            <Typography variant="body1">
              <PersonIcon sx={{ mr: 1 }} />
              {request.Username} ({request.Type})
            </Typography>
            <Box sx={styles.iconContainer}>
              <IconButton onClick={() => handleConfirmDeleteRequest(request)}>
                <CheckIcon sx={{ color: "#4CAF50" }} />
              </IconButton>
              <IconButton onClick={() => handleRejectRequest(request.Username)}>
                <CloseIcon sx={{ color: "#FF5252" }} />
              </IconButton>
            </Box>

          </Box>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No delete requests available.
        </Typography>
      )}
    </Box>

    {/* <Button
      onClick={closeDeleteRequestsModal}
      variant="contained"
      sx={styles.closeButton}
    >
      CLOSE
    </Button> */}
  </Box>
</Modal>

        {/* Delete ACcount Dialog*/}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#192959', mb: 2 }}>
            Are you sure you want to request the deletion of your account?
            </Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>
            This action cannot be reversed! If you decide to continue, our admins will review your profile and decide whether to proceed with your request.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={styles.dialogCancelButton}
            >
            Cancel
            </Button>
            <Button
            onClick={async () => {
                await handleAccountDeletion();
                setIsDeleteDialogOpen(false);
            }}
            sx={styles.dialogCancelButton}
            >
            Confirm
            </Button>
        </DialogActions>
        </Dialog>


      {/* Confirm Deletion Dialog */}
      <Dialog open={confirmDeleteDialog} onClose={() => setConfirmDeleteDialog(false)}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#192959', fontSize: '20px' }}>
            Are you sure you want to delete this user off of the system?
          </DialogContentText>
          <DialogContentText sx={{ fontWeight: 'bold', color: '#33416b', marginTop: '10px' }}>
            This action cannot be reversed! You will delete this user and everything they've created from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)} sx={{ color: '#192959' }}>
            Cancel
          </Button>
          <Button onClick={() => { confirmDeleteRequest(); setConfirmDeleteDialog(false); }} sx={{ color: '#192959' }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    
    </Box>
  );
}

const styles = {
    tableHeader: {
        backgroundColor: '#192959', // Header background color
        color: '#ffffff',           // Text color
        padding: '10px',
        textAlign: 'center',
        fontWeight: 'bold',
        position: 'sticky',         // Makes the header sticky
        top: 0,                     // Sticks the header to the top of the container
        zIndex: 2,                  // Ensure it stays above the table rows
      },      
    tableCell: {
        padding: '10px',
        border: '1px solid #ccc',
        textAlign: 'center',
        color: '#000000', // Set text color to black
    },
    row2: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '20px',
        width: '100%',
      },      
    revenueContainer: {
        height: '235px',
        backgroundColor: '#f3f4f6',
        color: '#192959',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'transform 0.2s',
        // '&:hover': {
        //   transform: 'scale(1.05)',
        // },
      },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        //padding: '0px 0px 50px 60px', // Added padding
        marginLeft: '100px', // Space for the sidebar
        marginRight: '20px', // Space for the sidebar
        marginTop: '20px', // Space between the top menu and the content
        transition: 'margin-left 0.3s ease',
      },
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#e6e7ed',
    color: '#e6e7ed',
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
    position: 'relative',
    zIndex: 3,
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
  reqDeleteButton: {
    marginTop: "10px",
    backgroundColor: '#ff7b7b',
    color: '#a70000',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#a70000', // Set background color on hover
      color: '#ff7b7b',           // Set text color on hover
    },
  }, 
  manageAccessContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#192959',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 1,
  },
  dropdownItem: {
    color: '#e6e7ed',
    display: 'block',
    padding: '10px 20px',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: '#4d587e',
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
  content: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    padding: '20px 70px 20px 90px',
    marginLeft: '60px',
    transition: 'margin-left 0.3s ease',
  },
  infoBox: {
    backgroundColor: '#4d587e',
    color: '#e6e7ed',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '&:hover .text': {
      transform: 'scale(1.5)',
    },
  },
  image: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '10px',
    transition: 'transform 0.2s',
  },
  text: {
    transition: 'transform 0.2s',
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
  actionButton: {
    backgroundColor: '#99a0b5',
    color: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },
  acceptButton: {
    color: '#4CAF50',
  },
  rejectButton: {
    color: '#FF5252',
  },
  doneButton: {
    mt: 2,
    backgroundColor: '#FF0000',
    '&:hover': { backgroundColor: '#FF5252' },
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    maxHeight: 400,
    overflowY: "auto",
  },
  categoryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  iconContainer: {
    display: "flex",
    gap: 1,
  },
  closeButton: {
    backgroundColor: "#FF5252",
    color: "#fff",
    mt: 2,
    "&:hover": { backgroundColor: "#D32F2F" },
  },
  welcomeSection: {
    //width: '500px',
    flex: 1,
    marginRight: '0px',
    padding: '140px 0px 20px 20px',
    // backgroundColor: '#f8f9fa',
    // borderRadius: '15px',
    // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  dialogCancelButton: {
    color: '#192959',
    backgroundColor: '#ffffff',
    //fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#192959',
      color: '#ffffff',
    },
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    width: '100%',
  },
};

export default YAdvertiserSalesPage;
