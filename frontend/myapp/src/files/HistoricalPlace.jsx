import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateHistoricalPlace = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: '',
    ticketPriceForeigner: '',
    ticketPriceNative: '',
    ticketPriceStudent: '',
    tag: '',
  });
  const navigate = useNavigate();
  const AuthorUsername = localStorage.getItem('username');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = formData.tag.split(',').map(tag => tag.trim());

    const payload = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      openingHours: formData.openingHours,
      ticketPrices: {
        foreigner: formData.ticketPriceForeigner,
        native: formData.ticketPriceNative,
        student: formData.ticketPriceStudent,
      },
      HistoricalTags: tagsArray,
      AuthorUsername,
    };

    try {
      const response = await axios.post('/addHistoricalPlace', payload);

      if (response.status === 201) {
        alert('Historical place created successfully!');
        navigate('/HistoricalPlaceTg');
      } else {
        alert('Error: ${response.data.error}');
      }
    } catch (error) {
        alert(`An error occurred: ${error.response?.data?.error || 'Please try again.'}`);
   } };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Create New Historical Place</h2>
        <form id="createHistoricalPlaceForm" onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Historical Place Name:</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea id="description" rows="4" value={formData.description} onChange={handleChange} required style={styles.textarea}></textarea>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" value={formData.location} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="openingHours">Opening Hours:</label>
            <input type="text" id="openingHours" value={formData.openingHours} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label>Ticket Prices (in USD):</label>
            <input type="number" id="ticketPriceForeigner" placeholder="Foreigner" value={formData.ticketPriceForeigner} onChange={handleChange} required style={styles.input} />
            <input type="number" id="ticketPriceNative" placeholder="Native" value={formData.ticketPriceNative} onChange={handleChange} required style={styles.input} />
            <input type="number" id="ticketPriceStudent" placeholder="Student" value={formData.ticketPriceStudent} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="tag">Historical Tags (comma separated):</label>
            <input type="text" id="tag" value={formData.tag} onChange={handleChange} required style={styles.input} />
          </div>
          <button type="submit" style={styles.button}>Create Historical Place</button>
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
};

export default CreateHistoricalPlace;