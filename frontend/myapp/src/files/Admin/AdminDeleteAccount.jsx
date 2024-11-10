// import React, { useState } from 'react';
// import axios from 'axios';

// const AdminDeleteAccount = () => {
//   const [username, setUsername] = useState('');
//   const [message, setMessage] = useState(''); // Message to display success or error feedback
//   const [messageColor, setMessageColor] = useState(''); // Color of the message text

//   const handleUsernameChange = (e) => {
//     setUsername(e.target.value); // Update the username state
//   };

//   const handleDeleteAccount = async (e) => {
//     e.preventDefault(); // Prevent form submission

//     try {
//       const response = await axios.post('/deleteAccount', { username });

//       if (response.status === 200) {
//         setMessage('Account deleted successfully!');
//         setMessageColor('green');
//         setTimeout(() => {
//             window.location.href = `HomePageAdmin`;
//           }, 900);

//       } else {
//         setMessage(`Error: ${response.data.error}`);
//         setMessageColor('red');
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
//       setMessageColor('red');
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.formContainer}>
//         <h2>Deleting Account</h2>
//         <form onSubmit={handleDeleteAccount}>
//           <div style={styles.formGroup}>
//             <label htmlFor="username">Username:</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={username}
//               onChange={handleUsernameChange}
//               required
//               style={styles.input}
//             />
//           </div>
//           <button type="submit" style={styles.button}>Delete</button>
//         </form>
//         {message && (
//           <p style={{ ...styles.message, color: messageColor }}>{message}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     fontFamily: 'Arial, sans-serif',
//     backgroundColor: '#f4f4f4',
//     padding: '50px',
//     margin: 0,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//   },
//   formContainer: {
//     backgroundColor: '#fff',
//     padding: '30px',
//     borderRadius: '10px',
//     boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
//     maxWidth: '500px',
//     width: '100%',
//   },
//   formGroup: {
//     marginBottom: '15px',
//   },
//   input: {
//     width: '100%',
//     padding: '10px',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     fontSize: '14px',
//   },
//   button: {
//     backgroundColor: '#28a745',
//     color: 'white',
//     padding: '15px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     width: '100%',
//     fontSize: '16px',
//   },
//   message: {
//     marginTop: '20px',
//     textAlign: 'center',
//   },
// };

// export default AdminDeleteAccount;
