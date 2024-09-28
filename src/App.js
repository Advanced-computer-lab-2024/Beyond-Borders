// External variables
const express = require("express"); //importing express
const mongoose = require('mongoose'); //importing mongoose
mongoose.set('strictQuery', false);
require("dotenv").config(); //load enviironment variables
//const {createUser,getUsers, updateUser, deleteUser} = require("./Routes/userController");
const {createTourist,getTourist, updateTourist} = require("./Routes/TouristController");
const {createUnregisteredAdvertiser} = require("./Routes/UnregisteredAdvertiserController");
const {createUnregisteredTourGuide} = require("./Routes/UnregisteredTourGuideController");
const {createUnregisteredSeller} = require("./Routes/UnregisteredSellerController");
const {createNewTourismGoverner, createNewAdmin, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories,updateCategory, deleteActivityCategory} = require("./Routes/AdminController");
const {readSellerProfile, updateSeller} = require("./Routes/AcceptedSellerController");


//importing a set of functions
const MongoURI = process.env.MONGO_URI ;


//App variables
const app = express(); //initialize express app
const port = process.env.PORT || "8000"; //kda kda local host fa msh hayefre2
const user = require('./Models/User'); //transparent so not used in javaScript
// #Importing the userController


// configurations
// Mongo DB
mongoose.connect(MongoURI) //connect to MongoDB
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
app.put("/editProduct", editProduct);
app.post("/acceptSeller", acceptSeller);
app.post("/rejectSeller", rejectSeller);
app.get("/viewTourist", getTourist);
app.put("/updateTourist", updateTourist);
app.get("/readSellerProfile", readSellerProfile);
app.put("/updateSeller", updateSeller);
app.post("/createNewCategory", createNewCategory);
app.get("/readAllActivityCategories", readAllActivityCategories);
app.put("/updateCategory", updateCategory);
app.post("/deleteActivityCategory", deleteActivityCategory);

// app.get("/users", getUsers);
// app.put("/updateUser", updateUser);
// app.delete("/deleteUser", deleteUser);

app.use(express.static('public')); //shaghal el html


/*
                                                    End of your code
*/

