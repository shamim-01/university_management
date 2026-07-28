import AuthService from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    console.log('📝 Register Request:', req.body);
    const result = await AuthService.register(req.body);
    console.log('✅ Register Success');
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Register Error:', error.message);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    console.log('📥 Login Request:', req.body);
    const result = await AuthService.login(req.body);
    console.log('✅ Login Success');
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const result = await AuthService.getCurrentUser(req.user._id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const result = await AuthService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const result = await AuthService.changePassword(req.user._id, req.body);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const result = await AuthService.forgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const result = await AuthService.resetPassword(
      req.params.token,
      req.body.password,
    );
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
