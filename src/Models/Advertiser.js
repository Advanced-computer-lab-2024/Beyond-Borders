const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvertiserSchema = new Schema({
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
  Website :{
    type: String ,
    required : true, 
  },
  Hotline :{
    type : Number,
    required : true ,
  },
  CompanyProfile : {
  type : String ,
  required : true,
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

const Advertiser = mongoose.model('Advertiser', AdvertiserSchema);
module.exports = Advertiser;