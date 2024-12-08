// External variables
const express = require("express"); //importing express
const path = require('path');
const cors = require('cors');
const cron = require('node-cron');

const mongoose = require('mongoose'); //importing mongoose
mongoose.set('strictQuery', false);
require("dotenv").config(); //load enviironment variables
//const {createUser,getUsers, updateUser, deleteUser} = require("./Routes/userController");
const {createTourist,getTourist, updateTourist, searchProductTourist, filterActivities, filterProductByPriceTourist, ActivityRating, sortProductsDescendingTourist, sortProductsAscendingTourist, ViewAllUpcomingActivities, ViewAllUpcomingMuseumEventsTourist, getMuseumsByTagTourist, getHistoricalPlacesByTagTourist, ViewAllUpcomingHistoricalPlacesEventsTourist,viewProductsTourist, sortActivitiesPriceAscendingTourist, sortActivitiesPriceDescendingTourist, sortActivitiesRatingAscendingTourist, sortActivitiesRatingDescendingTourist, loginTourist, ViewAllUpcomingItinerariesTourist, sortItinerariesPriceAscendingTourist, sortItinerariesPriceDescendingTourist, filterItinerariesTourist,ActivitiesSearchAll, ItinerarySearchAll, MuseumSearchAll, HistoricalPlacesSearchAll, ProductRating, createComplaint, getComplaintsByTouristUsername,ChooseActivitiesByCategoryTourist,bookActivity,bookItinerary,bookMuseum,bookHistoricalPlace, ratePurchasedProduct, addPurchasedProducts, reviewPurchasedProduct, addCompletedItinerary, rateTourGuide, commentOnTourGuide, rateCompletedItinerary, commentOnItinerary, addCompletedActivities, addCompletedMuseumEvents, addCompletedHPEvents, rateCompletedActivity, rateCompletedMuseum, rateCompletedHP, commentOnActivity, commentOnMuseum, commentOnHP,deleteBookedActivity,deleteBookedItinerary,deleteBookedMuseum,deleteBookedHP,payActivity,updateWallet,updatepoints,payItinerary,payMuseum,payHP,redeemPoints, convertEgp, fetchFlights,viewBookedItineraries, requestDeleteAccountTourist,convertCurr,getActivityDetails,getHistoricalPlaceDetails,getMuseumDetails,GetCopyLink, bookFlight, fetchHotelsByCity, fetchHotels, 
  bookHotel,bookTransportation,addPreferences, viewMyCompletedActivities, viewMyCompletedItineraries, viewMyCompletedMuseums, viewMyCompletedHistoricalPlaces,viewMyBookedActivities,viewMyBookedItineraries,viewMyBookedMuseums,viewMyBookedHistoricalPlaces,viewTourGuidesCompleted,viewAllTransportation, getItineraryDetails, viewPreferenceTags,viewPurchasedProducts,viewBookedActivities,viewMyBookedTransportation, payActivityByCard, payItineraryByCard, payMuseumByCard, payHPByCard, sendOtp, loginTouristOTP,addBookmark,viewBookmarks, addToWishList, viewMyWishlist, removeFromWishlist, addToCartFromWishlist, addToCart, removeFromCart, changeProductQuantityInCart, checkout,
  addDeliveryAddress, viewDeliveryAddresses,checkIfInWishlist, chooseDeliveryAddress,payOrderWallet,payOrderCash,viewOrderDetails,cancelOrder,markOrdersAsDelivered,viewAllOrders,sendUpcomingEventNotifications,payOrderStripe,payItineraryStripe,payActivityStripe,payMuseumStripe,payHPStripe, fetchCityCode, 
  getTourGuideComments,addNotificationSubscriberHP,addNotificationSubscriberMuseum,addNotificationSubscriberActivity,addNotificationSubscriberItinerary,getTouristNotifications,areAllTouristNotificationsRead,allNotificationsTouristRead, getTouristCartDetails, checkIfInBookmarkedEvents, removeFromBookmarkedEvents,checkTouristSubscription, viewBookedHotels, viewBookedFlights,sendNotificationWithPromoCode} = require("./Routes/TouristController");
const {createUnregisteredAdvertiser} = require("./Routes/UnregisteredAdvertiserController");

const {createUnregisteredTranspAdvertiser} = require("./Routes/UnregisteredTranspAdvertiserController");
const {loginTransportationAdvertiser,ReadTransportationAdvertiserProfile,createNewTransportation,viewMyTransportations} = require("./Routes/TransportationAdvertiserController");

