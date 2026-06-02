const User = require('../models/User');
const { uploadImage } = require('../utils/cloudinary');
const { syncRecordEmbedding } = require('../utils/vectorDb');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.image && req.body.image.startsWith('data:image')) {
        // Store the base64 string directly in the database to avoid Cloudinary API issues
        user.profilePic = req.body.image;
      }

      const updatedUser = await user.save();

      // Auto-sync User to AI Vector DB
      syncRecordEmbedding(updatedUser, 'User').catch(err => console.error("Auto-sync error:", err));

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.profilePic,
        role: updatedUser.role,
        companyName: updatedUser.companyName,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users in the same company
// @route   GET /api/users/company
// @access  Private
const getCompanyMembers = async (req, res) => {
  try {
    const members = await User.find({ companyName: req.user.companyName })
      .select('-password')
      .sort({ name: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members' });
  }
};

module.exports = {
  updateUserProfile,
  getCompanyMembers,
};
