// #Task route solution
const TourGuideModel = require('../Models/TourGuide.js');
const { default: mongoose } = require('mongoose');

const createTourGuide = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Username,Email,Password,MobileNum,YearsOfExperience,PreviousWork} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await TourGuideModel.create({Username,Email,Password,MobileNum,YearsOfExperience,PreviousWork});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"Tour Guide is created!"});
      //res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}
const ReadTourGuideProfile = async(req,res) =>{
   try{
    const{username} = req.body;
    const TourGuide = await TourGuideModel.findOne({ name: username }); // Find the user by name
    if (TourGuide) {
      res.status(200).json({TourGuide});
        // Extract specific attributes
      console.log('Username:', TourGuide.Username);
      console.log('Email:', TourGuide.Email);
      console.log('Mobile Number:', TourGuide.MobileNum);
      console.log('Years of experience:', TourGuide.YearsOfExperience);
      if (TourGuide.PreviousWork !== undefined) {
        console.log('Previuos work:', TourGuide.PreviousWork);
      } else {
        console.log('None');
      }
     // return user; // Return the full user object if needed
    }
    else{
        res.status(400).json({error : "Tour guide does not exist"});

    }
  } catch (error) {
    res.status(400).json({ error: error.message});
}
}
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
    const  UpdateTourGuideUserName = async(req,res) =>{
        try{
            const{Username,Email} = req.body;
            const existingUser = await TourGuideModel.findOne({ Username });
             if (existingUser) {
            return res.status(400).json({ error: "Username already exists!" });
            }
            const TourGuide = await TourGuideModel.findOne({ Email: Email });
            const ID = TourGuide._id;
            if(TourGuide){
                const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {Username}, {new: true});
                res.status(200).json({msg:"your useername is updated!"});
            }
            else{
                res.status(400).json({error : "Tour guide does not exist"});
            }
        }
        catch(error){
            res.status(400).json({error : error.message});
        }
    }

module.exports = {createTourGuide, ReadTourGuideProfile , UpdateTourGuideEmail , UpdateTourGuidePassword, UpdateTourGuideMobileNum , UpdateTourGuideYearsofExperience ,UpdateTourGuidePreviousWork , UpdateTourGuideUserName};
