import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditMuseum = () => {
  const [museum, setMuseum] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Get museum details from query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const museumName = urlParams.get('name');
  const AuthorUsername = urlParams.get('author');

  const loadMuseumData = async () => {
    try {
      const response = await axios.post('/readMuseumByName', { MuseumName: museumName });

      if (response.status === 200) {
        setMuseum(response.data); // Set the fetched museum data
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage('Error fetching museum details.');
      }
    } catch (error) {
      console.error("Error fetching museum details:", error);
      setErrorMessage("An error occurred while fetching museum details. Please try again.");
    }
  };

  const handleUpdateMuseum = async (event) => {
    event.preventDefault();

    const historicalTags = document.getElementById('historicalTags').value.split(',').map(tag => tag.trim());

    const updatedMuseum = {
      name: museum.name,
      description: document.getElementById('description').value,
      location: document.getElementById('location').value,
      openingHours: document.getElementById('openingHours').value,
      ticketPrices: {
        foreigner: document.getElementById('ticketPriceForeigner').value,
        native: document.getElementById('ticketPriceNative').value,
        student: document.getElementById('ticketPriceStudent').value,
      },
      AuthorUsername: AuthorUsername,
      HistoricalTags: historicalTags, // Updated tags as an array
    };

    try {
      const response = await axios.post('/updateMuseumByName', updatedMuseum);
      alert(response.data.msg || "Museum updated successfully.");
      window.location.href = "museumsTG.html"; // Redirect back to the museums management page
    } catch (error) {
      console.error("Error updating museum:", error);
      alert(`An error occurred while updating the museum: ${error.response.data.error || "Unknown error"}`);
    }
  };

  useEffect(() => {
    loadMuseumData();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Edit Museum</h2>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <form id="editMuseumForm" onSubmit={handleUpdateMuseum}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Museum Name:</label>
            <input type="text" id="name" value={museum.name || ''} readOnly style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea id="description" required defaultValue={museum.description || ''} style={styles.textarea}></textarea>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" required defaultValue={museum.location || ''} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="openingHours">Opening Hours:</label>
            <input type="text" id="openingHours" required defaultValue={museum.openingHours || ''} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label>Ticket Prices:</label>
            <input type="number" id="ticketPriceForeigner" placeholder="Foreigner" required defaultValue={museum.ticketPrices?.foreigner || ''} style={styles.input} />
            <input type="number" id="ticketPriceNative" placeholder="Native" required defaultValue={museum.ticketPrices?.native || ''} style={styles.input} />
            <input type="number" id="ticketPriceStudent" placeholder="Student" required defaultValue={museum.ticketPrices?.student || ''} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="historicalTags">Historical Tags:</label>
            <input type="text" id="historicalTags" placeholder="Comma-separated tags" defaultValue={Array.isArray(museum.HistoricalTags) ? museum.HistoricalTags.join(', ') : ''} style={styles.input} />
          </div>
          <button type="submit" style={styles.button}>Update Museum</button>
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

export default EditMuseum;
