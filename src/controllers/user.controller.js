const User = require('../models/User.model');

/**
 * @desc    Get all users with user_type 'user'
 * @route   GET /api/user/list
 * @access  Private
 */
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = { user_type: 'user' };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { first_name: searchRegex },
        { last_name: searchRegex },
        { email: searchRegex },
        { phone_number: searchRegex }
      ];
    }

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedUsers = users.map(user => ({
      _id: user._id,
      full_name: `${user.first_name} ${user.last_name}`,
      since: user.createdAt,
      email: user.email,
      phone_number: user.phone_number,
      phone_code: user.phone_code,
      total_order: 0, // Mock value
      total_spent: 0, // Mock value
      status: user.is_active ? 'Active' : 'Inactive',
      last_order: new Date() // Mock value
    }));

    res.status(200).json({
      success: true,
      current_page: page,
      total_pages: Math.ceil(totalUsers / limit),
      total_users: totalUsers,
      data: formattedUsers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user status (1 = Block/Inactive, 0 = Unblock/Active)
 * @route   PUT /api/user/block-user
 * @access  Private
 */
const blockUser = async (req, res, next) => {
  try {
    const { userId, type } = req.body;

    // type: 1 = Block (is_active: false), 0 = Unblock (is_active: true)

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (type !== 0 && type !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Type is required and must be 0 or 1'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Logic: type 1 -> is_active = false (Inactive)
    // Logic: type 0 -> is_active = true (Active)

    // Convert type to boolean for comparison logic if needed, but direct assignment is clearer
    // type 1 (Inactive) -> is_active = false
    // type 0 (Active)   -> is_active = true

    const isActive = type === 0; // If type is 0, active is true. If type is 1, active is false.

    user.is_active = isActive;
    await user.save();

    const statusMessage = isActive ? 'User unblocked successfully' : 'User blocked successfully';

    res.status(200).json({
      success: true,
      message: statusMessage,
      data: {
        _id: user._id,
        is_active: user.is_active
      }
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getUsers,
  blockUser
};

