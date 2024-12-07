import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Modal, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText , Tabs, Tab} from '@mui/material';
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
import CloseIcon from '@mui/icons-material/Clear';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person'; // Icon for generic user type
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Bar, Pie } from 'react-chartjs-2';
import {Chart as ChartJS,BarElement,Tooltip,Legend,CategoryScale,LinearScale,} from 'chart.js';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Menu,MenuItem } from '@mui/material';


ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

import axios from 'axios';


  

function AdminSalesPage() {
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

  
  const [currentView, setCurrentView] = useState('Advertisers');
  

  const [toggleRequestsModal, setToggleRequestsModal] = useState(false);
  const [value, setValue] = useState(0); // Active tab value
  const [usernames, setUsernames] = useState([]); // List of usernames

  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const tabs = ['Advertisers', 'Sellers', 'Tour Guides', 'Transportation Advertisers'];
  const [anchorEl, setAnchorEl] = useState(null); // For the filter menu
const [selectedMonth, setSelectedMonth] = useState('all'); // Default to all-time
const [userCounts, setUserCounts] = useState({
  tourists: 0,
  governors: 0,
  advertisers: 0,
  sellers: 0,
  tourGuides: 0,
  transportationAdvertisers: 0,
});
const [totalUsers, setTotalUsers] = useState(0);
const [revenueData, setRevenueData] = useState({
    totalItineraryRevenue: 0,
    totalActivityRevenue: 0,
    totalProductRevenue: 0,
    totalAppRevenue: 0,
  });



  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  

  useEffect(() => {
    fetchRequests();
   if (changePasswordModal) {
      fetchCurrentPassword();
    }
    if (deleteRequestsModal) {
      fetchDeleteRequests();
    }
  }, [changePasswordModal, deleteRequestsModal,tabValue]);

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

const fetchRequests = async () => {
  setLoading(true);
  setErrorMessage('');
  try {
    let response;
    switch (tabValue) {
      case 0: // Advertisers
        response = await axios.get('/api/getAllUnregisteredAdvertisers');
        setRequests(response.data.advertisers || []);
        break;
      case 1: // Sellers
        response = await axios.get('/api/getAllUnregisteredSellers');
        setRequests(response.data.sellers || []);
        break;
      case 2: // Tour Guides
        response = await axios.get('/api/getAllUnregisteredTourGuides');
        setRequests(response.data.tourGuides || []);
        break;
      case 3: // Transportation Advertisers
        response = await axios.get('/api/getAllUnregisteredTransportationAdvertisers');
        setRequests(response.data.transportationAdvertisers || []);
        break;
      default:
        setRequests([]);
    }
  } catch (error) {
    setErrorMessage('Failed to fetch requests. Please try again.');
  } finally {
    setLoading(false);
  }
};



const openToggleRequestsModal = () => {
  setToggleRequestsModal(true);
  fetchRequests();
};


const closeToggleRequestsModal = () => {
  setToggleRequestsModal(false);
  setUsernames([]); // Clear usernames
};

const handleViewChange = (view) => {
  setCurrentView(view);
  fetchRequests(view); // Fetch data for the selected view
};

const handleChange = (event, newValue) => {
  setValue(newValue);
  setUsernames([]); // Clear previous usernames
  fetchRequests(); // Fetch data for the new tab
};


const handleAccept = async (username) => {
  try {
    let endpoint;
    let requestBody = {};

    switch (tabValue) {
      case 0: // Advertisers
        endpoint = 'http://localhost:8000/api/acceptAdvertiser';
        requestBody = { AdvertiserUsername: username };
        break;

      case 1: // Sellers
        endpoint = 'http://localhost:8000/api/acceptSeller';
        requestBody = { SellerUsername: username };
        break;

      case 2: // Tour Guides
        endpoint = 'http://localhost:8000/api/acceptTourGuide';
        requestBody = { TourGuideUsername: username };
        break;

      case 3: // Transportation Advertisers
        endpoint = 'http://localhost:8000/api/acceptTranspAdvertiser';
        requestBody = { AdvertiserUsername: username }; // Assuming same key as AdvertiserUsername for transport advertisers
        break;

      default:
        alert('Invalid request type.');
        return;
    }

    // Send POST request
    await axios.post(endpoint, requestBody);

    alert(`${tabs[tabValue].slice(0, -1)} accepted successfully!`);
    fetchRequests(); // Refresh the list
  } catch (error) {
    console.error('Error accepting request:', error);
    alert('Error accepting request. Please try again.');
  }
};



const handleReject = async (username) => {
  try {
    let endpoint;
    let requestBody = {};

    switch (tabValue) {
      case 0: // Advertisers
        endpoint = 'http://localhost:8000/api/rejectAdvertiser';
        requestBody = { AdvertiserUsername: username };
        break;

      case 1: // Sellers
        endpoint = 'http://localhost:8000/api/rejectSeller';
        requestBody = { SellerUsername: username };
        break;

      case 2: // Tour Guides
        endpoint = 'http://localhost:8000/api/rejectTourGuide';
        requestBody = { TourGuideUsername: username };
        break;

      case 3: // Transportation Advertisers
        endpoint = 'http://localhost:8000/api/rejectTranspAdvertiser';
        requestBody = { AdvertiserUsername: username }; // Assuming the same key as AdvertiserUsername
        break;

      default:
        alert('Invalid request type.');
        return;
    }

    // Send POST request
    await axios.post(endpoint, requestBody);

    alert(`${tabs[tabValue].slice(0, -1)} rejected successfully!`);
    fetchRequests(); // Refresh the list
  } catch (error) {
    console.error('Error rejecting request:', error);
    alert('Error rejecting request. Please try again.');
  }
};


const handleViewDocument = (username) => {
  if (!username) {
    alert("Username is required!");
    return;
  }

  switch (tabValue) {
    case 0: // Advertisers
      window.open(`http://localhost:8000/api/viewAdvertiserDocument?Username=${username}`, "_blank");
      break;

    case 1: // Sellers
      window.open(`http://localhost:8000/api/viewSellerDocument?Username=${username}`, "_blank");
      break;

    case 2: // Tour Guides
      window.open(`http://localhost:8000/api/viewTourGuideDocuments?username=${username}&docType=ID`, "_blank");
      setTimeout(() => {
        window.open(`http://localhost:8000/api/viewTourGuideDocuments?username=${username}&docType=Certificate`, "_blank");
      }, 100); // Add a small delay for the second tab
      break;

    default:
      alert("No documents available for this category.");
  }
};

const chartData = {
    labels: [
      'Tourists',
      'Governors',
      'Advertisers',
      'Sellers',
      'Tour Guides',
      'Transportation\nAdvertisers',
      'Total',
    ],
    datasets: [
      {
        label: `User Counts (${selectedMonth === 'all' ? 'All Time' : `Month: ${new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}`})`,
        data: [
          userCounts.tourists,
          userCounts.governors,
          userCounts.advertisers,
          userCounts.sellers,
          userCounts.tourGuides,
          userCounts.transportationAdvertisers,
          totalUsers,
        ],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#888888',
        ],
      },
    ],
  };

  const fetchUserCounts = async (month) => {
    try {
      const endpoint = month === 'all' 
        ? '/api/getTotalUsers' 
        : `/api/getTotalUsersByMonth?month=${month}`;
      
      const response = await axios.get(endpoint);
      const data = response.data;
  
      setUserCounts(data.counts);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };

   // Fetch revenue data
   const fetchRevenueData = async () => {
    try {
        const response = await axios.get("/api/calculateTotalAppRevenue");
        const data = response.data;
        setRevenueData({
            totalItineraryRevenue: data.totalItineraryRevenue || 0,
            totalActivityRevenue: data.totalActivityRevenue || 0,
            totalProductRevenue: data.totalProductRevenue || 0,
            totalAppRevenue: 
                data.totalAppRevenue ?? 
                (data.totalItineraryRevenue || 0) +
                (data.totalActivityRevenue || 0) +
                (data.totalProductRevenue || 0), // Fallback calculation
        });
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        setRevenueData({
            totalItineraryRevenue: 0,
            totalActivityRevenue: 0,
            totalProductRevenue: 0,
            totalAppRevenue: 0,
        });
    }
};

  useEffect(() => {
    fetchRevenueData();
    fetchUserCounts(selectedMonth);
  }, [selectedMonth]);




  const pieChartData = {
    labels: ["Itineraries", "Activities", "Products"],
    datasets: [
      {
        data: [
          revenueData.totalItineraryRevenue,
          revenueData.totalActivityRevenue,
          revenueData.totalProductRevenue,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Custom colors for segments
        hoverOffset: 4,
      },
    ],
};

const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top', // Positions legend at the top
      },
      tooltip: {
        enabled: true, // Enable tooltips to show data on hover
      },
    },
    maintainAspectRatio: false, // Ensures the chart fits its container dimensions
  };
  
  
  


