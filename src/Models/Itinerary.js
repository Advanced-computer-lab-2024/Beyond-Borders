const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Language: { type: String, required: true },
  Price: { type: Number, required: true },
  availableDates: [Date],
  pickupLocation: { type: String },
  dropoffLocation: { type: String }, 
  accessibility: { type: Boolean, default: false },
  isBooked: {type:Boolean},

  activities: [
    {
      name: String,
      location: String,
      timeline: String,         // E.g., "Day 1: 9:00 AM - 11:00 AM"
      duration: Number,      // Duration of the activity in hours
      
    }
   
  ] 
},{ timestamps: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;