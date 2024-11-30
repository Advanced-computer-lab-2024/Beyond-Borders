const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Activities: { type: String, required: true },
  Locations: { type: String, required: true },
  Timeline: { type: String, required: true },
  Language: { type: String, required: true },
  Price: { type: Number, required: true },
  Date: { type: Date, required: true },
  accessibility: { type: Boolean, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true }, 
  isBooked: {type:Boolean, required: true },
  Tags: [{ type: String }],
  AuthorUsername : {type : String , required :true},
  Comments: [
    {
      touristUsername: {
        type: String,
        required: false 
      },
      Comment: {
        type: String,  
        required: false 
      } 
    }
  ],
  Ratings: {
    type: Number,
    default: 0,
    required: false
  },
  RatingCount: {
    type: Number,
    default: 0,
    required: false 
  },
  BookingOpen: {
    type: Boolean,
    default:true,
    required: false,
  },
  flagged: { type: Boolean},
  SendNotificationTo: [
    {
      username: {
        type: String,
        required: false
      }
    }
  ]
},{ timestamps: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;