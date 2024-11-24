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
  addDeliveryAddress, viewDeliveryAddresses,chooseDeliveryAddress,payOrderWallet,payOrderCash,viewOrderDetails,cancelOrder,markOrdersAsDelivered,viewAllOrders,sendUpcomingEventNotifications,payOrderStripe,payItineraryStripe,payActivityStripe,payMuseumStripe,payHPStripe, fetchCityCode} = require("./Routes/TouristController");
const {createUnregisteredAdvertiser} = require("./Routes/UnregisteredAdvertiserController");

const {createUnregisteredTranspAdvertiser} = require("./Routes/UnregisteredTranspAdvertiserController");
const {loginTransportationAdvertiser,ReadTransportationAdvertiserProfile,createNewTransportation} = require("./Routes/TransportationAdvertiserController");

const {createUnregisteredTourGuide} = require("./Routes/UnregisteredTourGuideController");
const {createUnregisteredSeller} = require("./Routes/UnregisteredSellerController");
const {createNewTourismGoverner, createNewAdmin, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories,updateCategory, deleteActivityCategory, deleteAccount, searchProductAdmin, createNewTag, readAllTags, updateTag, deleteTag, acceptTourGuide, rejectTourGuide, acceptAdvertiser, rejectAdvertiser, filterProductByPriceAdmin, sortProductsAscendingAdmin, sortProductsDescendingAdmin,viewProducts,loginAdmin, viewAllProductsAdmin, updateAdminPassword, getAllComplaints, updateComplaintStatus, replyToComplaint, getComplaintDetails, filterComplaintsByStatus, sortComplaintsByRecent, sortComplaintsByOldest, archiveProduct, unarchiveProduct, flagItinerary, viewArchivedProductsAdmin, flagActivity ,viewAllActivitiesAdmin , viewAllItinerariesAdmin, acceptTranspAdvertiser,rejectTranspAdvertiser, readAllDeleteRequests,rejectRequestDeleteAccout, getAdminPassword} = require("./Routes/AdminController");
const {readSellerProfile, updateSeller, editProductSeller, createNewProductSeller, searchProductSeller,filterProductByPriceSeller, sortProductsAscendingSeller, sortProductsDescendingSeller,viewProductsSeller,loginSeller,viewAllProductsSeller,getProductsBySeller, viewMyArchivedProductsSeller, requestDeleteAccountSeller, decrementLoginCount} = require("./Routes/AcceptedSellerController");
const {createNewHistoricalTag,createMuseumsAsTourismGoverner,getMuseumsByAuthorAsTourismGoverner
  ,createHistoricalPlaceAsTourismGoverner , getHistoricalPlaceByNameAsTourismGoverner , updateHistoricalPlaceAsTourismGoverner , deletePlaceAsTourismGoverner , getHistoricalByAuthorAsTourismGoverner, getMuseumByNameAsTourismGoverner, updateMuseumByNameAsTourismGoverner, deleteMuseumByNameAsTourismGoverner,
  loginGoverner, updateGovernorPassword} = require("./Routes/TourismGovernorController");
const{ReadAdvertiserProfile , updateAdvertiser, createNewActivity, readActivity, updateActivity, deleteActivity, getActivitiesByAuthor, loginAdvertiser, updateAdvertiserPassword, decrementLoginCountAdvertiser,requestDeleteAccountAdvertiser} = require("./Routes/AdvertiserController");
const {filterActivitiesGuest, getMuseumsByTagGuest, ViewAllUpcomingActivitiesGuest, ViewAllUpcomingMuseumEventsGuest, getHistoricalPlacesByTagGuest, ViewAllUpcomingHistoricalPlacesEventsGuest, sortActivitiesPriceAscendingGuest, sortActivitiesPriceDescendingGuest, sortActivitiesRatingDescendingGuest, sortActivitiesRatingAscendingGuest, ViewAllUpcomingItinerariesGuest, sortItinerariesPriceDescendingGuest, sortItinerariesPriceAscendingGuest, filterItinerariesGuest,ChooseActivitiesByCategoryGuest} = require("./Routes/GuestController");

