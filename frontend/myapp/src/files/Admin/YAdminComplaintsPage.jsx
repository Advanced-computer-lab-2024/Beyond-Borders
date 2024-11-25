import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';


import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function YAdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(''); // State for selected status
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/getAllComplaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleEditReply = (complaint) => {
    setEditMode(complaint._id);
    setReplyText(complaint.Reply || '');
  };

  const handleSaveReply = async (complaintId) => {
    try {
      await axios.put('/replyToComplaint', { Title: complaints.find(c => c._id === complaintId).Title, Reply: replyText });
      setEditMode(null);
      setReplyText('');
      fetchComplaints();
    } catch (error) {
      console.error('Error saving reply:', error);
      alert('Failed to save reply');
    }
  };

  const handleToggleStatus = async (complaint) => {
    const updatedStatus = complaint.Status === 'Resolved' ? 'Pending' : 'Resolved';
    try {
      await axios.put('/updateComplaintStatus', { Title: complaint.Title, newStatus: updatedStatus });
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleFilterComplaints = async (status) => {
    try {
      if (status === "All" || status === "") {
        // Fetch all complaints
        const response = await axios.get('/getAllComplaints');
        setComplaints(response.data);
      } else {
        // Fetch filtered complaints based on status
        const response = await axios.post('/api/filterComplaintsByStatus', { Status: status });
        setComplaints(response.data);
      }
    } catch (error) {
      console.error('Error filtering complaints:', error);
      alert('An error occurred while fetching complaints.');
    }
  };
  
  const handleSortMostRecent = async () => {
    try {
      const response = await axios.get('/sortComplaintsByRecent');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error sorting by most recent:', error);
      alert('An error occurred while sorting complaints.');
    }
  };
  
  const handleSortLeastRecent = async () => {
    try {
      const response = await axios.get('/sortComplaintsByOldest');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error sorting by least recent:', error);
      alert('An error occurred while sorting complaints.');
    }
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
        {/* <Box sx={styles.topMenuRight}>
          <IconButton sx={styles.iconButton}>
            <NotificationsIcon />
          </IconButton>
          <IconButton sx={styles.iconButton}>
            <LogoutIcon />
          </IconButton>
        </Box> */}
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          ...styles.sidebar,
          width: sidebarOpen ? '250px' : '60px',
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
        <Button onClick={() => navigate('/YAdminDashboard')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box sx={styles.mainContent}>
  {/* Filter Section */}
  <Box sx={styles.filterContainer}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    {/* Filter Icon */}
    <FilterListIcon sx={{ color: '#192959', fontSize: '28px' }} />

    {/* Dropdown */}
    <select
  value={statusFilter}
  onChange={(e) => {
    setStatusFilter(e.target.value);
    handleFilterComplaints(e.target.value); // Trigger filter function directly
  }}
  style={{
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
    fontSize: '16px',
  }}
>
  <option value="" disabled>
    Filter by status
  </option>
  <option value="All">All</option>
  <option value="Pending">Pending</option>
  <option value="Resolved">Resolved</option>
</select>

    {/* Filter Button
    <Button
      onClick={handleFilterComplaints}
      sx={{
        backgroundColor: '#192959',
        color: '#ffffff',
        '&:hover': { backgroundColor: '#33416b' },
        padding: '8px 16px',
      }}
    >
      Filter
    </Button> */}
   {/* Sorting Buttons */}
   {/* <IconButton onClick={handleSortMostRecent} title="Sort by Most Recent"> */}
    <IconButton onClick={handleSortMostRecent}>
      <SortIcon sx={{ fontSize: '28px', color: '#192959', transform: 'rotate(0deg)' }} />
    </IconButton>
    <Typography variant="body2">Most Recent</Typography>

    <IconButton onClick={handleSortLeastRecent}>
      <SortIcon sx={{ fontSize: '28px', color: '#192959', transform: 'rotate(180deg)' }} />
    </IconButton>
    <Typography variant="body2">Least Recent</Typography>
      </Box>
    </Box>
        <Box sx={styles.complaintsContainer}>
          {complaints.map((complaint) => (
            <Box key={complaint._id} sx={styles.complaintCard}>
              <Box sx={styles.complaintHeader}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '24px' }}>
                  {complaint.Title}
                </Typography>
                <Box
                  onClick={() => handleToggleStatus(complaint)}
                  sx={{
                    ...styles.toggleButton,
                    backgroundColor: complaint.Status === 'Resolved' ? '#192959' : '#cccfda',
                    width: complaint.Status === 'Resolved' ? '140px' : '130px',
                  }}
                >
                  <Box
                    sx={{
                      ...styles.toggleCircle,
                      transform: complaint.Status === 'Resolved' ? 'translateX(280%)' : 'translateX(5%)',
                      backgroundColor: complaint.Status === 'Resolved' ? '#cccfda' : '#192959',
                    }}
                  />
                  <Typography
                    sx={{
                      color: complaint.Status === 'Resolved' ? '#cccfda' : '#192959',
                      fontWeight: 'bold',
                      position: 'absolute',
                      left: complaint.Status === 'Resolved' ? '10px' : '40px',
                      transition: 'left 0.3s ease',
                    }}
                  >
                    {complaint.Status.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.complaintInfo}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                  {complaint.TouristUsername}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                  {new Date(complaint.Date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={styles.replyContainer}>
                <TextField
                  fullWidth
                  value={complaint.Body || 'No body text available'}
                  disabled
                  variant="outlined"
                  label="Complaint" // Add this line for the Complaint label
                  sx={styles.bodyTextField}
                />
                <TextField
                  fullWidth
                  value={editMode === complaint._id ? replyText : complaint.Reply || 'No reply yet'}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={editMode !== complaint._id}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() =>
                          editMode === complaint._id ? handleSaveReply(complaint._id) : handleEditReply(complaint)
                        }
                      >
                        {editMode === complaint._id ? <CheckIcon /> : <EditIcon />}
                      </IconButton>
                    ),
                  }}
                  variant="outlined"
                  label="Reply" // Add this line for the Reply label
                  sx={styles.replyTextField}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
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
    top: 0,
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
    color: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#e6e7ed',
      color: '#192959',
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
    height: '100vh',
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
  mainContent: {
    flex: 1,
    marginLeft: '80px',
    padding: '20px 60px',
  },
  complaintsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px',
    marginBottom: '20px',
  },
  complaintCard: {
    padding: '40px 60px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  complaintHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    height: '40px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  toggleCircle: {
    position: 'absolute',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    transition: 'transform 0.3s ease',
  },
  complaintInfo: {
    display: 'flex',
    flexDirection: 'row',
    gap: '15px',
    alignItems: 'center',
  },
  replyContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    paddingTop: '15px', // Add top padding
  },  
  bodyTextField: {
    flex: 1,
  },
  replyTextField: {
    flex: 1,
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: '20px', 
    backgroundColor: '#e6e7ed', // Matches the background
    borderBottom: '1px solid #ccc', // Optional: Adds a bottom border for separation
  },
  
};

export default YAdminComplaintsPage;
