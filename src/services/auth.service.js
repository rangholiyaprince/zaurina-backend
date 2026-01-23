const User = require('../models/User.model');
const { generateToken } = require('../utils/token');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const registerUser = async (userData) => {
  const { first_name, last_name, email, password } = userData;

  if (!first_name || !last_name || !email || !password) {
    throw { statusCode: 400, message: "All fields are required" };
  }

  const existingUser = await User.findOne({ $or: [{ email }] });
  if (existingUser) {
    throw { statusCode: 409, message: "User with this email already exists" };
  }

  // Password hashing handled by model pre-save hook
  const user = await User.create({
    first_name,
    last_name,
    email,
    password,
    last_login_at: new Date()
  });

  const tokenPayload = {
    user_id: user._id,
    email: user.email
  };

  const token = generateToken(tokenPayload);

  // Return plain object
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw { statusCode: 400, message: "Email and password are required" };
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw { statusCode: 404, message: "User not found" }; // As per prompt requirement 404
  }

  if (!user.is_active) {
    throw { statusCode: 403, message: "User account is inactive" };
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  user.last_login_at = new Date();
  await user.save();

  const tokenPayload = {
    user_id: user._id,
    email: user.email
  };

  const token = generateToken(tokenPayload);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.reset_password_token = resetToken;
  user.reset_password_expires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `http://localhost:5000/reset-password/${resetToken}`; // Adjust URL as needed
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. \n\n Please make a PUT request to: \n ${resetUrl} \n\n Reset Token: ${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    return "Email sent";
  } catch (error) {
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    await user.save();
    throw { statusCode: 500, message: "Email could not be sent" };
  }
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    reset_password_token: token,
    reset_password_expires: { $gt: Date.now() }
  });

  if (!user) {
    throw { statusCode: 400, message: "Invalid or expired token" };
  }

  user.password = newPassword;
  user.reset_password_token = null;
  user.reset_password_expires = null;
  await user.save();

  return true;
};

const updateUserDetails = async (userId, updateData) => {
  // Fields that should NOT be updated via this endpoint
  const restrictedFields = [
    'password',
    'user_type',
    'is_verified',
    'provider',
    'googleId',
    'reset_password_token',
    'reset_password_expires',
    'last_login_at',
    '_id',
    'createdAt',
    'updatedAt'
  ];

  const dataToUpdate = {};

  Object.keys(updateData).forEach(key => {
    if (!restrictedFields.includes(key)) {
      dataToUpdate[key] = updateData[key];
    }
  });

  if (Object.keys(dataToUpdate).length === 0) {
    throw { statusCode: 400, message: "No valid fields to update" };
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: dataToUpdate },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUserDetails
};
