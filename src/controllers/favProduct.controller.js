const Favorite = require('../models/Favorite.model');
const WatchProduct = require('../models/WatchProduct.model');
const User = require('../models/User.model');

/**
 * Manage favorite product (Add or Remove)
 * @param {string} user_id
 * @param {string} product_id
 * @param {number} is_fav - 1 to add, 0 to remove
 */
exports.manageFavorite = async (req, res, next) => {
  try {
    const { user_id, product_id, is_fav } = req.body;

    // Validation
    if (!user_id || !product_id || is_fav === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user_id, product_id, and is_fav (0 or 1).'
      });
    }

    // Check if user exists
    const userExists = await User.findById(user_id);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Check if product exists
    const productExists = await WatchProduct.findById(product_id);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (Number(is_fav) === 1) {
      // Add to favorites
      const existingFavorite = await Favorite.findOne({ user_id, product_id });

      if (existingFavorite) {
        return res.status(200).json({
          success: true,
          message: 'Product is already in favorites.',
          data: existingFavorite
        });
      }

      const newFavorite = await Favorite.create({ user_id, product_id });

      return res.status(201).json({
        success: true,
        message: 'Product added to favorites successfully.',
        data: newFavorite
      });

    } else if (Number(is_fav) === 0) {
      // Remove from favorites
      const deletedFavorite = await Favorite.findOneAndDelete({ user_id, product_id });

      if (!deletedFavorite) {
        return res.status(404).json({
          success: false,
          message: 'Product not found in favorites.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product removed from favorites successfully.'
      });

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid value for is_fav. Use 1 to add, 0 to remove.'
      });
    }

  } catch (error) {
    console.error('Error in manageFavorite:', error);
    next(error);
  }
};

/**
 * Get user favorites
 */
exports.getFavorites = async (req, res, next) => {
  try {
    const { user_id } = req.query; // Assuming user_id is passed as query param or from token if protected

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const favorites = await Favorite.find({ user_id }).populate('product_id');

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
}
