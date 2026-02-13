const express = require('express');
const router = express.Router();
const colorController = require('../controllers/color.controller');
const materialController = require('../controllers/material.controller');
const watchDetailsController = require('../controllers/watchDetails.controller');
const caseDetailsController = require('../controllers/caseDetails.controller');
const strapDetailsController = require('../controllers/strapDetails.controller');
const dialDetailsController = require('../controllers/dialDetails.controller');
const gemDetailsController = require('../controllers/gemDetails.controller');
const otherDetailsController = require('../controllers/otherDetails.controller');
const watchProductController = require('../controllers/watchProduct.controller');
const uploadController = require('../controllers/upload.controller');
const orderController = require('../controllers/order.controller');
const upload = require('../middlewares/upload.middleware');

const { protect } = require('../middlewares/auth.middleware');








// ===== COLOR MANAGEMENT ROUTES =====


/**
 * @route   POST /api/admin/colors
 * @desc    Create a new color
 * @access  Private (Admin)
 */
router.post('/colors', protect, colorController.createColor);

/**
 * @route   GET /api/admin/colors
 * @desc    Get all colors
 * @access  Private (Admin)
 */
router.get('/colors', protect, colorController.getColors);

/**
 * @route   PUT /api/admin/colors/:id
 * @desc    Update a color
 * @access  Private (Admin)
 */
router.put('/colors/:id', protect, colorController.updateColor);

/**
 * @route   DELETE /api/admin/colors/:id
 * @desc    Delete a color
 * @access  Private (Admin)
 */
router.delete('/colors/:id', protect, colorController.deleteColor);

// ===== MATERIAL MANAGEMENT ROUTES =====

/**
 * @route   POST /api/admin/materials
 * @desc    Create a new material
 * @access  Private (Admin)
 */
router.post('/materials', protect, materialController.createMaterial);

/**
 * @route   GET /api/admin/materials
 * @desc    Get all materials
 * @access  Private (Admin)
 */
router.get('/materials', protect, materialController.getMaterials);

/**
 * @route   PUT /api/admin/materials/:id
 * @desc    Update a material
 * @access  Private (Admin)
 */
router.put('/materials/:id', protect, materialController.updateMaterial);

/**
 * @route   DELETE /api/admin/materials/:id
 * @desc    Delete a material
 * @access  Private (Admin)
 */
router.delete('/materials/:id', protect, materialController.deleteMaterial);

// ===== WATCH DETAILS ROUTES =====

/**
 * @route   POST /api/admin/watch-details
 * @desc    Create a new watch detail
 * @access  Private (Admin)
 */
router.post('/watch-details', protect, watchDetailsController.createWatchDetail);

/**
 * @route   GET /api/admin/watch-details
 * @desc    Get all watch details
 * @access  Private (Admin)
 */
router.get('/watch-details', protect, watchDetailsController.getWatchDetails);

/**
 * @route   PUT /api/admin/watch-details/:id
 * @desc    Update a watch detail
 * @access  Private (Admin)
 */
router.put('/watch-details/:id', protect, watchDetailsController.updateWatchDetail);

/**
 * @route   DELETE /api/admin/watch-details/:id
 * @desc    Delete a watch detail
 * @access  Private (Admin)
 */
router.delete('/watch-details/:id', protect, watchDetailsController.deleteWatchDetail);

// ===== CASE DETAILS ROUTES =====

/**
 * @route   POST /api/admin/case-details
 * @desc    Create a new case detail
 * @access  Private (Admin)
 */
router.post('/case-details', protect, caseDetailsController.createCaseDetail);

/**
 * @route   GET /api/admin/case-details
 * @desc    Get all case details
 * @access  Private (Admin)
 */
router.get('/case-details', protect, caseDetailsController.getCaseDetails);

/**
 * @route   PUT /api/admin/case-details/:id
 * @desc    Update a case detail
 * @access  Private (Admin)
 */
router.put('/case-details/:id', protect, caseDetailsController.updateCaseDetail);

/**
 * @route   DELETE /api/admin/case-details/:id
 * @desc    Delete a case detail
 * @access  Private (Admin)
 */
router.delete('/case-details/:id', protect, caseDetailsController.deleteCaseDetail);

// ===== STRAP DETAILS ROUTES =====

/**
 * @route   POST /api/admin/strap-details
 * @desc    Create a new strap detail
 * @access  Private (Admin)
 */
router.post('/strap-details', protect, strapDetailsController.createStrapDetail);

/**
 * @route   GET /api/admin/strap-details
 * @desc    Get all strap details
 * @access  Private (Admin)
 */
