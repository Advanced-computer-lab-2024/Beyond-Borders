import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const TouristEventsPaymentPage = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false); // Mock loading state for API calls
  const [activeStep, setActiveStep] = useState(1); // Set "Payment Details" as the current step
  const location = useLocation();
  const navigate = useNavigate();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); // Success message dialog state

  // Retrieve data from state
  const { type, name, totalCost } = location.state || {};

  const handlePayment = async () => {
    const touristUsername = localStorage.getItem("username");
    if (!touristUsername) {
      alert("Please log in to make a payment.");
      return;
    }
  
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
  
    try {
      // Determine the endpoint based on the type
      const endpoint =
        type === "historicalPlace"
          ? "/payHP"
          : type === "museum"
          ? "/payMuseum"
          : type === "itinerary"
          ? "/payItinerary"
          : type === "activity"
          ? paymentMethod === "Wallet"
            ? "/payActivity"
            : "/payActivityStripe"
          : null;
  
      if (!endpoint) {
        alert("Invalid payment type.");
        return;
      }
  
      // Prepare the payload
      const payload = {
        touristUsername,
        activityName: type === "activity" ? name : undefined,
        museumName: type === "museum" ? name : undefined,
        HPName: type === "historicalPlace" ? name : undefined,
        ItineraryName: type === "itinerary" ? name : undefined,
      };
  
      // Make the payment request
      const response = await axios.put(endpoint, payload);
  
      if (response.status === 200) {
        setSuccessDialogOpen(true);
        console.log(
          `Points: ${response.data.Points}, Badge Level: ${response.data.BadgeLevelOfPoints}`
        );
        navigate("/NewTouristHomePage");
      } else {
        alert(response.data.msg || "Failed to complete payment.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("An error occurred while processing the payment.");
    }
  };
  

  return (
    <Box
      sx={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Stepper for Navigation */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ marginBottom: "20px" }}>
        {["Tickets", "Payment Details", "Confirmation"].map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: "40px",
        }}
      >
        {/* Visitor Details Section */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#192959",
            }}
          >
            Visitor Details:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <TextField
              label="First Name *"
              variant="outlined"
              fullWidth
              value={userInfo.firstName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name *"
              variant="outlined"
              fullWidth
              value={userInfo.lastName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastName: e.target.value })
              }
            />
            <TextField
              label="Email Address *"
              variant="outlined"
              fullWidth
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
            <TextField
              label="Confirm Email Address *"
              variant="outlined"
              fullWidth
              value={userInfo.confirmEmail}
              onChange={(e) =>
                setUserInfo({ ...userInfo, confirmEmail: e.target.value })
              }
            />
            <TextField
              label="Country *"
              variant="outlined"
              fullWidth
              value={userInfo.country}
              onChange={(e) =>
                setUserInfo({ ...userInfo, country: e.target.value })
              }
            />
          </Box>

          {/* Payment Options */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginTop: "40px",
              marginBottom: "20px",
              color: "#192959",
            }}
          >
            Payment Options:
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="Wallet"
              control={<Radio />}
              label={
                <>
                  <WalletIcon sx={{ marginRight: "10px", color: "#192959" }} />
                  Pay with Wallet
                </>
              }
            />
            <FormControlLabel
              value="Card"
              control={<Radio />}
              label={
                <>
                  <CreditCardIcon
                    sx={{ marginRight: "10px", color: "#192959" }}
                  />
                  Pay with Card
                </>
              }
            />
          </RadioGroup>
        </Box>

        {/* Summary Section */}
        <Box
          sx={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#192959",
            }}
          >
            Summary:
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Type
            </Typography>
            <Typography variant="body2">{type}</Typography>
          </Box>
          <Divider sx={{ marginY: "10px" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {name}
            </Typography>
          </Box>
          <Divider sx={{ marginY: "10px" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Total
            </Typography>
            <Typography variant="body2">EGP {totalCost}</Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={handlePayment}
        sx={{
          marginTop: "40px",
          backgroundColor: "#192959",
          color: "#fff",
          padding: "15px",
          fontSize: "16px",
          "&:hover": {
            backgroundColor: "#33416b",
          },
        }}
      >
        Submit Payment
      </Button>
      <Dialog open={successDialogOpen} onClose={() => navigate("/NewTouristHomePage")}>
  <DialogTitle
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "10px",
      backgroundColor: "#f1f8ff",
      padding: "20px",
    }}
  >
    <Box
      sx={{
        width: "50px",
        height: "50px",
        backgroundColor: "#4caf50",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontSize: "24px",
      }}
    >
      ✓
    </Box>
    <Typography
      sx={{
        fontWeight: "bold",
        fontSize: "20px",
        textAlign: "center",
        color: "#333",
      }}
    >
      Thank you for your purchase!
    </Typography>
  </DialogTitle>
  <DialogContent
    sx={{
      padding: "20px",
      textAlign: "center",
      fontSize: "16px",
      color: "#666",
      backgroundColor: "#f1f8ff"
    }}
  >
    Your order has been successfully placed. We hope you enjoy your items!
  </DialogContent>
  <DialogActions
    sx={{
      display: "flex",
      justifyContent: "center",
      padding: "10px",
      backgroundColor: "#f1f8ff",
    }}
  >
    <Button
      onClick={() => navigate("/NewTouristHomePage")}
      variant="contained"
      sx={{
        backgroundColor: "#192959",
        color: "#fff",
        padding: "10px 20px",
        "&:hover": { backgroundColor: "#33416b" },
      }}
    >
      Back To Dashboard
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default TouristEventsPaymentPage;
