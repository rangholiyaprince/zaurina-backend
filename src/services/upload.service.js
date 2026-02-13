const cloudinary = require("../config/cloudinary");
const ApiError = require("../utils/ApiError.util");

/**
 * Upload Service
 * Handles all Cloudinary upload operations with error handling
 */

/**
 * Upload image to Cloudinary
 * @param {Object} file - Multer file object (already uploaded by CloudinaryStorage)
 * @param {Object} options - Additional upload options
 * @returns {Promise<Object>} - Upload result with secure_url and public_id
 */
const uploadImage = async (file, options = {}) => {
  try {
    if (!file) {
      throw ApiError.badRequest("No file provided for upload");
    }

    // File is already uploaded by multer-storage-cloudinary
    // Return the relevant information
    return {
      success: true,
      url: file.path, // Cloudinary secure URL
      publicId: file.filename, // Cloudinary public ID
      format: file.format,
      width: file.width,
      height: file.height,
      bytes: file.bytes,
      createdAt: file.created_at,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw ApiError.internal("Failed to process uploaded image");
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      throw ApiError.badRequest("Public ID is required for deletion");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw ApiError.internal("Failed to delete image from Cloudinary");
    }

    return {
      success: true,
      message: "Image deleted successfully",
      result: result.result,
    };
  } catch (error) {
    console.error("Delete error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal("Failed to delete image");
  }
};

/**
 * Update/Replace image in Cloudinary
 * @param {string} oldPublicId - Old image public ID to delete
 * @param {Object} newFile - New file object from multer
 * @returns {Promise<Object>} - Upload result
 */
const updateImage = async (oldPublicId, newFile) => {
  try {
    // Upload new image first
    const uploadResult = await uploadImage(newFile);

    // Delete old image if upload was successful
    if (oldPublicId) {
      try {
        await deleteImage(oldPublicId);
      } catch (deleteError) {
        console.error("Failed to delete old image:", deleteError);
        // Don't throw error if old image deletion fails
        // New image is already uploaded
      }
    }

    return uploadResult;
  } catch (error) {
    console.error("Update error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal("Failed to update image");
  }
};

/**
 * Get image details from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Image details
 */
const getImageDetails = async (publicId) => {
  try {
    if (!publicId) {
      throw ApiError.badRequest("Public ID is required");
    }

    const result = await cloudinary.api.resource(publicId);

    return {
      success: true,
      data: {
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        url: result.secure_url,
        createdAt: result.created_at,
      },
    };
  } catch (error) {
    console.error("Get image details error:", error);
    if (error.error && error.error.http_code === 404) {
      throw ApiError.notFound("Image not found");
    }
    throw ApiError.internal("Failed to get image details");
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of public IDs
 * @returns {Promise<Object>} - Deletion results
 */
const deleteMultipleImages = async (publicIds) => {
  try {
    if (!publicIds || publicIds.length === 0) {
      throw ApiError.badRequest("Public IDs array is required");
    }

    const result = await cloudinary.api.delete_resources(publicIds);

    return {
      success: true,
      deleted: result.deleted,
      deletedCount: Object.keys(result.deleted).length,
    };
  } catch (error) {
    console.error("Delete multiple images error:", error);
    throw ApiError.internal("Failed to delete images");
  }
};

/**
 * Upload image with custom transformations
 * This is for direct uploads (not using multer-storage-cloudinary)
 * @param {string} filePath - Local file path or base64 string
 * @param {Object} options - Upload options including transformations
 * @returns {Promise<Object>} - Upload result
 */
const uploadWithTransformation = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: "zaurina/general_images",
      resource_type: "auto",
      ...options,
    };

    const result = await cloudinary.uploader.upload(filePath, defaultOptions);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Upload with transformation error:", error);
    throw ApiError.internal("Failed to upload image with transformations");
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  updateImage,
  getImageDetails,
  deleteMultipleImages,
  uploadWithTransformation,
};
