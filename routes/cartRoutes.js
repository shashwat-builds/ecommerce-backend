const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get user cart 
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Fixed
    const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price images stock');

    if (!cart) return res.json({ items: [] });

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product to cart 
router.post('/', authMiddleware, async (req, res) => {
  console.log('User in Request:', req.user); // Debugging
  try {
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update cart item quantity
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Fixed
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.equals(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    // Stock Check
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove one quantity of an item from cart (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const cart = await Cart.findOne({ userId });
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const itemIndex = cart.items.findIndex(item => item.productId.equals(req.params.id));
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;  // Reduce quantity by 1
      } else {
        cart.items.splice(itemIndex, 1);  // Remove item if quantity reaches 0
      }
  
      await cart.save();
      res.json({ message: 'One unit removed from cart', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});
  

module.exports = router;
