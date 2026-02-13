const StrapDetail = require('../models/StrapDetails.model');

/**
 * @desc    Create a new strap detail
 * @route   POST /api/admin/strap-details
 * @access  Private (Admin)
 */
const createStrapDetail = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    const strapDetail = await StrapDetail.create({
      name,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Strap Detail created successfully',
      data: strapDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all strap details
 * @route   GET /api/admin/strap-details
 * @access  Private (Admin)
 */
const getStrapDetails = async (req, res, next) => {
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

    const strapDetails = await StrapDetail.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: strapDetails.length,
      data: strapDetails
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a strap detail
 * @route   PUT /api/admin/strap-details/:id
 * @access  Private (Admin)
 */
const updateStrapDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const strapDetail = await StrapDetail.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!strapDetail) {
      return res.status(404).json({
        success: false,
        message: 'Strap Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Strap Detail updated successfully',
      data: strapDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a strap detail
 * @route   DELETE /api/admin/strap-details/:id
 * @access  Private (Admin)
 */
const deleteStrapDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const strapDetail = await StrapDetail.findByIdAndDelete(id);

    if (!strapDetail) {
      return res.status(404).json({
        success: false,
        message: 'Strap Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Strap Detail deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStrapDetail,
  getStrapDetails,
  updateStrapDetail,
  deleteStrapDetail
};
