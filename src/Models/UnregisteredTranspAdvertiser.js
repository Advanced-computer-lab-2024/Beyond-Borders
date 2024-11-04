const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnregTransportationAdvertiserSchema = new Schema({
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
  }
}, { timestamps: true });

const UnregTransportationAdvertiser = mongoose.model('UnregTransportationAdvertiser', UnregTransportationAdvertiserSchema);
module.exports = UnregTransportationAdvertiser;
