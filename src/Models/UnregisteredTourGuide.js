const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnregisteredTourGuideSchema = new Schema({
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
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const UnregisteredTourGuide = mongoose.model('UnregisteredTourGuide', UnregisteredTourGuideSchema);
module.exports = UnregisteredTourGuide;