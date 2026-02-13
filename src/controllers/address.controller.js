const addressService = require('../services/address.service');

const saveAddress = async (req, res, next) => {
  console.log(req.body);

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
    console.log(`[Address Controller] Save address error: ${error.message}`);
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

const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[Address Controller] Update address request for user: ${req.user._id}, address: ${id}`);

    const address = await addressService.updateAddress(req.user._id, id, req.body);

    console.log(`[Address Controller] Address updated successfully: ${address._id}`);
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address
    });
  } catch (error) {
    console.error(`[Address Controller] Update address error: ${error.message}`);
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[Address Controller] Delete address request for user: ${req.user._id}, address: ${id}`);

    await addressService.deleteAddress(req.user._id, id);

    console.log(`[Address Controller] Address deleted successfully: ${id}`);
    res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });
  } catch (error) {
    console.error(`[Address Controller] Delete address error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  saveAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress
};
