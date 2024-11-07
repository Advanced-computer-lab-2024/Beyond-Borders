import React, { useState } from 'react';
import axios from 'axios';

const HomePageTransportationAdvertiser = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTransportation, setNewTransportation] = useState({
    advertiserName: localStorage.getItem('username'), // Replace with actual advertiser name
    serviceName: '',
    serviceType: '',
    price: '',
    capacity: '',
    startLocation: '', // Separate start location field
    endLocation: '',   // Separate end location field
    schedule: [
      { day: '', departureTime: '', arrivalTime: '' } // Initialize with one schedule entry
    ]
  });

  // Adds a new schedule object to the schedule array
  const addSchedule = () => {
    setNewTransportation({
      ...newTransportation,
      schedule: [...newTransportation.schedule, { day: '', departureTime: '', arrivalTime: '' }]
    });
  };

  // Updates a specific field in a specific schedule object
  const updateSchedule = (index, field, value) => {
    const updatedSchedule = newTransportation.schedule.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setNewTransportation({ ...newTransportation, schedule: updatedSchedule });
  };

  // Function to handle the submission of the form
  const createNewTransportation = async () => {
    setLoading(true);
    console.log("Data being sent:", newTransportation); // Log the structure of the data
    try {
      const response = await axios.post('/createNewTransportation', newTransportation);
      if (response.status === 200) {
        alert('New transportation created successfully!');
        setShowCreateForm(false);
      } else {
        setError('Failed to create transportation');
      }
    } catch (err) {
      setError(`Error creating transportation: ${err.response?.data?.error || err.message}`);
      console.error('Error creating transportation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Transportation Advertiser Dashboard</h1>
        <nav>
          <ul style={styles.navList}>
            <li>
              <button style={styles.button} onClick={() => setShowCreateForm(true)}>
                Create Transportation
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div style={styles.mainContent}>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {showCreateForm && (
          <div style={styles.formModal}>
            <h2>Create New Transportation</h2>
            <form>
              <div style={styles.formRow}>
                <label>Service Name: </label>
                <input
                  type="text"
                  value={newTransportation.serviceName}
                  onChange={(e) => setNewTransportation({ ...newTransportation, serviceName: e.target.value })}
                />
              </div>
              <div style={styles.formRow}>
                <label>Service Type: </label>
                <input
                  type="text"
                  value={newTransportation.serviceType}
                  onChange={(e) => setNewTransportation({ ...newTransportation, serviceType: e.target.value })}
                />
              </div>
              <div style={styles.formRow}>
                <label>Price: </label>
                <input
                  type="number"
                  value={newTransportation.price}
                  onChange={(e) => setNewTransportation({ ...newTransportation, price: e.target.value })}
                />
              </div>
              <div style={styles.formRow}>
                <label>Capacity: </label>
                <input
                  type="number"
                  value={newTransportation.capacity}
                  onChange={(e) => setNewTransportation({ ...newTransportation, capacity: e.target.value })}
                />
              </div>
              <div style={styles.formRow}>
                <label>Start Location: </label>
                <input
                  type="text"
                  value={newTransportation.startLocation}
                  onChange={(e) => setNewTransportation({ ...newTransportation, startLocation: e.target.value })}
                />
              </div>
              <div style={styles.formRow}>
                <label>End Location: </label>
                <input
                  type="text"
                  value={newTransportation.endLocation}
                  onChange={(e) => setNewTransportation({ ...newTransportation, endLocation: e.target.value })}
                />
              </div>

              <h3>Schedule</h3>
              {newTransportation.schedule.map((schedule, index) => (
                <div key={index} style={styles.formRow}>
                  <label>Day: </label>
                  <input
                    type="text"
                    value={schedule.day}
                    onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                  />
                  <label>Departure Time: </label>
                  <input
                    type="text"
                    value={schedule.departureTime}
                    onChange={(e) => updateSchedule(index, 'departureTime', e.target.value)}
                  />
                  <label>Arrival Time: </label>
                  <input
                    type="text"
                    value={schedule.arrivalTime}
                    onChange={(e) => updateSchedule(index, 'arrivalTime', e.target.value)}
                  />
                </div>
              ))}
              <button type="button" style={styles.button} onClick={addSchedule}>
                Add Schedule
              </button>

              <button type="button" style={styles.button} onClick={createNewTransportation}>
                Create Transportation
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styling for consistency with the original theme
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
    fontSize: '24px',
    textAlign: 'left'
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    marginLeft: 'auto'
  },
  mainContent: {
    textAlign: 'left'
  },
  error: {
    color: 'red'
  },
  formRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    alignItems: 'center'
  },
  formModal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    border: '1px solid #218838'
  },
  button: {
    backgroundColor: '#218838',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  }
};

export default HomePageTransportationAdvertiser;
