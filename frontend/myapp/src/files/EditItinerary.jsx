import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditItinerary = () => {
  const [itinerary, setItinerary] = useState({
    title: '',
    activities: '',
    locations: '',
    timeline: '',
    language: '',
    price: '',
    date: '',
    accessibility: false,
    pickupLocation: '',
    dropoffLocation: '',
    tags: []
  });
  const [errorMessage, setErrorMessage] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const itineraryTitle = urlParams.get('title');
  const authorUsername = localStorage.getItem('username');

  const loadItineraryData = async () => {
    try {
      const response = await axios.get(`/api/readItinerary?Title=${encodeURIComponent(itineraryTitle)}`);

      if (response.status === 200 && response.data) {
        setItinerary({
          title: response.data.Title || '',
          activities: response.data.Activities || '',
          locations: response.data.Locations || '',
          timeline: response.data.Timeline || '',
          language: response.data.Language || '',
          price: response.data.Price || '',
          date: response.data.Date || '',
          accessibility: response.data.accessibility || false,
          pickupLocation: response.data.pickupLocation || '',
          dropoffLocation: response.data.dropoffLocation || '',
          tags: response.data.Tags || []
        });
        setErrorMessage('');
      } else {
        setErrorMessage('Error fetching itinerary details.');
      }
    } catch (error) {
      console.error("Error fetching itinerary details:", error);
      setErrorMessage("An error occurred while fetching itinerary details. Please try again.");
    }
  };

  const handleUpdateItinerary = async (event) => {
    event.preventDefault();

    const updatedTags = document.getElementById('updateitineraryTags').value.split(',').map(tag => tag.trim());

    const updatedItinerary = {
      Title: itinerary.title,
      Activities: document.getElementById('updateitineraryActivities').value,
      Locations: document.getElementById('updateitineraryLocations').value,
      Timeline: document.getElementById('updateitineraryTimeline').value,
      Language: document.getElementById('updateitineraryLanguage').value,
      Price: document.getElementById('updateitineraryPrice').value,
      Date: document.getElementById('updateitineraryDate').value,
      accessibility: document.getElementById('updateitineraryAccessibility').checked,
      pickupLocation: document.getElementById('updateitineraryPickupLocation').value,
      dropoffLocation: document.getElementById('updateitineraryDropoffLocation').value,
      Tags: updatedTags,
      AuthorUsername: authorUsername,
    };

    try {
      const response = await axios.put('/api/updateItinerary', updatedItinerary);
      alert(response.data.msg || "Itinerary updated successfully.");
      setTimeout(() => {
        window.location.href = `HomePageTourguide`;
      }, 500);
    } catch (error) {
      console.error("Error updating itinerary:", error);
      alert(`An error occurred while updating the itinerary: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  useEffect(() => {
    loadItineraryData();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Updating Itinerary</h2>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <form id="editItineraryForm" onSubmit={handleUpdateItinerary}>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryTitle">Title:</label>
            <input type="text" id="updateitineraryTitle" value={itinerary.title} readOnly style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryActivities">Activities:</label>
            <input type="text" id="updateitineraryActivities" defaultValue={itinerary.activities} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryLocations">Locations:</label>
            <input type="text" id="updateitineraryLocations" defaultValue={itinerary.locations} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryTimeline">Timeline:</label>
            <input type="text" id="updateitineraryTimeline" defaultValue={itinerary.timeline} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryLanguage">Language:</label>
            <input type="text" id="updateitineraryLanguage" defaultValue={itinerary.language} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryPrice">Price:</label>
            <input type="number" id="updateitineraryPrice" defaultValue={itinerary.price} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryDate">Date:</label>
            <input type="date" id="updateitineraryDate" defaultValue={itinerary.date.split('T')[0]} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryAccessibility">Accessibility:</label>
            <input type="checkbox" id="updateitineraryAccessibility" defaultChecked={itinerary.accessibility} style={styles.checkbox} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryPickupLocation">Pickup Location:</label>
            <input type="text" id="updateitineraryPickupLocation" defaultValue={itinerary.pickupLocation} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryDropoffLocation">Dropoff Location:</label>
            <input type="text" id="updateitineraryDropoffLocation" defaultValue={itinerary.dropoffLocation} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="updateitineraryTags">Tags:</label>
            <input type="text" id="updateitineraryTags" defaultValue={itinerary.tags.join(', ')} style={styles.input} />
          </div>
          <button type="submit" style={styles.button}>Update Itinerary</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    padding: '50px',
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
  checkbox: {
    marginLeft: '10px',
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

export default EditItinerary;
