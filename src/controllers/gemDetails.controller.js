const GemDetail = require('../models/GemDetails.model');

/**
 * @desc    Create a new gem detail
 * @route   POST /api/admin/gem-details
 * @access  Private (Admin)
 */
const createGemDetail = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    const gemDetail = await GemDetail.create({
      name,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Gem Detail created successfully',
      data: gemDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all gem details
 * @route   GET /api/admin/gem-details
 * @access  Private (Admin)
 */
const getGemDetails = async (req, res, next) => {
  try {
    const { type, search } = req.query;

    // Filter by type if provided
    const query = {};
    if (type) {
      query.type = type;
    }

    // Search by name if provided
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.name = searchRegex;
    }

    const gemDetails = await GemDetail.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gemDetails.length,
      data: gemDetails
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a gem detail
 * @route   PUT /api/admin/gem-details/:id
 * @access  Private (Admin)
 */
const updateGemDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gemDetail = await GemDetail.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!gemDetail) {
      return res.status(404).json({
        success: false,
        message: 'Gem Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gem Detail updated successfully',
      data: gemDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a gem detail
 * @route   DELETE /api/admin/gem-details/:id
 * @access  Private (Admin)
 */
const deleteGemDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gemDetail = await GemDetail.findByIdAndDelete(id);

    if (!gemDetail) {
      return res.status(404).json({
        success: false,
        message: 'Gem Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gem Detail deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGemDetail,
  getGemDetails,
  updateGemDetail,
  deleteGemDetail
};
