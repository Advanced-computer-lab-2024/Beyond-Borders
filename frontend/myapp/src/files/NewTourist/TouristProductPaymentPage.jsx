import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InputAdornment from "@mui/material/InputAdornment";

const steps = ["Shopping Cart", "Payment Details", "Payment Complete"];

const TouristProductPaymentPage = () => {
  const [addressError, setAddressError] = useState(""); // Error for the new address
  const stripePromise = loadStripe("pk_test_51QLqHGP7Sjm96OcqAOCQWfQuEwmMBxXj7hieiaUq1Q0m4qd0xaW9xi2GwrQbTb89OHEXUoIyhuAP29EhDlNYXYlC00HnsADGB1");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addingNewAddress, setAddingNewAddress] = useState(false); // Track if adding a new address
  const [newAddress, setNewAddress] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); // Success message dialog state
  const [paymentLoading, setPaymentLoading] = useState(false); // Loading state for payment
  const navigate = useNavigate();
  const stripe = useStripe();
  const [totalAmount, setTotalAmount] = useState(0); // Total amount with discount if applied
  const [promoCode, setPromoCode] = useState(""); // State for promo code
  const [promoApplied, setPromoApplied] = useState(false); // Flag for promo code applied
  const [discount, setDiscount] = useState(0);
  const [promoCodeError, setPromoCodeError] = useState(""); // Error state for promo code

  const elements = useElements();
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [userInfoErrors, setUserInfoErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  
 
  const [activeStep, setActiveStep] = useState(1); // Set the active step (index-based)
  const totalCost = cartItems.reduce(
    (total, item) => total + item.productDetails.Price * item.quantity,
    0
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("User is not logged in.");
          return;
        }
  
        // Fetch cart items
        const cartResponse = await axios.get("/api/getTouristCartDetails", {
          params: { username },
        });
        setCartItems(cartResponse.data);
  
        const total = cartResponse.data.reduce(
          (total, item) => total + item.productDetails.Price * item.quantity,
          0
        );
        setTotalAmount(total); // Update totalAmount state
  
        // Fetch delivery addresses
        const addressResponse = await axios.get("/api/viewDeliveryAddresses", {
          params: { touristUsername: username },
        });
  
        console.log("Addresses: ", addressResponse.data.DeliveryAddresses);
        setDeliveryAddresses(addressResponse.data.DeliveryAddresses);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

    const applyPromoCode = async (code) => {
      try {
        const response = await axios.get("/applyPromoCode", {
          params: { promoCode: code },
        });
        const { discountPercentage } = response.data;
  
        // Apply the discount
        setDiscount(discountPercentage);
        setPromoApplied(true);
  
        // Recalculate total after applying the discount
        const newTotal = totalAmount * (1 - discountPercentage / 100);
        setTotalAmount(newTotal); // Update the total amount after discount
      } catch (error) {
        setPromoApplied(false); // Mark as invalid
        setDiscount(0); // Reset discount
      }
    };
    const handlePromoCodeChange = (e) => {
      const code = e.target.value;
      setPromoCode(code);
  
      if (code.trim()) {
        applyPromoCode(code); // Call the API on every input change
      } else {
        setPromoApplied(null); // Reset status when the input is cleared
      }
    };

    const handleCompletePayment = async () => {

      setUserInfoErrors({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      });
     
      setAddressError("");
    
      let hasErrors = false;
    
      // Validate user info
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
      if (!userInfo.phoneNumber.trim()) {
        newUserInfoErrors.phoneNumber = "Phone number is required.";
        hasErrors = true;
      }
      setUserInfoErrors(newUserInfoErrors);
    
      if (!selectedAddress && !addingNewAddress) {
        setAddressError("Please select a delivery address.");
        hasErrors = true;
      }
    
        // if (!selectedAddress) {
        //   alert("Please select a delivery address.");
        //   return;
        // }
    
        if (!paymentMethod) {
          alert("Please select a payment method.");
          return;
        }
    
        const username = localStorage.getItem("username");
        if (!username) {
          alert("User is not logged in.");
          return;
        }


      
        if (hasErrors) return; // Stop if there are errors
        setPaymentLoading(true);
        try {
          let paymentResponse;
    
          // Call the appropriate payment function
          if (paymentMethod === "Card") {
            //paymentResponse = await axios.post("/payOrderStripe", { touristUsername: username });
            const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (stripeError) {
        console.error("Stripe error:", stripeError);
        alert(stripeError.message);
        setPaymentLoading(false);
        return;
      }

      // Send the paymentMethod ID to the backend
      //const username = localStorage.getItem("username");
       paymentResponse = await axios.post("/payOrderStripe", {
        touristUsername: username,
        paymentMethodId: paymentMethod.id, 
        promoCode: promoCode, // Add the promoCode to the payload
        // Pass the PaymentMethod ID
      });
          } else if (paymentMethod === "Cash") {
            paymentResponse = await axios.post("/payOrderCash", { touristUsername: username,  promoCode: promoCode, // Add the promoCode to the payload
            });
          } else if (paymentMethod === "Wallet") {
            paymentResponse = await axios.post("/payOrderWallet", { touristUsername: username,  promoCode: promoCode, // Add the promoCode to the payload
            });
          }
    
          if (!paymentResponse || paymentResponse.status !== 200) {
            throw new Error("Payment failed. Please try again.");
          }
          

          // Call the `chooseDeliveryAddress` function
          const orderNumber = paymentResponse.data.orderDetails.orderNumber;
          const addressResponse = await axios.put("/chooseDeliveryAddress", {
            orderNo: orderNumber,
            Address: selectedAddress,
          });
    
          if (addressResponse.status !== 200) {
            throw new Error("Failed to update delivery address.");
          }
    
          setPaymentLoading(false);
          setSuccessDialogOpen(true);
        } catch (err) {
          console.error("Error during payment or address update:", err);
          setPaymentLoading(false);
          alert(err.response?.data?.error || "An error occurred. Please try again.");
        }
      };

  const handleAddNewAddress = async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        alert("User is not logged in.");
        return;
      }

      if (!newAddress) {
        alert("Please enter a new address.");
        return;
      }

      await axios.post("/addDeliveryAddress", {
        touristUsername: username,
        addresses: [newAddress],
      });

      setDeliveryAddresses((prev) => [...prev, { address: newAddress }]);
      setAddingNewAddress(false);
      setSelectedAddress(newAddress);
      setNewAddress("");
    } catch (error) {
      console.error("Error adding new address:", error);
      alert("Failed to add new address.");
    }
  };

  

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
        Checkout
      </Typography>
      

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ marginBottom: "20px" }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: "20px",
        }}
      >
        {/* Left Section */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            Personal Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <TextField
    label="First Name"
    variant="outlined"
    fullWidth
    value={userInfo.firstName}
    onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
    error={!!userInfoErrors.firstName} // Highlight error
    helperText={userInfoErrors.firstName} // Display error message
  />
  <TextField
    label="Last Name"
    variant="outlined"
    fullWidth
    value={userInfo.lastName}
    onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
    error={!!userInfoErrors.lastName} // Highlight error
    helperText={userInfoErrors.lastName} // Display error message
  />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <TextField
    label="Email"
    variant="outlined"
    fullWidth
    value={userInfo.email}
    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
    error={!!userInfoErrors.email} // Highlight error
    helperText={userInfoErrors.email} // Display error message
  />
  <TextField
    label="Phone Number"
    variant="outlined"
    fullWidth
    value={userInfo.phoneNumber}
    onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
    error={!!userInfoErrors.phoneNumber} // Highlight error
    helperText={userInfoErrors.phoneNumber} // Display error message
  />
          </Box>


{/* Address Containers */}
<Box>
{!addingNewAddress && addressError && (
  <Typography color="error" variant="body2" sx={{ marginBottom: "10px" }}>
    {addressError}
  </Typography>
)}
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px", textAlign: "left" }}>
            Delivery Address
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
            {deliveryAddresses.map((addr, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "500", color: "#333" }}>
                  {addr.address}
                </Typography>
                <Radio
                  checked={selectedAddress === addr.address}
                  onChange={() => setSelectedAddress(addr.address)}
                  value={addr.address}
                  sx={{
                    color: "#192959",
                    "&.Mui-checked": {
                      color: "#192959",
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
  

  {/* Add New Address Container */}
  {!addingNewAddress ? (
    <Box
      onClick={() => setAddingNewAddress(true)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#e6e6e6",
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: "500",
          color: "#192959",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        + Add New Delivery Address
      </Typography>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        marginBottom: "20px",
      }}
    >
      <TextField
        label="New Address"
        variant="outlined"
        fullWidth
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#192959",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#33416b",
            },
          }}
          onClick={handleAddNewAddress}
        >
          Add
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#192959",
            color: "#192959",
          }}
          onClick={() => {
            setAddingNewAddress(false);
            setNewAddress("");
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  )}
</Box>

<Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px", textAlign: "left" }}>
            Payment Options
          </Typography>
          <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
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
              value="Cash"
              control={<Radio />}
              label={
                <>
                  <LocalShippingIcon sx={{ marginRight: "10px", color: "#192959" }} />
                  Cash on Delivery
                </>
              }
            />
            <FormControlLabel
              value="Card"
              control={<Radio />}
              label={
                <>
                  <CreditCardIcon sx={{ marginRight: "10px", color: "#192959" }} />
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

        {/* Right Section */}
        <Box sx={{marginLeft:'60px'}}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px"}}>
            Order Summary
          </Typography>
          {/* Promo Code Section */}
          <Box sx={{ marginBottom: "20px" }}>
  <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
    Promo Code
  </Typography>
  <TextField
    label="Enter Promo Code"
    variant="outlined"
    fullWidth
    value={promoCode}
    onChange={handlePromoCodeChange}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          {promoCode && promoApplied === true && (
            <CheckCircleIcon sx={{ color: "green" }} />
          )}
          {promoCode && promoApplied === false && (
            <CancelIcon sx={{ color: "red" }} />
          )}
        </InputAdornment>
      ),
    }}
  />
  {promoCode && promoApplied === true && (
    <Typography variant="body2" sx={{ color: "green", marginTop: "5px" }}>
      Promo code applied! You saved {discount}%.
    </Typography>
  )}
  {promoCode && promoApplied === false && (
    <Typography variant="body2" sx={{ color: "red", marginTop: "5px" }}>
      Invalid or expired promo code.
    </Typography>
  )}
