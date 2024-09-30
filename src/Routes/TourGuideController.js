// #Task route solution
const TourGuideModel = require('../Models/TourGuide.js');
const { default: mongoose } = require('mongoose');

// const createTourGuide = async(req,res) => {
//    //Destructure Name, Email, Age from the request body
//    const{Username,Email,Password,MobileNum,YearsOfExperience,PreviousWork} = req.body;
//    try{
//       //add a new user to the database with Name, Email and Age
//       const user = await TourGuideModel.create({Username,Email,Password,MobileNum,YearsOfExperience,PreviousWork});
//       //Send the created use as a JSON response with a 200 OK status 
//       res.status(200).json({msg:"Tour Guide is created!"});
//       //res.status(200).json(user);
//    } catch (error){
//       //If an error occurs, send a 400 Bad Request status with the error message
//       res.status(400).json({ error: error.message});
//    }
// }
const ReadTourGuideProfile = async(req,res) =>{
   try{
    const{username} = req.body;
    const TourGuide = await TourGuideModel.findOne({ Username: username }); // Find the user by name
    if (TourGuide) {
      res.status(200).json({TourGuide});
        // Extract specific attributes
      // console.log('Username:', TourGuide.Username);
      // console.log('Email:', TourGuide.Email);
      // console.log('Mobile Number:', TourGuide.MobileNum);
      // console.log('Years of experience:', TourGuide.YearsOfExperience);
      // if (TourGuide.PreviousWork !== undefined) {
      //   console.log('Previuos work:', TourGuide.PreviousWork);
      // } else {
      //   console.log('None');
      // }
     // return user; // Return the full user object if needed
    }
    else{
        res.status(400).json({error : "Tour guide does not exist"});

    }
  } catch (error) {
    res.status(400).json({ error: error.message});
}
}

const updateTourGuideProfile = async (req, res) => {
  const { _id } = req.body;  // Extract the _id from the request body

  try {
      if (req.body.Username) {
          delete req.body.Username;
          return res.status(404).json({ msg: "Cannot update username" });
        }
    // Find and update the tourist with the fields provided in req.body
    const updatedTourGuide = await TourGuideModel.findByIdAndUpdate(_id, req.body, {
      new: true,            // Return the updated document
      runValidators: true,  // Ensure the updates respect schema validation rules
    });
    res.status(200).json(updatedTourGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const  UpdateTourGuideEmail = async(req,res) =>{
try{
    const{Username , Email} = req.body;
    const TourGuide = await TourGuideModel.findOne({ Username: Username });
    const ID = TourGuide._id;
    if(TourGuide){
        const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {Email}, {new: true});
        res.status(200).json({msg:"Tour Guide email is updated!"});
    }
    else{
        res.status(400).json({error : "Tour guide does not exist"});

    }
}
catch(error){
    res.status(400).json({error : error.message});
}
}
const  UpdateTourGuidePassword = async(req,res) =>{
    try{
        const{Username,Password , ConfirmPassword} = req.body;
        if(Password != ConfirmPassword){
            res.status(400).json("Both passwords are not identical")
        }
        const TourGuide = await TourGuideModel.findOne({ Username: Username });
        const ID = TourGuide._id;
        if(TourGuide){
            const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {Password}, {new: true});
            res.status(200).json({msg:"Tour Guide password is updated!"});
        }
        else{
            res.status(400).json({error : "Tour guide does not exist"});

        }
    }
    catch(error){
        res.status(400).json({error : error.message});
    }
    }
    const  UpdateTourGuideMobileNum = async(req,res) =>{
        try{
            const{Username,MobileNum} = req.body;
            const TourGuide = await TourGuideModel.findOne({ Username: Username });
            const ID = TourGuide._id;
            if(TourGuide){
                const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {MobileNum}, {new: true});
                res.status(200).json({msg:"Tour Guide mobile number is updated!"});
            }
            else{
                res.status(400).json({error : "Tour guide does not exist"});
            }
        }
        catch(error){
            res.status(400).json({error : error.message});
        }
    }
    const  UpdateTourGuideYearsofExperience= async(req,res) =>{
        try{
            const{Username,YearsOfExperience} = req.body;
            const TourGuide = await TourGuideModel.findOne({ Username: Username });
            const ID = TourGuide._id;
            if(TourGuide){
                const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {YearsOfExperience}, {new: true});
                res.status(200).json({msg:"Your years of experience are updated!"});
            }
            else{
                res.status(400).json({error : "Tour guide does not exist"});
            }
        }
        catch(error){
            res.status(400).json({error : error.message});
        }
    }
    const  UpdateTourGuidePreviousWork = async(req,res) =>{
        try{
            const{Username,PreviousWork} = req.body;
            const TourGuide = await TourGuideModel.findOne({ Username: Username });
            const ID = TourGuide._id;
            if(TourGuide){
                const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {PreviousWork}, {new: true});
                res.status(200).json({msg:"your previous work is updated!"});
            }
            else{
                res.status(400).json({error : "Tour guide does not exist"});
            }
        }
        catch(error){
            res.status(400).json({error : error.message});
        }
    }
    // const  UpdateTourGuideUserName = async(req,res) =>{
    //     try{
    //         const{Username,Email} = req.body;
    //         const existingUser = await TourGuideModel.findOne({ Username });
    //          if (existingUser) {
    //         return res.status(400).json({ error: "Username already exists!" });
    //         }
    //         const TourGuide = await TourGuideModel.findOne({ Email: Email });
    //         const ID = TourGuide._id;
    //         if(TourGuide){
    //             const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {Username}, {new: true});
    //             res.status(200).json({msg:"your useername is updated!"});
    //         }
    //         else{
    //             res.status(400).json({error : "Tour guide does not exist"});
    //         }
    //     }
    //     catch(error){
    //         res.status(400).json({error : error.message});
    //     }



    // }




    // Itinerary Part As A TourGuide
    const { createItinerary } = require('./ItineraryController');
    const { readItineraryByTitle } = require('./ItineraryController');
    const { updateItineraryByTitle } = require('./ItineraryController');
    const { deleteItineraryByTitle } = require('./ItineraryController');

