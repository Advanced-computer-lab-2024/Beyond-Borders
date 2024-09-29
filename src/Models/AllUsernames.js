const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AllUsernamesSchema = new Schema({
  Username: {
    type: String,
    required: true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const AllUsernames = mongoose.model('AllUsernames', AllUsernamesSchema);
module.exports = AllUsernames;