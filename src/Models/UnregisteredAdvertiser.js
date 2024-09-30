const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnregisteredAdvertiserSchema = new Schema({
  
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
  },
  Website :{
    type: String ,
    required : true, 
  },
  Hotline :{
    type : Number,
    required : true ,
  },
  CompanyProfile : {
  type : String ,
  required : true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const UnregisteredAdvertiser = mongoose.model('UnregisteredAdvertiser', UnregisteredAdvertiserSchema);
module.exports = UnregisteredAdvertiser;