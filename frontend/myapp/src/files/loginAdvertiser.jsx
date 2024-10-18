import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const LoginAdvertiser = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage('');

        console.log("Form Data being sent:", formData); // Log form data

        try {
            const response = await axios.post('http://localhost:8000/loginAdvertiser', formData);
            const result = response.data;

            if (response.status === 200) {
                localStorage.setItem('username', result.advertiser.Username);
                setResponseMessage(`Welcome, ${result.advertiser.Username}!`);

                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = '/homePageAdvertiser'; // Redirect to home page after login
                }, 2000);
            } else {
                setResponseMessage(`Error: ${result.error || 'Failed to log in.'}`);
            }
        } catch (error) {
            console.error('Error logging in:', error.response ? error.response.data : error.message);
            if (error.response && error.response.data) {
                setResponseMessage(`Error: ${error.response.data.error || 'An error occurred.'}`);
            } else {
                setResponseMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <Box
            className="container"
            sx={{
                maxWidth: '600px',
                margin: 'auto',
                background: '#fff',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography variant="h4" align="center">Login Advertiser</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '4px',
                        width: '100%',
                        '&:hover': { backgroundColor: '#218838' },
                    }}
                >
                    Login
                </Button>
            </form>
            {responseMessage && (
                <Typography
                    variant="body1"
                    align="center"
                    sx={{
                        marginTop: '20px',
                        color: responseMessage.includes('Error') ? 'red' : 'green',
                    }}
                >
                    {responseMessage}
                </Typography>
            )}
        </Box>
    );
};

export default LoginAdvertiser;
