const Color = require('../models/Color.model');

/**
 * @desc    Create a new color
 * @route   POST /api/colors
 * @access  Private (Admin)
 */
const createColor = async (req, res, next) => {
  try {
    const { name, value, type } = req.body;

    const color = await Color.create({
      name,
      value,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Color created successfully',
      data: color
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all colors
 * @route   GET /api/colors
 * @access  Public/Private
 */
const getColors = async (req, res, next) => {
  try {
    const { type, search } = req.query;

    // Filter by type if provided
    const query = {};
    if (type) {
      query.type = type.toUpperCase();
    }

    // Search by name if provided
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.name = searchRegex;
    }

    const colors = await Color.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: colors.length,
      data: colors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a color
 * @route   PUT /api/colors/:id
 * @access  Private (Admin)
 */
const updateColor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const color = await Color.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Color updated successfully',
      data: color
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a color
 * @route   DELETE /api/colors/:id
 * @access  Private (Admin)
 */
const deleteColor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const color = await Color.findByIdAndDelete(id);

    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Color deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createColor,
  getColors,
  updateColor,
  deleteColor
};