const {createUnregisteredTourGuide} = require("./Routes/UnregisteredTourGuideController");
const {createUnregisteredSeller} = require("./Routes/UnregisteredSellerController");
const {createNewTourismGoverner, createNewAdmin, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories,updateCategory, deleteActivityCategory, deleteAccount, searchProductAdmin, createNewTag, readAllTags, updateTag, deleteTag, acceptTourGuide, rejectTourGuide, acceptAdvertiser, rejectAdvertiser, filterProductByPriceAdmin, sortProductsAscendingAdmin, sortProductsDescendingAdmin,viewProducts,loginAdmin, viewAllProductsAdmin, updateAdminPassword, getAllComplaints, updateComplaintStatus, replyToComplaint, getComplaintDetails, filterComplaintsByStatus, sortComplaintsByRecent, sortComplaintsByOldest, archiveProduct, unarchiveProduct, flagItinerary, viewArchivedProductsAdmin, flagActivity ,viewAllActivitiesAdmin , viewAllItinerariesAdmin, acceptTranspAdvertiser,rejectTranspAdvertiser, readAllDeleteRequests,rejectRequestDeleteAccout, getAdminPassword,viewAdvertiserDocument,viewTourGuideDocuments,viewSellerDocument,getAllUnregisteredAdvertisers,getAllUnregisteredTourGuides,getAllUnregisteredSellers,getAllUnregisteredTransportationAdvertisers,createPromoCode, getTotalTourists, getTouristsByMonth, getTotalTourismGovernors, getTourismGovernorsByMonth, getTotalTourGuides, getTourGuidesByMonth, getTotalSellers, getSellersByMonth, getTotalAdvertisers, getAdvertisersByMonth, getTotalTransportationAdvertisers, getTransportationAdvertisersByMonth, getTotalUsers, getTotalUsersByMonth,loginUser,calculateAppRevenueItinerary,calculateAppRevenueActivity,calculateAppRevenueProduct,calculateTotalAppRevenue,findUserTypeByUsername,notifyAdminOfOutOfStock,allNotificationsReadAdmin,areAllNotificationsReadAdmin,getAdminNotifications,filterAdminProducts,getProductsByAdmin,getOrderedProductsBySeller} = require("./Routes/AdminController");
const {readSellerProfile, updateSeller, editProductSeller, createNewProductSeller, searchProductSeller,filterProductByPriceSeller, sortProductsAscendingSeller, sortProductsDescendingSeller,viewProductsSeller,loginSeller,viewAllProductsSeller,getProductsBySeller, viewMyArchivedProductsSeller, requestDeleteAccountSeller, decrementLoginCount,calculateSellerRevenue,filterSellerProducts,notifySellerOfOutOfStock,allNotificationsReadSeller,areAllNotificationsReadSeller,getSellerNotifications} = require("./Routes/AcceptedSellerController");
const {createNewHistoricalTag,createMuseumsAsTourismGoverner,getMuseumsByAuthorAsTourismGoverner
  ,createHistoricalPlaceAsTourismGoverner , getHistoricalPlaceByNameAsTourismGoverner , updateHistoricalPlaceAsTourismGoverner , deletePlaceAsTourismGoverner , getHistoricalByAuthorAsTourismGoverner, getMuseumByNameAsTourismGoverner, updateMuseumByNameAsTourismGoverner, deleteMuseumByNameAsTourismGoverner,
  loginGoverner, updateGovernorPassword} = require("./Routes/TourismGovernorController");
const{ReadAdvertiserProfile , updateAdvertiser, createNewActivity, readActivity, updateActivity, deleteActivity, getActivitiesByAuthor, loginAdvertiser, updateAdvertiserPassword, decrementLoginCountAdvertiser,requestDeleteAccountAdvertiser, allNotificationsRead, areAllNotificationsRead, getAdvertiserNotifications ,calculateAdvertiserRevenue,getUsersWhoBookedActivity,getRevenueFromActivity,filterAdvertiserActivities,getTotalTouristsForAdvertiser,getTouristsByActivityAndMonth,getHighestRevenueActivity,calculateCurrentMonthRevenueForAdvertiser} = require("./Routes/AdvertiserController");
const {filterActivitiesGuest, getMuseumsByTagGuest, ViewAllUpcomingActivitiesGuest, ViewAllUpcomingMuseumEventsGuest, getHistoricalPlacesByTagGuest, ViewAllUpcomingHistoricalPlacesEventsGuest, sortActivitiesPriceAscendingGuest, sortActivitiesPriceDescendingGuest, sortActivitiesRatingDescendingGuest, sortActivitiesRatingAscendingGuest, ViewAllUpcomingItinerariesGuest, sortItinerariesPriceDescendingGuest, sortItinerariesPriceAscendingGuest, filterItinerariesGuest,ChooseActivitiesByCategoryGuest} = require("./Routes/GuestController");

