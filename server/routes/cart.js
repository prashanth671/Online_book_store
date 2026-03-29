const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

router.get('/',    getCart);
router.post('/',   addToCart);
router.put('/:bookId', updateCartItem);

// IMPORTANT: /clear must be registered BEFORE /:bookId
// so Express doesn't treat "clear" as a bookId parameter
router.delete('/clear',     clearCart);
router.delete('/:bookId',   removeFromCart);

module.exports = router;
