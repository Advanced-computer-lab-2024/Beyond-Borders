// #Task route solution
const NewAdminModel = require('../Models/Admin.js');
const NewTourismGoverner = require('../Models/TourismGoverner.js');
const NewProduct = require('../Models/Product.js');
const NewUnregisteredSellerModel = require('../Models/UnregisteredSeller.js');
const NewAcceptedSellerModel = require('../Models/AcceptedSeller.js');
const NewActivityCategoryModel = require('../Models/ActivityCategory.js');


const { default: mongoose } = require('mongoose');

const createNewAdmin = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Username,Password} = req.body;
   try{
      // Check if a user with the same Username already exists
      const existingUser = await NewAdminModel.findOne({ Username });
      if (existingUser) {
          return res.status(400).json({ error: "Username already exists!" });
      }
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
        // Check if a user with the same Username already exists
        const existingUser = await NewTourismGoverner.findOne({ Username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists!" });
        }
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

const acceptSeller = async (req, res) => {
   const { UnregisteredSellerID } = req.body;

   try {
       // Find the unregistered seller by ID
       const existingUser = await NewUnregisteredSellerModel.findById(UnregisteredSellerID);
       
       if (existingUser) {
           // Create a new accepted seller with the existing user's details
           const { Username, Email, Password, Name, Description} = existingUser; // Destructure the relevant fields
           const createdSeller = await NewAcceptedSellerModel.create({Username,Email,Password,Name,Description});
           // Delete the unregistered seller
           await NewUnregisteredSellerModel.findByIdAndDelete(UnregisteredSellerID);
           // Respond with success message
           res.status(200).json({ msg: "Seller has been accepted!" });
       } else {
           res.status(404).json({ error: "Unregistered seller not found." });
       }
   } catch (error) {
       // Handle any errors that occur during the process
       res.status(400).json({ error: error.message });
   }
};

const rejectSeller = async (req, res) => {
   const { UnregisteredSellerID } = req.body;

   try {
       // Find the unregistered seller by ID
       const existingUser = await NewUnregisteredSellerModel.findById(UnregisteredSellerID);
       
       if (existingUser) {
           // Delete the unregistered seller
           await NewUnregisteredSellerModel.findByIdAndDelete(UnregisteredSellerID);
           // Respond with success message
           res.status(200).json({ msg: "Seller has been rejected!" });
       } else {
           res.status(404).json({ error: "Unregistered seller not found." });
       }
   } catch (error) {
       // Handle any errors that occur during the process
       res.status(400).json({ error: error.message });
   }
};

const createNewCategory = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{NameOfCategory} = req.body;
   try{
      // Check if a user with the same Username already exists
      const existingCategory = await NewActivityCategoryModel.findOne({NameOfCategory});
      if (existingCategory) {
          return res.status(400).json({ error: "Category already exists!" });
      }
      //add a new category to the database with Name, Email and Age
      const category = await NewActivityCategoryModel.create({NameOfCategory});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"New Category is created!"});
      //res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const readAllActivityCategories = async (req, res) => {
   try {
       const categories = await NewActivityCategoryModel.find(); //Fetch all categories
       res.status(200).json(categories);
   } catch (error) {
       res.status(400).json({ error: error.message }); 
   }
};

const updateCategory = async (req, res) => {
   const {oldCategoryName,newCategoryName} = req.body;
   try {
       // Find the category by the old name and update it
       const updatedCategory = await NewActivityCategoryModel.findOneAndUpdate(
           {NameOfCategory: oldCategoryName}, //Find the category with the old name 
           {NameOfCategory: newCategoryName}, //Update the category name
           {new: true} // Return the updated document
       );
       if (!updatedCategory) {
           return res.status(404).json({ error: "Category not found." }); // Handle case where category does not exist
       }
       res.status(200).json(updatedCategory);
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};

const deleteActivityCategory = async (req, res) => {
   const { CategoryName } = req.body;

   try {
       const category = await NewActivityCategoryModel.findOne({NameOfCategory: CategoryName});
       if (category) {
         await NewActivityCategoryModel.findOneAndDelete({NameOfCategory: CategoryName});
         res.status(200).json({ msg: "Category has been deleted!" });
      }
       else {
         return res.status(404).json({ error: "Category not found." }); // Handle case where category does not exist
       }
     //res.status(200).json(updatedCategory);
 } catch (error) {
     res.status(400).json({ error: error.message });
 }
};

module.exports = {createNewAdmin, createNewTourismGoverner, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories, updateCategory, deleteActivityCategory};
