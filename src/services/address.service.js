const Address = require('../models/Address.model');

const createAddress = async (userId, addressData) => {
  // If this address is set as default, unset other default addresses for this user
  if (addressData.isDefault) {
    await Address.updateMany(
      { user_id: userId, isDefault: true },
      { isDefault: false }
    );
  }

  // Create the new address
  const address = await Address.create({
    user_id: userId,
    ...addressData
  });

  return address;
};

const getUserAddresses = async (userId) => {
  const addresses = await Address.find({ user_id: userId }).sort({ isDefault: -1, createdAt: -1 });
  return addresses;
};

module.exports = {
  createAddress,
  getUserAddresses
};
