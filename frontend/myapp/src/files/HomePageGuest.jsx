import React, { useState } from 'react';
import axios from 'axios';

const HomePageGuest = () => {
  const [activities, setActivities] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalType, setModalType] = useState(null); // Tracks which modal is open
  const [expandedItems, setExpandedItems] = useState({});
  const [tags, setTags] = useState('');
  const [expandedMuseumIndex, setExpandedMuseumIndex] = useState(null);
  const [expandedHistoricalPlaceIndex, setExpandedHistoricalPlaceIndex] = useState(null);
  

  const [isMuseumsModalOpen, setMuseumsModalOpen] = useState(false);

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

  // Fetch all museums
  const viewAllMuseums = async () => {
    try {
      const response = await fetch('/api/ViewAllUpcomingMuseumEventsGuest');
      const museumsData = await response.json();
      if (response.ok) {
        setMuseums(museumsData);
        setMuseumsModalOpen(true); // Open modal after setting museums data
      } else {
        alert('Failed to fetch museums: ' + (museumsData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching museums:', error);
      alert('An error occurred while loading museums.');
    }
  };

  // Close museums modal
  const closeMuseumsModal = () => {
    setMuseumsModalOpen(false);
  };

  // Handle tag filtering for museums
  const handleTagFilter = async () => {
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    if (tagsArray.length === 0) {
      alert('Please enter at least one tag to filter.');
      return;
    }

    try {
      const response = await fetch('/api/getMuseumsByTagGuest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tags: tagsArray })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to fetch museums.');
        return;
      }

      const filteredMuseums = await response.json();
      setMuseums(filteredMuseums); // Display filtered museums
    } catch (error) {
      console.error('Error fetching filtered museums:', error);
      alert('An error occurred while fetching museums.');
    }
  };

  // Toggle details visibility for Museums
  const toggleMuseumDetails = (index) => {
    setExpandedMuseumIndex(expandedMuseumIndex === index ? null : index);
  };
// Toggle details visibility for Historical Places
const toggleHistoricalPlaceDetails = (index) => {
  setExpandedHistoricalPlaceIndex(expandedHistoricalPlaceIndex === index ? null : index);
};


  // Display individual museum details
const displayMuseums = () => {
  return museums.map((museum, index) => (
    <div key={index} className="museum" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
      <h3 style={{ display: 'inline' }}>{museum.name}</h3>
      <button onClick={() => toggleMuseumDetails(index)} style={{ marginLeft: '10px' }}>
        {expandedMuseumIndex === index ? "Hide Details" : "View Details"}
      </button>

      {expandedMuseumIndex === index && (
        <div className="details" style={{ display: 'block', marginTop: '10px' }}>
          <p>Description: {museum.description}</p>
          <p>Pictures: {museum.pictures.join(', ')}</p>
          <p>Location: {museum.location}</p>
          <p>Opening Hours: {museum.openingHours}</p>
          <p>Ticket Prices: Foreigner: {museum.ticketPrices.foreigner}, Native: {museum.ticketPrices.native}, Student: {museum.ticketPrices.student}</p>
          <p>Author: {museum.AuthorUsername}</p>
          <p>Historical Tags: {museum.HistoricalTags.join(', ')}</p>
          <p>Date of Event: {museum.dateOfEvent ? new Date(museum.dateOfEvent).toLocaleDateString() : 'N/A'}</p>
        </div>
      )}
    </div>
  ));
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

  // Fetch Historical Places
  const fetchHistoricalPlaces = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/ViewAllUpcomingHistoricalPlacesEventsGuest');
      setHistoricalPlaces(response.data);
      openModal('historicalPlaces');
    } catch {
      setError('Error fetching historical places');
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

   // Apply Filters, including Category
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

  const applyHistoricalPlacesFilter = async () => {
    setLoading(true);
    setError('');
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const response = await axios.post('/api/getHistoricalPlacesByTagGuest', { tags: tagsArray });
      if (response.status === 200) {
        setHistoricalPlaces(response.data);
      } else {
        setError(response.data.error || 'Failed to filter historical places');
      }
    } catch (err) {
      console.error(err);
      setError('Error filtering historical places');
    } finally {
      setLoading(false);
    }
  };

   // Sorting function for activities
   const sortActivities = (criterion, order) => {
    const sortedActivities = [...activities].sort((a, b) => {
      let valueA, valueB;

      // Set values based on sorting criterion
      if (criterion === 'Price') {
        valueA = parseFloat(a.Price) || 0;
        valueB = parseFloat(b.Price) || 0;
      } else if (criterion === 'Rating') {
        valueA = parseFloat(a.Rating) || 0;
        valueB = parseFloat(b.Rating) || 0;
      } else if (criterion === 'Date') {
        valueA = new Date(a.Date).getTime() || 0;
        valueB = new Date(b.Date).getTime() || 0;
      }

      // Perform sorting
      return order === 'Ascending' ? valueA - valueB : valueB - valueA;
    });

    setActivities(sortedActivities);
    console.log(`Sorted by ${criterion} (${order}):`, sortedActivities); // Debugging line
  };
  

  const sortItineraries = (order) => {
    const sortedItineraries = [...itineraries].sort((a, b) => {
      return order === 'Ascending' ? a.Price - b.Price : b.Price - a.Price;
    });
    setItineraries(sortedItineraries);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Beyond Borders</h1>
        <button style={styles.button} onClick={fetchActivities}>View All Activities</button>
        <button style={styles.button} onClick={viewAllMuseums}>View All Museums</button>
        <button style={styles.button} onClick={fetchItineraries}>View All Itineraries</button>
        <button style={styles.button} onClick={fetchHistoricalPlaces}>View All Historical Places</button>
      </header>

      <div style={styles.mainContent}>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}
 {/* Activities Modal */}
 {modalType === 'activities' && (
        <Modal onClose={closeModal} title="Upcoming Activities">
          <ActivityFilters onApply={applyFilters} />
          <button onClick={() => sortActivities('Price', 'Descending')}>Sort by Price (Descending)</button>
          <button onClick={() => sortActivities('Price', 'Ascending')}>Sort by Price (Ascending)</button>
          <button onClick={() => sortActivities('Rating', 'Descending')}>Sort by Rating (Descending)</button>
          <button onClick={() => sortActivities('Rating', 'Ascending')}>Sort by Rating (Ascending)</button>
          <button onClick={() => sortActivities('Date', 'Descending')}>Sort by Date (Newest)</button>
          <button onClick={() => sortActivities('Date', 'Ascending')}>Sort by Date (Oldest)</button>
          {activities.length > 0 ? <ContentList items={activities} /> : <p>No activities found.</p>}
        </Modal>
      )}

      {/* Museums Modal */}
{isMuseumsModalOpen && (
  <div className="modal" style={{
    display: 'block', position: 'fixed', zIndex: 1, left: 0, top: 0, width: '100%', height: '100%', overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)', paddingTop: '60px'
  }}>
    <div className="modal-content" style={{
      backgroundColor: '#fefefe', margin: '5% auto', padding: '20px', border: '1px solid #888',
      width: '80%', maxWidth: '600px', borderRadius: '8px'
    }}>
      <span className="close" onClick={closeMuseumsModal} style={{
        color: '#aaa', float: 'right', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer'
      }}>&times;</span>
      <h2>Upcoming Museum Events</h2>

      {/* Tag Filtering Section */}
      <label htmlFor="tags">Filter by Tags (comma-separated):</label>
      <input
        type="text"
        id="tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Enter tags"
        style={{ display: 'block', margin: '10px 0', padding: '5px', width: '100%' }}
      />
      <button onClick={handleTagFilter} style={{
        backgroundColor: '#40be5b', color: 'white', padding: '10px 20px', border: 'none',
        borderRadius: '4px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s'
      }}>Apply Tag Filter</button>

      {/* Display Museums with Toggle Details */}
      <div id="museumsContainerModal" style={{ marginTop: '20px' }}>
        {museums.map((museum, index) => (
          <div key={index} className="museum" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
            <h3 style={{ display: 'inline' }}>{museum.name || 'Unnamed Museum'}</h3>
            <button onClick={() => toggleMuseumDetails(index)} style={{ marginLeft: '10px' }}>
              {expandedMuseumIndex === index ? "Hide Details" : "View Details"}
            </button>
            
            {expandedMuseumIndex === index && (
              <div className="details" style={{ display: 'block', marginTop: '10px' }}>
                {museum.description && <p><strong>Description:</strong> {museum.description}</p>}
                {museum.pictures && (
                  <p>
                    <strong>Pictures:</strong> {museum.pictures.join(', ')}
                  </p>
                )}
                {museum.location && <p><strong>Location:</strong> {museum.location}</p>}
                {museum.openingHours && <p><strong>Opening Hours:</strong> {museum.openingHours}</p>}
                {museum.ticketPrices && (
                  <p>
                    <strong>Ticket Prices:</strong>
                    <ul>
                      {museum.ticketPrices.foreigner && <li>Foreigner: ${museum.ticketPrices.foreigner}</li>}
                      {museum.ticketPrices.native && <li>Native: ${museum.ticketPrices.native}</li>}
                      {museum.ticketPrices.student && <li>Student: ${museum.ticketPrices.student}</li>}
                    </ul>
                  </p>
                )}
                {museum.author && <p><strong>Author:</strong> {museum.author}</p>}
                {museum.historicalTags && (
                  <p><strong>Historical Tags:</strong> {museum.historicalTags.join(', ')}</p>
                )}
                {museum.dateOfEvent && (
                  <p><strong>Date of Event:</strong> {new Date(museum.dateOfEvent).toLocaleDateString()}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}


     {/* Historical Places Modal */}
{modalType === 'historicalPlaces' && (
  <Modal onClose={closeModal} title="Upcoming Historical Places Events">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyHistoricalPlacesFilter();
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
      {historicalPlaces.map((item, index) => (
        <div key={index} style={styles.activityItem}>
          <h3 style={styles.title}>{item.name || 'Unnamed Historical Place'}</h3>
          <button style={styles.button} onClick={() => toggleHistoricalPlaceDetails(index)}>
            {expandedHistoricalPlaceIndex === index ? 'Hide Details' : 'View Details'}
          </button>
          
          {expandedHistoricalPlaceIndex === index && (
            <div style={styles.details}>
              {item.description && <p><strong>Description:</strong> {item.description}</p>}
              {item.pictures && (
                <p>
                  <strong>Pictures:</strong> {item.pictures.join(', ')}
                </p>
              )}
              {item.location && <p><strong>Location:</strong> {item.location}</p>}
              {item.openingHours && <p><strong>Opening Hours:</strong> {item.openingHours}</p>}
              {item.ticketPrices && (
                <p>
                  <strong>Ticket Prices:</strong>
                  <ul>
                    {item.ticketPrices.foreigner && <li>Foreigner: ${item.ticketPrices.foreigner}</li>}
                    {item.ticketPrices.native && <li>Native: ${item.ticketPrices.native}</li>}
                    {item.ticketPrices.student && <li>Student: ${item.ticketPrices.student}</li>}
                  </ul>
                </p>
              )}
              {item.author && <p><strong>Author:</strong> {item.author}</p>}
              {item.tags && (
                <p><strong>Tags:</strong> {item.tags.join(', ')}</p>
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


const ActivityFilters = ({ onApply }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      category: e.target.category.value || undefined,
      minPrice: e.target.minPrice.value ? parseFloat(e.target.minPrice.value) : undefined,
      maxPrice: e.target.maxPrice.value ? parseFloat(e.target.maxPrice.value) : undefined,
      date: selectedDate || undefined,
      rating: e.target.rating.value ? parseInt(e.target.rating.value) : undefined
    };
    onApply(filters);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Category:</label>
      <input type="text" name="category" placeholder="Enter category" />
      <label>Min Price:</label>
      <input type="number" name="minPrice" placeholder="Minimum Price" />
      <label>Max Price:</label>
      <input type="number" name="maxPrice" placeholder="Maximum Price" />
      <label>Date:</label>
      <input 
        type="date" 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)} 
      />
      <label>Rating:</label>
      <input type="number" name="rating" min="1" max="5" placeholder="Rating" />
      <button type="submit">Apply Filter</button>
    </form>
  );
};




// Itinerary Filters Component
const ItineraryFilters = ({ onApply }) => {
  const [selectedDate, setSelectedDate] = useState("");  // Define selectedDate and setSelectedDate here

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      Language: e.target.language.value,
      MinPrice: e.target.minPrice.value ? parseFloat(e.target.minPrice.value) : undefined,
      MaxPrice: e.target.maxPrice.value ? parseFloat(e.target.maxPrice.value) : undefined,
      InputDate: selectedDate || undefined,  // Use selectedDate here
      Tags: e.target.tags.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onApply(filters);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.filterForm}>
      <input type="text" name="language" placeholder="Language" style={styles.input} />
      <input type="number" name="minPrice" placeholder="Min Price" style={styles.input} />
      <input type="number" name="maxPrice" placeholder="Max Price" style={styles.input} />
      <input 
        type="date" 
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}  // Use setSelectedDate for the date input
        style={styles.input} 
      />
      <input type="text" name="tags" placeholder="Tags (comma-separated)" style={styles.input} />
      <button style={styles.button} type="submit">Apply Filter</button>
    </form>
  );
};

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
