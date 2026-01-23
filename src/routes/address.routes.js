const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const { protect } = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

router.use(logger);

router.post('/save-address', protect, addressController.saveAddress);
router.get('/address-list', protect, addressController.getUserAddresses);

module.exports = router;
