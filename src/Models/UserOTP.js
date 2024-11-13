const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserOTPSchema = new Schema({
  Username: {
    type: String,
    required: true
  },
  OTP: {
    type: Number,
    required: true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const UserOTP = mongoose.model('UserOTP', UserOTPSchema);
module.exports = UserOTP;