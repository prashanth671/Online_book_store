const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.post('/',               placeOrder);
router.get('/my',              getMyOrders);
router.get('/',                adminOnly, getAllOrders);
router.put('/:id/status',      adminOnly, updateOrderStatus);

module.exports = router;
