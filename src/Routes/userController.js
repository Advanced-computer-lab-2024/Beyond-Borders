// #Task route solution
const userModel = require('../Models/User.js');
const { default: mongoose } = require('mongoose');

const createUser = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Name,Email,Age} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await userModel.create({Name,Email,Age});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"user is created"});
      //res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const getUsers = async (req, res) => {
   //retrieve all users from the database
   try{
      //add a new user to the database with Name, Email and Age
      const user = await userModel.find();
      //Send the created use as a JSON response with a 200 OK status 
      //res.status(200).json({msg:"user is created"});
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
  }


const updateUser = async (req, res) => {
   //update a user in the database
   try{
      const{Name,Email} = req.body;
      const user = await userModel.findOneAndUpdate({Email: Email}, {Name}, {new: true});
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
   
  }

const deleteUser = async (req, res) => {
   //delete a user from the database
  }


module.exports = {createUser, getUsers, updateUser, deleteUser};