//const {createNewTourismGoverner, createNewAdmin, createNewProduct, editProduct} = require("./Routes/AdminController");
const{ReadTourGuideProfile , UpdateTourGuideEmail , UpdateTourGuidePassword, UpdateTourGuideMobileNum , UpdateTourGuideYearsofExperience ,UpdateTourGuidePreviousWork, createItineraryAsTourGuide, readItineraryAsTourGuide, updateItineraryAsTourGuide, deleteItineraryAsTourGuide, updateTourGuideProfile,loginTourGuide,getItenrarysByTourGuide, deactivateItinerary,activateItinerary, viewMyDeactivatedItinerariesTourGuide, decrementLoginCountTourGuide,requestDeleteAccountTourGuide, allNotificationsReadtg, areAllNotificationsReadtg, getAdvertiserNotificationstg, calculateTourGuideRevenue, getUsersWhoBookedItinerary, getRevenueFromItinerary, filterTourGuideItineraries, getTouristsByItineraryAndMonth, getHighestRevenueItinerary, calculateCurrentMonthRevenue, getTotalTouristsForTourGuide, calculateRevenueForItinerary} = require("./Routes/TourGuideController")
//importing a set of functions
const MongoURI = process.env.MONGO_URI ;


//App variables
const app = express(); //initialize express app
const port = process.env.PORT || "8000"; //kda kda local host fa msh hayefre2
const user = require('./Models/User'); //transparent so not used in javaScript

// Serve static files from the 'public' directory
app.use('/images', express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads/logos")));


// #Importing the userController


// configurations
// Mongo DB
mongoose.connect(process.env.MONGO_URI) //connect to MongoDB
.then(()=>{
  console.log("MongoDB is now connected!") //to test successful connection
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));
/*
                                                    Start of your code
*/

//request n response 
app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });
  //200 - ok
  //300 - 
  //404 - error

// #Routing to userController here
///////////////////////Multer////////////
const multer = require("multer");


// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/uploads/logos")); // Destination for images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// Configure storage for PDFs
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/uploads/documents")); // Destination for PDFs
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept images
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject non-images
  }
};

// File filter for PDFs
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept PDFs
  } else {
    cb(new Error("Only PDF files are allowed!"), false); // Reject non-PDFs
  }
};

// Multer instances
const uploadImage = multer({ storage: imageStorage, fileFilter: imageFileFilter });
const uploadPDF = multer({ storage: pdfStorage, fileFilter: pdfFileFilter });

app.use(cors());
app.use(express.json())
app.post("/addTourist", createTourist);
app.post('/addUnregisteredTourGuide',uploadPDF.fields([{ name: 'IDDocument', maxCount: 1 }, { name: 'CertificateDocument', maxCount: 1 }]),createUnregisteredTourGuide);
app.post("/addUnregisteredSeller",uploadPDF.single("CombinedDocument"),createUnregisteredSeller);
app.post("/addUnregisteredAdvertiser",uploadPDF.single("AdvertiserDocument"),createUnregisteredAdvertiser);
app.post("/addTourismGovernor", createNewTourismGoverner);
app.post("/addAdmin", createNewAdmin);
app.post("/api/addProduct", uploadImage.single("Picture"), createNewProduct);
app.post("/api/addProductSeller", uploadImage.single("Picture"), createNewProductSeller);
app.put("/api/editProduct", uploadImage.single("Picture"), editProduct);
app.put("/api/editProductSeller", uploadImage.single("Logo"), editProductSeller);
app.post("/api/acceptSeller", acceptSeller);
app.post("/api/acceptTourGuide", acceptTourGuide);
app.post("/api/acceptAdvertiser", acceptAdvertiser);
app.post("/api/rejectSeller", rejectSeller);
app.post("/api/rejectTourGuide", rejectTourGuide);
app.post("/api/rejectAdvertiser", rejectAdvertiser);
app.get("/api/viewTourist", getTourist);
app.post("/api/filterActivities", filterActivities);
app.put("/api/updateTourist", updateTourist);
app.get("/api/readSellerProfile", readSellerProfile);
app.put("/api/updateSeller", uploadImage.single("Logo"), updateSeller);
app.post("/api/createNewCategory", createNewCategory);
app.post("/api/createNewTag", createNewTag);
app.get("/api/readAllActivityCategories", readAllActivityCategories);
app.get("/api/readAllTags", readAllTags);
app.put("/api/updateCategory", updateCategory);
app.put("/api/updateTag", updateTag);
app.post("/api/deleteActivityCategory", deleteActivityCategory);
app.post("/api/deleteTag", deleteTag);
app.post("/deleteAccount", deleteAccount);
app.get("/api/searchProductAdmin", searchProductAdmin);
app.get("/searchProductSeller", searchProductSeller);
app.post("/api/searchProductTourist", searchProductTourist);
app.put("/api/updateTourGuideProfile",uploadImage.single("Logo"), updateTourGuideProfile);
app.get("/filterProductByPriceAdmin", filterProductByPriceAdmin);
app.post("/filterProductByPriceTourist", filterProductByPriceTourist);
app.post("/api/filterProductByPriceSeller", filterProductByPriceSeller);
app.post("/ActivityRating", ActivityRating);
app.post("/ProductRating", ProductRating);
app.get("/api/readAllActivities" , getActivitiesByAuthor);
app.get("/api/sortProductsAscendingAdmin", sortProductsAscendingAdmin);
app.get("/api/sortProductsDescendingAdmin", sortProductsDescendingAdmin);
app.get("/api/sortProductsAscendingSeller", sortProductsAscendingSeller);
app.get("/api/sortProductsDescendingSeller", sortProductsDescendingSeller);
app.get("/api/sortProductsDescendingTourist", sortProductsDescendingTourist);
app.get("/api/sortProductsAscendingTourist", sortProductsAscendingTourist);
app.get("/filterActivitiesGuest", filterActivitiesGuest);
app.post("/api/getMuseumsByTagGuest", getMuseumsByTagGuest);
app.post("/api/getMuseumsByTagTourist", getMuseumsByTagTourist);
app.post("/api/getHistoricalPlacesByTagGuest", getHistoricalPlacesByTagGuest);
app.post("/getHistoricalPlacesByTagTourist", getHistoricalPlacesByTagTourist);

