const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnregisteredTourGuideSchema = new Schema({
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
  MobileNum: {
    type: String,
    required: true,
  },
  YearsOfExperience: {
    type: Number,
    required: true,
  },
  PreviousWork: {
    type: String,
    required: false,
  },
  IDDocument: {
    type: String, // Store file path as a string
    required: true,
  },
  CertificateDocument: {
    type: String, // Store file path as a string
    required: true,
  },
}, { timestamps: true });

const UnregisteredTourGuide = mongoose.model('UnregisteredTourGuide', UnregisteredTourGuideSchema);
module.exports = UnregisteredTourGuide;