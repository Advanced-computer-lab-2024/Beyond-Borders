const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema({
  Title: {
    type: String,
    required: true
  },
  Body: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  Reply: {
    type: String,
    required: false,
  },
  TouristUsername: {
    type: String,
    required: true
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const Complaint = mongoose.model('Complaint', ComplaintSchema);
module.exports = Complaint;