app.get("/api/ViewAllUpcomingActivities", ViewAllUpcomingActivities);
app.get("/api/ViewAllUpcomingActivitiesGuest", ViewAllUpcomingActivitiesGuest);
app.get("/api/ViewAllUpcomingMuseumEventsTourist", ViewAllUpcomingMuseumEventsTourist);
app.get("/api/ViewAllUpcomingMuseumEventsGuest", ViewAllUpcomingMuseumEventsGuest);
app.get("/api/ViewAllUpcomingHistoricalPlacesEventsTourist", ViewAllUpcomingHistoricalPlacesEventsTourist);
app.get("/api/ViewAllUpcomingHistoricalPlacesEventsGuest", ViewAllUpcomingHistoricalPlacesEventsGuest);
app.get("/viewProducts", viewProducts);
app.get("/viewProductsTourist", viewProductsTourist);
app.get("/api/viewProductsSeller", viewProductsSeller);
app.get("/api/viewAllProductsSeller", viewAllProductsSeller);
app.get("/api/getProductsBySeller", getProductsBySeller);
app.get("/api/viewAllProductsAdmin", viewAllProductsAdmin);
app.get("/api/viewAllActivitiesAdmin", viewAllActivitiesAdmin);
app.get("/api/viewAllItinerariesAdmin", viewAllItinerariesAdmin);

app.post("/loginAdvertiser", loginAdvertiser);
app.post("/loginTourist", loginTourist);
app.post("/loginSeller",loginSeller);
app.post("/loginTourGuide",loginTourGuide);
app.post("/loginAdmin",loginAdmin);
app.get("/api/ViewAllUpcomingItinerariesTourist",ViewAllUpcomingItinerariesTourist);
app.get("/api/ViewAllUpcomingItinerariesGuest",ViewAllUpcomingItinerariesGuest);
app.get("/sortItinerariesPriceDescendingTourist",sortItinerariesPriceDescendingTourist);
app.get("/sortItinerariesPriceAscendingTourist",sortItinerariesPriceAscendingTourist);
app.get("/sortItinerariesPriceAscendingGuest",sortItinerariesPriceAscendingGuest);
app.get("/sortItinerariesPriceDescendingGuest",sortItinerariesPriceDescendingGuest);
app.post("/api/ActivitiesSearchAll",ActivitiesSearchAll);
app.post("/api/ItinerarySearchAll",ItinerarySearchAll);
app.post("/api/MuseumSearchAll",MuseumSearchAll);
app.post("/api/HistoricalPlacesSearchAll",HistoricalPlacesSearchAll);


