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
    MobileNumber: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false); // Mock loading state for API calls
  const [activeStep, setActiveStep] = useState(1); // Set "Payment Details" as the current step
  const location = useLocation();
  const navigate = useNavigate();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); // Success message dialog state
  const [paymentLoading, setPaymentLoading] = useState(false); // Loading state for payment
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });
  const [userInfoErrors, setUserInfoErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    MobileNumber: "",
    country: "",
  });
  
  const [cardInfoErrors, setCardInfoErrors] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });
  
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

     // Reset errors
  setUserInfoErrors({
    firstName: "",
    lastName: "",
    email: "",
    MobileNumber: "",
    country: "",
  });
  setCardInfoErrors({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  // Validate user info
  let hasErrors = false;
  const newUserInfoErrors = {};
  if (!userInfo.firstName.trim()) {
    newUserInfoErrors.firstName = "First name is required.";
    hasErrors = true;
  }
  if (!userInfo.lastName.trim()) {
    newUserInfoErrors.lastName = "Last name is required.";
    hasErrors = true;
  }
  if (!userInfo.email.trim()) {
    newUserInfoErrors.email = "Email is required.";
    hasErrors = true;
  }
  if (!userInfo.MobileNumber.trim()) {
    newUserInfoErrors.MobileNumber = "MobileNumber is required.";
    hasErrors = true;
  }
  if (!userInfo.country.trim()) {
    newUserInfoErrors.country = "Country is required.";
    hasErrors = true;
  }
  setUserInfoErrors(newUserInfoErrors);

  // Validate card info if payment method is Card
  if (paymentMethod === "Card") {
    const newCardInfoErrors = {};
    if (!cardInfo.cardNumber.trim()) {
      newCardInfoErrors.cardNumber = "Card number is required.";
      hasErrors = true;
    }
    if (!cardInfo.cardholderName.trim()) {
      newCardInfoErrors.cardholderName = "Cardholder name is required.";
      hasErrors = true;
    }
    if (!cardInfo.expiryDate.trim()) {
      newCardInfoErrors.expiryDate = "Expiry date is required.";
      hasErrors = true;
    }
    if (!cardInfo.cvv.trim()) {
      newCardInfoErrors.cvv = "CVV is required.";
      hasErrors = true;
    }
    setCardInfoErrors(newCardInfoErrors);
  }

  if (hasErrors) {
    return; // Stop the payment process if there are errors
  }
  
    try {
      setPaymentLoading(true);
      // Determine the endpoint based on the type
      const endpoint =
            type === "historicalPlace"
          ?  paymentMethod === "Wallet"
            ? "/payHP"
            : "/payHPStripe"
          : type === "museum"
          ?  paymentMethod === "Wallet"
            ? "/payMuseum"
            : "/payMuseumStripe"
          : type === "itinerary"
         ? paymentMethod === "Wallet"
            ? "/payItinerary"
            : "/payItineraryStripe"
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
        setPaymentLoading(false);
        setSuccessDialogOpen(true);
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
      onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
      error={!!userInfoErrors.firstName} // Highlight error
      helperText={userInfoErrors.firstName} // Show error message
    />
    <TextField
      label="Last Name *"
      variant="outlined"
      fullWidth
      value={userInfo.lastName}
      onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
      error={!!userInfoErrors.lastName} // Highlight error
      helperText={userInfoErrors.lastName} // Show error message
    />
    <TextField
      label="Email Address *"
      variant="outlined"
      fullWidth
      value={userInfo.email}
      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
      error={!!userInfoErrors.email} // Highlight error
      helperText={userInfoErrors.email} // Show error message
    />
    <TextField
      label="Mobile Number *"
      variant="outlined"
      fullWidth
      value={userInfo.confirmEmail}
      onChange={(e) =>
        setUserInfo({ ...userInfo, confirmEmail: e.target.value })
      }
      error={!!userInfoErrors.confirmEmail} // Highlight error
      helperText={userInfoErrors.confirmEmail} // Show error message
    />
    <TextField
      label="Country *"
      variant="outlined"
      fullWidth
      value={userInfo.country}
      onChange={(e) => setUserInfo({ ...userInfo, country: e.target.value })}
      error={!!userInfoErrors.country} // Highlight error
      helperText={userInfoErrors.country} // Show error message
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
          {paymentMethod === "Card" && (
            <Box sx={{ marginTop: "20px" }}>
              <TextField
      label="Card Number"
      variant="outlined"
      fullWidth
      value={cardInfo.cardNumber}
      onChange={(e) =>
        setCardInfo({ ...cardInfo, cardNumber: e.target.value })
      }
      error={!!cardInfoErrors.cardNumber} // Highlight error
      helperText={cardInfoErrors.cardNumber} // Show error message
      sx={{ marginBottom: "20px" }}
    />
    <TextField
      label="Cardholder Name"
      variant="outlined"
      fullWidth
      value={cardInfo.cardholderName}
      onChange={(e) =>
        setCardInfo({ ...cardInfo, cardholderName: e.target.value })
      }
      error={!!cardInfoErrors.cardholderName} // Highlight error
      helperText={cardInfoErrors.cardholderName} // Show error message
      sx={{ marginBottom: "20px" }}
    />
    <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <TextField
        label="Expiry Date (MM/YY)"
        variant="outlined"
        value={cardInfo.expiryDate}
        onChange={(e) =>
          setCardInfo({ ...cardInfo, expiryDate: e.target.value })
        }
        error={!!cardInfoErrors.expiryDate} // Highlight error
        helperText={cardInfoErrors.expiryDate} // Show error message
      />
      <TextField
        label="CVV"
        variant="outlined"
        value={cardInfo.cvv}
        onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
        error={!!cardInfoErrors.cvv} // Highlight error
        helperText={cardInfoErrors.cvv} // Show error message
      />
              </Box>
            </Box>
          )}
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
        disabled={paymentLoading}
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
        {paymentLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Complete Payment"}
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
    Your ticket has been successfully booked!
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
