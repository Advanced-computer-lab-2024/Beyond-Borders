// #Task route solution
const NewAdminModel = require('../Models/Admin.js');
const NewTourismGoverner = require('../Models/TourismGoverner.js');
const { default: mongoose } = require('mongoose');

const createNewAdmin = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Username,Password} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await NewAdminModel.create({Username,Password});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"New admin is created!"});
      //res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const createNewTourismGoverner = async(req,res) => {
    //Destructure Name, Email, Age from the request body
    const{Username,Password} = req.body;
    try{
       //add a new user to the database with Name, Email and Age
       const user = await NewTourismGoverner.create({Username,Password});
       //Send the created use as a JSON response with a 200 OK status 
       res.status(200).json({msg:"New Tourism Governer is created!"});
       //res.status(200).json(user);
    } catch (error){
       //If an error occurs, send a 400 Bad Request status with the error message
       res.status(400).json({ error: error.message});
    }
 }

module.exports = {createNewAdmin, createNewTourismGoverner};
