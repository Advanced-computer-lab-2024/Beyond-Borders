// #Task route solution
const NewAdminModel = require('../Models/Admin.js');
const NewTourismGoverner = require('../Models/TourismGoverner.js');
const NewProduct = require('../Models/Product.js');

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

 const createNewProduct = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Details,Price,Quantity} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await NewProduct.create({Details,Price,Quantity});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"New Product is created!"});
      //res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const editProduct = async (req, res) => {
   //update a user in the database
   try{
      const{_id,Details,Price} = req.body;
      const user = await NewProduct.findOneAndUpdate({_id: _id}, {Details,Price}, {new: true});
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
   
  }

module.exports = {createNewAdmin, createNewTourismGoverner, createNewProduct, editProduct};
