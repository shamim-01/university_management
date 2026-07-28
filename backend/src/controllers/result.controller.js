import Result from '../models/Result.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import { AppError } from '../utils/AppError.js';

// Calculate grade and grade point
const calculateGrade = marks => {
  if (marks >= 80) return { grade: 'A+', gradePoint: 4.0 };
  if (marks >= 75) return { grade: 'A', gradePoint: 3.75 };
  if (marks >= 70) return { grade: 'A-', gradePoint: 3.5 };
  if (marks >= 65) return { grade: 'B+', gradePoint: 3.25 };
  if (marks >= 60) return { grade: 'B', gradePoint: 3.0 };
  if (marks >= 55) return { grade: 'B-', gradePoint: 2.75 };
  if (marks >= 50) return { grade: 'C+', gradePoint: 2.5 };
  if (marks >= 45) return { grade: 'C', gradePoint: 2.25 };
  if (marks >= 40) return { grade: 'D', gradePoint: 2.0 };
  return { grade: 'F', gradePoint: 0 };
};

// @desc    Add result
// @route   POST /api/results
// @access  Private/Teacher
export const addResult = async (req, res, next) => {
  try {
    const { student, course, semester, marks, remarks } = req.body;

    // Check if result exists
    const existingResult = await Result.findOne({ student, course, semester });
    if (existingResult) {
      return next(
        new AppError(
          'Result already exists for this student in this course',
          400,
        ),
      );
    }

    const { grade, gradePoint } = calculateGrade(marks);
    const status = marks >= 40 ? 'passed' : 'failed';

    const result = await Result.create({
      student,
      course,
      semester,
      marks,
      grade,
      gradePoint,
      status,
      remarks,
      approvedBy: req.user._id,
      isPublished: true,
    });

    // Update student CGPA
    await updateStudentCGPA(student);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get results by student
// @route   GET /api/results/student/:studentId
// @access  Private
export const getResultsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { semester } = req.query;

    const filter = { student: studentId };
    if (semester) filter.semester = parseInt(semester);

    const results = await Result.find(filter)
      .populate('course', 'name code credits')
      .populate('approvedBy', 'name')
      .sort({ semester: -1 });

    // Calculate summary
    const totalCredits = results.reduce((sum, r) => sum + r.course.credits, 0);
    const totalGradePoints = results.reduce(
      (sum, r) => sum + r.gradePoint * r.course.credits,
      0,
    );
    const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    res.status(200).json({
      success: true,
      data: {
        results,
        summary: {
          totalCourses: results.length,
          passed: results.filter(r => r.status === 'passed').length,
          failed: results.filter(r => r.status === 'failed').length,
          cgpa: cgpa.toFixed(2),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get results by course
// @route   GET /api/results/course/:courseId
// @access  Private/Teacher
export const getResultsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { semester } = req.query;

    const filter = { course: courseId };
    if (semester) filter.semester = parseInt(semester);

    const results = await Result.find(filter)
      .populate('student', 'studentId')
      .populate('approvedBy', 'name')
      .sort({ marks: -1 });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update result
// @route   PUT /api/results/:id
// @access  Private/Teacher
export const updateResult = async (req, res, next) => {
  try {
    const { marks, remarks } = req.body;

    const result = await Result.findById(req.params.id);
    if (!result) {
      return next(new AppError('Result not found', 404));
    }

    const { grade, gradePoint } = calculateGrade(marks);
    const status = marks >= 40 ? 'passed' : 'failed';

    const updatedResult = await Result.findByIdAndUpdate(
      req.params.id,
      {
        marks,
        grade,
        gradePoint,
        status,
        remarks,
        approvedBy: req.user._id,
      },
      { new: true, runValidators: true },
    );

    // Update student CGPA
    await updateStudentCGPA(result.student);

    res.status(200).json({
      success: true,
      data: updatedResult,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update student CGPA
const updateStudentCGPA = async studentId => {
  const results = await Result.find({ student: studentId });
  const student = await Student.findById(studentId).populate('course');

  if (results.length > 0) {
    let totalCredits = 0;
    let totalGradePoints = 0;

    for (const result of results) {
      const course = await Course.findById(result.course);
      if (course) {
        totalCredits += course.credits;
        totalGradePoints += result.gradePoint * course.credits;
      }
    }

    const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    student.cgpa = parseFloat(cgpa.toFixed(2));
    await student.save();
  }
};
