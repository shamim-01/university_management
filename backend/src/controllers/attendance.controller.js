import Attendance from '../models/Attendance.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import { AppError } from '../utils/AppError.js';

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private/Teacher
export const markAttendance = async (req, res, next) => {
  try {
    const { course, student, date, status, remarks } = req.body;

    const existingAttendance = await Attendance.findOne({
      course,
      student,
      date: new Date(date),
    });

    if (existingAttendance) {
      return next(
        new AppError(
          'Attendance already marked for this student on this date',
          400,
        ),
      );
    }

    const attendance = await Attendance.create({
      course,
      student,
      date,
      status,
      remarks,
      markedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('❌ Mark Attendance Error:', error);
    next(error);
  }
};

// ✅ Get attendance by course - FIXED (No populate('course'))
export const getAttendanceByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { startDate, endDate, status } = req.query;

    const filter = { course: courseId };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (status) filter.status = status;

    // ✅ populate('course') সরিয়ে ফেলা হয়েছে
    const attendance = await Attendance.find(filter)
      .populate('student', 'studentId')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    // ✅ Course আলাদাভাবে fetch
    const course = await Course.findById(courseId).select('name code');

    res.status(200).json({
      success: true,
      data: {
        attendance,
        course: course || null,
      },
    });
  } catch (error) {
    console.error('❌ Get Attendance By Course Error:', error);
    next(error);
  }
};

// ✅ Get attendance by student - FIXED
export const getAttendanceByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { course, semester } = req.query;

    const filter = { student: studentId };
    if (course) filter.course = course;

    const attendance = await Attendance.find(filter)
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    // ✅ Course আলাদাভাবে fetch
    const attendanceWithCourses = await Promise.all(
      attendance.map(async item => {
        const courseData = await Course.findById(item.course).select(
          'name code credits',
        );
        return {
          ...item._doc,
          course: courseData || { name: 'Course not found', code: 'N/A' },
        };
      }),
    );

    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(
      a => a.status === 'present',
    ).length;
    const attendancePercentage =
      totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        attendance: attendanceWithCourses,
        summary: {
          totalClasses,
          present: presentClasses,
          absent: attendance.filter(a => a.status === 'absent').length,
          late: attendance.filter(a => a.status === 'late').length,
          excused: attendance.filter(a => a.status === 'excused').length,
          percentage: attendancePercentage.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error('❌ Get Attendance By Student Error:', error);
    next(error);
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private/Teacher
export const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!attendance) {
      return next(new AppError('Attendance record not found', 404));
    }

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('❌ Update Attendance Error:', error);
    next(error);
  }
};
