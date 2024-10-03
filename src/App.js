// External variables
const express = require("express"); //importing express
const path = require('path');

const mongoose = require('mongoose'); //importing mongoose
mongoose.set('strictQuery', false);
require("dotenv").config(); //load enviironment variables
//const {createUser,getUsers, updateUser, deleteUser} = require("./Routes/userController");
const {createTourist,getTourist, updateTourist, searchProductTourist, filterActivities, filterProductByPriceTourist, ActivityRating, sortProductsDescendingTourist, sortProductsAscendingTourist, ViewAllUpcomingActivities, ViewAllUpcomingMuseumEventsTourist, getMuseumsByTagTourist, getHistoricalPlacesByTagTourist, ViewAllUpcomingHistoricalPlacesEventsTourist,viewProductsTourist, sortActivitiesPriceAscendingTourist, sortActivitiesPriceDescendingTourist, sortActivitiesRatingAscendingTourist, sortActivitiesRatingDescendingTourist} = require("./Routes/TouristController");
const {createUnregisteredAdvertiser} = require("./Routes/UnregisteredAdvertiserController");
const {createUnregisteredTourGuide} = require("./Routes/UnregisteredTourGuideController");
const {createUnregisteredSeller} = require("./Routes/UnregisteredSellerController");
const {createNewTourismGoverner, createNewAdmin, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories,updateCategory, deleteActivityCategory, deleteAccount, searchProductAdmin, createNewTag, readAllTags, updateTag, deleteTag, acceptTourGuide, rejectTourGuide, acceptAdvertiser, rejectAdvertiser, filterProductByPriceAdmin, sortProductsAscendingAdmin, sortProductsDescendingAdmin,viewProducts} = require("./Routes/AdminController");
const {readSellerProfile, updateSeller, editProductSeller, createNewProductSeller, searchProductSeller,filterProductByPriceSeller, sortProductsAscendingSeller, sortProductsDescendingSeller,viewProductsSeller} = require("./Routes/AcceptedSellerController");
const {createNewHistoricalTag,createMuseumsAsTourismGoverner,getMuseumsByAuthorAsTourismGoverner
  ,createHistoricalPlaceAsTourismGoverner , getHistoricalPlaceByNameAsTourismGoverner , updateHistoricalPlaceAsTourismGoverner , deletePlaceAsTourismGoverner , getHistoricalByAuthorAsTourismGoverner, getMuseumByNameAsTourismGoverner, updateMuseumByNameAsTourismGoverner, deleteMuseumByNameAsTourismGoverner
} = require("./Routes/TourismGovernorController");
const{ReadAdvertiserProfile , updateAdvertiser, createNewActivity, readActivity, updateActivity, deleteActivity, getActivitiesByAuthor} = require("./Routes/AdvertiserController");
const {filterActivitiesGuest, getMuseumsByTagGuest, ViewAllUpcomingActivitiesGuest, ViewAllUpcomingMuseumEventsGuest, getHistoricalPlacesByTagGuest, ViewAllUpcomingHistoricalPlacesEventsGuest, sortActivitiesPriceAscendingGuest, sortActivitiesPriceDescendingGuest, sortActivitiesRatingDescendingGuest, sortActivitiesRatingAscendingGuest} = require("./Routes/GuestController");

//const {createNewTourismGoverner, createNewAdmin, createNewProduct, editProduct} = require("./Routes/AdminController");
const{ReadTourGuideProfile , UpdateTourGuideEmail , UpdateTourGuidePassword, UpdateTourGuideMobileNum , UpdateTourGuideYearsofExperience ,UpdateTourGuidePreviousWork, createItineraryAsTourGuide, readItineraryAsTourGuide, updateItineraryAsTourGuide, deleteItineraryAsTourGuide, updateTourGuideProfile} = require("./Routes/TourGuideController")
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

app.use(express.json())
app.post("/addTourist", createTourist);
app.post("/addUnregisteredTourGuide", createUnregisteredTourGuide);
app.post("/addUnregisteredSeller", createUnregisteredSeller);
app.post("/addUnregisteredAdvertiser", createUnregisteredAdvertiser);
app.post("/addTourismGovernor", createNewTourismGoverner);
app.post("/addAdmin", createNewAdmin);
app.post("/addProduct", createNewProduct);
app.post("/addProductSeller", createNewProductSeller);
app.put("/editProduct", editProduct);
app.put("/editProductSeller", editProductSeller);
app.post("/acceptSeller", acceptSeller);
app.post("/acceptTourGuide", acceptTourGuide);
app.post("/acceptAdvertiser", acceptAdvertiser);
app.post("/rejectSeller", rejectSeller);
app.post("/rejectTourGuide", rejectTourGuide);
app.post("/rejectAdvertiser", rejectAdvertiser);
app.get("/viewTourist", getTourist);
app.get("/filterActivities", filterActivities);//
app.put("/updateTourist", updateTourist);
app.get("/readSellerProfile", readSellerProfile);
app.put("/updateSeller", updateSeller);
app.post("/createNewCategory", createNewCategory);
app.post("/createNewTag", createNewTag);
app.get("/readAllActivityCategories", readAllActivityCategories);
app.get("/readAllTags", readAllTags);
app.put("/updateCategory", updateCategory);
app.put("/updateTag", updateTag);
app.post("/deleteActivityCategory", deleteActivityCategory);
app.post("/deleteTag", deleteTag);
app.post("/deleteAccount", deleteAccount);
app.get("/searchProductAdmin", searchProductAdmin);
app.get("/searchProductSeller", searchProductSeller);
app.get("/searchProductTourist", searchProductTourist);
app.put("/updateTourGuideProfile", updateTourGuideProfile);
app.get("/filterProductByPriceAdmin", filterProductByPriceAdmin);
app.get("/filterProductByPriceTourist", filterProductByPriceTourist);
app.get("/filterProductByPriceSeller", filterProductByPriceSeller);
app.post("/ActivityRating", ActivityRating);
app.get("/readAllActivities" , getActivitiesByAuthor);
app.get("/sortProductsAscendingAdmin", sortProductsAscendingAdmin);
app.get("/sortProductsDescendingAdmin", sortProductsDescendingAdmin);
app.get("/sortProductsAscendingSeller", sortProductsAscendingSeller);
app.get("/sortProductsDescendingSeller", sortProductsDescendingSeller);
app.get("/sortProductsDescendingTourist", sortProductsDescendingTourist);
app.get("/sortProductsAscendingTourist", sortProductsAscendingTourist);
app.get("/filterActivitiesGuest", filterActivitiesGuest);
app.get("/getMuseumsByTagGuest", getMuseumsByTagGuest);
app.get("/getMuseumsByTagTourist", getMuseumsByTagTourist);
app.get("/getHistoricalPlacesByTagGuest", getHistoricalPlacesByTagGuest);
app.get("/getHistoricalPlacesByTagTourist", getHistoricalPlacesByTagTourist);