//const {createNewTourismGoverner, createNewAdmin, createNewProduct, editProduct} = require("./Routes/AdminController");
const{ReadTourGuideProfile , UpdateTourGuideEmail , UpdateTourGuidePassword, UpdateTourGuideMobileNum , UpdateTourGuideYearsofExperience ,UpdateTourGuidePreviousWork, createItineraryAsTourGuide, readItineraryAsTourGuide, updateItineraryAsTourGuide, deleteItineraryAsTourGuide, updateTourGuideProfile,loginTourGuide,getItenrarysByTourGuide, deactivateItinerary,activateItinerary, viewMyDeactivatedItinerariesTourGuide, decrementLoginCountTourGuide,requestDeleteAccountTourGuide} = require("./Routes/TourGuideController")
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
app.post("/addUnregisteredAdvertiser", createUnregisteredAdvertiser);
app.post("/addTourismGovernor", createNewTourismGoverner);
app.post("/addAdmin", createNewAdmin);
app.post("/addProduct", createNewProduct);
app.post("/api/addProductSeller", createNewProductSeller);
app.put("/editProduct", editProduct);
app.put("/api/editProductSeller", editProductSeller);
app.post("/acceptSeller", acceptSeller);
app.post("/acceptTourGuide", acceptTourGuide);
app.post("/acceptAdvertiser", acceptAdvertiser);
app.post("/rejectSeller", rejectSeller);
app.post("/rejectTourGuide", rejectTourGuide);
app.post("/rejectAdvertiser", rejectAdvertiser);
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
app.get("/searchProductAdmin", searchProductAdmin);
app.get("/searchProductSeller", searchProductSeller);
app.get("/searchProductTourist", searchProductTourist);
app.put("/api/updateTourGuideProfile",uploadImage.single("Logo"), updateTourGuideProfile);
app.get("/filterProductByPriceAdmin", filterProductByPriceAdmin);
app.post("/api/filterProductByPriceTourist", filterProductByPriceTourist);
app.post("/api/filterProductByPriceSeller", filterProductByPriceSeller);
app.post("/ActivityRating", ActivityRating);
app.post("/ProductRating", ProductRating);
app.get("/api/readAllActivities" , getActivitiesByAuthor);
app.get("/sortProductsAscendingAdmin", sortProductsAscendingAdmin);
app.get("/sortProductsDescendingAdmin", sortProductsDescendingAdmin);
app.get("/api/sortProductsAscendingSeller", sortProductsAscendingSeller);
app.get("/api/sortProductsDescendingSeller", sortProductsDescendingSeller);
app.get("/api/sortProductsDescendingTourist", sortProductsDescendingTourist);
app.get("/api/sortProductsAscendingTourist", sortProductsAscendingTourist);
app.get("/filterActivitiesGuest", filterActivitiesGuest);
app.post("/api/getMuseumsByTagGuest", getMuseumsByTagGuest);
app.get("/getMuseumsByTagTourist", getMuseumsByTagTourist);
app.post("/api/getHistoricalPlacesByTagGuest", getHistoricalPlacesByTagGuest);
app.get("/getHistoricalPlacesByTagTourist", getHistoricalPlacesByTagTourist);

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
app.post('/rejectTranspAdvertiser', rejectTranspAdvertiser);
app.post('/acceptTranspAdvertiser', acceptTranspAdvertiser);
app.post('/createNewTransportation', createNewTransportation);
app.get("/ReadTransportationAdvertiserProfile",ReadTransportationAdvertiserProfile);
app.get("/viewPreferenceTags",viewPreferenceTags);

app.put("/bookTransportation",bookTransportation);
app.put("/addPreferences",addPreferences);



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
app.put("/api/updateAdvertiserProfile",updateAdvertiser);
app.post("/api/createNewActivity", createNewActivity);
app.get("/api/readActivity", readActivity);
app.put("/api/updateActivity", updateActivity);
app.post("/api/deleteActivity", deleteActivity);

// app.get("/users", getUsers);
// app.put("/updateUser", updateUser);
// app.delete("/deleteUser", deleteUser);
app.post("/loginGoverner",loginGoverner);



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
app.get("/viewBookmarks",viewBookmarks);
app.post("/addToWishList",addToWishList);
app.get("/viewMyWishlist",viewMyWishlist);
app.post("/removeFromWishlist",removeFromWishlist);
app.post("/addToCartFromWishlist",addToCartFromWishlist);
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
app.get("/viewOrderDetails",viewOrderDetails);
app.put("/cancelOrder",cancelOrder);
app.put("/markOrdersAsDelivered",markOrdersAsDelivered);
app.get("/viewAllOrders",viewAllOrders);
app.get("/sendUpcomingEventNotifications",sendUpcomingEventNotifications);
app.get("/fetchCityCode",fetchCityCode);


cron.schedule('0 8 * * *', async () => { // Run every day at 8 AM
  console.log('Running upcoming events reminder...');
  await sendUpcomingEventNotifications();
});


app.use(express.static('public')); //shaghal el html



/*
                                                    End of your code
*/

