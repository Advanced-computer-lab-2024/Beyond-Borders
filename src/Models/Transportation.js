const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    day: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true }
  });

const TransportationSchema = new Schema({
    advertiserName: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true, // E.g., "Car Rental", "Bus", "Shuttle", etc.
    },
    price: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true, // Number of people the service can accommodate
    },
    available: {
      type: Boolean,
      default: true,
    },
    routeDetails: {
      startLocation: {
        type: String,
        required: true,
      },
      endLocation: {
        type: String,
        required: true,
      },
    },
    schedule: {
    type: [ScheduleSchema], // Array of schedule objects
    required: true, 
  },
  }, { timestamps: true });
  
  const Transportation = mongoose.model('Transportation', TransportationSchema);
  module.exports = Transportation;
  