const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArchivedProductSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Seller: {
    type: String,
    required: true
  },
  Picture: {
    type: String,
    required: true
  },
  Reviews: [
    {
      touristUsername: {
        type: String,
        required: false 
      },
      Review: {
        type: String,  
        required: false 
      } 
    }
  ],
  Ratings: {
    type: Number,
    default: 0,
    required: false
  },
  RatingCount: {
    type: Number,
    default: 0,
    required: false 
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const ArchivedProducts = mongoose.model('ArchivedProduct', ArchivedProductSchema);
module.exports = ArchivedProducts;