import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const Begin2 = () => {
  const [text, setText] = useState(''); // State for the animated text
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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add login logic here
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <Box>
      {/* Animated Welcome Text */}
      <Box
        sx={{
          textAlign: 'center',
          marginTop: '50px',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#283593',
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
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          width: '500px',
          height: 'auto',
          minHeight: '200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '50px',
        }}
      >
        <h2>Login</h2>

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
            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'left', marginTop: '2px',marginRight:'20px' }}>
                <Link
                    to="/forgot-password"
                    style={{
                    textDecoration: 'none',
                    color: '#283593',
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
                    borderRadius: '20px',
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
