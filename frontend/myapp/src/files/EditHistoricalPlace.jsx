import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditHistoricalPlace = () => {
  const [historicalPlace, setHistoricalPlace] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // State for ticket prices and tags
  const [ticketPrices, setTicketPrices] = useState({
    foreigner: '',
    native: '',
    student: '',
  });
  const [tags, setTags] = useState('');

  const loadHistoricalPlaceData = async () => {
    try {
      const AuthorUsername = localStorage.getItem('username');
      if (!AuthorUsername) {
        setErrorMessage('Author username not found. Please log in.');
        return;
      }

      const response = await axios.post('/readAllHistoricalPlace', { AuthorUsername });

      if (response.status === 200 && response.data.length > 0) {
        const place = response.data[0];
        setHistoricalPlace(place);
        setTicketPrices(place.ticketPrices || { foreigner: '', native: '', student: '' });
        setTags(place.HistoricalTags ? place.HistoricalTags.join(', ') : '');
        setErrorMessage('');
      } else {
        setErrorMessage('No historical place details found for this author.');
      }
    } catch (error) {
      console.error('Error fetching historical place details:', error);
      setErrorMessage('An error occurred while fetching historical place details. Please try again.');
    }
  };

  const handleUpdateHistoricalPlace = async (event) => {
    event.preventDefault();

    const updatedPlace = {
      name: historicalPlace.name,
      description: historicalPlace.description,
      location: historicalPlace.location,
      openingHours: historicalPlace.openingHours,
      ticketPrices,
      AuthorUsername: localStorage.getItem('username'),
      HistoricalTags: document.getElementById('tag').value.split(',').map(tag => tag.trim()),
    };

    try {
      const response = await axios.put('/updateHistoricalPlace', updatedPlace);
      if (response.status === 200) {
        alert('Historical place updated successfully!');
        navigate('/HistoricalPlaceTG'); // Redirect to homepage after update
      } else {
        setErrorMessage(response.data.error || 'Failed to update the historical place.');
      }
    } catch (error) {
      console.error('Error updating historical place:', error);
      alert(`An error occurred while updating the historical place: ${error.message}`);
    }
  };

  useEffect(() => {
    loadHistoricalPlaceData();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Edit Historical Place</h2>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <form id="editHistoricalPlaceForm" onSubmit={handleUpdateHistoricalPlace}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Historical Place Name:</label>
            <input type="text" id="name" value={historicalPlace.name || ''} readOnly style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea id="description" defaultValue={historicalPlace.description || ''} style={styles.textarea} required></textarea>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" defaultValue={historicalPlace.location || ''} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="openingHours">Opening Hours:</label>
            <input type="text" id="openingHours" defaultValue={historicalPlace.openingHours || ''} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label>Ticket Prices:</label>
            <input type="number" id="ticketPriceForeigner" placeholder="Foreigner" value={ticketPrices.foreigner} onChange={e => setTicketPrices({ ...ticketPrices, foreigner: e.target.value })} required style={styles.input} />
            <input type="number" id="ticketPriceNative" placeholder="Native" value={ticketPrices.native} onChange={e => setTicketPrices({ ...ticketPrices, native: e.target.value })} required style={styles.input} />
            <input type="number" id="ticketPriceStudent" placeholder="Student" value={ticketPrices.student} onChange={e => setTicketPrices({ ...ticketPrices, student: e.target.value })} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="tag">Historical Tags (comma separated):</label>
            <input type="text" id="tag" defaultValue={historicalPlace.Tags ? historicalPlace.Tags.join(', ') : ''} style={styles.input} required />
          </div>
          <button type="submit" style={styles.button}>Update Historical Place</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    padding: '20px',
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    width: '100%',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default EditHistoricalPlace;
