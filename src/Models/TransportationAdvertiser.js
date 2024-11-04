const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportationAdvertiserSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  CompanyName: {
    type: String,
    required: true,
  },
  Website: {
    type: String,
    required: true,
  },
  Hotline: {
    type: Number,
    required: true,
  },
  CompanyProfile: {
    type: String,
    required: true,
  },
  transportationOptions: [
    {
      serviceName: { type: String, required: true },
      serviceType: { type: String, required: true }
    }
  ],
  LoginCount: {
    type: Number,
    default: 0,
    required: false 
  }
}, { timestamps: true });

const TransportationAdvertiser = mongoose.model('TransportationAdvertiser', TransportationAdvertiserSchema);
module.exports = TransportationAdvertiser;
