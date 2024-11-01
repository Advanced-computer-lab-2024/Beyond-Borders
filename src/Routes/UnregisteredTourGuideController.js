// #Task route solution
const UnregisteredTourGuideModel = require('../Models/UnregisteredTourGuide.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');

const { default: mongoose } = require('mongoose');

const createUnregisteredTourGuide = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Username, Email, Password, MobileNum, YearsOfExperience, PreviousWork} = req.body;
   try{
      // Check if a user with the same Username already exists
      const existingUser = await AllUsernamesModel.findOne({ Username });
      if (existingUser) {
         return res.status(400).json({ error: "Username already exists!" });
      }
      else{
         await AllUsernamesModel.create({Username});
         //add a new user to the database with Name, Email and Age
         const user = await UnregisteredTourGuideModel.create({Username, Email, Password, MobileNum, YearsOfExperience, PreviousWork, Rating: 0, Comments: []});
         //Send the created use as a JSON response with a 200 OK status 
         res.status(200).json({msg:"Unregistered Tour Guide is created!"});
         //res.status(200).json(user);
      }
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}


module.exports = {createUnregisteredTourGuide};
