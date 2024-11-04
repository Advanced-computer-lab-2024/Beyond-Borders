import React, { useState } from 'react';
import axios from 'axios';

const HomePageGuest = () => {
  const [activities, setActivities] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalType, setModalType] = useState(null); // Tracks which modal is open
  const [expandedItems, setExpandedItems] = useState({});
  const [tags, setTags] = useState('');

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  // Fetch Activities
  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/ViewAllUpcomingActivitiesGuest');
      setActivities(response.data);
      openModal('activities');
    } catch {
      setError('Error fetching activities');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Museums
  const fetchMuseums = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/ViewAllUpcomingMuseumEventsGuest');
      setMuseums(response.data);
      openModal('museums');
    } catch {
      setError('Error fetching museums');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Itineraries
  const fetchItineraries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/ViewAllUpcomingItinerariesGuest');
      setItineraries(response.data);
      openModal('itineraries');
    } catch {
      setError('Error fetching itineraries');
    } finally {
      setLoading(false);
    }
  };

  const applyTagFilter = async () => {
    setLoading(true);
    setError('');
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const response = await axios.post('/api/getMuseumsByTagGuest', { tags: tagsArray });
      if (response.status === 200) {
        setMuseums(response.data);
      } else {
        setError(response.data.error || 'Failed to filter museums');
      }
    } catch (err) {
      console.error(err);
      setError('Error filtering museums');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async (filters) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/filterActivities', filters);
      setActivities(response.data);
    } catch {
      setError('Error applying filters');
    } finally {
      setLoading(false);
    }
  };

  const applyItineraryFilters = async (filters) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/filterItinerariesTourist', filters);
      setItineraries(response.data);
      openModal('itineraries');
    } catch {
      setError('Error applying filters to itineraries');
    } finally {
      setLoading(false);
    }
  };

  const sortActivities = (criterion, order) => {
    const sortedActivities = [...activities].sort((a, b) => {
      if (criterion === 'Price') return order === 'Ascending' ? a.Price - b.Price : b.Price - a.Price;
      if (criterion === 'Rating') return order === 'Ascending' ? a.Rating - b.Rating : b.Rating - a.Rating;
      return 0;
    });
    setActivities(sortedActivities);
  };

  const sortItineraries = (order) => {
    const sortedItineraries = [...itineraries].sort((a, b) => {
      return order === 'Ascending' ? a.Price - b.Price : b.Price - a.Price;
    });
    setItineraries(sortedItineraries);
  };

  const toggleDetails = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Beyond Borders</h1>
        <button style={styles.button} onClick={fetchActivities}>
          View All Activities
        </button>
        <button style={styles.button} onClick={fetchMuseums}>
          View All Museums
        </button>
        <button style={styles.button} onClick={fetchItineraries}>
          View All Itineraries
        </button>
      </header>

      <div style={styles.mainContent}>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Activities Modal */}
        {modalType === 'activities' && (
          <Modal onClose={closeModal} title="Upcoming Activities">
            <ActivityFilters onApply={applyFilters} />
            <button style={styles.button} onClick={() => sortActivities('Price', 'Descending')}>Sort by Price (Descending)</button>
            <button style={styles.button} onClick={() => sortActivities('Price', 'Ascending')}>Sort by Price (Ascending)</button>
            <button style={styles.button} onClick={() => sortActivities('Rating', 'Descending')}>Sort by Rating (Descending)</button>
            <button style={styles.button} onClick={() => sortActivities('Rating', 'Ascending')}>Sort by Rating (Ascending)</button>
            {activities.length > 0 ? <ContentList items={activities} /> : <p>No activities found.</p>}
          </Modal>
        )}

        {/* Museums Modal */}
        {modalType === 'museums' && (
          <Modal onClose={closeModal} title="Upcoming Museum Events">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyTagFilter();
              }}
              style={styles.form}
            >
              <label>Filter by Tags (comma-separated):</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags"
                style={styles.input}
              />
              <button style={styles.button} type="submit">Apply Tag Filter</button>
            </form>

            <div style={styles.activitiesList}>
              {museums.map((item, index) => (
                <div key={index} style={styles.activityItem}>
                  <h3 style={styles.title}>{item.Name || item.Title || 'Unnamed Museum'}</h3>
                  <button style={styles.button} onClick={() => toggleDetails(index)}>
                    {expandedItems[index] ? 'Hide Details' : 'View Details'}
                  </button>
                  {expandedItems[index] && (
                    <div style={styles.details}>
                      {item.description && <p><strong>Description:</strong> {item.description}</p>}
                      {item.pictures && (
                        <p>
                          <strong>Pictures:</strong> {item.pictures.join(', ')}
                        </p>
                      )}
                      {item.Location && <p><strong>Location:</strong> {item.Location}</p>}
                      {item.OpeningHours && <p><strong>Opening Hours:</strong> {item.OpeningHours}</p>}
                      {item.TicketPrices && (
                        <p>
                          <strong>Ticket Prices:</strong>
                          <ul>
                            {item.TicketPrices.foreigner && <li>Foreigner: ${item.TicketPrices.foreigner}</li>}
                            {item.TicketPrices.native && <li>Native: ${item.TicketPrices.native}</li>}
                            {item.TicketPrices.student && <li>Student: ${item.TicketPrices.student}</li>}
                          </ul>
                        </p>
                      )}
                      {item.author && <p><strong>Author:</strong> {item.author}</p>}
                      {item.HistoricalTags && (
                        <p><strong>Historical Tags:</strong> {item.HistoricalTags.join(', ')}</p>
                      )}
                      {item.dateOfEvent && (
                        <p><strong>Date of Event:</strong> {new Date(item.dateOfEvent).toLocaleDateString()}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Modal>
        )}

        {/* Itineraries Modal */}
        {modalType === 'itineraries' && (
          <Modal onClose={closeModal} title="Upcoming Itinerary Events">
            <ItineraryFilters onApply={applyItineraryFilters} />
            <div style={styles.sortingButtons}>
              <button style={styles.button} onClick={() => sortItineraries('Descending')}>Sort by Price (Descending)</button>
              <button style={styles.button} onClick={() => sortItineraries('Ascending')}>Sort by Price (Ascending)</button>
            </div>
            <ContentList items={itineraries} />
          </Modal>
        )}
      </div>
    </div>
  );
};

// Reusable Modal Component
const Modal = ({ onClose, title, children }) => (
  <div style={styles.modal}>
    <div style={styles.modalContent}>
      <span style={styles.close} onClick={onClose}>
        &times;
      </span>
      <h2>{title}</h2>
      {children}
    </div>
  </div>
);

// Activity Filters Component
const ActivityFilters = ({ onApply }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      category: e.target.category.value,
      minPrice: e.target.minPrice.value ? parseFloat(e.target.minPrice.value) : undefined,
      maxPrice: e.target.maxPrice.value ? parseFloat(e.target.maxPrice.value) : undefined,
      date: e.target.date.value,
      rating: e.target.rating.value ? parseInt(e.target.rating.value) : undefined
    };
    onApply(filters);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.filterForm}>
      <label>Category:</label>
      <input type="text" name="category" placeholder="Enter category" style={styles.input} />
      <label>Min Price:</label>
      <input type="number" name="minPrice" placeholder="Minimum Price" style={styles.input} />
      <label>Max Price:</label>
      <input type="number" name="maxPrice" placeholder="Maximum Price" style={styles.input} />
      <label>Date:</label>
      <input type="date" name="date" style={styles.input} />
      <label>Rating:</label>
      <input type="number" name="rating" min="1" max="5" placeholder="Rating" style={styles.input} />
      <button style={styles.button} type="submit">Apply Filter</button>
    </form>
  );
};

