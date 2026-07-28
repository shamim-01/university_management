import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import { AppError } from '../utils/AppError.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import crypto from 'crypto';

class AuthService {
  // Register user
  async register(userData) {
    console.log('📝 Register Service called:', userData);

    const { name, email, password, role, studentData, teacherData } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    console.log('✅ User created:', user._id);

    // Create profile based on role
    let profileData = null;
    if (role === 'student' && studentData) {
      profileData = await Student.create({
        user: user._id,
        ...studentData,
      });
    } else if (role === 'teacher' && teacherData) {
      profileData = await Teacher.create({
        user: user._id,
        ...teacherData,
      });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return {
      user: user.profile,
      profile: profileData,
      token,
      refreshToken,
    };
  }

  // Login user
  async login(credentials) {
    console.log('🔑 Login Service called:', credentials);

    const { email, password } = credentials;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Get profile based on role
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id }).populate(
        'department',
        'name code',
      );
    } else if (user.role === 'teacher') {
      profile = await Teacher.findOne({ user: user._id }).populate(
        'department',
        'name code',
      );
    }

    console.log('✅ Login successful for:', user.email);

    return {
      user: user.profile,
      profile,
      token,
      refreshToken,
    };
  }

  // Get current user
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    let profile = null;

    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id })
        .populate('department', 'name code')
        .populate('courses.course', 'name code credits');
    } else if (user.role === 'teacher') {
      profile = await Teacher.findOne({ user: user._id })
        .populate('department', 'name code')
        .populate('courses', 'name code credits');
    }

    return {
      user: user.profile,
      profile,
    };
  }

  // Update profile
  async updateProfile(userId, updateData) {
    const { name, phoneNumber } = updateData;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phoneNumber },
      { new: true, runValidators: true },
    );

    return user.profile;
  }

  // Change password
  async changePassword(userId, passwordData) {
    const { currentPassword, newPassword } = passwordData;

    const user = await User.findById(userId).select('+password');

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  // Forgot password
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('No user found with this email', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    return {
      message: 'Password reset email sent successfully',
      resetToken:
        process.env.NODE_ENV === 'development' ? resetToken : undefined,
    };
  }

  // Reset password
  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Invalid or expired token', 400);
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }
}

export default new AuthService();
