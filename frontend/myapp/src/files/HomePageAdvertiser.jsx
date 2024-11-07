import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePageAdvertiser = () => {
  const [activities, setActivities] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [profile, setProfile] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateActivityData, setUpdateActivityData] = useState(null);
  const [showActivities, setShowActivities] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);


  const [newActivity, setNewActivity] = useState({
    AdvertiserName: 'yourAdvertiserName', // Replace with actual advertiser name
    Name: '',
    Date: '',
    Time: '',
    Price: '',
    Location: { type: 'Point', address: '', longitude: '', latitude: '' },
    Category: '',
    Tags: '',
    SpecialDiscount: '',
    BookingOpen: true
  });

  const loadMyActivities = async () => {
    setLoading(true);
    const username = localStorage.getItem('username'); 
    if (!username) {
      alert('You need to log in first.');
      setLoading(false);
      setIsLoggedIn(false);
      return;
    }
  
    try {
      const response = await axios.get(`/api/readAllActivities?AuthorUsername=${encodeURIComponent(username)}`);
      if (response.status === 200) {
        setActivities(response.data);
        setShowActivities(true); // Show activities only when button is clicked
        setIsLoggedIn(true);
      } else {
        setError('Failed to load activities');
      }
    } catch (err) {
      setError('Error fetching activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const loadProfile = async () => {
    setLoading(true);
    const username = localStorage.getItem('username'); 

    if (!username) {
      alert('You need to log in first.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/AdvertiserProfile?username=${encodeURIComponent(username)}`);
      if (response.status === 200) {
        setProfile(response.data.Advertiser);
        setShowProfile(true);
        setShowCreateForm(false); // Hide create form if profile is open
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Error fetching profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateForm = (activity) => {
    setUpdateActivityData(activity);
    setShowUpdateForm(true);
  };
  

  const saveProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put('/api/updateAdvertiserProfile', profile);
      if (response.status === 200) {
        alert('Profile updated successfully!');
        setShowProfile(false);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Error saving profile');
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async () => {
    setLoading(true);
    try {
      const response = await axios.put('/api/updateActivity', updateActivityData);
      if (response.status === 200) {
        alert('Activity updated successfully!');
        setShowUpdateForm(false);
        loadMyActivities(); // Reload activities after updating
      } else {
        setError('Failed to update activity');
      }
    } catch (err) {
      setError(`Error updating activity: ${err.response?.data?.error || err.message}`);
      console.error('Error updating activity:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const createNewActivity = async () => {
    setLoading(true);
    try {
      const username = localStorage.getItem('username'); // Get advertiser name
      const response = await axios.post('/api/createNewActivity', { ...newActivity, AdvertiserName: username });
      if (response.status === 200) {
        alert('New activity created successfully!');
        setShowCreateForm(false);
        loadMyActivities(); // Reload activities after creating a new one
      } else {
        setError('Failed to create activity');
      }
    } catch (err) {
      setError(`Error creating activity: ${err.response?.data?.error || err.message}`);
      console.error('Error creating activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (activity) => {
    setSelectedActivity(activity);
  };
  

  const deleteActivity = async (activity) => {
    setLoading(true);
    const username = localStorage.getItem('username'); // Get the advertiser name
  
    try {
      console.log("Attempting to delete activity:", { AdvertiserName: username, Name: activity.Name });
      
      const response = await axios.post('/api/deleteActivity', {
        AdvertiserName: username,
        Name: activity.Name
      });
  
      if (response.status === 200) {
        alert("Activity deleted successfully!");
        setActivities(activities.filter(a => a.Name !== activity.Name)); // Update state to remove the deleted activity
      } else {
        setError("Failed to delete activity");
      }
    } catch (err) {
      setError(`Error deleting activity: ${err.response?.data?.error || err.message}`);
      console.error("Error deleting activity:", err);
    } finally {
      setLoading(false);
    }
  };
  
  
  


  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Beyond Borders</h1>
        <nav>
          <ul style={styles.navList}>
            <li><a href="#" style={styles.navLink} onClick={loadMyActivities}>My Activities</a></li>
            <li><a href="#" style={styles.navLink} onClick={loadProfile}>My Profile</a></li>
            <li><button style={styles.button} onClick={() => { setShowCreateForm(true); setShowProfile(false); }}>Create New Activity</button></li>
           

            
          </ul>
        </nav>
      </div>

      <div style={styles.mainContent}>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {isLoggedIn && (
          <div>
            <h2>My Activities</h2>
            {activities.length === 0 ? (
              <p>No activities found.</p>
            ) : (
              <div style={styles.activitiesList}>
                {activities.map((activity, index) => (
                  <div key={index} style={styles.activityItem}>
                    <h3>{activity.Name}</h3>
                    <button style={styles.button} onClick={() => openUpdateForm(activity)}>Update</button>

                    <button style={styles.button} onClick={() => viewDetails(activity)}>View Details</button>

                    <button style={styles.button} onClick={() => deleteActivity(activity)}>Delete</button> 


                  </div>
                ))}
              </div>
            )}
          </div>
        )}

         {/* Show selected activity details when "View Details" is clicked */}
         {selectedActivity && (
          <div style={styles.formModal}>
            <h2>Activity Details</h2>
            <p><strong>Name:</strong> {selectedActivity.Name}</p>
            <p><strong>Date:</strong> {new Date(selectedActivity.Date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedActivity.Time}</p>
            <p><strong>Price:</strong> ${selectedActivity.Price}</p>
            <p><strong>Location:</strong> {selectedActivity.Location.address || 'N/A'}</p>
            <p><strong>Category:</strong> {selectedActivity.Category}</p>
            <p><strong>Tags:</strong> {selectedActivity.Tags.join(', ')}</p>
            <p><strong>Special Discount:</strong> {selectedActivity.SpecialDiscount}</p>
            <p><strong>Booking Status:</strong> {selectedActivity.BookingOpen ? 'Open' : 'Closed'}</p>
            <button style={styles.button} onClick={() => setSelectedActivity(null)}>Close</button>
          </div>
        )}

        {showProfile && (
          <div style={styles.formModal}>
            <h2>My Profile</h2>
            <form>
              <div style={styles.formRow}>
                <label>Username: </label>
                <input type="text" value={profile.Username || ''} readOnly />
              </div>
              <div style={styles.formRow}>
                <label>Email: </label>
                <input type="email" value={profile.Email || ''} onChange={(e) => setProfile({ ...profile, Email: e.target.value })} />
              </div>
              <div style={styles.formRow}>
                <label>Password: </label>
                <input type="password" value={profile.Password || ''} onChange={(e) => setProfile({ ...profile, Password: e.target.value })} />
              </div>
              <div style={styles.formRow}>
                <label>Company Profile: </label>
                <input type="text" value={profile.CompanyProfile || ''} onChange={(e) => setProfile({ ...profile, CompanyProfile: e.target.value })} />
              </div>
              <div style={styles.formRow}>
                <label>Hotline: </label>
                <input type="text" value={profile.Hotline || ''} onChange={(e) => setProfile({ ...profile, Hotline: e.target.value })} />
              </div>
              <div style={styles.formRow}>
                <label>Website: </label>
                <input type="url" value={profile.Website || ''} onChange={(e) => setProfile({ ...profile, Website: e.target.value })} />
              </div>
              <button type="button" onClick={saveProfile}>Save Changes</button>
            </form>
          </div>
        )}

        {showCreateForm && (
          <div style={styles.formModal}>
            <h2>Create New Activity</h2>
            <form>
              <div style={styles.formRow}><label>Name: </label><input type="text" value={newActivity.Name} onChange={(e) => setNewActivity({ ...newActivity, Name: e.target.value })} /></div>
              <div style={styles.formRow}><label>Date: </label><input type="date" value={newActivity.Date} onChange={(e) => setNewActivity({ ...newActivity, Date: e.target.value })} /></div>
              <div style={styles.formRow}><label>Time: </label><input type="time" value={newActivity.Time} onChange={(e) => setNewActivity({ ...newActivity, Time: e.target.value })} /></div>
              <div style={styles.formRow}><label>Price: </label><input type="number" value={newActivity.Price} onChange={(e) => setNewActivity({ ...newActivity, Price: e.target.value })} /></div>
              <div style={styles.formRow}><label>Location: </label><input type="text" placeholder="Address" value={newActivity.Location.address} onChange={(e) => setNewActivity({ ...newActivity, Location: { ...newActivity.Location, type: 'Point', address: e.target.value } })} /></div>
              <div style={styles.formRow}><label>Longitude: </label><input type="number" value={newActivity.Location.longitude} onChange={(e) => setNewActivity({ ...newActivity, Location: { ...newActivity.Location, type: 'Point', longitude: e.target.value } })} /></div>
              <div style={styles.formRow}><label>Latitude: </label><input type="number" value={newActivity.Location.latitude} onChange={(e) => setNewActivity({ ...newActivity, Location: { ...newActivity.Location, type: 'Point', latitude: e.target.value } })} /></div>
              <div style={styles.formRow}><label>Category: </label><input type="text" value={newActivity.Category} onChange={(e) => setNewActivity({ ...newActivity, Category: e.target.value })} /></div>
              <div style={styles.formRow}><label>Tags: </label><input type="text" placeholder="Comma-separated tags" value={newActivity.Tags} onChange={(e) => setNewActivity({ ...newActivity, Tags: e.target.value.split(',') })} /></div>
              <div style={styles.formRow}><label>Special Discount: </label><input type="number" value={newActivity.SpecialDiscount} onChange={(e) => setNewActivity({ ...newActivity, SpecialDiscount: e.target.value })} /></div>
              <div style={styles.formRow}><label>Booking Status: </label><input type="checkbox" checked={newActivity.BookingOpen} onChange={(e) => setNewActivity({ ...newActivity, BookingOpen: e.target.checked })} /></div>
              <button type="button" style={styles.button} onClick={createNewActivity}>Create Activity</button>
            </form>
          </div>
        )}

{showUpdateForm && updateActivityData && (
  <div style={styles.formModal}>
    <h2>Update Activity</h2>
    <form>
      <div style={styles.formRow}><label>Name: </label><input type="text" value={updateActivityData.Name} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Name: e.target.value })} readOnly /></div>
      <div style={styles.formRow}><label>Date: </label><input type="date" value={updateActivityData.Date} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Date: e.target.value })} /></div>
      <div style={styles.formRow}><label>Time: </label><input type="time" value={updateActivityData.Time} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Time: e.target.value })} /></div>
      <div style={styles.formRow}><label>Price: </label><input type="number" value={updateActivityData.Price} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Price: e.target.value })} /></div>
      <div style={styles.formRow}><label>Special Discount: </label><input type="number" value={updateActivityData.SpecialDiscount} onChange={(e) => setUpdateActivityData({ ...updateActivityData, SpecialDiscount: e.target.value })} /></div>
      <div style={styles.formRow}><label>Booking Status: </label><input type="checkbox" checked={updateActivityData.BookingOpen} onChange={(e) => setUpdateActivityData({ ...updateActivityData, BookingOpen: e.target.checked })} /></div>
      <div style={styles.formRow}><label>Location: </label><input type="text" placeholder="Address" value={updateActivityData.Location.address || ''} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Location: { ...updateActivityData.Location, address: e.target.value } })} /></div>
      <div style={styles.formRow}><label>Longitude: </label><input type="number" value={updateActivityData.Location.longitude || ''} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Location: { ...updateActivityData.Location, longitude: e.target.value } })} /></div>
      <div style={styles.formRow}><label>Latitude: </label><input type="number" value={updateActivityData.Location.latitude || ''} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Location: { ...updateActivityData.Location, latitude: e.target.value } })} /></div>
      <div style={styles.formRow}><label>Category: </label><input type="text" value={updateActivityData.Category} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Category: e.target.value })} /></div>
      <div style={styles.formRow}><label>Tags: </label><input type="text" value={updateActivityData.Tags.join(', ')} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Tags: e.target.value.split(', ') })} /></div>
      <button type="button" style={styles.button} onClick={updateActivity}>Save Changes</button>
    </form>
  </div>
)}

      </div>
    </div>
  );
};

// Inline styling with white and green theme
const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    background: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginTop: '20px'
  },
  header: {
    backgroundColor: '#218838',
    color: 'white',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
    textAlign: 'left'
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    marginLeft: 'auto'
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px'
  },
  mainContent: {
    textAlign: 'left'
  },
  error: {
    color: 'red'
  },
  activitiesList: {
    marginTop: '15px'
  },
  activityItem: {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px'
  },
  formRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    alignItems: 'center'
  },
  formModal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    border: '1px solid #218838'
  },
  button: {
    backgroundColor: '#218838',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  }
};

export default HomePageAdvertiser;
