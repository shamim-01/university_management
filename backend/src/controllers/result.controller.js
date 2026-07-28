import Result from '../models/Result.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
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

// ✅ Get results by student - WITH SEARCH
export const getResultsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { semester, search } = req.query;

    console.log('📥 Fetching results for student:', studentId);
    console.log('📥 Search term:', search || 'No search');

    const filter = { student: studentId };
    if (semester) filter.semester = parseInt(semester);

    // NO POPULATE - Direct find
    const results = await Result.find(filter).sort({ semester: -1 });

    // Course info আলাদাভাবে fetch
    const formattedResults = [];
    for (const result of results) {
      try {
        const course = await Course.findById(result.course).select(
          'name code credits',
        );
        const approvedBy = await User.findById(result.approvedBy).select(
          'name',
        );

        formattedResults.push({
          _id: result._id,
          student: result.student,
          course: course || {
            name: 'Course not found',
            code: 'N/A',
            credits: 0,
          },
          semester: result.semester,
          marks: result.marks,
          grade: result.grade,
          gradePoint: result.gradePoint,
          status: result.status,
          remarks: result.remarks,
          approvedBy: approvedBy || null,
          isPublished: result.isPublished,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        });
      } catch (err) {
        console.error('Course fetch error for result:', result._id);
        formattedResults.push({
          ...result._doc,
          course: { name: 'Course not found', code: 'N/A', credits: 0 },
        });
      }
    }

    // ✅ SEARCH FILTER (Result এর মধ্যে Search)
    let filteredResults = formattedResults;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredResults = formattedResults.filter(r => {
        const courseName = r.course?.name?.toLowerCase() || '';
        const courseCode = r.course?.code?.toLowerCase() || '';
        const grade = r.grade?.toLowerCase() || '';
        const status = r.status?.toLowerCase() || '';

        return (
          courseName.includes(searchLower) ||
          courseCode.includes(searchLower) ||
          grade.includes(searchLower) ||
          status.includes(searchLower) ||
          r.semester.toString().includes(searchLower) ||
          r.marks.toString().includes(searchLower)
        );
      });
      console.log('🔍 Filtered results count:', filteredResults.length);
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

    console.log('✅ Final results count:', filteredResults.length);

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

    // Student info আলাদাভাবে fetch
    const formattedResults = [];
    for (const result of results) {
      try {
        const student = await Student.findById(result.student).select(
          'studentId',
        );
        formattedResults.push({
          ...result._doc,
          student: student || { studentId: 'N/A' },
        });
      } catch (err) {
        formattedResults.push(result._doc);
      }
    }

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

    // Update student CGPA
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
