const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');
const upload = require('../middlewares/upload.middleware');

router.use(logger);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getProfile);
router.post('/upload-profile', protect, upload.single('image'), authController.uploadProfileImage);

const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleAuthCallback
);

module.exports = router;
