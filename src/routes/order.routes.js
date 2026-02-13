const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/create-order', protect, createOrder);

module.exports = router;