return (
    <Box sx={styles.container}>
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
          <Button onClick={() => setChangePasswordModal(true)} sx={styles.menuButton}>
            Change My Password
          </Button>
          <Box
            onMouseEnter={() => setShowManageAccessDropdown(true)}
            onMouseLeave={() => setShowManageAccessDropdown(false)}
            sx={styles.manageAccessContainer}
          >
            <Button sx={styles.menuButton}>Manage Access</Button>
            {showManageAccessDropdown && (
              <Box sx={styles.dropdown}>
                <Button onClick={() => setAddAdminModal(true)} sx={styles.dropdownItem}>Add Admin</Button>
                <Button onClick={() => setAddTourismGovModal(true)} sx={styles.dropdownItem}>Add Tourism Governor</Button>
                <Button onClick={openToggleRequestsModal} sx={styles.dropdownItem}>Requests</Button>
                <Button onClick={() => setDeleteRequestsModal(true)} sx={styles.dropdownItem}> Delete Requests</Button>
              </Box>
            )}
          </Box>
          <IconButton sx={styles.iconButton}>
            <NotificationsIcon />
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
        <Button onClick={() => navigate('/YAdminComplaintsPage')} sx={styles.sidebarButton}>
          <AssignmentIcon sx={styles.icon} />
          {sidebarOpen && 'Complaints'}
        </Button>
        <Button onClick={() => navigate('/YAdminProductsPage')} sx={styles.sidebarButton}>
          <StorefrontIcon sx={styles.icon} />
          {sidebarOpen && 'Products'}
        </Button>
        <Button onClick={() => navigate('/YAdminActivitiesPage')} sx={styles.sidebarButton}>
          <LocalActivityIcon sx={styles.icon} />
          {sidebarOpen && 'Activities'}
        </Button>
        <Button onClick={() => navigate('/YAdminItinerariesPage')} sx={styles.sidebarButton}>
          <MapIcon sx={styles.icon} />
          {sidebarOpen && 'Itineraries'}
        </Button>
        {/* <Button onClick={() => navigate('/YAdminDashboard')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button> */}
      </Box>

      <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    marginLeft: sidebarOpen ? '280px' : '60px',
    transition: 'margin-left 0.3s ease',
    overflow: 'hidden', // Prevent scrolling
    alignItems: 'center', // Center the content
    justifyContent: 'flex-start', // Align content at the top
  }}
