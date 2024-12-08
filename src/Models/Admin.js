const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  Notifications: [
    {
      NotificationText: {
        type: String,
        required: true,
      },
      Read: {
        type: Boolean,
        default: false, // Default to unread
        required: true,
      },
    }
  ],

},{ timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;