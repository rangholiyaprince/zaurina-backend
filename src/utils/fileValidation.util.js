const ApiError = require("./ApiError.util");

/**
 * File Validation Utilities
 * Provides comprehensive validation for file uploads
 */

// Allowed image MIME types
const ALLOWED_IMAGE_MIMETYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Allowed image extensions
const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

// Default max file size (2MB)
const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

/**
 * Validate if file is an image based on MIME type
 * @param {string} mimetype - File MIME type
 * @returns {boolean}
 */
const isValidImageType = (mimetype) => {
  return ALLOWED_IMAGE_MIMETYPES.includes(mimetype.toLowerCase());
};

/**
 * Validate if file extension is allowed
 * @param {string} filename - File name
 * @returns {boolean}
 */
const isValidImageExtension = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.includes(extension);
};

/**
 * Validate file size
 * @param {number} fileSize - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {boolean}
 */
const isValidFileSize = (fileSize, maxSize = DEFAULT_MAX_FILE_SIZE) => {
  return fileSize <= maxSize;
};

/**
 * Get human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string}
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

/**
 * Comprehensive file validation middleware
 * @param {Object} file - Multer file object
 * @param {number} maxSize - Maximum file size in bytes
 * @throws {ApiError} - Throws error if validation fails
 */
const validateImageFile = (file, maxSize = DEFAULT_MAX_FILE_SIZE) => {
  if (!file) {
    throw ApiError.badRequest("No file uploaded");
  }

  // Validate MIME type
  if (!isValidImageType(file.mimetype)) {
    throw ApiError.badRequest(
      `Invalid file type. Only ${ALLOWED_IMAGE_EXTENSIONS.join(", ")} files are allowed`
    );
  }

  // Validate file extension
  if (!isValidImageExtension(file.originalname)) {
    throw ApiError.badRequest(
      `Invalid file extension. Only ${ALLOWED_IMAGE_EXTENSIONS.join(", ")} extensions are allowed`
    );
  }

  // Validate file size
  if (!isValidFileSize(file.size, maxSize)) {
    throw ApiError.badRequest(
      `File size exceeds limit. Maximum allowed size is ${formatFileSize(maxSize)}, but received ${formatFileSize(file.size)}`
    );
  }

  return true;
};

/**
 * Multer file filter function
 * @param {Object} req - Express request object
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const imageFileFilter = (req, file, cb) => {
  try {
    // Check MIME type
    if (!isValidImageType(file.mimetype)) {
      return cb(
        ApiError.badRequest(
          `Invalid file type. Only ${ALLOWED_IMAGE_EXTENSIONS.join(", ")} files are allowed`
        ),
        false
      );
    }

    // Check file extension
    if (!isValidImageExtension(file.originalname)) {
      return cb(
        ApiError.badRequest(
          `Invalid file extension. Only ${ALLOWED_IMAGE_EXTENSIONS.join(", ")} extensions are allowed`
        ),
        false
      );
    }

    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

module.exports = {
  ALLOWED_IMAGE_MIMETYPES,
  ALLOWED_IMAGE_EXTENSIONS,
  DEFAULT_MAX_FILE_SIZE,
  isValidImageType,
  isValidImageExtension,
  isValidFileSize,
  formatFileSize,
  validateImageFile,
  imageFileFilter,
};