//SPRINT 2 YASSIN AND AMINA
app.put("/updateAdminPassword", updateAdminPassword);
app.put("/updateAdvertiserPassword", updateAdvertiserPassword);
app.put("/updateGovernorPassword", updateGovernorPassword);
app.post("/createComplaint", createComplaint); 
app.get("/getAllComplaints", getAllComplaints);
app.put("/updateComplaintStatus", updateComplaintStatus);
app.put("/replyToComplaint", replyToComplaint);
app.get("/getComplaintDetails", getComplaintDetails);
app.post("/api/filterComplaintsByStatus", filterComplaintsByStatus);
app.get("/sortComplaintsByRecent",sortComplaintsByRecent);
app.get("/sortComplaintsByOldest",sortComplaintsByOldest);
app.get("/api/getComplaintsByTouristUsername" , getComplaintsByTouristUsername);
app.post("/api/archiveProduct" , archiveProduct);
app.post("/api/unarchiveProduct" , unarchiveProduct);
app.post("/api/deactivateItinerary" , deactivateItinerary);
app.post("/api/flagItinerary" , flagItinerary);
app.post("/api/flagActivity" , flagActivity);
app.get("/api/viewArchivedProductsAdmin" , viewArchivedProductsAdmin);
app.get("/api/viewMyArchivedProductsSeller" , viewMyArchivedProductsSeller);
app.get("/api/viewBookedItineraries" , viewBookedItineraries);
app.post("/api/activateItinerary" , activateItinerary);
app.post("/api/requestDeleteAccountTourist" , requestDeleteAccountTourist);
app.post("/api/requestDeleteAccountSeller" , requestDeleteAccountSeller);
app.get("/api/viewMyDeactivatedItinerariesTourGuide" , viewMyDeactivatedItinerariesTourGuide);
app.put("/decrementLoginCount", decrementLoginCount);
app.put("/decrementLoginCountAdvertiser", decrementLoginCountAdvertiser);
app.put("/decrementLoginCountTourGuide", decrementLoginCountTourGuide);
app.get("/api/readAllDeleteRequests" , readAllDeleteRequests);
app.post("/api/requestDeleteAccountAdvertiser" , requestDeleteAccountAdvertiser);
app.post("/api/requestDeleteAccountTourGuide" , requestDeleteAccountTourGuide);
app.post("/api/rejectRequestDeleteAccout" , rejectRequestDeleteAccout);
app.get("/api/viewBookedActivities" , viewBookedActivities);
app.get("/api/getAdminPassword" , getAdminPassword);
app.get("/api/viewAdvertiserDocument", viewAdvertiserDocument);
app.get("/api/viewTourGuideDocuments", viewTourGuideDocuments);
app.get("/api/viewSellerDocument", viewSellerDocument);
app.get("/api/getAllUnregisteredAdvertisers", getAllUnregisteredAdvertisers);
app.get("/api/getAllUnregisteredTourGuides", getAllUnregisteredTourGuides);
app.get("/api/getAllUnregisteredSellers", getAllUnregisteredSellers);
app.get("/api/getAllUnregisteredTransportationAdvertisers", getAllUnregisteredTransportationAdvertisers);
app.put("/api/allNotificationsRead", allNotificationsRead);
app.get("/api/areAllNotificationsRead", areAllNotificationsRead);
app.get("/api/getAdvertiserNotifications", getAdvertiserNotifications);
app.put("/api/allNotificationsReadtg", allNotificationsReadtg);
app.get("/api/areAllNotificationsReadtg", areAllNotificationsReadtg);
app.get("/api/getAdvertiserNotificationstg", getAdvertiserNotificationstg);
app.get("/api/calculateTourGuideRevenue", calculateTourGuideRevenue);
app.get("/api/getUsersWhoBookedItinerary", getUsersWhoBookedItinerary);
app.get("/api/getRevenueFromItinerary", getRevenueFromItinerary);
app.get("/api/filterTourGuideItineraries", filterTourGuideItineraries);
app.get("/api/getTouristsByItineraryAndMonth", getTouristsByItineraryAndMonth); 
app.get("/api/getTotalTourists", getTotalTourists);  
app.get("/api/getTouristsByMonth", getTouristsByMonth);  
app.get("/api/getTotalTourismGovernors", getTotalTourismGovernors);  
app.get("/api/getTourismGovernorsByMonth", getTourismGovernorsByMonth); 
app.get("/api/getTotalTourGuides", getTotalTourGuides);  
app.get("/api/getTourGuidesByMonth", getTourGuidesByMonth); 
app.get("/api/getTotalSellers", getTotalSellers);  
app.get("/api/getSellersByMonth", getSellersByMonth); 
app.get("/api/getTotalAdvertisers", getTotalAdvertisers);  
app.get("/api/getAdvertisersByMonth", getAdvertisersByMonth); 
app.get("/api/getTotalTransportationAdvertisers", getTotalTransportationAdvertisers);  
app.get("/api/getTransportationAdvertisersByMonth", getTransportationAdvertisersByMonth); 
app.get("/api/getTotalUsers", getTotalUsers); 
app.get("/api/getTotalUsersByMonth", getTotalUsersByMonth); 
app.get("/api/getHighestRevenueItinerary", getHighestRevenueItinerary); 
app.get("/api/calculateCurrentMonthRevenue", calculateCurrentMonthRevenue); 
app.get("/api/getTotalTouristsForTourGuide", getTotalTouristsForTourGuide);
app.get("/api/calculateAdvertiserRevenue", calculateAdvertiserRevenue);
app.get("/api/getUsersWhoBookedActivity", getUsersWhoBookedActivity);
app.get("/api/getRevenueFromActivity", getRevenueFromActivity);
app.get("/api/filterAdvertiserActivities", filterAdvertiserActivities);
app.get("/api/getTouristsByActivityAndMonth", getTouristsByActivityAndMonth); 
app.get("/api/getHighestRevenueActivity", getHighestRevenueActivity); 
app.get("/api/calculateCurrentMonthRevenueForAdvertiser", calculateCurrentMonthRevenueForAdvertiser); 
app.get("/api/getTotalTouristsForAdvertiser", getTotalTouristsForAdvertiser);
app.post('/loginUser', loginUser);
app.get("/api/calculateAppRevenueItinerary", calculateAppRevenueItinerary);
app.get("/api/calculateAppRevenueActivity", calculateAppRevenueActivity);
app.get("/api/calculateAppRevenueProduct", calculateAppRevenueProduct);
app.get("/api/calculateTotalAppRevenue", calculateTotalAppRevenue);
app.get('/api/findUserTypeByUsername', findUserTypeByUsername);
app.get("/api/calculateSellerRevenue", calculateSellerRevenue);
app.get("/api/filterSellerProducts", filterSellerProducts);
app.get("/api/calculateRevenueForItinerary", calculateRevenueForItinerary);
app.post('/api/notifyAdminOfOutOfStock', notifyAdminOfOutOfStock);
app.put('/api/allNotificationsReadAdmin', allNotificationsReadAdmin);
app.get('/api/areAllNotificationsReadAdmin', areAllNotificationsReadAdmin);
app.get('/api/getAdminNotifications', getAdminNotifications);
app.get("/api/filterAdminProducts", filterAdminProducts);
app.get("/api/getProductsByAdmin", getProductsByAdmin);
app.get("/api/getOrderedProductsBySeller", getOrderedProductsBySeller);
app.post('/api/notifySellerOfOutOfStock', notifySellerOfOutOfStock);
app.put('/api/allNotificationsReadSeller', allNotificationsReadSeller);
app.get('/api/areAllNotificationsReadSeller', areAllNotificationsReadSeller);
app.get('/api/getSellerNotifications', getSellerNotifications);


