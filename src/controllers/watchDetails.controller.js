const WatchDetail = require('../models/WatchDetails.model');

/**
 * @desc    Create a new watch detail
 * @route   POST /api/admin/watch-details
 * @access  Private (Admin)
 */
const createWatchDetail = async (req, res, next) => {
  try {
    const { name, type, value } = req.body;

    const watchDetail = await WatchDetail.create({
      name,
      type,
      value
    });

    res.status(201).json({
      success: true,
      message: 'Watch Detail created successfully',
      data: watchDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all watch details
 * @route   GET /api/admin/watch-details
 * @access  Private (Admin)
 */
const getWatchDetails = async (req, res, next) => {
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

    const watchDetails = await WatchDetail.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: watchDetails.length,
      data: watchDetails
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a watch detail
 * @route   PUT /api/admin/watch-details/:id
 * @access  Private (Admin)
 */
const updateWatchDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const watchDetail = await WatchDetail.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!watchDetail) {
      return res.status(404).json({
        success: false,
        message: 'Watch Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Watch Detail updated successfully',
      data: watchDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a watch detail
 * @route   DELETE /api/admin/watch-details/:id
 * @access  Private (Admin)
 */
const deleteWatchDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const watchDetail = await WatchDetail.findByIdAndDelete(id);

    if (!watchDetail) {
      return res.status(404).json({
        success: false,
        message: 'Watch Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Watch Detail deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWatchDetail,
  getWatchDetails,
  updateWatchDetail,
  deleteWatchDetail
};
