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

// Update student CGPA
const updateStudentCGPA = async studentId => {
  try {
    const results = await Result.find({ student: studentId });
    const student = await Student.findById(studentId);

    if (results.length > 0 && student) {
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
  } catch (error) {
    console.error('❌ Update CGPA Error:', error);
  }
};

// @desc    Add result
// @route   POST /api/results
// @access  Private/Teacher
export const addResult = async (req, res, next) => {
  try {
    console.log('📝 Adding result:', req.body);

    const { student, course, semester, marks, remarks } = req.body;

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

    await updateStudentCGPA(student);

    console.log('✅ Result added:', result);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Add Result Error:', error);
    next(error);
  }
};

// ✅ Get ALL results OR specific student
export const getResultsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { semester, search } = req.query;

    console.log('📥 Fetching results...');
    console.log('📍 Student ID:', studentId || 'ALL');
    console.log('🔍 Search term:', search || 'No search');

    // Build filter - 'all' হলে সব Student, নাহলে নির্দিষ্ট Student
    const filter = {};
    if (studentId && studentId !== 'all' && studentId !== 'undefined') {
      filter.student = studentId;
    }

    const results = await Result.find(filter).sort({ semester: -1 });

    console.log(`📊 Total results in DB: ${results.length}`);

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          results: [],
          summary: {
            totalCourses: 0,
            passed: 0,
            failed: 0,
            cgpa: '0.00',
          },
        },
      });
    }

    // Fetch all courses
    const courseIds = [...new Set(results.map(r => r.course.toString()))];
    const courses = await Course.find({ _id: { $in: courseIds } }).select(
      'name code credits',
    );
    const courseMap = {};
    courses.forEach(c => {
      courseMap[c._id.toString()] = c;
    });

    // Get student info with user details
    const studentIds = [...new Set(results.map(r => r.student.toString()))];
    const students = await Student.find({ _id: { $in: studentIds } })
      .populate('user', 'name email')
      .select('studentId user');
    const studentMap = {};
    students.forEach(s => {
      studentMap[s._id.toString()] = s;
    });

    // Format all results
    const formattedResults = results.map(result => {
      const course = courseMap[result.course.toString()];
      const student = studentMap[result.student.toString()];
      return {
        _id: result._id,
        student: student || { studentId: 'N/A', user: { name: 'Unknown' } },
        course: course || { name: 'N/A', code: 'N/A', credits: 0 },
        semester: result.semester,
        marks: result.marks,
        grade: result.grade,
        gradePoint: result.gradePoint,
        status: result.status,
        remarks: result.remarks || '',
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
    });

    // SEARCH FILTER
    let filteredResults = formattedResults;

    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      const searchTerms = searchLower
        .split(' ')
        .filter(term => term.length > 0);

      filteredResults = formattedResults.filter(r => {
        const searchableFields = [
          (r.course?.name || '').toLowerCase(),
          (r.course?.code || '').toLowerCase(),
          (r.grade || '').toLowerCase(),
          (r.status || '').toLowerCase(),
          r.semester?.toString() || '',
          r.marks?.toString() || '',
          (r.remarks || '').toLowerCase(),
          (r.student?.user?.name || '').toLowerCase(),
          (r.student?.studentId || '').toLowerCase(),
        ];

        for (const field of searchableFields) {
          for (const term of searchTerms) {
            if (field.includes(term)) {
              return true;
            }
          }
        }
        return false;
      });

      console.log(
        `🔍 Filtered: ${filteredResults.length} out of ${formattedResults.length}`,
      );
    }

    // Calculate summary
    let totalCredits = 0;
    let totalGradePoints = 0;
    for (const r of filteredResults) {
      if (r.course && r.course.credits) {
        totalCredits += r.course.credits;
        totalGradePoints += r.gradePoint * r.course.credits;
      }
    }
    const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    res.status(200).json({
      success: true,
      data: {
        results: filteredResults,
        summary: {
          totalCourses: filteredResults.length,
          passed: filteredResults.filter(r => r.status === 'passed').length,
          failed: filteredResults.filter(r => r.status === 'failed').length,
          cgpa: cgpa.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error('❌ Get Results Error:', error);
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

    console.log('📥 Fetching results for course:', courseId);

    const filter = { course: courseId };
    if (semester) filter.semester = parseInt(semester);

    const results = await Result.find(filter).sort({ marks: -1 });

    const studentIds = [...new Set(results.map(r => r.student.toString()))];
    const students = await Student.find({ _id: { $in: studentIds } })
      .populate('user', 'name')
      .select('studentId user');
    const studentMap = {};
    students.forEach(s => {
      studentMap[s._id.toString()] = s;
    });

    const formattedResults = results.map(result => {
      const student = studentMap[result.student.toString()];
      return {
        ...result._doc,
        student: student || { studentId: 'N/A', user: { name: 'Unknown' } },
      };
    });

    console.log('✅ Results found:', formattedResults.length);

    res.status(200).json({
      success: true,
      data: formattedResults,
    });
  } catch (error) {
    console.error('❌ Get Results By Course Error:', error);
    next(error);
  }
};

// @desc    Update result
// @route   PUT /api/results/:id
// @access  Private/Teacher
export const updateResult = async (req, res, next) => {
  try {
    const { marks, remarks } = req.body;

    console.log('📝 Updating result:', req.params.id);
    console.log('📝 New marks:', marks);

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

    await updateStudentCGPA(result.student);

    console.log('✅ Result updated:', updatedResult);

    res.status(200).json({
      success: true,
      data: updatedResult,
    });
  } catch (error) {
    console.error('❌ Update Result Error:', error);
    next(error);
  }
};

// @desc    Delete result
// @route   DELETE /api/results/:id
// @access  Private/Admin
export const deleteResult = async (req, res, next) => {
  try {
    console.log('🗑️ Deleting result:', req.params.id);

    const result = await Result.findById(req.params.id);
    if (!result) {
      return next(new AppError('Result not found', 404));
    }

    const studentId = result.student;
    await result.deleteOne();

    await updateStudentCGPA(studentId);

    console.log('✅ Result deleted:', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Result deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete Result Error:', error);
    next(error);
  }
};

// @desc    Get result statistics
// @route   GET /api/results/stats
// @access  Private/Admin
export const getResultStats = async (req, res, next) => {
  try {
    console.log('📊 Getting result statistics');

    const totalResults = await Result.countDocuments();
    const passedResults = await Result.countDocuments({ status: 'passed' });
    const failedResults = await Result.countDocuments({ status: 'failed' });

    const gradeDistribution = await Result.aggregate([
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const semesterStats = await Result.aggregate([
      {
        $group: {
          _id: '$semester',
          count: { $sum: 1 },
          avgMarks: { $avg: '$marks' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalResults,
        passedResults,
        failedResults,
        passRate:
          totalResults > 0
            ? ((passedResults / totalResults) * 100).toFixed(2)
            : 0,
        gradeDistribution,
        semesterStats,
      },
    });
  } catch (error) {
    console.error('❌ Get Result Stats Error:', error);
    next(error);
  }
};

// @desc    Get Result Dashboard Data
// @route   GET /api/results/dashboard
// @access  Private/Admin
export const getResultDashboard = async (req, res, next) => {
  try {
    console.log('📊 Getting Result Dashboard...');

    const totalResults = await Result.countDocuments();
    const passedResults = await Result.countDocuments({ status: 'passed' });
    const failedResults = await Result.countDocuments({ status: 'failed' });
    const passRate =
      totalResults > 0 ? ((passedResults / totalResults) * 100).toFixed(1) : 0;

    const gradeDistribution = await Result.aggregate([
      { $group: { _id: '$grade', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const deptPerformance = await Result.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseData',
        },
      },
      { $unwind: '$courseData' },
      {
        $lookup: {
          from: 'departments',
          localField: 'courseData.department',
          foreignField: '_id',
          as: 'deptData',
        },
      },
      { $unwind: '$deptData' },
      {
        $group: {
          _id: '$deptData.code',
          deptName: { $first: '$deptData.name' },
          total: { $sum: 1 },
          passed: { $sum: { $cond: [{ $eq: ['$status', 'passed'] }, 1, 0] } },
          avgMarks: { $avg: '$marks' },
        },
      },
      {
        $project: {
          deptName: 1,
          total: 1,
          passed: 1,
          failed: { $subtract: ['$total', '$passed'] },
          avgMarks: { $round: ['$avgMarks', 1] },
          passRate: { $multiply: [{ $divide: ['$passed', '$total'] }, 100] },
        },
      },
    ]);

    const recentResults = await Result.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('student', 'studentId')
      .populate('course', 'name code');

    const semesterStats = await Result.aggregate([
      {
        $group: {
          _id: '$semester',
          count: { $sum: 1 },
          avgMarks: { $avg: '$marks' },
          passed: { $sum: { $cond: [{ $eq: ['$status', 'passed'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalResults,
          passedResults,
          failedResults,
          passRate: parseFloat(passRate),
        },
        gradeDistribution,
        deptPerformance,
        recentResults,
        semesterStats,
      },
    });
  } catch (error) {
    console.error('❌ Dashboard Error:', error);
    next(error);
  }
};
