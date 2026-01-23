const addressService = require('../services/address.service');

const saveAddress = async (req, res, next) => {
  try {
    console.log(`[Address Controller] Save address request for user: ${req.user._id}`);
    const address = await addressService.createAddress(req.user._id, req.body);

    console.log(`[Address Controller] Address saved successfully: ${address._id}`);
    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: address
    });
  } catch (error) {
    console.error(`[Address Controller] Save address error: ${error.message}`);
    next(error);
  }
};

const getUserAddresses = async (req, res, next) => {
  try {
    console.log(`[Address Controller] Get addresses request for user: ${req.user._id}`);
    const addresses = await addressService.getUserAddresses(req.user._id);

    console.log(`[Address Controller] Retrieved ${addresses.length} addresses for user: ${req.user._id}`);
    res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error(`[Address Controller] Get addresses error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  saveAddress,
  getUserAddresses
};
