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
  const [updateActivityData, setUpdateActivityData] = useState(null); // State to store data for updating an activity

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

  const openUpdateForm = (activity) => {
    setUpdateActivityData(activity);
    setShowUpdateForm(true);
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

  useEffect(() => {
    loadMyActivities();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Beyond Borders</h1>
        <nav>
          <ul style={styles.navList}>
            <li><a href="#" style={styles.navLink} onClick={loadMyActivities}>My Activities</a></li>
            <li><button style={styles.button} onClick={() => setShowCreateForm(true)}>Create New Activity</button></li>
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
                    <p>Date: {new Date(activity.Date).toLocaleDateString()}</p>
                    <p>Time: {activity.Time}</p>
                    <p>Price: ${activity.Price}</p>
                    <p>Location: {activity.Location.address || 'N/A'}</p>
                    <button style={styles.button} onClick={() => openUpdateForm(activity)}>Update</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showUpdateForm && updateActivityData && (
          <div style={styles.formModal}>
            <h2>Update Activity</h2>
            <form>
              <div style={styles.formRow}><label>Name: </label><input type="text" value={updateActivityData.Name} readOnly /></div>
              <div style={styles.formRow}><label>Date: </label><input type="date" value={updateActivityData.Date} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Date: e.target.value })} /></div>
              <div style={styles.formRow}><label>Time: </label><input type="time" value={updateActivityData.Time} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Time: e.target.value })} /></div>
              <div style={styles.formRow}><label>Special Discount: </label><input type="number" value={updateActivityData.SpecialDiscount} onChange={(e) => setUpdateActivityData({ ...updateActivityData, SpecialDiscount: e.target.value })} /></div>
              <div style={styles.formRow}><label>Booking Status: </label><input type="checkbox" checked={updateActivityData.BookingOpen} onChange={(e) => setUpdateActivityData({ ...updateActivityData, BookingOpen: e.target.checked })} /></div>
              <div style={styles.formRow}><label>Price: </label><input type="number" value={updateActivityData.Price} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Price: e.target.value })} /></div>
              <div style={styles.formRow}><label>Location: </label><input type="text" placeholder="Address" value={updateActivityData.Location.address} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Location: { ...updateActivityData.Location, address: e.target.value } })} /></div>
              <div style={styles.formRow}><label>Longitude: </label><input type="number" value={updateActivityData.Location.longitude} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Location: { ...updateActivityData.Location, longitude: e.target.value } })} /></div>
              <div style={styles.formRow}><label>Latitude: </label><input type="number" value={updateActivityData.Location.latitude} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Location: { ...updateActivityData.Location, latitude: e.target.value } })} /></div>
              <div style={styles.formRow}><label>Category: </label><input type="text" value={updateActivityData.Category} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Category: e.target.value })} /></div>
              <div style={styles.formRow}><label>Tags: </label><input type="text" placeholder="Comma-separated tags" value={updateActivityData.Tags.join(',')} onChange={(e) => setUpdateActivityData({ ...updateActivityData, Tags: e.target.value.split(',') })} /></div>
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
