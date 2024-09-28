const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AcceptedSellerSchema = new Schema({
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
    required: false,
  },
  Description: {
    type: String,
    required: false,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const AcceptedSeller = mongoose.model('AcceptedSeller', AcceptedSellerSchema);
module.exports = AcceptedSeller;