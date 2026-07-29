import Result from '../models/Result.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import { AppError } from '../utils/AppError.js';

class ResultService {
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

  async updateStudentCGPA(studentId) {
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
  }

  async addResult(resultData, userId) {
    try {
      console.log('📝 Adding result:', resultData);

      const { student, course, semester, marks, remarks } = resultData;

      const existingResult = await Result.findOne({
        student,
        course,
        semester,
      });
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

      await this.updateStudentCGPA(student);

      console.log('✅ Result added:', result);
      return result;
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // ✅ Optimized Search - Faster & Better
  async getResultsByStudent(studentId, query) {
    try {
      console.log('📥 Fetching results for student:', studentId);

      const { semester, search } = query || {};
      const filter = { student: studentId };
      if (semester) filter.semester = parseInt(semester);

      // Get results
      const results = await Result.find(filter).sort({ semester: -1 });

      if (results.length === 0) {
        return {
          results: [],
          summary: {
            totalCourses: 0,
            passed: 0,
            failed: 0,
            cgpa: '0.00',
          },
        };
      }

      // ✅ Smart Course Fetch (একবারে সব Course ID নিন)
      const courseIds = [...new Set(results.map(r => r.course.toString()))];
      const courses = await Course.find({ _id: { $in: courseIds } }).select(
        'name code credits',
      );
      const courseMap = {};
      courses.forEach(c => {
        courseMap[c._id.toString()] = c;
      });

      // Format results
      const formattedResults = results.map(result => {
        const course = courseMap[result.course.toString()];
        return {
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
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        };
      });

      // ✅ Search Filter
      let filteredResults = formattedResults;
      if (search && search.trim()) {
        const searchLower = search.toLowerCase().trim();
        filteredResults = formattedResults.filter(r => {
          const courseName = r.course?.name?.toLowerCase() || '';
          const courseCode = r.course?.code?.toLowerCase() || '';
          const grade = r.grade?.toLowerCase() || '';
          const status = r.status?.toLowerCase() || '';
          const semesterStr = r.semester?.toString() || '';
          const marksStr = r.marks?.toString() || '';

          return (
            courseName.includes(searchLower) ||
            courseCode.includes(searchLower) ||
            grade.includes(searchLower) ||
            status.includes(searchLower) ||
            semesterStr.includes(searchLower) ||
            marksStr.includes(searchLower)
          );
        });
        console.log(
          '🔍 Search term:',
          search,
          'Filtered:',
          filteredResults.length,
        );
      }

      // Summary
      let totalCredits = 0;
      let totalGradePoints = 0;
      for (const r of filteredResults) {
        if (r.course && r.course.credits) {
          totalCredits += r.course.credits;
          totalGradePoints += r.gradePoint * r.course.credits;
        }
      }
      const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

      return {
        results: filteredResults,
        summary: {
          totalCourses: filteredResults.length,
          passed: filteredResults.filter(r => r.status === 'passed').length,
          failed: filteredResults.filter(r => r.status === 'failed').length,
          cgpa: cgpa.toFixed(2),
        },
      };
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  async getResultsByCourse(courseId, query) {
    try {
      const { semester } = query;
      const filter = { course: courseId };
      if (semester) filter.semester = parseInt(semester);

      const results = await Result.find(filter).sort({ marks: -1 });

      const studentIds = [...new Set(results.map(r => r.student.toString()))];
      const students = await Student.find({ _id: { $in: studentIds } }).select(
        'studentId',
      );
      const studentMap = {};
      students.forEach(s => {
        studentMap[s._id.toString()] = s;
      });

      const formattedResults = results.map(result => {
        const student = studentMap[result.student.toString()];
        return {
          ...result._doc,
          student: student || { studentId: 'N/A' },
        };
      });

      return formattedResults;
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  async updateResult(resultId, updateData, userId) {
    try {
      console.log('📝 Updating result:', resultId);

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

      await this.updateStudentCGPA(result.student);

      console.log('✅ Result updated:', updatedResult);
      return updatedResult;
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }
}

export default new ResultService();