//SPRINT 2 MALAK AND JANA
app.get("/ChooseActivitiesByCategoryTourist",ChooseActivitiesByCategoryTourist);
app.get("/ChooseActivitiesByCategoryGuest",ChooseActivitiesByCategoryGuest);
app.put("/bookActivity",bookActivity);
app.put("/bookItinerary",bookItinerary);
app.put("/bookMuseum",bookMuseum);
app.put("/bookHistoricalPlace",bookHistoricalPlace);
app.put("/ratePurchasedProduct",ratePurchasedProduct);
app.put("/addPurchasedProducts",addPurchasedProducts);
app.put("/reviewPurchasedProduct",reviewPurchasedProduct);
app.put("/addCompletedItinerary",addCompletedItinerary);
app.put("/rateTourGuide",rateTourGuide);
app.put("/commentOnTourGuide",commentOnTourGuide);
app.put("/rateCompletedItinerary",rateCompletedItinerary);
app.put("/commentOnItinerary",commentOnItinerary);
app.put("/addCompletedActivities",addCompletedActivities);
app.put("/addCompletedMuseumEvents",addCompletedMuseumEvents);
app.put("/addCompletedHPEvents",addCompletedHPEvents);
app.put("/rateCompletedActivity",rateCompletedActivity);
app.put("/rateCompletedMuseum",rateCompletedMuseum);
app.put("/rateCompletedHP",rateCompletedHP);
app.put("/commentOnActivity",commentOnActivity);
app.put("/commentOnMuseum",commentOnMuseum);
app.put("/commentOnHP",commentOnHP);
app.put("/deleteBookedActivity",deleteBookedActivity);
app.put("/deleteBookedItinerary",deleteBookedItinerary);
app.put("/deleteBookedMuseum",deleteBookedMuseum);
app.put("/deleteBookedHP",deleteBookedHP);
app.put("/payActivity",payActivity);
app.put("/updateWallet",updateWallet);
app.put("/updatepoints",updatepoints);
app.put("/payItinerary",payItinerary);
app.put("/payMuseum",payMuseum);
app.put("/payHP",payHP);
app.put("/redeemPoints",redeemPoints);
app.put("/convertEgp",convertEgp);
app.post("/fetchFlights",fetchFlights);
app.post("/bookFlight",bookFlight);
app.post("/convertCurr",convertCurr);
app.post("/fetchHotelsByCity",fetchHotelsByCity);
app.post("/fetchHotels",fetchHotels);
app.post("/bookHotel",bookHotel);
app.get("/getActivityDetails",getActivityDetails);
app.get("/getHistoricalPlaceDetails",getHistoricalPlaceDetails);
app.get("/getMuseumDetails",getMuseumDetails);
app.get("/api/viewMyCompletedActivities",viewMyCompletedActivities);
app.get("/api/viewMyCompletedItineraries",viewMyCompletedItineraries);
app.get("/api/viewMyCompletedMuseums",viewMyCompletedMuseums);
app.get("/api/viewMyCompletedHistoricalPlaces",viewMyCompletedHistoricalPlaces);
app.get("/api/viewMyBookedActivities",viewMyBookedActivities);
app.get("/api/viewMyBookedItineraries",viewMyBookedItineraries);
app.get("/api/viewMyBookedMuseums",viewMyBookedMuseums);
app.get("/api/viewMyBookedHistoricalPlaces",viewMyBookedHistoricalPlaces);
app.get("/api/viewAllTransportation",viewAllTransportation);
app.get("/api/viewTourGuidesCompleted",viewTourGuidesCompleted);
app.get("/api/viewPurchasedProducts",viewPurchasedProducts)
app.get('/api/viewMyBookedTransportation', viewMyBookedTransportation);
app.get('/api/activity/details/:activityName', getActivityDetails);
app.get('/api/historicalPlace/details/:HPname', getHistoricalPlaceDetails);
app.get('/api/museum/details/:museumName', getMuseumDetails);
app.post('/getCopyLink', GetCopyLink);
app.get('/api/itinerary/details/:itineraryName', getItineraryDetails);
app.post('/createUnregisteredTranspAdvertiser', createUnregisteredTranspAdvertiser);
app.post('/loginTransportationAdvertiser', loginTransportationAdvertiser);
app.post('/api/rejectTranspAdvertiser', rejectTranspAdvertiser);
app.post('/api/acceptTranspAdvertiser', acceptTranspAdvertiser);
app.post('/createNewTransportation', createNewTransportation);
app.get("/ReadTransportationAdvertiserProfile",ReadTransportationAdvertiserProfile);
app.get("/viewPreferenceTags",viewPreferenceTags);
app.get("/api/getTourGuideComments",getTourGuideComments);

