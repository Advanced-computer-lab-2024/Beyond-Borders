const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
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
  Reviews: {
    type: String,
    required: false
  },
  Ratings: {
    type: Number,
    required: false
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;