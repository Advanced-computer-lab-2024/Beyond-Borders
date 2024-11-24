const UnregisteredSellerModel = require('../Models/UnregisteredSeller.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const { default: mongoose } = require('mongoose');

const createUnregisteredSeller = async (req, res) => {
   const { Username, Email, Password, Name, Description } = req.body;

   try {
     // Check if the username exists
     const existingUser = await AllUsernamesModel.findOne({ Username });
     if (existingUser) {
       return res.status(400).json({ error: "Username already exists!" });
     }

     // Check if file is uploaded
     if (!req.file) {
       return res.status(400).json({ error: "ID and Taxation Registry Document is required!" });
     }

     const documentPath = req.file.path; // Use the uploaded file's path

     await AllUsernamesModel.create({ Username });
     const user = await UnregisteredSellerModel.create({
       Username,
       Email,
       Password,
       Name,
       Description,
       Documents: documentPath, // Save the uploaded file path
     });

     res.status(200).json({ msg: "Unregistered Seller is created!" });
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};

module.exports = { createUnregisteredSeller };
