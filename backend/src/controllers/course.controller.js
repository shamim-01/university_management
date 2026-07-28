import Course from '../models/Course.js';
import Department from '../models/Department.js';
import { AppError } from '../utils/AppError.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      semester,
      status,
    } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .populate('department', 'name code')
      .populate('teacher', 'name email')
      .populate('students', 'studentId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ code: 1 });

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('department', 'name code')
      .populate('teacher', 'name email')
      .populate('students', 'studentId')
      .populate('prerequisites', 'name code');

    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);

    // Add course to department
    await Department.findByIdAndUpdate(req.body.department, {
      $push: { courses: course._id },
    });

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    // Remove from department
    await Department.findByIdAndUpdate(course.department, {
      $pull: { courses: course._id },
    });

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll student in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Admin
export const enrollStudent = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }

    res.status(200).json({
      success: true,
      message: 'Student enrolled successfully',
    });
  } catch (error) {
    next(error);
  }
};
