// #Task route solution
const UnregisteredTourGuideModel = require('../Models/UnregisteredTourGuide.js');
const { default: mongoose } = require('mongoose');

const createUnregisteredTourGuide = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Username,Email,Password} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await UnregisteredTourGuideModel.create({Username,Email,Password});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"Unregistered Tour Guide is created!"});
      //res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

module.exports = {createUnregisteredTourGuide};
