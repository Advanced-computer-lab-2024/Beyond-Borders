const HistoricalTagsModel = require('../Models/HistoricalTags');

const TourismGovernerModel = require('../Models/TourismGoverner');

const { default: mongoose } = require('mongoose');


const loginGoverner = async (req, res) => {
   try {
     const { username, password } = req.body;
 
     // Validate input
     if (!username || !password) {
       return res.status(400).json({ error: "Username and password are required." });
     }
 
     // Find the advertiser by username
     const TourismGoverner = await TourismGovernerModel.findOne({ Username: username });
     if (!TourismGoverner) {
       return res.status(401).json({ error: "Invalid username." });
     }
 
     // Check if the password matches
     if (TourismGoverner.Password !== password) {
       return res.status(401).json({ error: "Invalid password." });
     }
 
     // Successful authentication
     res.status(200).json({ message: "Login successful!", TourismGoverner });
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };

const createNewHistoricalTag = async(req,res) => {
    //Destructure Name, Email, Age from the request body
    const{NameOfHistoricalTags} = req.body;
    try{
       // Check if a user with the same Username already exists
       const existingHistoricalTag = await HistoricalTagsModel.findOne({NameOfHistoricalTags});
       if (existingHistoricalTag) {
           return res.status(400).json({ error: "Tag already exists!" });
       }
       //add a new category to the database with Name, Email and Age
       const newTag = await HistoricalTagsModel.create({NameOfHistoricalTags});
       //Send the created use as a JSON response with a 200 OK status 
       res.status(200).json({msg:"New Historical Tag is created!"});
       //res.status(200).json(user);
    } catch (error){
       //If an error occurs, send a 400 Bad Request status with the error message
       res.status(400).json({ error: error.message});
    }
 };
// Museums part as a Tourism governer
const{CreateMuseums} = require('./MuseumsController');
const{getMuseumsByAuthor} = require('./MuseumsController');

//YASSIN AND AMINA 
const{getMuseumByName, updateMuseumByName, deleteMuseumByName} = require('./MuseumsController');

const createMuseumsAsTourismGoverner = async(req,res) => {
   try{
    await CreateMuseums(req,res);
   }  
   catch(error){
    res.status(500).json({error : error.msg});
   }
}

//YASSIN AND AMINA
const getMuseumByNameAsTourismGoverner = async(req,res) =>{
   try{
      await getMuseumByName(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg})
   }
}

//YASSIN AND AMINA
const updateMuseumByNameAsTourismGoverner = async(req,res) =>{
   try{
      await updateMuseumByName(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg});
   }
}

//YASSIN AND AMINA
const deleteMuseumByNameAsTourismGoverner = async(req,res) =>{
   try{
      await deleteMuseumByName(req,res);
   }
   catch(error){
      res.status(500).json({error : error.msg});
   }
}

const getMuseumsByAuthorAsTourismGoverner = async(req,res) =>{
   try{
      await getMuseumsByAuthor(req,res);
   }
   catch(error){
      res.status(500).json({error : error.msg})
   }
}
 // Historical places part as a Tourism governer
 const{CreateHistoricalPlace} = require('./HistoricalPlaceController');
 const{getHistoricalPlaceByName} = require('./HistoricalPlaceController');
 const{updateHistoricalPlace} = require('./HistoricalPlaceController');
 const{deleteHistoricalPlacebyName} = require('./HistoricalPlaceController');
 const{getHistoricalPlaceByAuthor} = require('./HistoricalPlaceController');
const TourismGoverner = require('../Models/TourismGoverner');
 const createHistoricalPlaceAsTourismGoverner = async(req,res) => {
   try{
    await CreateHistoricalPlace(req,res);
   }  
   catch(error){
    res.status(500).json({error : error.msg});
   }
}
const getHistoricalPlaceByNameAsTourismGoverner = async(req,res) =>{
   try{
      await getHistoricalPlaceByName(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg})
   }
}
const updateHistoricalPlaceAsTourismGoverner = async(req,res) =>{
   try{
      await updateHistoricalPlace(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg});
   }
}


const deletePlaceAsTourismGoverner = async(req,res) =>{
   try{
      await deleteHistoricalPlacebyName(req,res);
   }
   catch(error){
      res.status(500).json({error : error.msg});
   }
}
const getHistoricalByAuthorAsTourismGoverner = async(req,res) =>{
   try{
      await getHistoricalPlaceByAuthor(req,res);
   }
   catch(error){
      res.status(500).json({error : error.msg})
   }
}

const updateGovernorPassword = async (req, res) => {
   const { Username, newPassword } = req.body;

   try {
       const existingUser = await TourismGovernerModel.findOne({ Username:Username });

       //Redundant code but extra precaution as you will never do this except after logging in
       if (!existingUser) {
           return res.status(404).json({ error: "User not found!" });
       }

       // Update the password for the admin
       existingUser.Password = newPassword; // You might want to hash the password before saving
       await existingUser.save();

       // Send a success response
       res.status(200).json({ msg: "Password updated successfully!" });
   } catch (error) {
       // If an error occurs, send a 400 Bad Request status with the error message
       res.status(400).json({ error: error.message });
   }
};

 module.exports = {createNewHistoricalTag,createMuseumsAsTourismGoverner,getMuseumsByAuthorAsTourismGoverner
   ,createHistoricalPlaceAsTourismGoverner , getHistoricalPlaceByNameAsTourismGoverner , updateHistoricalPlaceAsTourismGoverner , deletePlaceAsTourismGoverner , getHistoricalByAuthorAsTourismGoverner, getMuseumByNameAsTourismGoverner, updateMuseumByNameAsTourismGoverner, deleteMuseumByNameAsTourismGoverner
 ,loginGoverner, updateGovernorPassword};