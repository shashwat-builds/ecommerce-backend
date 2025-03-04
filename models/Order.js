const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  paymentMethod: { type: String, enum: ['Card', 'UPI', 'COD', 'Razorpay'], required: true }, // Added Razorpay
  shippingDetails: {
    address: { type: String, required: true },
    contact: { type: String, required: true },
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
