import React, { useState } from 'react';
import axios from 'axios';

const CreateItinerary = () => {
  const [itineraryData, setItineraryData] = useState({
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
    tags: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItineraryData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const AuthorUsername = localStorage.getItem('username');
    if (!AuthorUsername) {
      alert('You need to log in first.');
      return;
    }

    const tagsArray = itineraryData.tags.split(',').map(tag => tag.trim());
    
    const dataToSubmit = {
      AuthorUsername,
      Title: itineraryData.title,
      Date: itineraryData.date,
      Timeline: itineraryData.timeline,
      Price: itineraryData.price,
      Locations: itineraryData.locations,
      Activities: itineraryData.activities,
      accessibility: itineraryData.accessibility,
      pickupLocation: itineraryData.pickupLocation,
      dropoffLocation: itineraryData.dropoffLocation,
      Tags: tagsArray,
      Language: itineraryData.language
    };

    try {
      const response = await axios.post('/api/createItinerary', dataToSubmit);
      alert('Itinerary created successfully!');

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = `HomePageTourguide`;
      }, 500);

      // Clear form data
      setItineraryData({
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
        tags: ''
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Create New Itinerary</h2>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="title">Itinerary Title:</label>
            <input type="text" id="title" name="title" value={itineraryData.title} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="activities">Activities (comma-separated):</label>
            <input type="text" id="activities" name="activities" value={itineraryData.activities} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="locations">Locations (comma-separated):</label>
            <input type="text" id="locations" name="locations" value={itineraryData.locations} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="timeline">Timeline:</label>
            <input type="text" id="timeline" name="timeline" value={itineraryData.timeline} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="language">Language:</label>
            <input type="text" id="language" name="language" value={itineraryData.language} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="price">Price (USD):</label>
            <input type="number" id="price" name="price" value={itineraryData.price} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" value={itineraryData.date} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="accessibility">Accessibility:</label>
            <input type="checkbox" id="accessibility" name="accessibility" checked={itineraryData.accessibility} onChange={handleChange} style={styles.checkbox} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="pickupLocation">Pickup Location:</label>
            <input type="text" id="pickupLocation" name="pickupLocation" value={itineraryData.pickupLocation} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="dropoffLocation">Dropoff Location:</label>
            <input type="text" id="dropoffLocation" name="dropoffLocation" value={itineraryData.dropoffLocation} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="tags">Tags (comma-separated):</label>
            <input type="text" id="tags" name="tags" value={itineraryData.tags} onChange={handleChange} required style={styles.input} />
          </div>
          <button type="submit" style={styles.button}>Create Itinerary</button>
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
    backgroundColor: '#28a745',
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

export default CreateItinerary;
