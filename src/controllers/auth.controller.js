const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { ...user, token }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  // try {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);

  // 🔐 SET COOKIE HERE
  res.cookie("access_token", token, {
    httpOnly: true,                       // JS cannot access
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",                   // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,           // 1 day
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { ...user, token }
  });
  // } catch (error) {
  //   console.log(error);
  //   next(error);
  // }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Since we are using stateless JWT, the server doesn't need to do much.
    // Ideally, you might blacklist the token here if using Redis/DB blacklist.
    // For now, we just verify the user is essentially logging out.

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

const { generateToken } = require('../utils/token');

const googleAuthCallback = async (req, res, next) => {
  try {
    const user = req.user;
    const tokenPayload = {
      user_id: user._id,
      email: user.email
    };
    const token = generateToken(tokenPayload);

    // Redirect to frontend with token
    // res.redirect(`http://localhost:3000/auth/success?token=${token}`);

    // For testing/Postman visibility or if client handles popup flow:
    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          googleId: user.googleId
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    // req.file.path contains the Cloudinary URL
    const user = await authService.updateProfileImage(req.user._id, req.file.path);

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        imageUrl: user.profile_image,
        user: user
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  googleAuthCallback,
  uploadProfileImage
};
