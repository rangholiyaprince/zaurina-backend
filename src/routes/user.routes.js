const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const addressController = require('../controllers/address.controller');
const cartController = require('../controllers/cart.controller');
const orderController = require('../controllers/order.controller');
const favProductController = require('../controllers/favProduct.controller');



// ===== DEBUG LOG =====
console.log('[DEBUG] User Routes Loaded');

/**
 * User Management Routes
 * Handles user profile and account management
 */

// ===== USER PROFILE ROUTES =====


// ===== DEBUG ROUTE =====
router.get('/test-ping', (req, res) => {
  res.send('User routes are working');
});

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile information
 * @access  Private
 */
router.get('/update-profile', protect, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile information
 * @access  Private
 */
router.put('/update-profile', protect, async (req, res, next) => {
  try {
    const { first_name, last_name, phone_number, phone_code } = req.body;

    const user = req.user;

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (phone_number) user.phone_number = phone_number;
    if (phone_code) user.phone_code = phone_code;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/user/block-user
 * @desc    Block a user
 * @access  Private
 */
router.put('/block-user', protect, userController.blockUser);


/**
 * @route   GET /api/user/list
 * @desc    Get all users list
 * @access  Private
 */
router.get('/list', (req, res, next) => {
  console.log('[DEBUG] Hit /list route');
  next();
}, protect, userController.getUsers);


/**
 * @route   GET /api/user/addresses
 * @desc    Get all addresses for the authenticated user
 * @access  Private
 */
router.get('/addresses', protect, addressController.getUserAddresses);

/**
 * @route   POST /api/user/addresses
 * @desc    Create a new address
 * @access  Private
 */
router.post('/addresses', protect, addressController.saveAddress);

/**
 * @route   PUT /api/user/addresses/:id
 * @desc    Update an existing address
 * @access  Private
 */
router.put('/addresses/:id', protect, addressController.updateAddress);

/**
 * @route   DELETE /api/user/addresses/:id
 * @desc    Delete an address
 * @access  Private
 */
router.delete('/addresses/:id', protect, addressController.deleteAddress);

/**
 * Cart Routes
 * Integrated into user routes
 */

/**
 * @route   POST /api/user/cart/save
 * @desc    Add or update item in cart
 * @access  Private
 */
router.post('/cart/save', protect, cartController.saveCart);

/**
 * @route   GET /api/user/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/cart', protect, cartController.getCart);

/**
 * @route   DELETE /api/user/cart/remove
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/cart/remove', protect, cartController.removeCartItem);

/**
 * @route   PUT /api/user/cart/update-qty
 * @desc    Update item quantity in cart
 * @access  Private
 */
router.put('/cart/update-qty', protect, cartController.updateCartQty);

const watchProductController = require('../controllers/watchProduct.controller');

/**
 * @route   GET /api/user/products
 * @desc    Get all active products with filters
 * @access  Public (or protected if needed, usually public for listing)
 */
router.get('/products', watchProductController.getPublicProducts);

/**
 * @route   GET /api/user/products/:id
 * @desc    Get single product details by ID
 * @access  Public
 */
router.get('/products/:id', watchProductController.getPublicProductById);


/**
 * @route   POST /api/user/create-order
 * @desc    Create a new order from a Stripe session
 * @access  Private
 */
/**
 * @route   POST /api/user/create-order
 * @desc    Create a new order from a Stripe session
 * @access  Private
 */
router.post('/create-order', protect, orderController.createOrder);

/**
 * @route   GET /api/user/orders
 * @desc    Get all orders for the logged-in user
 * @access  Private
 */
router.get('/orders', protect, orderController.getUserOrders);

/**
 * @route   POST /api/user/fav-product/manage
 * @desc    Add or remove product from favorites
 * @access  Private
 */
router.post('/fav-product/manage', protect, favProductController.manageFavorite);

/**
 * @route   GET /api/user/fav-product/list
 * @desc    Get user's favorite products
 * @access  Private
 */
router.get('/fav-product/list', protect, favProductController.getFavorites);

module.exports = router;
