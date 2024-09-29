const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  AdvertiserName: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  }, 
  Time: {
    type: String,
    required: true,
  },
  SpecialDiscount: {
    type: String,
    required: false,
  },
  BookingOpen: {
    type: Boolean,
    required: true,
  },
  Price: {
    type: Number,
    required: true
  },
  Location: {
    type: {
      type: String, // 'Point' for GeoJSON
      enum: ['Point'], // Specify that this is a Point type
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    address: {
      type: String, // Optional field for the location address
      required: false,
    }
  },
  Category: {
    type: String, // Store the name of the category
    required: true,
  },
  Tags: [{
    type: String, // Store the names of the tags
  }]
},
{ timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;