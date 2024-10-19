import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePageAdvertiser = () => {
  // State management
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
    <div className="container">
      {/* Header Section */}
      <div className="header">
        <h1>Beyond Borders</h1>
        <nav>
          <ul>
            <li><a href="#" onClick={loadMyActivities}>My Activities</a></li>
            <li><a href="#" onClick={loadProfile}>My Profile</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {isLoggedIn && (
          <div>
            <h2>My Activities</h2>
            {activities.length === 0 ? (
              <p>No activities found.</p>
            ) : (
              <div className="activities-list">
                {activities.map((activity, index) => (
                  <div key={index} className="activity-item">
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
        <style jsx="true">{`
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    justify-content: flex-start;
    text-align: left;
  }
  .header {
    background-color: #218838;
    color: white;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  nav ul {
    list-style: none;
    display: flex;
    gap: 35px;
    margin-left: 500px;
  }
  nav ul li {
    display: inline;
  }
  nav ul li a {
    color: #fff;
    text-decoration: none;
  }
  nav ul li a:hover {
    color: #95d0a2;
    text-decoration: none;
  }

  .header h1 {
    margin: 0;
    font-size: 24px;
    text-align: left;
  }
  .button-container {
    margin-left: 15px;
  }
  .button-container button {
    background-color: #40be5b;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 20px;
    transition: background-color 0.3s;
  }
  .button-container button:hover {
    background-color: #7ccf8e;
  }
  .container {
    max-width: 800px;
    margin: auto;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }
  .activity-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
  }
  .form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  label {
    width: 30%;
  }
`}</style>


        {showProfile && (
          <div>
            <h2>My Profile</h2>
            <form>
              <div className="form-row">
                <label>Username: </label>
                <input type="text" value={profile.Username || ''} readOnly />
              </div>
              <div className="form-row">
                <label>Email: </label>
                <input type="email" value={profile.Email || ''} onChange={(e) => setProfile({ ...profile, Email: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Password: </label>
                <input type="password" value={profile.Password || ''} onChange={(e) => setProfile({ ...profile, Password: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Company Profile: </label>
                <input type="text" value={profile.CompanyProfile || ''} onChange={(e) => setProfile({ ...profile, CompanyProfile: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Hotline: </label>
                <input type="text" value={profile.Hotline || ''} onChange={(e) => setProfile({ ...profile, Hotline: e.target.value })} />
              </div>
              <div className="form-row">
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

export default HomePageAdvertiser;