router.get('/strap-details', protect, strapDetailsController.getStrapDetails);

/**
 * @route   PUT /api/admin/strap-details/:id
 * @desc    Update a strap detail
 * @access  Private (Admin)
 */
router.put('/strap-details/:id', protect, strapDetailsController.updateStrapDetail);

/**
 * @route   DELETE /api/admin/strap-details/:id
 * @desc    Delete a strap detail
 * @access  Private (Admin)
 */
router.delete('/strap-details/:id', protect, strapDetailsController.deleteStrapDetail);

// ===== DIAL DETAILS ROUTES =====

/**
 * @route   POST /api/admin/dial-details
 * @desc    Create a new dial detail
 * @access  Private (Admin)
 */
router.post('/dial-details', protect, dialDetailsController.createDialDetail);

/**
 * @route   GET /api/admin/dial-details
 * @desc    Get all dial details
 * @access  Private (Admin)
 */
router.get('/dial-details', protect, dialDetailsController.getDialDetails);

/**
 * @route   PUT /api/admin/dial-details/:id
 * @desc    Update a dial detail
 * @access  Private (Admin)
 */
router.put('/dial-details/:id', protect, dialDetailsController.updateDialDetail);

/**
 * @route   DELETE /api/admin/dial-details/:id
 * @desc    Delete a dial detail
 * @access  Private (Admin)
 */
router.delete('/dial-details/:id', protect, dialDetailsController.deleteDialDetail);

// ===== GEM DETAILS ROUTES =====

/**
 * @route   POST /api/admin/gem-details
 * @desc    Create a new gem detail
 * @access  Private (Admin)
 */
router.post('/gem-details', protect, gemDetailsController.createGemDetail);

/**
 * @route   GET /api/admin/gem-details
 * @desc    Get all gem details
 * @access  Private (Admin)
 */
router.get('/gem-details', protect, gemDetailsController.getGemDetails);

/**
 * @route   PUT /api/admin/gem-details/:id
 * @desc    Update a gem detail
 * @access  Private (Admin)
 */
router.put('/gem-details/:id', protect, gemDetailsController.updateGemDetail);

/**
 * @route   DELETE /api/admin/gem-details/:id
 * @desc    Delete a gem detail
 * @access  Private (Admin)
 */
router.delete('/gem-details/:id', protect, gemDetailsController.deleteGemDetail);

// ===== OTHER DETAILS ROUTES =====

/**
 * @route   POST /api/admin/other-details
 * @desc    Create a new other detail
 * @access  Private (Admin)
 */
router.post('/other-details', protect, otherDetailsController.createOtherDetail);

/**
 * @route   GET /api/admin/other-details
 * @desc    Get all other details
 * @access  Private (Admin)
 */
router.get('/other-details', protect, otherDetailsController.getOtherDetails);

/**
 * @route   PUT /api/admin/other-details/:id
 * @desc    Update an other detail
 * @access  Private (Admin)
 */
router.put('/other-details/:id', protect, otherDetailsController.updateOtherDetail);

/**
 * @route   DELETE /api/admin/other-details/:id
 * @desc    Delete an other detail
 * @access  Private (Admin)
 */
router.delete('/other-details/:id', protect, otherDetailsController.deleteOtherDetail);

// ===== WATCH PRODUCT ROUTES =====

/**
 * @route   POST /api/admin/watch-products
 * @desc    Create a new watch product
 * @access  Private (Admin)
 */
router.post('/watch-products', protect, upload.array('media', 10), watchProductController.createProduct);

/**
 * @route   GET /api/admin/watch-products
 * @desc    Get all watch products
 * @access  Private (Admin)
 */
router.get('/watch-products', protect, watchProductController.getProducts);

/**
 * @route   PUT /api/admin/watch-products/:id
 * @desc    Update a watch product
 * @access  Private (Admin)
 */
router.put('/watch-products/:id', protect, watchProductController.updateProduct);

/**
 * @route   DELETE /api/admin/watch-products/:id
 * @desc    Delete a watch product
 * @access  Private (Admin)
 */
router.delete('/watch-products/:id', protect, watchProductController.deleteProduct);

// ===== MEDIA UPLOAD ROUTE =====

/**
 * @route   POST /api/admin/upload
 * @desc    Upload media files
 * @access  Private (Admin)
 */
router.post('/upload', protect, upload.array('media', 10), uploadController.uploadMedia);

// ===== ORDER MANAGEMENT ROUTES =====

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders
 * @access  Private (Admin)
 */
router.get('/orders', protect, orderController.getAllOrders);

module.exports = router;
