const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TourismGovernerSchema = new Schema({
  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const TourismGoverner = mongoose.model('TourismGoverner', TourismGovernerSchema);
module.exports = TourismGoverner;