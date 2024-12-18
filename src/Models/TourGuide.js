const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TourGuideSchema = new Schema({
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
  MobileNum :{
    type: String ,
    required : true, 
  },
  YearsOfExperience :{
    type : Number,
    required : true ,
  },
  PreviousWork : {
  type : String ,
  required : false,
  },
  Rating : {
    type : Number ,
    required : false,
    },
    RatingCount: {
      type: Number,
      default: 0,
      required: false 
    },
    Comments: [
      {
        TouristUsername: {
          type: String,
          required: false 
        },
        Comment: {
          type: String, 
          required: false 
        } 
      }
    ],
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

const TourGuide = mongoose.model('TourGuide', TourGuideSchema);
module.exports = TourGuide;