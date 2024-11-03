import React, { useState } from 'react';
import axios from 'axios';

const HomePageGuest = () => {
  const [activities, setActivities] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  
  const displayMuseums = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/museums');
      if (response.status === 200) {
        setMuseums(response.data);
        openModal('museums');
      } else {
        setError('Failed to load museums');
      }
    } catch (error) {
      setError('Error fetching museums');
    } finally {
      setLoading(false);
    }
  };
  


  const displayActivities = async (endpoint) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(endpoint);
      if (response.status === 200) {
        setActivities(response.data);
        openModal('activities');
      } else {
        setError('Failed to load activities');
      }
    } catch (error) {
      setError('Error fetching activities');
    } finally {
      setLoading(false);
    }
  };

  const displayHistoricalPlaces = async (endpoint) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(endpoint);
      if (response.status === 200) {
        setHistoricalPlaces(response.data);
        openModal('historicalPlaces');
      } else {
        setError('Failed to load historical places');
      }
    } catch (error) {
      setError('Error fetching historical places');
    } finally {
      setLoading(false);
    }
  };
  

  const sortActivities = (criterion, order) => {
    const sortedData = [...activities].sort((a, b) => {
      if (criterion === 'Price') {
        return order === 'Ascending' ? a.Price - b.Price : b.Price - a.Price;
      } else if (criterion === 'Rating') {
        return order === 'Ascending' ? a.Rating - b.Rating : b.Rating - a.Rating;
      }
      return 0;
    });
    setActivities(sortedData);
  };
  
  

  const displayItineraries = async (endpoint) => {
    setLoading(true);
    setError('');
    try {
        const response = await axios.get(endpoint);
        console.log("API response for itineraries:", response.data); // Log response data
        if (response.status === 200) {
            const sortedData = response.data.sort((a, b) => a.Price - b.Price); // Default sorting by price ascending
            setItineraries(sortedData);
            openModal('itineraries'); // Open modal after data is set and sorted
        } else {
            setError('Failed to load itineraries');
        }
    } catch (error) {
        setError('Error fetching itineraries');
    } finally {
        setLoading(false);
    }
};


const sortItineraries = (order) => {
  const sortedData = [...itineraries].sort((a, b) => {
    return order === 'Ascending' ? a.Price - b.Price : b.Price - a.Price;
  });
  setItineraries(sortedData);
};


  const filterActivities = async (filters) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/filterActivities', filters);
      if (response.status === 200) {
        setActivities(response.data);
        openModal('activities');
      } else {
        setError('Failed to filter activities');
      }
    } catch (error) {
      setError('Error filtering activities');
    } finally {
      setLoading(false);
    }
  };

  const handleActivityFilterSubmit = (e) => {
    e.preventDefault();
    const filters = {
      Category: e.target.category.value || undefined,
      minPrice: e.target.minPrice.value ? parseFloat(e.target.minPrice.value) : undefined,
      maxPrice: e.target.maxPrice.value ? parseFloat(e.target.maxPrice.value) : undefined,
      InputDate: e.target.InputDate.value || undefined,
      Rating: e.target.Rating.value ? parseInt(e.target.Rating.value) : undefined
    };
    filterActivities(filters);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Beyond Borders</h1>
        <nav>
          <ul style={styles.navList}>
            <li><a href="#" style={styles.navLink} onClick={() => displayActivities('/api/ViewAllUpcomingActivitiesGuest')}>View All Activities</a></li>
            <li><a href="#" style={styles.navLink} onClick={displayMuseums}>View All Museums</a></li>
            <li><a href="#" style={styles.navLink} onClick={() => openModal('itineraries')}>View All Itineraries</a></li>
            {/* <li><a href="#" style={styles.navLink} onClick={() => openModal('historicalPlaces')}>View All Historical Places</a></li> */}
            <li><a href="#" style={styles.navLink} onClick={() => displayHistoricalPlaces('/api/ViewAllUpcomingHistoricalPlacesEventsGuest')}>View All Historical Places</a></li>

          </ul>
        </nav>
      </header>

      <div style={styles.mainContent}>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Activities Modal */}
        {modalType === 'activities' && (
  <Modal onClose={closeModal} title="Activities">
    <form onSubmit={handleActivityFilterSubmit}>
      <input type="text" name="category" placeholder="Category" />
      <input type="number" name="minPrice" placeholder="Min Price" />
      <input type="number" name="maxPrice" placeholder="Max Price" />
      <input type="date" name="InputDate" />
      <input type="number" name="Rating" min="1" max="5" placeholder="Rating (1-5)" />
      <button type="submit">Apply Filter</button>
    </form>
    <button onClick={() => sortActivities('Price', 'Descending')}>Sort by Price Descending</button>
    <button onClick={() => sortActivities('Price', 'Ascending')}>Sort by Price Ascending</button>
    <button onClick={() => sortActivities('Rating', 'Descending')}>Sort by Rating Descending</button>
    <button onClick={() => sortActivities('Rating', 'Ascending')}>Sort by Rating Ascending</button>
    <ContentList items={activities} />
  </Modal>
)}

        {modalType === 'historicalPlaces' && (
  <Modal onClose={closeModal} title="Historical Places">
    <ContentList items={historicalPlaces} />
  </Modal>
)}
      {modalType === 'museums' && (
          <Modal onClose={closeModal} title="Museums">
            <ContentList items={museums} />
          </Modal>
        )}


        {/* Itineraries Modal */}
        {modalType === 'itineraries' && (
          <Modal onClose={closeModal} title="Itineraries">
            <button onClick={() => sortItineraries('Descending')}>Sort by Price Descending</button>
            <button onClick={() => sortItineraries('Ascending')}>Sort by Price Ascending</button>
            <ContentList items={itineraries} />
          </Modal>
        )}
      </div>
    </div>
  );
};

const Modal = ({ onClose, title, children }) => (
  <div style={styles.modal}>
    <div style={styles.modalContent}>
      <span style={styles.close} onClick={onClose}>&times;</span>
      <h2>{title}</h2>
      {children}
    </div>
  </div>
);


const ContentList = ({ items }) => (
  <div style={styles.activitiesList}>
    {items.length === 0 ? (
      <p>No items found.</p>
    ) : (
      items.map((item, index) => (
        <div key={index} style={styles.activityItem}>
          <h3>{item.Name || item.name || item.Title}</h3>
          {item.Date && <p>Date: {new Date(item.Date).toLocaleDateString()}</p>}
          {item.Time && <p>Time: {item.Time}</p>}
          {item.Price && <p>Price: ${item.Price}</p>}
          {item.Location?.address && <p>Location: {item.Location.address}</p>}
          {item.description && <p>Description: {item.description}</p>}
          {/* Additional fields as needed */}
        </div>
      ))
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
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)', // Slightly darker overlay for better focus
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000 // Ensure it appears above other elements
  },
  modalContent: {
    backgroundColor: '#fefefe',
    padding: '20px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh', // Set max height for scrolling
    overflowY: 'auto',  // Enables scrolling within the modal content
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)'
  },
  close: {
    fontSize: '24px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: '15px',
    right: '20px',
    color: '#000',
  },
  activitiesList: {
    marginTop: '15px'
  },
  activityItem: {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  details: {
    marginTop: '10px',
    padding: '10px',
    borderTop: '1px solid #ddd',
  },
};

export default HomePageGuest;
