// External variables
const express = require("express"); //importing express
const path = require('path');
const cors = require('cors');

const mongoose = require('mongoose'); //importing mongoose
mongoose.set('strictQuery', false);
require("dotenv").config(); //load enviironment variables
//const {createUser,getUsers, updateUser, deleteUser} = require("./Routes/userController");
const {createTourist,getTourist, updateTourist, searchProductTourist, filterActivities, filterProductByPriceTourist, ActivityRating, sortProductsDescendingTourist, sortProductsAscendingTourist, ViewAllUpcomingActivities, ViewAllUpcomingMuseumEventsTourist, getMuseumsByTagTourist, getHistoricalPlacesByTagTourist, ViewAllUpcomingHistoricalPlacesEventsTourist,viewProductsTourist, sortActivitiesPriceAscendingTourist, sortActivitiesPriceDescendingTourist, sortActivitiesRatingAscendingTourist, sortActivitiesRatingDescendingTourist, loginTourist, ViewAllUpcomingItinerariesTourist, sortItinerariesPriceAscendingTourist, sortItinerariesPriceDescendingTourist, filterItinerariesTourist,ActivitiesSearchAll, ItinerarySearchAll, MuseumSearchAll, HistoricalPlacesSearchAll, ProductRating, createComplaint, getComplaintsByTouristUsername,ChooseActivitiesByCategoryTourist,bookActivity,bookItinerary,bookMuseum,bookHistoricalPlace, ratePurchasedProduct, addPurchasedProducts, reviewPurchasedProduct, addCompletedItinerary, rateTourGuide, commentOnTourGuide, rateCompletedItinerary, commentOnItinerary, addCompletedActivities, addCompletedMuseumEvents, addCompletedHPEvents, rateCompletedActivity, rateCompletedMuseum, rateCompletedHP, commentOnActivity, commentOnMuseum, commentOnHP,deleteBookedActivity,deleteBookedItinerary,deleteBookedMuseum,deleteBookedHP,payActivity,updateWallet,updatepoints,payItinerary,payMuseum,payHP,redeemPoints, convertEgp, fetchFlights,viewBookedItineraries} = require("./Routes/TouristController");
const {createUnregisteredAdvertiser} = require("./Routes/UnregisteredAdvertiserController");
const {createUnregisteredTourGuide} = require("./Routes/UnregisteredTourGuideController");
const {createUnregisteredSeller} = require("./Routes/UnregisteredSellerController");
const {createNewTourismGoverner, createNewAdmin, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories,updateCategory, deleteActivityCategory, deleteAccount, searchProductAdmin, createNewTag, readAllTags, updateTag, deleteTag, acceptTourGuide, rejectTourGuide, acceptAdvertiser, rejectAdvertiser, filterProductByPriceAdmin, sortProductsAscendingAdmin, sortProductsDescendingAdmin,viewProducts,loginAdmin, viewAllProductsAdmin, updateAdminPassword, getAllComplaints, updateComplaintStatus, replyToComplaint, getComplaintDetails, filterComplaintsByStatus, sortComplaintsByRecent, sortComplaintsByOldest, archiveProduct, unarchiveProduct, flagItinerary, viewArchivedProductsAdmin} = require("./Routes/AdminController");
const {readSellerProfile, updateSeller, editProductSeller, createNewProductSeller, searchProductSeller,filterProductByPriceSeller, sortProductsAscendingSeller, sortProductsDescendingSeller,viewProductsSeller,loginSeller,viewAllProductsSeller,getProductsBySeller, viewMyArchivedProductsSeller} = require("./Routes/AcceptedSellerController");
const {createNewHistoricalTag,createMuseumsAsTourismGoverner,getMuseumsByAuthorAsTourismGoverner
  ,createHistoricalPlaceAsTourismGoverner , getHistoricalPlaceByNameAsTourismGoverner , updateHistoricalPlaceAsTourismGoverner , deletePlaceAsTourismGoverner , getHistoricalByAuthorAsTourismGoverner, getMuseumByNameAsTourismGoverner, updateMuseumByNameAsTourismGoverner, deleteMuseumByNameAsTourismGoverner,
  loginGoverner, updateGovernorPassword} = require("./Routes/TourismGovernorController");
