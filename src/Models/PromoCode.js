const mongoose = require('mongoose');
const { Schema } = mongoose;

const promoCodeSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discountPercentage: {
    type: Number, // percentage discount (e.g. 20 for 20%)
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;
