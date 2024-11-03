const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeleteRequestsSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const DeleteRequests = mongoose.model('DeleteRequests', DeleteRequestsSchema);
module.exports = DeleteRequests;