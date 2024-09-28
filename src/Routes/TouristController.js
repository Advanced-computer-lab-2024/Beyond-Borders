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
   const{_id} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await TouristModel.findById({_id});
      //Send the created use as a JSON response with a 200 OK status 
      //res.status(200).json({msg:"user is created"});
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
  }

  /*const updateTourist = async (req, res) => {
   //update a user in the database
   try{
      const{_id} = req.body;
      const updatedTourist = await TouristModel.findByIdAndUpdate(_id, req.body, {new: true});
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
   
  }*/
   const updateTourist = async (req, res) => {
      const { _id } = req.body;  // Extract the _id from the request body
    
      try {
        // Remove 'Username' from the request body to prevent its update
        if (req.body.Username) {
          delete req.body.Username;
          return res.status(404).json({ msg: "Cannot update username" });
        }
    
        // Find and update the tourist with the fields provided in req.body (excluding Username)
        const updatedTourist = await TouristModel.findByIdAndUpdate(_id, req.body, {
          new: true,            // Return the updated document
          runValidators: true,  // Ensure the updates respect schema validation rules
        });
    
        // If no tourist is found with the given ID, send a 404 response
        if (!updatedTourist) {
          return res.status(404).json({ msg: "Tourist not found" });
        }
    
        // Send back the updated tourist data
        res.status(200).json(updatedTourist);
      } catch (error) {
        // Send a 400 error with the error message if something goes wrong
        res.status(400).json({ error: error.message });
      }
    };
    
    


module.exports = {createTourist, getTourist, updateTourist};
