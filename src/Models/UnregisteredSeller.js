const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnregisteredSellerSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const UnregisteredSeller = mongoose.model('UnregisteredSeller', UnregisteredSellerSchema);
module.exports = UnregisteredSeller;