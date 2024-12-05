import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // To make API calls

const Begin2 = () => {
  const [text, setText] = useState(''); // State for the animated text
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For error messages
  const navigate = useNavigate(); // Hook for navigation
  const fullText = 'Welcome to Beyond Borders!'; // Full text to display

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1)); // Incrementally show the text
        index++;
      } else {
        clearInterval(interval); // Stop animation after displaying all characters
      }
    }, 100); // Typing speed in milliseconds

    return () => clearInterval(interval); // Cleanup the interval
  }, []);

  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');

  // const handleLogin = () => {
  //   // Add login logic here
  //   console.log('Username:', username);
  //   console.log('Password:', password);
  // };
  const handleLogin = async () => {
    try {
      // Validate input fields
    if (!username) {
      setError("Please enter your username and password");
      return;
    }
    // Validate input fields
    if (!password) {
      setError("Please enter your password");
      return;
    }
      const response = await axios.post('/loginUser', { username,password});

      // Check user type and navigate accordingly
      const { userType } = response.data;

      switch (userType) {
        case 'Tourist':
          navigate('/NewTouristHomePage');
          break;
        case 'Advertiser':
          navigate('/YAdvertiserDashboard');
          break;
        case 'TourGuide':
          navigate('/YTourGuideDashboard');
          break;
        case 'Seller':
          navigate('/YSellerDashboard');
          break;
        case 'TourismGovernor':
          navigate('/TourismGovernorDashboard');
          break;
        case 'Admin':
          navigate('/YAdminDashboard');
          break;
        case 'TransportationAdvertiser':
          navigate('/transportAdvertiserHome');
          break;
        default:
          throw new Error('Unknown user type');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("The username and password you have entered don't match");
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(/images/beach2.jpg)`, // Set the background image
        backgroundSize: 'cover', // Cover the entire container
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated Welcome Text */}
      <Box
        sx={{
          textAlign: 'center',
          marginTop: '-50px',
          marginBottom: '20px',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#192959',
        }}
      >
        {text} {/* Display the animated text */}
      </Box>

      {/* Login Form */}
      <Box
        className="container"
        sx={{
          textAlign: 'center',
          margin: '20px',
          padding: '25px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Translucent background
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          width: '500px',
          minHeight: '250px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '30px',
        }}
      >
        <h2
          style={{
            fontSize: '2rem', // Bigger font size for "Login"
            color: '#192959', // Dark blue color
            marginBottom: '20px',
            marginTop: '-10px', // Raise the text
          }}
        >
          Login
        </h2>

        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          {/* Username Input */}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password Input */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error Message */}
          {error && (
            <p style={{ color: 'red', marginTop: '-10px',marginBottom: '-15px', textAlign: 'left'}}>
              {error}
            </p>
          )}

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: 'left', marginTop: '2px', marginRight: '20px' }}>
            <Link
              to="/forgot-password"
              style={{
                textDecoration: 'none',
                color: '#192959',
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} // Add underline on hover
              onMouseLeave={(e) => (e.target.style.textDecoration = 'none')} // Remove underline when not hovering
            >
              Forgot password?
            </Link>
          </Box>

          {/* Login Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#192959', // Original color
              color: 'white',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: '#4b5a86', // Lighter shade of #192959
              },
            }}
            onClick={handleLogin}
          >
            Sign in
          </Button>
        </Box>

        {/* Forgot Password and Register Links */}
        <Box sx={{ marginTop: '20px' }}>
          
          <p>
           Login for nowww{' '}
            <Link
              to="/login"
              style={{ textDecoration: 'none', color: '#192959', fontWeight: 'bold' }}
              onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} // Add underline on hover
               onMouseLeave={(e) => (e.target.style.textDecoration = 'none')} // Remove underline when not hovering
            >
              login Now
            </Link>
          </p>
        </Box>

        {/* Forgot Password and Register Links */}
        <Box sx={{ marginTop: '20px' }}>
          <p>
            Don't have an account?{' '}
            <Link
              to="/New"
              style={{ textDecoration: 'none', color: '#192959', fontWeight: 'bold' }}
              onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} // Add underline on hover
              onMouseLeave={(e) => (e.target.style.textDecoration = 'none')} // Remove underline when not hovering
            >
              Register Now
            </Link>
          </p>
        </Box>

        {/* Continue as Guest Link */}
        <p>
          <Link
            to="/homeGuest" // Replace with the route for the guest home page
            style={{
              textDecoration: 'none',
              color: '#192959',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} // Add underline on hover
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')} // Remove underline when not hovering
          >
            Continue as Guest
          </Link>
        </p>
      </Box>
    </Box>
  );
};

export default Begin2;
