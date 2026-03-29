const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    book:     { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    title:    String,
    author:   String,
    price:    Number,
    coverImage: String,
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending','confirmed','shipped','delivered','cancelled'],
    default: 'confirmed'
  },
  shippingAddress: {
    name:    String,
    address: String,
    city:    String,
    pincode: String,
    phone:   String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
