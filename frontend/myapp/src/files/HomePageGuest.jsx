import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePageGuest = () => {
  const [activities, setActivities] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewType, setViewType] = useState('');

  const loadContent = async (type) => {
    setLoading(true);
    setError('');
    let endpoint = '';

    switch (type) {
      case 'activities':
        endpoint = '/api/ViewAllUpcomingActivitiesGuest';
        break;
      case 'museums':
        endpoint = '/api/ViewAllUpcomingMuseumEventsGuest';
        break;
      case 'itineraries':
        endpoint = '/api/ViewAllUpcomingItinerariesGuest';
        break;
      case 'historicalPlaces':
        endpoint = '/api/ViewAllUpcomingHistoricalPlacesEventsGuest';
        break;
      default:
        return;
    }

    try {
      const response = await axios.get(endpoint);
      if (response.status === 200) {
        if (type === 'activities') setActivities(response.data);
        if (type === 'museums') setMuseums(response.data);
        if (type === 'itineraries') setItineraries(response.data);
        if (type === 'historicalPlaces') setHistoricalPlaces(response.data);
        setViewType(type);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('Error fetching data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent('activities'); // Load activities by default on page load
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Beyond Borders</h1>
        <nav>
          <ul style={styles.navList}>
            <li><a href="#" style={styles.navLink} onClick={() => loadContent('activities')}>View All Activities</a></li>
            <li><a href="#" style={styles.navLink} onClick={() => loadContent('museums')}>View All Museums</a></li>
            <li><a href="#" style={styles.navLink} onClick={() => loadContent('itineraries')}>View All Itineraries</a></li>
            <li><a href="#" style={styles.navLink} onClick={() => loadContent('historicalPlaces')}>View All Historical Places</a></li>
          </ul>
        </nav>
      </header>

      <div style={styles.mainContent}>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {viewType === 'activities' && <ContentList items={activities} title="Activities" />}
        {viewType === 'museums' && <ContentList items={museums} title="Museums" />}
        {viewType === 'itineraries' && <ContentList items={itineraries} title="Itineraries" />}
        {viewType === 'historicalPlaces' && <ContentList items={historicalPlaces} title="Historical Places" />}
      </div>
    </div>
  );
};

const ContentList = ({ items, title }) => (
  <div>
    <h2>{title}</h2>
    {items.length === 0 ? (
      <p>No {title.toLowerCase()} found.</p>
    ) : (
      <div style={styles.activitiesList}>
        {items.map((item, index) => (
          <div key={index} style={styles.activityItem}>
            <h3>{item.Name || item.name || item.Title}</h3>
            {item.Date && <p>Date: {new Date(item.Date).toLocaleDateString()}</p>}
            {item.Time && <p>Time: {item.Time}</p>}
            {item.Price && <p>Price: ${item.Price}</p>}
            {item.Location?.address && <p>Location: {item.Location.address}</p>}
            {item.description && <p>Description: {item.description}</p>}
            {/* Add additional fields as needed */}
          </div>
        ))}
      </div>
    )}
  </div>
);

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
    fontSize: '24px'
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px'
  },
  navLink: {
    color: '#fff',
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
  }
};

export default HomePageGuest;
