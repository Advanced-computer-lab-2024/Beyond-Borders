import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePageAdvertiser = () => {
  const [activities, setActivities] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [profile, setProfile] = useState({});
  const [showProfile, setShowProfile] = useState(false);

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
            <li><a href="#" style={styles.navLink} onClick={loadProfile}>My Profile</a></li>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showProfile && (
          <div>
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
      </div>
    </div>
  );
};

// Inline styling
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
    gap: '35px',
    marginLeft: '500px'
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none'
  },
  navLinkHover: {
    color: '#95d0a2',
    textDecoration: 'none'
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
    marginBottom: '15px'
  },
  button: {
    backgroundColor: '#40be5b',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '20px',
    transition: 'background-color 0.3s'
  },
  buttonHover: {
    backgroundColor: '#7ccf8e'
  }
};

export default HomePageAdvertiser;
