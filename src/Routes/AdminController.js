// #Task route solution
const NewAdminModel = require('../Models/Admin.js');
const NewTourismGoverner = require('../Models/TourismGoverner.js');
const NewProduct = require('../Models/Product.js');
const NewUnregisteredSellerModel = require('../Models/UnregisteredSeller.js');
const NewAcceptedSellerModel = require('../Models/AcceptedSeller.js');
const NewActivityCategoryModel = require('../Models/ActivityCategory.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const AllTouristModel = require('../Models/Tourist.js');
const TagsModel = require('../Models/Tags.js');




const { default: mongoose } = require('mongoose');

const createNewAdmin = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Username,Password} = req.body;
   try{
      // Check if a user with the same Username already exists
      const existingUser = await AllUsernamesModel.findOne({Username});
      if (existingUser) {
          return res.status(400).json({ error: "Username already exists!" });
      }
      else{
         await AllUsernamesModel.create({Username});
         //add a new user to the database with Name, Email and Age
         const user = await NewAdminModel.create({Username,Password});
         //Send the created use as a JSON response with a 200 OK status 
         res.status(200).json({msg:"New admin is created!"});
         //res.status(200).json(user);
      }
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
        const existingUser = await AllUsernamesModel.findOne({ Username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists!" });
        }
        else{
         await AllUsernamesModel.create({Username});
         //add a new user to the database with Name, Email and Age
         const user = await NewTourismGoverner.create({Username,Password});
         //Send the created use as a JSON response with a 200 OK status 
         res.status(200).json({msg:"New Tourism Governer is created!"});
         //res.status(200).json(user);
        }
    } catch (error){
       //If an error occurs, send a 400 Bad Request status with the error message
       res.status(400).json({ error: error.message});
    }
 }

 const createNewProduct = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Name,Description,Price,Quantity, Seller,Picture} = req.body;
   try{
      const existingSeller = await NewAcceptedSellerModel.findOne({ Username: Seller });
       if (existingSeller) {
         //add a new user to the database with Name, Email and Age
         const user = await NewProduct.create({Name,Description,Price,Quantity, Seller,Picture, Reviews: "",Ratings: 0});
         //Send the created use as a JSON response with a 200 OK status 
         res.status(200).json({msg:"New Product is created!"});
         //res.status(200).json(user);
       }
      else{
         res.status(400).json({msg:"This seller does not exist!"});
      }
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const editProduct = async (req, res) => {
   const {ProductID} = req.body;  // Extract the _id from the request body
   //update a user in the database
   try{
      if (req.body.Seller) {
         delete req.body.Seller;
         return res.status(404).json({ msg: "Cannot update seller" });
      }
       const updatedProduct = await NewProduct.findByIdAndUpdate(ProductID, req.body, {
         new: true,            // Return the updated document
         runValidators: true,  // Ensure the updates respect schema validation rules
       });
       res.status(200).json(updatedProduct);
     } catch (error) {
       // Send a 400 error with the error message if something goes wrong
       res.status(400).json({ error: error.message });
     }
   };

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
            // Extract Username
            const {Username, Email, Password} = existingUser;
            await AllUsernamesModel.findOneAndDelete({Username});
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

const createNewTag = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{NameOfTags} = req.body;
   try{
      // Check if a user with the same Username already exists
      const existingTag = await TagsModel.findOne({NameOfTags});
      if (existingTag) {
          return res.status(400).json({ error: "Tag already exists!" });
      }
      //add a new category to the database with Name, Email and Age
      const newTag = await TagsModel.create({NameOfTags});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"New Tag is created!"});
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

const readAllTags = async (req, res) => {
   try {
       const tags = await TagsModel.find(); //Fetch all categories
       res.status(200).json(tags);
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

const updateTag = async (req, res) => {
   const {oldTagName,newTagName} = req.body;
   try {
       // Find the category by the old name and update it
       const updatedTag = await TagsModel.findOneAndUpdate(
           {NameOfTags: oldTagName}, //Find the category with the old name 
           {NameOfTags: newTagName}, //Update the category name
           {new: true} // Return the updated document
       );
       if (!updatedTag) {
           return res.status(404).json({ error: "Tag not found." }); // Handle case where category does not exist
       }
       res.status(200).json(updatedTag);
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

const deleteTag = async (req, res) => {
   const { TagName } = req.body;

   try {
       const tag = await TagsModel.findOne({NameOfTags: TagName});
       if (tag) {
         await TagsModel.findOneAndDelete({NameOfTags: TagName});
         res.status(200).json({ msg: "Tag has been deleted!" });
      }
       else {
         return res.status(404).json({ error: "Tag not found." }); // Handle case where category does not exist
       }
     //res.status(200).json(updatedCategory);
 } catch (error) {
     res.status(400).json({ error: error.message });
 }
};

const deleteAccount = async (req, res) => {
   const {Username} = req.body;

   try {
       // Find the unregistered seller by ID
       const existingUser = await AllUsernamesModel.findOne({Username});
       
       if (existingUser) {
           // Delete username from AllUsernames Model
           await AllUsernamesModel.findOneAndDelete({Username});
           const existingTourist = await AllTouristModel.findOne({Username});
           //const existingTourGuide = await AllTouristModel.findOne({Username});
           const existingAdmin = await NewAdminModel.findOne({Username});
           const existingSeller = await NewAcceptedSellerModel.findOne({Username});
           //const existingAdvertiser = await AllTouristModel.findOne({Username});
           const existingTourismGovernor = await NewTourismGoverner.findOne({Username});
           if (existingTourist) {
               await AllTouristModel.findOneAndDelete({Username});
           }
           else if(existingAdmin){
               await NewAdminModel.findOneAndDelete({Username});
           }
           else if(existingSeller){
               await NewAcceptedSellerModel.findOneAndDelete({Username});
           }
           else if(existingTourismGovernor){
               await NewTourismGoverner.findOneAndDelete({Username});
           }
           //Redudant else
           else{
               res.status(404).json({ error: "Account with this username doest not exist." });
           }
         //   else if(){
            
         //   }
         //   else if(){
            
         //   }
           // Respond with success message
           res.status(200).json({ msg: "Account has been deleted!" });
       } else {
           res.status(404).json({ error: "Account with this username doest not exist." });
       }
   } catch (error) {
       // Handle any errors that occur during the process
       res.status(400).json({ error: error.message });
   }
};

const searchProductAdmin = async (req, res) => {
   const {ProductName} = req.body;
   try {
       const fetchedProduct = await NewProduct.findOne({Name: ProductName}); //Fetch all categories
       res.status(200).json(fetchedProduct);
   } catch (error) {
      res.status(200).json({ msg: "There is no product with this name!" });
   }
};

module.exports = {createNewAdmin, createNewTourismGoverner, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories, updateCategory, deleteActivityCategory, deleteAccount, searchProductAdmin, createNewTag, readAllTags, updateTag, deleteTag};
