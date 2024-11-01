import React, { useState } from 'react';

const TourismGovernorDashboard = () => {
  const [tagName, setTagName] = useState('');
  const [showTagForm, setShowTagForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Toggle the Add Tag form visibility
  const toggleTagForm = () => {
    setShowTagForm(!showTagForm);
    setResponseMessage('');
    setErrorMessage('');
  };

  // Handle form submission for adding a new tag
  const handleTagFormSubmit = async (event) => {
    event.preventDefault();

    // Clear previous messages
    setResponseMessage('');
    setErrorMessage('');

    const formData = { NameOfHistoricalTags: tagName };

    try {
      const response = await fetch('/createHistoricalTag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage('Historical Tag added successfully!');
        setErrorMessage('');
        setTagName(''); // Reset the form
      } else {
        setErrorMessage(`Error: ${result.error}`);
        setResponseMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setResponseMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tourism Governor Dashboard</h2>
      <button
        style={styles.button}
        onClick={() => (window.location.href = '/MuseumTG')}
      >
        Museums
      </button>
      <button
        style={styles.button}
        onClick={() => (window.location.href = '/HistoricalPlaceTG')}
      >
        Historical Places
      </button>
      <button style={styles.button} onClick={toggleTagForm}>
        Add New Historical Tag
      </button>

      {showTagForm && (
        <div style={styles.tagForm}>
          <h2 style={styles.heading}>Add New Historical Tag</h2>
          <form onSubmit={handleTagFormSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="name">Tag Name:</label>
              <input
                type="text"
                id="name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Tag Name"
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Add Historical Tag
            </button>
            {responseMessage && (
              <div style={{ ...styles.message, color: 'green' }}>
                {responseMessage}
              </div>
            )}
            {errorMessage && (
              <div style={{ ...styles.message, color: 'red' }}>
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    maxWidth: '600px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    margin: '20px auto',
  },
  heading: {
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
    fontSize: '16px',
    width: '80%',
  },
  tagForm: {
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    backgroundColor: '#40be5b',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px',
  },
  message: {
    marginTop: '20px',
    textAlign: 'center',
  },
};

export default TourismGovernorDashboard;