app.put("/bookTransportation",bookTransportation);
app.put("/addPreferences",addPreferences);
app.put("/addNotificationSubscriberHP",addNotificationSubscriberHP);
app.put("/addNotificationSubscriberMuseum",addNotificationSubscriberMuseum);
app.put("/addNotificationSubscriberActivity",addNotificationSubscriberActivity);
app.put("/addNotificationSubscriberItinerary",addNotificationSubscriberItinerary);

app.put("/api/allNotificationsTouristRead", allNotificationsTouristRead);
app.get("/api/areAllTouristNotificationsRead", areAllTouristNotificationsRead);
app.get("/api/getTouristNotifications", getTouristNotifications);
app.get("/api/getTouristCartDetails", getTouristCartDetails);
app.get("/api/checkTouristSubscription",checkTouristSubscription);
//app.post("/createNewActivity", createNewActivity);
//Tour Guide
//app.post("/addTourGuide",createTourGuide);
app.get("/api/TourGuideProfile",ReadTourGuideProfile);
app.put("/updateTourGuideEmail",UpdateTourGuideEmail);
app.put("/updateTourGuidePasword",UpdateTourGuidePassword);
app.put("/updateTourGuideMobileNumber",UpdateTourGuideMobileNum);
app.put("/updateTourGuideYearsofExperience",UpdateTourGuideYearsofExperience);
app.put("/updateTourGuidePreviousWork",UpdateTourGuidePreviousWork);
//app.put("/updateTourGuideUsername",UpdateTourGuideUserName);
//Tourist Governer
app.post("/createHistoricalTag", createNewHistoricalTag);
app.post("/addMuseum" , createMuseumsAsTourismGoverner);
app.post("/readMuseumByName" , getMuseumByNameAsTourismGoverner);
app.post("/updateMuseumByName" , updateMuseumByNameAsTourismGoverner);
app.post("/deleteMuseumByName" , deleteMuseumByNameAsTourismGoverner);
app.post("/readAllMuseums" , getMuseumsByAuthorAsTourismGoverner);
app.post("/addHistoricalPlace" , createHistoricalPlaceAsTourismGoverner);
app.get("/readHistoricalPlace" , getHistoricalPlaceByNameAsTourismGoverner);
app.put("/updateHistoricalPlace" , updateHistoricalPlaceAsTourismGoverner);
app.delete("/deleteHistoricalPlace" , deletePlaceAsTourismGoverner);
app.post("/readAllHistoricalPlace" , getHistoricalByAuthorAsTourismGoverner);


