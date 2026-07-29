import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, bio, department } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (department) user.department = department;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
