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
const steps = ["Shopping Cart", "Payment Details", "Payment Complete"];

const TouristProductPaymentPage = () => {
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
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  const [activeStep, setActiveStep] = useState(1); // Set the active step (index-based)

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
  
          // Fetch delivery addresses
          const addressResponse = await axios.get("/viewDeliveryAddresses", {
            params: { touristUsername: username },
          });
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

    const handleCompletePayment = async () => {
        if (!selectedAddress) {
          alert("Please select a delivery address.");
          return;
        }
    
        if (!paymentMethod) {
          alert("Please select a payment method.");
          return;
        }
    
        const username = localStorage.getItem("username");
        if (!username) {
          alert("User is not logged in.");
          return;
        }
        setPaymentLoading(true);
        try {
          let paymentResponse;
    
          // Call the appropriate payment function
          if (paymentMethod === "Card") {
            paymentResponse = await axios.post("/payOrderStripe", { touristUsername: username });
          } else if (paymentMethod === "Cash") {
            paymentResponse = await axios.post("/payOrderCash", { touristUsername: username });
          } else if (paymentMethod === "Wallet") {
            paymentResponse = await axios.post("/payOrderWallet", { touristUsername: username });
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

  const handlePaymentSubmit = () => {
    if (!selectedAddress && !addingNewAddress) {
      alert("Please select a delivery address.");
      return;
    }

    if (
      paymentMethod === "Card" &&
      (!cardInfo.cardNumber || !cardInfo.cvv || !cardInfo.expiryDate || !cardInfo.cardholderName)
    ) {
      alert("Please fill out all card details.");
      return;
    }

    alert("Payment Submitted Successfully!");
    setActiveStep(2); // Move to the "Payment Complete" step
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "50px" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
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
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={userInfo.phoneNumber}
              onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
            />
          </Box>


{/* Address Containers */}
<Box>
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
              <TextField
                label="Card Number"
                variant="outlined"
                fullWidth
                value={cardInfo.cardNumber}
                onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                sx={{ marginBottom: "20px" }}
              />
              <TextField
                label="Cardholder Name"
                variant="outlined"
                fullWidth
                value={cardInfo.cardholderName}
                onChange={(e) => setCardInfo({ ...cardInfo, cardholderName: e.target.value })}
                sx={{ marginBottom: "20px" }}
              />
              <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <TextField
                  label="Expiry Date (MM/YY)"
                  variant="outlined"
                  value={cardInfo.expiryDate}
                  onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
                />
                <TextField
                  label="CVV"
                  variant="outlined"
                  value={cardInfo.cvv}
                  onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
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
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "20px"}}
          >
            Total: EGP {cartItems.reduce(
              (total, item) =>
                total + item.productDetails.Price * item.quantity,
              0
            )}
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