app.get("/sortActivitiesPriceAscendingTourist" , sortActivitiesPriceAscendingTourist);
app.get("/sortActivitiesPriceAscendingGuest" , sortActivitiesPriceAscendingGuest);
app.get("/sortActivitiesPriceDescendingTourist" , sortActivitiesPriceDescendingTourist);
app.get("/sortActivitiesPriceDescendingGuest" , sortActivitiesPriceDescendingGuest);
app.get("/sortActivitiesRatingAscendingTourist" , sortActivitiesRatingAscendingTourist);
app.get("/sortActivitiesRatingDescendingTourist" , sortActivitiesRatingDescendingTourist);
app.get("/sortActivitiesRatingDescendingGuest" , sortActivitiesRatingDescendingGuest);
app.get("/sortActivitiesRatingAscendingGuest" , sortActivitiesRatingAscendingGuest);
app.post("/api/filterItinerariesTourist" , filterItinerariesTourist);
app.post("/filterItinerariesGuest" , filterItinerariesGuest);

// Itinerary
app.post("/api/createItinerary",createItineraryAsTourGuide);
app.get("/api/readItinerary", readItineraryAsTourGuide);
app.put("/api/updateItinerary",updateItineraryAsTourGuide);
app.delete("/api/deleteItinerary",deleteItineraryAsTourGuide);
app.get("/api/getallItinerarys",getItenrarysByTourGuide);
//Advertiser
//app.post("/addAdvertiser",createAdvertiser);
app.get("/api/AdvertiserProfile",ReadAdvertiserProfile);
app.put("/api/updateAdvertiserProfile",uploadImage.single("Logo"),updateAdvertiser);
app.post("/api/createNewActivity", createNewActivity);
app.get("/api/readActivity", readActivity);
app.put("/api/updateActivity", updateActivity);
app.post("/api/deleteActivity", deleteActivity);

// app.get("/users", getUsers);
// app.put("/updateUser", updateUser);
// app.delete("/deleteUser", deleteUser);
app.post("/loginGoverner",loginGoverner);
app.get("/api/viewMyTransportations",viewMyTransportations);


//SPRINT 3 MALAK AND JANA
app.put("/payActivityByCard",payActivityByCard);
app.put("/payActivityStripe",payActivityStripe);
app.put("/payItineraryByCard",payItineraryByCard);
app.put("/payItineraryStripe",payItineraryStripe);
app.put("/payMuseumByCard",payMuseumByCard);
app.put("/payMuseumStripe",payMuseumStripe);
app.put("/payHPByCard",payHPByCard);
app.put("/payHPStripe",payHPStripe);
app.post("/sendOtp",sendOtp);
app.post("/loginTouristOTP",loginTouristOTP);
app.put("/addBookmark",addBookmark);
app.get("/api/viewBookmarks",viewBookmarks);
app.post("/addToWishList",addToWishList);
app.get("/api/viewMyWishlist",viewMyWishlist);
app.post("/removeFromWishlist",removeFromWishlist);
app.post("/addToCartFromWishlist",addToCartFromWishlist);
app.get("/api/checkIfInWishlist",checkIfInWishlist);
app.get("/api/checkIfInBookmarkedEvents",checkIfInBookmarkedEvents);
app.post("/removeFromBookmarkedEvents",removeFromBookmarkedEvents);
app.get("/api/viewBookedFlights",viewBookedFlights);
app.get("/api/viewBookedHotels",viewBookedHotels);

app.post("/addToCart",addToCart);
app.post("/removeFromCart",removeFromCart);
app.post("/changeProductQuantityInCart",changeProductQuantityInCart);
app.post("/checkout",checkout);
app.post("/addDeliveryAddress",addDeliveryAddress);
app.get("/viewDeliveryAddresses",viewDeliveryAddresses);
app.put("/chooseDeliveryAddress",chooseDeliveryAddress);
app.post("/payOrderWallet",payOrderWallet);
app.post("/payOrderCash",payOrderCash);
app.post("/payOrderStripe",payOrderStripe);
app.get("/api/viewOrderDetails",viewOrderDetails);
app.put("/cancelOrder",cancelOrder);
app.put("/markOrdersAsDelivered",markOrdersAsDelivered);
app.get("/api/viewAllOrders",viewAllOrders);

app.get("/fetchCityCode",fetchCityCode);
app.post("/createPromo",createPromoCode);
app.post("/sendNotificationWithPromoCode",sendNotificationWithPromoCode)
cron.schedule('0 8 * * *', async () => { // Run every day at 8 AM
  console.log('Running upcoming events reminder...');
  await sendUpcomingEventNotifications();
});


app.use(express.static('public')); //shaghal el html



/*
                                                    End of your code
*/
