const DialDetail = require('../models/DialDetails.model');

/**
 * @desc    Create a new dial detail
 * @route   POST /api/admin/dial-details
 * @access  Private (Admin)
 */
const createDialDetail = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    const dialDetail = await DialDetail.create({
      name,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Dial Detail created successfully',
      data: dialDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all dial details
 * @route   GET /api/admin/dial-details
 * @access  Private (Admin)
 */
const getDialDetails = async (req, res, next) => {
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

    const dialDetails = await DialDetail.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dialDetails.length,
      data: dialDetails
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a dial detail
 * @route   PUT /api/admin/dial-details/:id
 * @access  Private (Admin)
 */
const updateDialDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dialDetail = await DialDetail.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!dialDetail) {
      return res.status(404).json({
        success: false,
        message: 'Dial Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dial Detail updated successfully',
      data: dialDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a dial detail
 * @route   DELETE /api/admin/dial-details/:id
 * @access  Private (Admin)
 */
const deleteDialDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dialDetail = await DialDetail.findByIdAndDelete(id);

    if (!dialDetail) {
      return res.status(404).json({
        success: false,
        message: 'Dial Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dial Detail deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDialDetail,
  getDialDetails,
  updateDialDetail,
  deleteDialDetail
};
