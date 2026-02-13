const express = require('express');
const router = express.Router();
const { createPaymentIntent, createCheckoutSession } = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/create-checkout-session', protect, createCheckoutSession);

module.exports = router;
