const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },  // Name of the itinerary or tour
  activities: [
    {
      name: String,
      location: String,
      timeline: String,         // E.g., "Day 1: 9:00 AM - 11:00 AM"
      duration: Number,      // Duration of the activity in hours
      required:true
    }
   
  ] ,
  language: { type: String, required: true },  // Language of the tour
  price: { type: Number, required: true },     // Price of the tour
  availableDates: [Date],                      // List of available dates for the tour
  accessibility: { type: Boolean, default: false }, // Is the tour accessible?
  pickupLocation: { type: String },           // Pickup location (optional)
  dropoffLocation: { type: String },          // Drop-off location (optional)
  createdAt: { type: Date, default: Date.now },// Auto timestamp
},{ timestamps: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;