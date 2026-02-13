const OtherDetail = require('../models/OtherDetails.model');

/**
 * @desc    Create a new other detail
 * @route   POST /api/admin/other-details
 * @access  Private (Admin)
 */
const createOtherDetail = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    const otherDetail = await OtherDetail.create({
      name,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Detail created successfully',
      data: otherDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all other details
 * @route   GET /api/admin/other-details
 * @access  Private (Admin)
 */
const getOtherDetails = async (req, res, next) => {
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

    const otherDetails = await OtherDetail.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: otherDetails.length,
      data: otherDetails
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an other detail
 * @route   PUT /api/admin/other-details/:id
 * @access  Private (Admin)
 */
const updateOtherDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const otherDetail = await OtherDetail.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!otherDetail) {
      return res.status(404).json({
        success: false,
        message: 'Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Detail updated successfully',
      data: otherDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an other detail
 * @route   DELETE /api/admin/other-details/:id
 * @access  Private (Admin)
 */
const deleteOtherDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const otherDetail = await OtherDetail.findByIdAndDelete(id);

    if (!otherDetail) {
      return res.status(404).json({
        success: false,
        message: 'Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Detail deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOtherDetail,
  getOtherDetails,
  updateOtherDetail,
  deleteOtherDetail
};
