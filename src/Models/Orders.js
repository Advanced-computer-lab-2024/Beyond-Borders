const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  orderNumber: {
        type: Number,
        default: Date.now,
      },
  touristUsername: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  productsPurchased: [
    {
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Cash On Delivery'],
    default: 'Pending',
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Confirmed',
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: false,
  },
  TotalPrice: {
    type: Number,
    required: false,
  },
  
}, { timestamps: true }); 

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
