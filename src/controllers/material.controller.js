const Material = require('../models/Material.model');

/**
 * @desc    Create a new material
 * @route   POST /api/admin/materials
 * @access  Private (Admin)
 */
const createMaterial = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    const material = await Material.create({
      name,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Material created successfully',
      data: material
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all materials
 * @route   GET /api/admin/materials
 * @access  Private (Admin)
 */
const getMaterials = async (req, res, next) => {
  try {
    const { type, search } = req.query;

    // Filter by type if provided
    const query = {};
    if (type) {
      query.type = type;
    }

    // Search by name if provided
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.name = searchRegex;
    }

    const materials = await Material.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a material
 * @route   PUT /api/admin/materials/:id
 * @access  Private (Admin)
 */
const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const material = await Material.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Material updated successfully',
      data: material
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a material
 * @route   DELETE /api/admin/materials/:id
 * @access  Private (Admin)
 */
const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const material = await Material.findByIdAndDelete(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMaterial,
  getMaterials,
  updateMaterial,
  deleteMaterial
};