// Itinerary Filters Component
const ItineraryFilters = ({ onApply }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      Language: e.target.language.value,
      MinPrice: e.target.minPrice.value ? parseFloat(e.target.minPrice.value) : undefined,
      MaxPrice: e.target.maxPrice.value ? parseFloat(e.target.maxPrice.value) : undefined,
      InputDate: e.target.InputDate.value,
      Tags: e.target.tags.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onApply(filters);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.filterForm}>
      <input type="text" name="language" placeholder="Language" style={styles.input} />
      <input type="number" name="minPrice" placeholder="Min Price" style={styles.input} />
      <input type="number" name="maxPrice" placeholder="Max Price" style={styles.input} />
      <input type="date" name="InputDate" style={styles.input} />
      <input type="text" name="tags" placeholder="Tags (comma-separated)" style={styles.input} />
      <button style={styles.button} type="submit">Apply Filter</button>
    </form>
  );
};

// Content List Component for Activities
const ContentList = ({ items }) => (
  <div style={styles.activitiesList}>
    {items.map((item, index) => (
      <div key={index} style={styles.activityItem}>
        <h3>{item.Name || item.Title}</h3>
        {item.Price && <p>Price: ${item.Price}</p>}
        {item.Rating && <p>Rating: {item.Rating}</p>}
        {item.Date && <p>Date: {new Date(item.Date).toLocaleDateString()}</p>}
      </div>
    ))}
  </div>
);

// Styling
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
  button: {
    backgroundColor: '#40be5b',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    margin: '5px 0'
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fefefe',
    padding: '20px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)'
  },
  close: {
    fontSize: '24px',
    cursor: 'pointer',
    position: 'absolute',
    top: '15px',
    right: '20px',
    color: '#000'
  },
  activitiesList: {
    marginTop: '15px'
  },
  activityItem: {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    width: '100%',
    boxSizing: 'border-box'
  },
  details: {
    marginTop: '10px',
    padding: '10px',
    borderTop: '1px solid #ddd'
  },
  sortingButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px'
  },
  filterForm: {
    marginBottom: '10px'
  }
};

export default HomePageGuest;
