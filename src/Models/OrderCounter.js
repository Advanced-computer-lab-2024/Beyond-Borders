const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderCounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 }, // Start with 1
});

const OrderCounter = mongoose.model('OrderCounter', OrderCounterSchema);
module.exports = OrderCounter;