</Box>
  

      <Box>
  {/* Display Discount */}
  {discount > 0 && promoApplied && (
    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        Discount Applied
      </Typography>
      <Typography variant="body1">{`EGP ${(totalCost * (discount / 100)).toFixed(2)}`}</Typography>
    </Box>
  )}

  {/* Display Updated Total */}
  {promoApplied && (
    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        Final Total
      </Typography>
      <Typography variant="body1">{`EGP ${totalAmount.toFixed(2)}`}</Typography>
    </Box>
  )}
</Box>

          <List>
            {cartItems.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={item.productDetails.Picture}
                    variant="square"
                    sx={{ width: "80px", height: "80px", borderRadius: "10px" }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {item.productDetails.Name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#333", fontWeight: "bold" }}
                      >
                        Price: EGP {item.productDetails.Price}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                  }
                  sx={{ marginLeft: "20px",  }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ marginY: "20px" }} />
          <Typography variant="h6">
        Total: EGP {promoApplied ? totalAmount.toFixed(2) : cartItems.reduce(
          (total, item) => total + item.productDetails.Price * item.quantity,
          0
        ).toFixed(2)}
      </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#192959",
              color: "#fff",
              "&:hover": { backgroundColor: "#33416b" },
              padding: "10px 20px",
            }}
            onClick={handleCompletePayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Complete Payment"}
          </Button>
        </Box>
      </Box>
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

export default TouristProductPaymentPage;