app.get("/ViewAllUpcomingActivities", ViewAllUpcomingActivities);
app.get("/ViewAllUpcomingActivitiesGuest", ViewAllUpcomingActivitiesGuest);
app.get("/ViewAllUpcomingMuseumEventsTourist", ViewAllUpcomingMuseumEventsTourist);
app.get("/ViewAllUpcomingMuseumEventsGuest", ViewAllUpcomingMuseumEventsGuest);
app.get("/ViewAllUpcomingHistoricalPlacesEventsTourist", ViewAllUpcomingHistoricalPlacesEventsTourist);
app.get("/ViewAllUpcomingHistoricalPlacesEventsGuest", ViewAllUpcomingHistoricalPlacesEventsGuest);
app.get("/viewProducts", viewProducts);
app.get("/viewProductsTourist", viewProductsTourist);
app.get("/viewProductsSeller", viewProductsSeller);





//app.post("/createNewActivity", createNewActivity);
//Tour Guide
//app.post("/addTourGuide",createTourGuide);
app.get("/TourGuideProfile",ReadTourGuideProfile);
app.put("/updateTourGuideEmail",UpdateTourGuideEmail);
app.put("/updateTourGuidePasword",UpdateTourGuidePassword);
app.put("/updateTourGuideMobileNumber",UpdateTourGuideMobileNum);
app.put("/updateTourGuideYearsofExperience",UpdateTourGuideYearsofExperience);
app.put("/updateTourGuidePreviousWork",UpdateTourGuidePreviousWork);
//app.put("/updateTourGuideUsername",UpdateTourGuideUserName);
//Tourist Governer
app.post("/createHistoricalTag", createNewHistoricalTag);
app.post("/addMuseum" , createMuseumsAsTourismGoverner);
app.get("/readMuseumByName" , getMuseumByNameAsTourismGoverner);
app.put("/updateMuseumByName" , updateMuseumByNameAsTourismGoverner);
app.post("/deleteMuseumByName" , deleteMuseumByNameAsTourismGoverner);
app.get("/readAllMuseums" , getMuseumsByAuthorAsTourismGoverner)
app.post("/addHistoricalPlace" , createHistoricalPlaceAsTourismGoverner);
app.get("/readHistoricalPlace" , getHistoricalPlaceByNameAsTourismGoverner);
app.put("/updateHistoricalPlace" , updateHistoricalPlaceAsTourismGoverner);
app.delete("/deleteHistoricalPlace" , deletePlaceAsTourismGoverner);
app.get("/readAllHistoricalPlace" , getHistoricalByAuthorAsTourismGoverner);


app.get("/sortActivitiesPriceAscendingTourist" , sortActivitiesPriceAscendingTourist);
app.get("/sortActivitiesPriceAscendingGuest" , sortActivitiesPriceAscendingGuest);
app.get("/sortActivitiesPriceDescendingTourist" , sortActivitiesPriceDescendingTourist);
app.get("/sortActivitiesPriceDescendingGuest" , sortActivitiesPriceDescendingGuest);
app.get("/sortActivitiesRatingAscendingTourist" , sortActivitiesRatingAscendingTourist);
app.get("/sortActivitiesRatingDescendingTourist" , sortActivitiesRatingDescendingTourist);
app.get("/sortActivitiesRatingDescendingGuest" , sortActivitiesRatingDescendingGuest);
app.get("/sortActivitiesRatingAscendingGuest" , sortActivitiesRatingAscendingGuest);












// Itinerary
app.post("/createItinerary",createItineraryAsTourGuide);
app.get("/readItinerary",readItineraryAsTourGuide);
app.put("/updateItinerary",updateItineraryAsTourGuide);
app.delete("/deleteItinerary",deleteItineraryAsTourGuide);
//Advertiser
//app.post("/addAdvertiser",createAdvertiser);
app.get("/AdvertiserProfile",ReadAdvertiserProfile);
app.put("/updateAdvertiserProfile",updateAdvertiser);
app.post("/createNewActivity", createNewActivity);
app.get("/readActivity", readActivity);
app.put("/updateActivity", updateActivity);
app.post("/deleteActivity", deleteActivity);

// app.get("/users", getUsers);
// app.put("/updateUser", updateUser);
// app.delete("/deleteUser", deleteUser);

app.use(express.static('public')); //shaghal el html



/*
                                                    End of your code
*/

