const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Age: {
    type: Number,
    required: true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const User = mongoose.model('User', userSchema);
module.exports = User;