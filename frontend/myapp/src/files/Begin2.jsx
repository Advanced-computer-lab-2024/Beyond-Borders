import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // To make API calls

const Begin2 = () => {
  const [text, setText] = useState(''); // State for the animated text
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userTypeSaved, setUserType] = useState('');
  const [error, setError] = useState(''); // For error messages
  const [otp, setOtp] = useState(new Array(6).fill('')); // For OTP input
  const [dialogOpen, setDialogOpen] = useState(false); // To control the dialog
  const otpRefs = useRef([]); // Array of refs for OTP fields
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
          localStorage.setItem('username',username);
          break;
        case 'Advertiser':
          navigate('/YAdvertiserDashboard');
          localStorage.setItem('username',username);
          break;
        case 'TourGuide':
          navigate('/YTourGuideDashboard');
          localStorage.setItem('username',username);
          break;
        case 'Seller':
          navigate('/YSellerDashboard');
          localStorage.setItem('username',username);
          break;
        case 'TourismGovernor':
          navigate('/TourismGovernorDashboard');
          localStorage.setItem('username',username);
          break;
        case 'Admin':
          navigate('/YAdminDashboard');
          localStorage.setItem('username',username);
          break;
        case 'TransportationAdvertiser':
          navigate('/transportAdvertiserHome');
          localStorage.setItem('username',username);
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

  // const handleForgotPassword = async () => {
  //   if (!username) {
  //     setError('Please enter your username');
  //     return;
  //   }

  //   try {
  //     // Call the backend function to get the user type
  //     const response = await axios.get('/api/findUserTypeByUsername', {
  //       params: { username },
  //     });
  //     const { userType } = response.data;
  //     //console.log(userType);
  //     setUserType(userType);
  //     //console.log(userTypeSaved.toString);

  //     // Open the dialog for OTP entry
  //     setDialogOpen(true);

  //     // Navigate based on user type or show success message
  //     //navigate(`/reset-password/${userType}`); // Example route for resetting password based on user type
  //   } catch (err) {
  //     if (err.response?.status === 404) {
  //       setError('Username not found');
  //     } else {
  //       setError('Failed to process your request. Please try again.');
  //     }
  //   }
  // };

  const handleForgotPassword = async () => {
    if (!username) {
      setError('Please enter your username');
      return;
    }

    try {
      const response = await axios.get('/api/findUserTypeByUsername', {
        params: { username },
      });
      const { userType } = response.data;
      setUserType(userType);

      // // Reset OTP and open dialog
      // setOtp(new Array(6).fill(''));
      // setDialogOpen(true);

      //if (userType === 'Tourist') {
        // Step 2: Call the backend `sendOtp` function for tourists
        try {
          const otpResponse = await axios.post('/sendOtp', { username: username });
          console.log(otpResponse.data.msg);
  
          // Step 3: Reset OTP, open the dialog, and focus on the first field
          setOtp(new Array(6).fill(''));
          setDialogOpen(true);
  
          // Focus on the first OTP field after a short delay
          setTimeout(() => otpRefs.current[0]?.focus(), 0);
        } catch (otpError) {
          console.error('Failed to send OTP:', otpError);
          setError('Failed to send OTP. Please try again.');
        }
      // } else {
      //   // If user type is not Tourist, display a message
      //   setError('Forgot password is only available for tourists.');
      // }

      // Focus on the first OTP field after a short delay
      //setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Username not found');
      } else {
        setError('Failed to process your request. Please try again.');
      }
    }
  };

  // const handleOtpChange = (value, index) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = value;
  //   setOtp(newOtp);
  // };
  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        otpRefs.current[index + 1]?.focus(); // Move to the next field
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus(); // Move to the previous field on delete
    }
  };

  // const handleOtpSubmit = () => {
  //   console.log('OTP Submitted:', otp.join(''));
  //   // Proceed with OTP verification logic
  //   setDialogOpen(false); // Close the dialog after submission
  // };

  // const handleOtpSubmit = async () => {
  //   const enteredOtp = otp.join(""); // Combine the OTP array into a single string
  
  //   if (enteredOtp.length !== 6) {
  //     setError("Please enter the complete OTP."); // Ensure all 6 digits are filled
  //     return;
  //   }
  
  //   try {
  //     // Call the backend function with the username and OTP
  //     const response = await axios.post("/loginTouristOTP", {
  //       username,
  //       OTP: enteredOtp,
  //     });
  
  //     console.log("Login OTP successful:", response.data.message);
  
  //     // Redirect based on userTypeSaved
  //     switch (userTypeSaved) {
  //       case "Tourist":
  //         navigate("/NewTouristHomePage");
  //         localStorage.setItem('username',username);
  //         break;
  //       case "Advertiser":
  //         navigate("/YAdvertiserDashboard");
  //         localStorage.setItem('username',username);
  //         break;
  //       case "TourGuide":
  //         navigate("/YTourGuideDashboard");
  //         localStorage.setItem('username',username);
  //         break;
  //       case "Seller":
  //         navigate("/YSellerDashboard");
  //         localStorage.setItem('username',username);
  //         break;
  //       case "TourismGovernor":
  //         navigate("/TourismGovernorDashboard");
  //         localStorage.setItem('username',username);
  //         break;
  //       case "Admin":
  //         navigate("/YAdminDashboard");
  //         localStorage.setItem('username',username);
  //         break;
  //       case "TransportationAdvertiser":
  //         navigate("/transportAdvertiserHome");
  //         localStorage.setItem('username',username);
  //         break;
  //       default:
  //         setError("Unknown user type. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Login OTP failed:", error.response?.data?.error || error.message);
  //     setError(error.response?.data?.error || "Failed to verify OTP. Please try again.");
  //   }
  // };

  const handleOtpSubmit = async () => {
    const enteredOtp = otp.join(""); // Combine the OTP array into a single string
  
    if (enteredOtp.length !== 6) {
      setError("Please enter the complete OTP."); // Ensure all 6 digits are filled
      return;
    }
  
    try {
      // Call the backend function with the username and OTP
      const response = await axios.post("/loginTouristOTP", {
        username,
        OTP: enteredOtp,
      });
  
      console.log("Login OTP successful:", response.data.message);
  
      // Clear error and redirect based on userTypeSaved
      setError("");
      switch (userTypeSaved) {
        case "Tourist":
          navigate("/NewTouristHomePage");
          localStorage.setItem("username", username);
          break;
        case "Advertiser":
          navigate("/YAdvertiserDashboard");
          localStorage.setItem("username", username);
          break;
        case "TourGuide":
          navigate("/YTourGuideDashboard");
          localStorage.setItem("username", username);
          break;
        case "Seller":
          navigate("/YSellerDashboard");
          localStorage.setItem("username", username);
          break;
        case "TourismGovernor":
          navigate("/TourismGovernorDashboard");
          localStorage.setItem("username", username);
          break;
        case "Admin":
          navigate("/YAdminDashboard");
          localStorage.setItem("username", username);
          break;
        case "TransportationAdvertiser":
          navigate("/transportAdvertiserHome");
          localStorage.setItem("username", username);
          break;
        default:
          setError("Unknown user type. Please try again.");
      }
    } catch (error) {
      console.error("Login OTP failed:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || "Failed to verify OTP. Please try again.");
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
          <Box
            sx={{
              textAlign: 'left',
              marginTop: '-5px',
              marginRight: '20px',
            }}
            onClick={handleForgotPassword} // Call the function on click
            style={{ cursor: 'pointer' }} // Add pointer cursor for a clickable effect
          >
            <span
              style={{
                textDecoration: 'none',
                color: '#192959',
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} // Add underline on hover
              onMouseLeave={(e) => (e.target.style.textDecoration = 'none')} // Remove underline when not hovering
            >
              Forgot password?
            </span>
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

        {/* <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Please enter the OTP sent to your email</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" gap="10px">
            {otp.map((value, index) => (
              <TextField
                key={index}
                value={value}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                inputProps={{ maxLength: 1 }}
                sx={{ width: '40px', textAlign: 'center' }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOtpSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Please enter the OTP sent to your email</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" gap="10px">
            {otp.map((value, index) => (
              <TextField
                key={index}
                value={value}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputProps={{ maxLength: 1 }}
                sx={{ width: '40px', textAlign: 'center' }}
                inputRef={(el) => (otpRefs.current[index] = el)}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOtpSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog> */}

<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
  <DialogTitle>Please enter the OTP sent to your email</DialogTitle>
  <DialogContent>
    <Box display="flex" justifyContent="center" gap="10px" mb={2}>
      {otp.map((value, index) => (
        <TextField
          key={index}
          value={value}
          onChange={(e) => handleOtpChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          inputProps={{ maxLength: 1 }}
          sx={{
            width: "40px",
            textAlign: "center",
          }}
          inputRef={(el) => (otpRefs.current[index] = el)}
        />
      ))}
    </Box>

    {/* Error Message */}
    {error && (
      <Box display="flex" justifyContent="center" mb={2}>
        <p style={{ color: "red", textAlign: "center", marginTop: "-10px", marginBottom: "-7px"}}>{error}</p>
      </Box>
    )}

    <Box display="flex" justifyContent="center">
      <Button
        onClick={handleOtpSubmit}
        variant="contained"
        sx={{
          backgroundColor: otp.every((digit) => digit !== "") ? "#192959" : "gray",
          color: "white",
          borderRadius: "10px",
          width: "150px",
          "&:hover": {
            backgroundColor: otp.every((digit) => digit !== "") ? "#4b5a86" : "gray",
          },
        }}
        disabled={!otp.every((digit) => digit !== "")} // Disable if OTP is incomplete
      >
        Sign In
      </Button>
    </Box>
  </DialogContent>
</Dialog>



        {/* Forgot Password and Register Links */}
        {/* <Box sx={{ marginTop: '20px' }}>
          
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
        </Box> */}

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
