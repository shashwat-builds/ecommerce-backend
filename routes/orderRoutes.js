const mongoose = require('mongoose');
const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure middleware is applied
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// Place an order 
router.post('/', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { shippingDetails, paymentMethod } = req.body;
  
      // Validate required fields
      if (!shippingDetails || !shippingDetails.contact || !shippingDetails.address) {
        return res.status(400).json({ message: 'Shipping details are required' });
      }
      if (!paymentMethod) {
        return res.status(400).json({ message: 'Payment method is required' });
      }
  
      // Fetch user's cart
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
  
      // Calculate total amount
      const totalAmount = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  
      // Create order
      const order = new Order({
        userId,
        items: cart.items.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        totalAmount,
        paymentStatus: 'Pending',
        shippingDetails,
        paymentMethod
      });
  
      await order.save();
  
      // Clear cart after placing order
      await Cart.findOneAndDelete({ userId });
  
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});
  

// Get user orders 
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId }).populate('items.productId', 'name price');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log('Received Order ID:', orderId); // Debugging

    // ✅ Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log('Invalid MongoDB ObjectId');
      return res.status(400).json({ message: 'Invalid Order ID' });
    }

    const order = await Order.findById(orderId).populate('items.productId', 'name price');

    if (!order) {
      console.log('Order not found in database'); // Debugging
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id/status', authMiddleware, adminMiddleware , async (req, res) => {
  try {
    if (!req.user.isAdmin) {  // ✅ Check if the user is an admin
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
