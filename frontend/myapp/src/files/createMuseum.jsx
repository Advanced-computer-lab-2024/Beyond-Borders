import React, { useState } from 'react';
import axios from 'axios';

const CreateMuseum = () => {
  const [museumData, setMuseumData] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: '',
    ticketPrices: {
      foreigner: '',
      native: '',
      student: ''
    },
    historicalTags: '',
    dateOfEvent: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is a ticket price field
    if (name === 'foreigner' || name === 'native' || name === 'student') {
      setMuseumData((prevData) => ({
        ...prevData,
        ticketPrices: {
          ...prevData.ticketPrices,
          [name]: value // Directly updating the correct ticket price
        }
      }));
    } else {
      setMuseumData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const AuthorUsername = localStorage.getItem("username");
    const historicalTags = museumData.historicalTags.split(',').map(tag => tag.trim());

    const dataToSubmit = {
      ...museumData,
      AuthorUsername,
      HistoricalTags: historicalTags
    };

    try {
      const response = await axios.post('/addMuseum', dataToSubmit);
      alert("Museum created successfully!");
      window.location.href = "/MuseumTG"; // Redirect to museumsTG.html
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Create New Museum</h2>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <form id="createMuseumForm" onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Museum Name:</label>
            <input type="text" id="name" name="name" required value={museumData.name} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" rows="4" required value={museumData.description} onChange={handleChange} style={styles.textarea}></textarea>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location" required value={museumData.location} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="openingHours">Opening Hours:</label>
            <input type="text" id="openingHours" name="openingHours" required value={museumData.openingHours} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label>Ticket Prices (in USD):</label>
            <input
              type="number"
              id="ticketPriceForeigner"
              name="foreigner"
              placeholder="Foreigner"
              required
              value={museumData.ticketPrices.foreigner}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="number"
              id="ticketPriceNative"
              name="native"
              placeholder="Native"
              required
              value={museumData.ticketPrices.native}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="number"
              id="ticketPriceStudent"
              name="student"
              placeholder="Student"
              required
              value={museumData.ticketPrices.student}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="historicalTags">Historical Tags (comma separated):</label>
            <input type="text" id="historicalTags" name="historicalTags" required value={museumData.historicalTags} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="dateOfEvent">Date of Event:</label>
            <input type="date" id="dateOfEvent" name="dateOfEvent" required value={museumData.dateOfEvent} onChange={handleChange} style={styles.input} />
          </div>
          <button type="submit" style={styles.button}>Create Museum</button>
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

export default CreateMuseum;
