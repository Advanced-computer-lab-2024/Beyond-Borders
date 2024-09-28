// #Task route solution
const AcceptedSellerModel = require('../Models/AcceptedSeller.js');
const { default: mongoose } = require('mongoose');

const readSellerProfile = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{LoggedInSellerID} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await AcceptedSellerModel.findById(LoggedInSellerID);
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const updateSeller = async (req, res) => {
    const { _id } = req.body;  // Extract the _id from the request body
  
    try {
      // Find and update the tourist with the fields provided in req.body
      const updatedSeller = await AcceptedSellerModel.findByIdAndUpdate(_id, req.body, {
        new: true,            // Return the updated document
        runValidators: true,  // Ensure the updates respect schema validation rules
      });
  
      // If no seller is found with the given ID, send a 404 response
    //   if (!updatedTourist) {
    //     return res.status(404).json({ msg: "Seller not found" });
    //   }
  
      // Send back the updated tourist data
      res.status(200).json(updatedSeller);
    } catch (error) {
      // Send a 400 error with the error message if something goes wrong
      res.status(400).json({ error: error.message });
    }
  };

module.exports = {readSellerProfile, updateSeller};
