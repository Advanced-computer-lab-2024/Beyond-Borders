// #Task route solution
const UnregisteredSellerModel = require('../Models/UnregisteredSeller.js');
const { default: mongoose } = require('mongoose');

const createUnregisteredSeller = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Username,Email,Password,Name,Description} = req.body;
   try{
      // Check if a user with the same Username already exists
      const existingUser = await UnregisteredSellerModel.findOne({ Username });
      if (existingUser) {
          return res.status(400).json({ error: "Username already exists!" });
      }
      else{
         //add a new user to the database with Name, Email and Age
         const user = await UnregisteredSellerModel.create({Username,Email,Password,Name,Description});
         //Send the created use as a JSON response with a 200 OK status 
         res.status(200).json({msg:"Unregistered Seller is created!"});
         //res.status(200).json(user);
      }
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

module.exports = {createUnregisteredSeller};
