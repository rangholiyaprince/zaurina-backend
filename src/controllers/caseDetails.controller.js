const CaseDetail = require('../models/CaseDetails.model');

/**
 * @desc    Create a new case detail
 * @route   POST /api/admin/case-details
 * @access  Private (Admin)
 */
const createCaseDetail = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    const caseDetail = await CaseDetail.create({
      name,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Case Detail created successfully',
      data: caseDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all case details
 * @route   GET /api/admin/case-details
 * @access  Private (Admin)
 */
const getCaseDetails = async (req, res, next) => {
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

    const caseDetails = await CaseDetail.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: caseDetails.length,
      data: caseDetails
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a case detail
 * @route   PUT /api/admin/case-details/:id
 * @access  Private (Admin)
 */
const updateCaseDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const caseDetail = await CaseDetail.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!caseDetail) {
      return res.status(404).json({
        success: false,
        message: 'Case Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Case Detail updated successfully',
      data: caseDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a case detail
 * @route   DELETE /api/admin/case-details/:id
 * @access  Private (Admin)
 */
const deleteCaseDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const caseDetail = await CaseDetail.findByIdAndDelete(id);

    if (!caseDetail) {
      return res.status(404).json({
        success: false,
        message: 'Case Detail not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Case Detail deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCaseDetail,
  getCaseDetails,
  updateCaseDetail,
  deleteCaseDetail
};