>
  {/* Row Container for Bar Chart and Pie Chart */}
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px',
      width: '100%',
      maxWidth: '1400px', // Increased maxWidth for a wider layout
      marginTop: '30px', // Move the containers closer to the top
    }}
  >
    {/* User Statistics Container */}
    <Box
      sx={{
        width: '50%', // Slightly increased width
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        height: '420px', // Adjusted height for consistency
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h6" sx={{ marginRight: '10px' }}>
          User Statistics
        </Typography>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <FilterAltIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              setSelectedMonth('all');
              setAnchorEl(null);
            }}
          >
            All Time
          </MenuItem>
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem
              key={i + 1}
              onClick={() => {
                setSelectedMonth(String(i + 1));
                setAnchorEl(null);
              }}
            >
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Box sx={{ width: '100%', height: '320px' }}>
        <Bar
          data={chartData}
          options={{ responsive: true, plugins: { legend: { display: true } } }}
        />
      </Box>
    </Box>

    {/* App Revenue Container */}
    <Box
      sx={{
        width: '50%', // Slightly increased width
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        height: '420px', // Adjusted height for consistency
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        App Revenue
      </Typography>
      <Box sx={{ width: '300px', height: '300px' }}> {/* Increased size */}
        <Pie data={pieChartData} options={pieChartOptions} />
      </Box>
      <Typography
        variant="h6"
        sx={{ marginTop: '10px', fontWeight: 'bold', color: '#192959' }}
      >
        Total Revenue: $
        {typeof revenueData.totalAppRevenue === 'number'
          ? revenueData.totalAppRevenue.toFixed(2)
          : revenueData.totalAppRevenue}
      </Typography>
    </Box>
  </Box>
</Box>



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
 {/* Manage Requests Modal */}
 <Modal open={toggleRequestsModal} onClose={() => setToggleRequestsModal(false)}>
  <Box sx={styles.largeModalContent}>
    {/* Tabs for navigation */}
    <Tabs
      value={tabValue}
      onChange={(e, newValue) => setTabValue(newValue)}
      centered
    >
      {tabs.map((tab, index) => (
        <Tab key={index} label={tab} />
      ))}
    </Tabs>

    {/* Scrollable area for requests */}
    <Box sx={styles.scrollableContainer}>
      {loading && <Typography>Loading...</Typography>}
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      {!loading && requests.length === 0 && (
        <Typography>No requests found for {tabs[tabValue]}.</Typography>
      )}

      {!loading &&
        requests.map((request, index) => (
          <Box key={index} sx={styles.requestItem}>
            {/* User Info with Icon */}
            <Typography sx={styles.userInfo}>
              <PersonIcon sx={{ mr: 1 }} />
              {request.Username} 
            </Typography>

            {/* Icons for Actions */}
            <Box sx={styles.actionIcons}>
              {/* Conditionally render the "View Document" button */}
              {tabValue !== 3 && (
                <IconButton
                  onClick={() => handleViewDocument(request.Username)}
                  sx={{ color: "#99a0b5" }} // Blue for "View Document"
                >
                  <PictureAsPdfIcon />
                </IconButton>
              )}
              <IconButton
                onClick={() => handleAccept(request.Username)}
                sx={{ color: "#4CAF50" }} // Green for "Accept"
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                onClick={() => handleReject(request.Username)}
                sx={{ color: "#FF5252" }} // Red for "Reject"
              >
                <ClearIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
    </Box>
  </Box>
</Modal>

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
  largeModalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw', // Adjust width as needed
    maxWidth: '600px', // Restrict max width
    maxHeight: '80vh', // Limit height
    backgroundColor: '#fff',
    padding: '20px', // Added padding to give space inside the modal
    margin: '20px', // Added margin to give space outside the modal
    borderRadius: '8px',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // Prevent outer scrolling
  },
  scrollableContainer: {
    flex: 1,
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    overflowY: 'auto', // Enable only vertical scrolling
  },
  requestItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f3f4f6',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: "#333",
  },
  actionIcons: {
    display: "flex",
    gap: "10px",
  },

  
};

export default AdminSalesPage;
