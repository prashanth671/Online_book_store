const User = require('../models/User');
const Book = require('../models/Book');

// Helper: return populated cart
const getPopulatedCart = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'cart.book',
    select: 'title author price coverImage stock category'
  });
  // Filter out items where book may have been deleted
  return user.cart.filter(item => item.book != null);
};

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/cart  { bookId, quantity }
const addToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    if (!bookId) return res.status(400).json({ message: 'bookId is required' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.stock === 0) return res.status(400).json({ message: 'Book is out of stock' });

    const user = await User.findById(req.user._id);
    const existingIdx = user.cart.findIndex(item => item.book.toString() === bookId);

    if (existingIdx >= 0) {
      user.cart[existingIdx].quantity = Math.min(
        user.cart[existingIdx].quantity + quantity,
        book.stock
      );
    } else {
      user.cart.push({ book: bookId, quantity: Math.min(quantity, book.stock) });
    }

    await user.save();
    const cart = await getPopulatedCart(req.user._id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/cart/:bookId  { quantity }
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { bookId } = req.params;

    const user = await User.findById(req.user._id);
    const idx = user.cart.findIndex(item => item.book.toString() === bookId);

    if (idx === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      user.cart.splice(idx, 1);
    } else {
      user.cart[idx].quantity = quantity;
    }

    await user.save();
    const cart = await getPopulatedCart(req.user._id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/clear   ← must be registered BEFORE /:bookId
const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/:bookId
const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item.book.toString() !== bookId);
    await user.save();
    const cart = await getPopulatedCart(req.user._id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