const{ReadAdvertiserProfile , updateAdvertiser, createNewActivity, readActivity, updateActivity, deleteActivity, getActivitiesByAuthor, loginAdvertiser} = require("./Routes/AdvertiserController");
const {filterActivitiesGuest, getMuseumsByTagGuest, ViewAllUpcomingActivitiesGuest, ViewAllUpcomingMuseumEventsGuest, getHistoricalPlacesByTagGuest, ViewAllUpcomingHistoricalPlacesEventsGuest, sortActivitiesPriceAscendingGuest, sortActivitiesPriceDescendingGuest, sortActivitiesRatingDescendingGuest, sortActivitiesRatingAscendingGuest, ViewAllUpcomingItinerariesGuest, sortItinerariesPriceDescendingGuest, sortItinerariesPriceAscendingGuest, filterItinerariesGuest,ChooseActivitiesByCategoryGuest} = require("./Routes/GuestController");

//const {createNewTourismGoverner, createNewAdmin, createNewProduct, editProduct} = require("./Routes/AdminController");
const{ReadTourGuideProfile , UpdateTourGuideEmail , UpdateTourGuidePassword, UpdateTourGuideMobileNum , UpdateTourGuideYearsofExperience ,UpdateTourGuidePreviousWork, createItineraryAsTourGuide, readItineraryAsTourGuide, updateItineraryAsTourGuide, deleteItineraryAsTourGuide, updateTourGuideProfile,loginTourGuide,getItenrarysByTourGuide, deactivateItinerary,activateItinerary} = require("./Routes/TourGuideController")
//importing a set of functions
const MongoURI = process.env.MONGO_URI ;


//App variables
const app = express(); //initialize express app
const port = process.env.PORT || "8000"; //kda kda local host fa msh hayefre2
const user = require('./Models/User'); //transparent so not used in javaScript

// Serve static files from the 'public' directory
app.use('/images', express.static(path.join(__dirname, 'public')));

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
app.use(cors());
app.use(express.json())
app.post("/addTourist", createTourist);
app.post("/addUnregisteredTourGuide", createUnregisteredTourGuide);
app.post("/addUnregisteredSeller", createUnregisteredSeller);
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
app.post("/api/filterActivities", filterActivities);//
app.put("/api/updateTourist", updateTourist);
app.get("/api/readSellerProfile", readSellerProfile);
app.put("/api/updateSeller", updateSeller);
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
app.put("/api/updateTourGuideProfile", updateTourGuideProfile);
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
app.put("/updateGovernorPassword", updateGovernorPassword);
app.post("/createComplaint", createComplaint); 
app.get("/getAllComplaints", getAllComplaints);
app.put("/updateComplaintStatus", updateComplaintStatus);
app.put("/replyToComplaint", replyToComplaint);
app.get("/getComplaintDetails", getComplaintDetails);
app.get("/filterComplaintsByStatus", filterComplaintsByStatus);
app.get("/sortComplaintsByRecent",sortComplaintsByRecent);
app.get("/sortComplaintsByOldest",sortComplaintsByOldest);
app.get("/api/getComplaintsByTouristUsername" , getComplaintsByTouristUsername);
app.post("/api/archiveProduct" , archiveProduct);
app.post("/api/unarchiveProduct" , unarchiveProduct);
app.post("/api/deactivateItinerary" , deactivateItinerary);
app.post("/api/flagItinerary" , flagItinerary);
app.get("/api/viewArchivedProductsAdmin" , viewArchivedProductsAdmin);
app.get("/api/viewMyArchivedProductsSeller" , viewMyArchivedProductsSeller);
app.get("/api/viewBookedItineraries" , viewBookedItineraries);
app.post("/api/activateItinerary" , activateItinerary);

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

app.use(express.static('public')); //shaghal el html



/*
                                                    End of your code
*/

