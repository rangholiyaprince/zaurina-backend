const cloudinary = require("../config/cloudinary");

/**
 * @desc    Upload media (images/videos) to Cloudinary
 * @route   POST /api/admin/upload
 * @access  Private (Admin)
 */
exports.uploadMedia = async (req, res) => {
  console.log(req.files);

  try {
    const media = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // console.log(`Uploading file from path: ${file.path}`);

        // // Sanity check
        // if (!process.env.CLOUDINARY_NAME) {
        //   console.error('Missing CLOUDINARY_NAME env var');
        //   throw new Error('Cloudinary config missing');
        // }

        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
          folder: "zaurina-uploads",
        });

        media.push({
          url: result.secure_url,
          public_id: result.public_id,
          type: result.resource_type,
        });
      }
    } else {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    res.status(200).json({
      success: true,
      count: media.length,
      data: media
    });
    console.log(media);

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