// Assuming the tour guide will have other methods too, like managing itineraries

const createItineraryAsTourGuide = async (req, res) => {
  try {
    // You can add any additional logic specific to the tour guide here (e.g., verify the tour guide's role)

    // Call the existing createItinerary method and pass the req, res objects
    await createItinerary(req, res);
    
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the itinerary." });
  }
};
// Import the Itinerary model
const ItineraryModel = require('../Models/Itinerary.js');

// Search itineraries by title

const readItineraryAsTourGuide = async (req, res) => {
    try {
      // You can add any additional logic specific to the tour guide here (e.g., verify the tour guide's role)
      
      // Call the existing readItineraryByTitle method and pass the req, res objects
      await readItineraryByTitle(req, res);
      
    } catch (error) {
      res.status(500).json({ error: "An error occurred while retrieving the itinerary." });
    }
  };
  const updateItineraryAsTourGuide = async (req, res) => {
    try {
      // You can add any additional logic specific to the tour guide here (e.g., verify the tour guide's role)
      
      // Call the existing updateItineraryByTitle method and pass the req, res objects
      await updateItineraryByTitle(req, res);
      
    } catch (error) {
      res.status(500).json({ error: "An error occurred while updating the itinerary." });
    }
  };
  const deleteItineraryAsTourGuide = async (req, res) => {
    try {
      // You can add any additional logic specific to the tour guide here (e.g., verify the tour guide's role)
      
      // Call the existing deleteItineraryByTitle method and pass the req, res objects
      await deleteItineraryByTitle(req, res);
      
    } catch (error) {
      res.status(500).json({ error: "An error occurred while deleting the itinerary." });
    }
  };
  
  

  
  


module.exports = {ReadTourGuideProfile , UpdateTourGuideEmail , UpdateTourGuidePassword, UpdateTourGuideMobileNum , UpdateTourGuideYearsofExperience ,UpdateTourGuidePreviousWork ,createItineraryAsTourGuide,readItineraryAsTourGuide,updateItineraryAsTourGuide,deleteItineraryAsTourGuide, updateTourGuideProfile};
