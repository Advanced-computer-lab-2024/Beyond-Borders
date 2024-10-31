import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MuseumTG = () => {
  const [museums, setMuseums] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMuseumsByAuthor = async () => {
    const AuthorUsername = localStorage.getItem('username');

    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post('/readAllMuseums', { AuthorUsername });

      if (response.status === 200) {
        if (response.data.length === 0) {
          setErrorMessage('You do not have Museums Created.'); // Set message when no museums found
          setMuseums([]); // Clear any previously displayed museums
        } else {
          setMuseums(response.data); // Populate museums list
          setErrorMessage(''); // Clear any existing error message
        }
      } else {
        setErrorMessage('An unexpected response was received from the server.');
      }
    } catch (error) {
      console.error('Fetch error:', error); // Log the error details
      setErrorMessage('An error occurred while fetching museums. Please try again.');
    }
  };

  const editMuseum = (museumName) => {
    const AuthorUsername = localStorage.getItem('username');
    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }
    // Redirect to the EditMuseum.jsx component using window.location.href
    window.location.href = `/editMuseum?name=${encodeURIComponent(museumName)}&author=${encodeURIComponent(AuthorUsername)}`;
  };

  const removeMuseum = async (museumName) => {
    const AuthorUsername = localStorage.getItem('username');

    if (!AuthorUsername) {
      alert('Author username not found. Please log in again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this museum?')) {
      try {
        const response = await axios.post('/deleteMuseumByName', {
          name: museumName,
          AuthorUsername,
        });

        alert(response.data.message);
        fetchMuseumsByAuthor(); // Refresh the list of museums
      } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred while deleting the museum. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchMuseumsByAuthor(); // Fetch museums on component mount
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button style={styles.createButton} onClick={() => window.location.href = '/createMuseum'}>
          Create New Museum
        </button>
      </div>
      {errorMessage ? (
        <p style={styles.errorMessage}>{errorMessage}</p>
      ) : (
        museums.map((museum) => (
          <div style={styles.museumPost} key={museum.name}>
            <img src={museum.image} alt={museum.name} style={styles.image} />
            <div style={styles.museumDetails}>
              <h3>{museum.name}</h3>
              <p>{museum.description}</p>
              <p><strong>Location:</strong> {museum.location}</p>
              <p><strong>Opening Hours:</strong> {museum.openingHours}</p>
              <p><strong>Ticket Prices:</strong> Foreigner - ${museum.ticketPrices.foreigner}, Native - ${museum.ticketPrices.native}, Student - ${museum.ticketPrices.student}</p>
            </div>
            <div style={styles.museumActions}>
              <button style={styles.editButton} onClick={() => editMuseum(museum.name)}>Edit</button>
              <button style={{ ...styles.editButton, ...styles.deleteButton }} onClick={() => removeMuseum(museum.name)}>Delete</button>
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
  museumPost: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
    marginBottom: 20,
    width: '100%',
    maxWidth: 800,
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 10,
    marginBottom: 10,
  },
  museumDetails: {
    textAlign: 'left',
  },
  museumActions: {
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

export default MuseumTG;
