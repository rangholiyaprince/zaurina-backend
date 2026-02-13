const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');


// ===== AUTHENTICATION ROUTES =====
router.use('/auth', authRoutes);

// ===== USER ROUTES =====
router.use('/user', userRoutes);

// ===== ADMIN ROUTES =====
const adminRoutes = require('./admin.routes');
router.use('/admin', adminRoutes);

// ===== PAYMENT ROUTES =====
const paymentRoutes = require('./payment.routes');
router.use('/payment', paymentRoutes);

// ===== FAVORITE PRODUCT ROUTES =====
// Routes moved to user.routes.js







// ===== HEALTH CHECK ROUTE =====
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
