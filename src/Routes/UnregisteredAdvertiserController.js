// #Task route solution
const userModel = require('../Models/UnregisteredAdvertiser.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const { default: mongoose } = require('mongoose');

const createUnregisteredAdvertiser = async (req, res) => {
   try {
     const { Username, Email, Password, Website, Hotline, CompanyProfile } = req.body;
 
     // Access the uploaded file
     const documentPath = req.file ? req.file.path : null;
 
     // Check if a user with the same Username already exists
     const existingUser = await AllUsernamesModel.findOne({ Username });
     if (existingUser) {
       return res.status(400).json({ error: "Username already exists!" });
     }
 
     await AllUsernamesModel.create({ Username });
 
     const user = await userModel.create({
       Username,
       Email,
       Password,
       Website,
       Hotline,
       CompanyProfile,
       AdvertiserDocument: documentPath, // Save the uploaded file path
     });
 
     res.status(200).json({ msg: "Unregistered Advertiser is created!", user });
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };
 

module.exports = {createUnregisteredAdvertiser};
