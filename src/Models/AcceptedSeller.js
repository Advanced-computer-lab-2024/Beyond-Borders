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
  },
  LoginCount: {
    type: Number,
    default: 0,
    required: false 
  },
  Logo: {
    type: String, 
    required: false,
  },
  Notifications: [
    {
      NotificationText: {
        type: String,
        required: true,
      },
      Read: {
        type: Boolean,
        default: false, // Default to unread
        required: true,
      },
    }
  ],
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const AcceptedSeller = mongoose.model('AcceptedSeller', AcceptedSellerSchema);
module.exports = AcceptedSeller;