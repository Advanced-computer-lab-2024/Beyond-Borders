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
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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
  const [promoCode, setPromoCode] = useState(""); // State for Promo Code
  const [discount, setDiscount] = useState(0); // State to store discount amount
  const [totalAmount, setTotalAmount] = useState(100); // Example total amount (you can change this)
  const [promoApplied, setPromoApplied] = useState(false); // Flag to check if promo is applied
  const [promoCodeError, setPromoCodeError] = useState(""); // Error state for promo code


  const [userInfoErrors, setUserInfoErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    MobileNumber: "",
    country: "",
  });
  
  
  const stripe = useStripe();
  const elements = useElements();
  
  // Retrieve data from state
  const { type, name, totalCost } = location.state || {};
  const applyPromoCode = async () => {
    try {
      // Make the API call to the backend with the promo code
      const response = await axios.get('/applyPromoCode', { params: { promoCode } });

      // If promo code is valid, apply discount and update UI
      const { discountPercentage } = response.data;
      console.log(discountPercentage);
      setDiscount(discountPercentage);
      console.log(totalCost);
      const discountedAmount = totalCost * (1 - discountPercentage / 100);
      setTotalAmount(discountedAmount); // Set the updated total amount after discount     
      setPromoApplied(true);
      setPromoCodeError(""); // Clear any previous errors

    } catch (error) {
      // Handle errors (invalid promo code or backend issues)
      if (error.response && error.response.status === 404) {
        alert("Invalid or expired promo code.");
      } else {
        alert("An error occurred. Please try again.");
      }
      setPromoApplied(false); // Reset promo applied state if there's an error
    }
  };

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
      newUserInfoErrors.MobileNumber = "Mobile Number is required.";
      hasErrors = true;
    }
    if (!userInfo.country.trim()) {
      newUserInfoErrors.country = "Country is required.";
      hasErrors = true;
    }
    setUserInfoErrors(newUserInfoErrors);
  
    if (hasErrors) {
      return; // Stop the payment process if there are errors
    }
  
    try {
      setPaymentLoading(true);
  
      // Determine the endpoint based on the type
      const endpoint =
        type === "historicalPlace"
          ? paymentMethod === "Wallet"
            ? "/payHP"
            : "/payHPStripe"
          : type === "museum"
          ? paymentMethod === "Wallet"
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
  
      // Wallet payment
      if (paymentMethod === "Wallet") {
        const payload = {
          touristUsername,
          promoCode: promoCode || null, // Add promoCode here, setting it to null if it's not available
          activityName: type === "activity" ? name : undefined,
          museumName: type === "museum" ? name : undefined,
          HPName: type === "historicalPlace" ? name : undefined,
          ItineraryName: type === "itinerary" ? name : undefined,
        };
  
        const response = await axios.put(endpoint, payload);
  
        if (response.status === 200) {
          setSuccessDialogOpen(true);
          console.log(`Points: ${response.data.Points}, Badge Level: ${response.data.BadgeLevelOfPoints}`);
          setPaymentLoading(false);
        } else {
          alert(response.data.msg || "Failed to complete payment.");
        }
      }
  
      // Card payment using Stripe
      if (paymentMethod === "Card") {
        const cardElement = elements.getElement(CardElement);
        const { paymentMethod: stripePaymentMethod, error } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });
  
        if (error) {
          console.error("Stripe error:", error);
          alert(error.message);
          setPaymentLoading(false);
          return;
        }
  
        const stripePayload = {
          touristUsername,
          promoCode: promoCode || null, // Add promoCode here, setting it to null if it's not available
          paymentMethodId: stripePaymentMethod.id, // Include the payment method ID from Stripe
          activityName: type === "activity" ? name : undefined,
          museumName: type === "museum" ? name : undefined,
          HPName: type === "historicalPlace" ? name : undefined,
          ItineraryName: type === "itinerary" ? name : undefined,
        };
  
        const stripeResponse = await axios.put(endpoint, stripePayload);
  
        if (stripeResponse.status === 200) {
          setSuccessDialogOpen(true);
          console.log(`Points: ${stripeResponse.data.Points}, Badge Level: ${stripeResponse.data.BadgeLevelOfPoints}`);
          setPaymentLoading(false);
        } else {
          alert(stripeResponse.data.msg || "Failed to complete payment.");
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("An error occurred while processing the payment.");
    } finally {
      setPaymentLoading(false);
    }
  };
  
  // Function to handle promo code application
 


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
      value={userInfo.MobileNumber}
      onChange={(e) =>
        setUserInfo({ ...userInfo, MobileNumber: e.target.value })
      }
      error={!!userInfoErrors.MobileNumber} // Highlight error
      helperText={userInfoErrors.MobileNumber} // Show error message
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
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "left", // Align text to the left
      }}
    >
      Enter Card Details
    </Typography>
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px", // Increase padding for a bigger box
        marginBottom: "20px",
      }}
    >
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "18px", // Increase font size for better readability
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
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
      {/* Promo Code Input */}
      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          label="PromoCode"
          variant="outlined"
          fullWidth
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#f9f9f9',
              padding: '10px 12px',
              borderColor: '#ccc',
              '&:hover': {
                borderColor: '#999',
              },
            },
          }}
        />
      </Box>

      {/* Apply Promo Code Button */}
      <Box sx={{ marginBottom: "20px" }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={applyPromoCode}
          fullWidth
          sx={{
            borderRadius: '12px',
            padding: '12px',
            fontWeight: 'bold',
            textTransform: 'none',
            backgroundColor: '#192959', // Dark blue color
            '&:hover': {
              backgroundColor: '#33416b', // Darker green on hover
            },
          }}
        >
          Apply Promo Code
        </Button>
      </Box>
            {/* Display Discount */}
            {discount > 0 && promoApplied &&(
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Discount Applied 
          </Typography>
          <Typography variant="body1">{`EGP ${(totalCost *( discount / 100)).toFixed(2)}`}</Typography>
        </Box>
      )}

      {/* Display Updated Total */}
      {promoApplied &&(
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>Final Total</Typography>
        <Typography variant="body1">{`EGP ${totalAmount.toFixed(2)}`}</Typography>
      </Box>)}
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
