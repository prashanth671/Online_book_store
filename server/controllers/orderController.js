const Order = require('../models/Order');
const User  = require('../models/User');

// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    if (!shippingAddress) return res.status(400).json({ message: 'Shipping address is required' });

    const user = await User.findById(req.user._id).populate('cart.book');
    if (!user.cart?.length) return res.status(400).json({ message: 'Your cart is empty' });

    const items = user.cart
      .filter(item => item.book)       // skip deleted books
      .map(item => ({
        book:       item.book._id,
        title:      item.book.title,
        author:     item.book.author,
        price:      item.book.price,
        coverImage: item.book.coverImage,
        quantity:   item.quantity
      }));

    if (!items.length) return res.status(400).json({ message: 'No valid items in cart' });

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({ user: req.user._id, items, totalAmount, shippingAddress });

    // Clear cart after successful order
    await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders  (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/orders/:id/status  (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
