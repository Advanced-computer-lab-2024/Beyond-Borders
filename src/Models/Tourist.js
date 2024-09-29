const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TouristSchema = new Schema({
  Email: {
    type: String,
    required: true,
  },
  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  MobileNumber: {
    type: String,
    required: true,
  },
  DoB: {
    type: Date,
    required: true,
  }, 
  Nationality: {
    type: String,
    required: true,
  },
  Occupation: {
    type: String,
    required: true,
  },
  Wallet: {
    type: Number,
    required: false
    
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const Tourist = mongoose.model('Tourist', TouristSchema);
module.exports = Tourist;