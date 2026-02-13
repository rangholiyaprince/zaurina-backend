const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

// ===== DEBUG LOG =====
console.log('[DEBUG] Auth Routes Loaded');

/**
 * Authentication Routes
 * Handles user registration, login, password management, and OAuth
 */

// Apply logger middleware to all auth routes
router.use(logger);

// ===== PUBLIC ROUTES =====

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req, res, next) => {
  console.log(`[DEBUG] Hit /auth/register route`);
  next();
}, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', (req, res, next) => {
  console.log(`[DEBUG] Hit /auth/login route`);
  next();
}, authController.login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

// ===== GOOGLE OAUTH ROUTES =====

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth authentication
 * @access  Public
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleAuthCallback
);

// ===== PROTECTED ROUTES =====

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, authController.getProfile);

/**
 * @route   POST /api/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
// router.post('/update-profile', protect, authController.updateProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, authController.logout);

module.exports = router;
