// #Task route solution
const UnregisteredTourGuideModel = require('../Models/UnregisteredTourGuide.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');

const { default: mongoose } = require('mongoose');

const createUnregisteredTourGuide = async (req, res) => {
   const { Username, Email, Password, MobileNum, YearsOfExperience, PreviousWork } = req.body;
 
   try {
     // Check if a user with the same Username already exists
     const existingUser = await AllUsernamesModel.findOne({ Username });
     if (existingUser) {
       return res.status(400).json({ error: 'Username already exists!' });
     }
 
     // Add the Username to AllUsernames collection
     await AllUsernamesModel.create({ Username });
 
     // Create a new tour guide with uploaded file paths
     const user = await UnregisteredTourGuideModel.create({
       Username,
       Email,
       Password,
       MobileNum,
       YearsOfExperience,
       PreviousWork,
       IDDocument: req.files.IDDocument[0].path, // Path of the uploaded ID document
       CertificateDocument: req.files.CertificateDocument[0].path, // Path of the uploaded certificate document
     });
 
     res.status(200).json({ msg: 'Unregistered Tour Guide is created!' });
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };


module.exports = {createUnregisteredTourGuide};
