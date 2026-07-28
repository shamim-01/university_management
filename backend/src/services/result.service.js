import Result from '../models/Result.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import { AppError } from '../utils/AppError.js';

class ResultService {
  // Calculate grade and grade point
  calculateGrade(marks) {
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
  }

  // Update student CGPA
  async updateStudentCGPA(studentId) {
    const results = await Result.find({ student: studentId });
    const student = await Student.findById(studentId);

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
  }

  // Add result
  async addResult(resultData, userId) {
    const { student, course, semester, marks, remarks } = resultData;

    // Check if result exists
    const existingResult = await Result.findOne({ student, course, semester });
    if (existingResult) {
      throw new AppError(
        'Result already exists for this student in this course',
        400,
      );
    }

    const { grade, gradePoint } = this.calculateGrade(marks);
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
      approvedBy: userId,
      isPublished: true,
    });

    // Update student CGPA
    await this.updateStudentCGPA(student);

    return result;
  }

  // Get results by student
  async getResultsByStudent(studentId, query) {
    const { semester } = query;

    const filter = { student: studentId };
    if (semester) filter.semester = parseInt(semester);

    const results = await Result.find(filter)
      .populate('course', 'name code credits')
      .populate('approvedBy', 'name')
      .sort({ semester: -1 });

    // Calculate summary
    const totalCredits = results.reduce(
      (sum, r) => sum + (r.course?.credits || 0),
      0,
    );
    const totalGradePoints = results.reduce(
      (sum, r) => sum + r.gradePoint * (r.course?.credits || 0),
      0,
    );
    const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    return {
      results,
      summary: {
        totalCourses: results.length,
        passed: results.filter(r => r.status === 'passed').length,
        failed: results.filter(r => r.status === 'failed').length,
        cgpa: cgpa.toFixed(2),
      },
    };
  }

  // Get results by course
  async getResultsByCourse(courseId, query) {
    const { semester } = query;

    const filter = { course: courseId };
    if (semester) filter.semester = parseInt(semester);

    const results = await Result.find(filter)
      .populate('student', 'studentId')
      .populate('approvedBy', 'name')
      .sort({ marks: -1 });

    return results;
  }

  // Update result
  async updateResult(resultId, updateData, userId) {
    const { marks, remarks } = updateData;

    const result = await Result.findById(resultId);
    if (!result) {
      throw new AppError('Result not found', 404);
    }

    const { grade, gradePoint } = this.calculateGrade(marks);
    const status = marks >= 40 ? 'passed' : 'failed';

    const updatedResult = await Result.findByIdAndUpdate(
      resultId,
      {
        marks,
        grade,
        gradePoint,
        status,
        remarks,
        approvedBy: userId,
      },
      { new: true, runValidators: true },
    );

    // Update student CGPA
    await this.updateStudentCGPA(result.student);

    return updatedResult;
  }

  // Get result statistics
  async getResultStats() {
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

    return {
      totalResults,
      passedResults,
      failedResults,
      passPercentage:
        totalResults > 0
          ? ((passedResults / totalResults) * 100).toFixed(2)
          : 0,
      gradeDistribution,
    };
  }
}

export default new ResultService();
