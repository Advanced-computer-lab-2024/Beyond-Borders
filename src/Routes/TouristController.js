// #Task route solution
const TouristModel = require('../Models/Tourist.js');
const { default: mongoose } = require('mongoose');

const createTourist = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Email,Username,Password,MobileNumber,DoB,Nationality,Occupation} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await TouristModel.create({Email,Username,Password,MobileNumber,DoB,Nationality,Occupation});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"Tourist is created!"});
      //res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const getTourist = async (req, res) => {
   //retrieve all users from the database
   try{
      //add a new user to the database with Name, Email and Age
      const user = await TouristModel.findById();
      //Send the created use as a JSON response with a 200 OK status 
      //res.status(200).json({msg:"user is created"});
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
  }

module.exports = {createTourist, getTourist};
