import Department from '../models/Department.js';
import { AppError } from '../utils/AppError.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate('head', 'name email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private
export const getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      'head',
      'name email',
    );

    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
