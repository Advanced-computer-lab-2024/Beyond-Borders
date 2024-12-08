import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { useNavigate, useLocation } from "react-router-dom";

const TouristEventsPrePaymentPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeStep, setActiveStep] = useState(0); // Start at "Tickets"
  const navigate = useNavigate(); // React Router DOM navigation
  const location = useLocation();
  const { type , name ,totalCost } = location.state || {};

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };
  const handleCheckout = () => {
    // Redirect to the "Payment Details" page, passing state
    navigate("/TouristEventsPaymentPage", {
      state: {
        type,
        name,
        totalCost, // Calculate total cost based on quantity
      },
    });
  };

  return (
    
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
     <button
  onClick={goBack}
  style={{
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: 'transparent',
    color: '#192959', // Blue color for text and border
    border: '2px solid #192959',
    padding: '10px 20px',
    borderRadius: '30px', // Rounded border
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Space between the arrow and text
    transition: 'all 0.3s ease', // Smooth transition for hover effects
  }}
>
  <span style={{ fontSize: '20px' }}>←</span> Back
</button>



      {/* Stepper for Navigation */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ marginBottom: "20px" }}>
        {["Tickets", "Payment Details", "Confirmation"].map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      

      {/* Ticket Details Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#192959",
            marginBottom: "20px",
            
          }}
        >
          Tickets
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px", // Reduced the gap between the icon and ticket info
            marginBottom: "20px",
            
          }}
        >
          {/* Ticket Icon */}
          <ConfirmationNumberOutlinedIcon
            sx={{
              fontSize: "40px",
              color: "#192959",
            }}
          />

          {/* Ticket Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: "#192959",
                marginLeft:"20px"
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#192959",
                marginLeft:"20px"
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Typography>
          </Box>

          {/* Quantity and Price */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "5px", // Added margin for spacing

                color: "#192959",
              }}
            >
              Quantity
            </Typography>
            1
          </Box>
        </Box>

        <Divider />

        {/* Summary */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          
          <Typography
            variant="body1"
            sx={{
              color: "#192959",
            }}
          >
            Total:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            EGP {totalCost || "0.00"}
          </Typography>
        </Box>

        {/* Checkout Button */}
        <Button
          variant="contained"
          onClick={handleCheckout}
          sx={{
            marginTop: "20px",
            backgroundColor: "#192959",
            color: "#fff",
            marginLeft:"1050px",
            "&:hover": {
              backgroundColor: "#33416b",
            },
          }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default TouristEventsPrePaymentPage;
