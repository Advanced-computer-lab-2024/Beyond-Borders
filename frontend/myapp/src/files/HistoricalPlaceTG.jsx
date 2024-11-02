import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoricalPlaceTG = () => {
  const [places, setPlaces] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchHistoricalPlacesByAuthor = async () => {
    const AuthorUsername = localStorage.getItem('username');

    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post('/readAllHistoricalPlace', { AuthorUsername });

      if (response.status === 200) {
        if (response.data.length === 0) {
          setErrorMessage('You do not have Historical Places Created.');
          setPlaces([]);
        } else {
          setPlaces(response.data);
          setErrorMessage('');
        }
      } else {
        setErrorMessage('An unexpected response was received from the server.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage('An error occurred while fetching historical places. Please try again.');
    }
  };

  const editHistoricalPlace = (placeName) => {
    const AuthorUsername = localStorage.getItem('username');
    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }
    window.location.href = '/EditHistoricalPlace?name=${encodeURIComponent(placeName)}&author=${encodeURIComponent(AuthorUsername)}';
  };

  const removeHistoricalPlace = async (placeName) => {
    const AuthorUsername = localStorage.getItem('username');

    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this historical place?')) {
      try {
        const response = await axios.delete('/deleteHistoricalPlace', {
          data: { name: placeName, AuthorUsername },
        });

        alert(response.data.message);
        fetchHistoricalPlacesByAuthor();
      } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred while deleting the historical place. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchHistoricalPlacesByAuthor();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button style={styles.createButton} onClick={() => window.location.href = '/HistoricalPlace'}>
          Create New Historical Place
        </button>
      </div>
      {errorMessage ? (
        <p style={styles.errorMessage}>{errorMessage}</p>
      ) : (
        places.map((place) => (
          <div style={styles.placePost} key={place.name}>
            <div style={styles.placeDetails}>
              <h3>{place.name}</h3>
              <p>{place.description}</p>
              <p><strong>Location:</strong> {place.location}</p>
              <p><strong>Opening Hours:</strong> {place.openingHours}</p>
              <p><strong>Ticket Prices:</strong> Foreigner - ${place.ticketPrices.foreigner}, Native - ${place.ticketPrices.native}, Student - ${place.ticketPrices.student}</p>
              <p><strong>Tags:</strong> {place.Tags && place.Tags.join(', ')}</p>
            </div>
            <div style={styles.placeActions}>
              <button style={styles.editButton} onClick={() => editHistoricalPlace(place.name)}>Edit</button>
              <button style={{ ...styles.editButton, ...styles.deleteButton }} onClick={() => removeHistoricalPlace(place.name)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  toolbar: {
    width: '100%',
    maxWidth: 800,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  createButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: 10,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 14,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  },
  placePost: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
    marginBottom: 20,
    width: '100%',
    maxWidth: 800,
  },
  placeDetails: {
    textAlign: 'left',
  },
  placeActions: {
    marginTop: 15,
    display: 'flex',
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: 10,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
};

export default HistoricalPlaceTG;