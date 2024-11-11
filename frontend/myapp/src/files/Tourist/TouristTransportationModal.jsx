import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TouristTransportationModal({ currency, onClose }) {
    const [transportationOptions, setTransportationOptions] = useState([]);
    const [email, setEmail] = useState('');
    const [convertedPrices, setConvertedPrices] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransportationOptions = async () => {
            try {
                const response = await axios.get('/api/viewAllTransportation');
                setTransportationOptions(response.data);
            } catch (error) {
                console.error('Error fetching transportation options:', error);
            }
        };
        fetchTransportationOptions();
    }, []);

    useEffect(() => {
        if (currency !== 'EGP') {
            convertTransportationPrices();
        }
    }, [currency, transportationOptions]);

    const handleShare = async (transportationName) => {
        try {
            const frontendLink = `http://localhost:3000/transportation/details/${encodeURIComponent(transportationName)}`;
            const response = await axios.post('/getCopyLink', {
                entityType: 'transportation',
                entityName: transportationName,
                email: email,
            });
            const { msg } = response.data;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(frontendLink)
                    .then(() => alert(`Link copied to clipboard successfully!\n${msg}`))
                    .catch(err => alert(`Failed to copy link: ${err}`));
            } else {
                alert(`Here is the link to share: ${frontendLink}\n${msg}`);
            }
        } catch (error) {
            console.error('Error sharing link:', error);
            alert('An error occurred while generating the share link.');
        }
    };

    const handleBookTransportation = async (transportation) => {
        const touristUsername = localStorage.getItem('username');
        if (!touristUsername || !transportation) {
            alert("Please log in and select a transportation option to book.");
            return;
        }

        try {
            const response = await fetch('/bookTransportation', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    touristUsername,
                    TranspName: transportation.serviceName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Transportation booked successfully! `);
                navigate('/touristHome', {
                    state: {
                        type: 'transportation',
                        name: transportation.serviceName,
                        totalCost: data.totalCost,
                    },
                });
            } else {
                alert(data.msg || 'Failed to book transportation.');
            }
        } catch (error) {
            console.error('Error booking transportation:', error);
            alert('An error occurred while booking the transportation.');
        }
    };

    const convertTransportationPrices = async () => {
        const newConvertedPrices = {};

        await Promise.all(
            transportationOptions.map(async (transportation) => {
                try {
                    const response = await axios.post('/convertCurr', {
                        priceEgp: transportation.price || 0,
                        targetCurrency: currency,
                    });

                    newConvertedPrices[transportation._id] = response.data.convertedPrice;
                } catch (error) {
                    console.error(`Error converting price for ${transportation.serviceName}:`, error);
                }
            })
        );

        setConvertedPrices(newConvertedPrices);
    };

    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={styles.modalContent}>
                <Typography variant="h6" component="h2">
                    Available Transportation Options
                </Typography>

                <TextField
                    label="Email for Sharing"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />

                <Box sx={styles.listContainer}>
                    {transportationOptions.map(transportation => (
                        <Box key={transportation._id} sx={styles.item}>
                            <Typography variant="body1"><strong>Name:</strong> {transportation.serviceName || "N/A"}</Typography>
                            <Typography variant="body2"><strong>Type:</strong> {transportation.serviceType || "N/A"}</Typography>
                            <Typography variant="body2"><strong>Capacity:</strong> {transportation.capacity || "N/A"}</Typography>
                            <Typography variant="body2"><strong>Route:</strong> {transportation.routeDetails.startLocation} to {transportation.routeDetails.endLocation}</Typography>
                            
                            <Typography variant="body2"><strong>Schedule:</strong></Typography>
                            <Box sx={styles.scheduleList}>
                                {transportation.schedule.map((s, index) => (
                                    <Box key={index} sx={styles.scheduleItem}>
                                        <Typography variant="body2">Day: {s.day}</Typography>
                                        <Typography variant="body2">Departure: {s.departureTime}</Typography>
                                        <Typography variant="body2">Arrival: {s.arrivalTime}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Typography variant="body2">
                                <strong>Price:</strong> {currency === 'EGP' ? `${transportation.price || 0} EGP` : `${convertedPrices[transportation._id] || 'Loading...'} ${currency}`}
                            </Typography>

                            <Button
                                variant="outlined"
                                onClick={() => handleShare(transportation.serviceName)}
                                sx={styles.shareButton}
                            >
                                Share
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => handleBookTransportation(transportation)}
                                sx={styles.bookButton}
                            >
                                Book
                            </Button>
                        </Box>
                    ))}
                </Box>
                <Button variant="contained" sx={styles.doneButton} onClick={onClose}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
}

const styles = {
    modalContent: {
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 500, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
    },
    listContainer: {
        maxHeight: 300, overflowY: 'auto', mt: 2,
    },
    item: {
        p: 2, borderBottom: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
    },
    scheduleList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        marginLeft: 2,
        marginTop: 1,
    },
    scheduleItem: {
        marginBottom: 1,
        paddingLeft: 1,
        borderLeft: '2px solid #ddd',
    },
    doneButton: {
        mt: 2, backgroundColor: '#FF0000', '&:hover': { backgroundColor: '#FF5252' },
    },
    shareButton: {
        mt: 1, backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#63a4ff' },
    },
    bookButton: {
        mt: 1, backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#388E3C' },
    },
};

export default TouristTransportationModal;
