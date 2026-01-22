const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protect } = require("../middlewares/auth.middleware");

router.post(
  "/profile-image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        imageUrl: req.file.path,
        publicId: req.file.filename,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
