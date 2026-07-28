import Result from '../models/Result.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import { AppError } from '../utils/AppError.js';

class ResultService {
  // Calculate grade
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

  // Add result
  async addResult(resultData, userId) {
    try {
      console.log('📝 Service: Adding result:', resultData);

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

      console.log('✅ Service: Result added:', result);
      return result;
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // ✅ Get results by student - WITH SEARCH
  async getResultsByStudent(studentId, query) {
    try {
      console.log('📥 Service: Fetching results for student:', studentId);
      console.log('📥 Query:', query);

      const { semester, search } = query;
      const filter = { student: studentId };
      if (semester) filter.semester = parseInt(semester);

      // ✅ সরাসরি Result find করুন
      const results = await Result.find(filter).sort({ semester: -1 });

      // ✅ প্রতিটি result এর জন্য course আলাদাভাবে fetch করুন
      const resultsWithCourses = await Promise.all(
        results.map(async result => {
          let courseData = null;
          try {
            courseData = await Course.findById(result.course).select(
              'name code credits',
            );
          } catch (err) {
            console.error('Course fetch error:', err);
          }
          return {
            ...result._doc,
            course: courseData || {
              name: 'Course not found',
              code: 'N/A',
              credits: 0,
            },
          };
        }),
      );

      // ✅ SEARCH FILTER (যদি search থাকে)
      let filteredResults = resultsWithCourses;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredResults = resultsWithCourses.filter(r => {
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
        console.log('🔍 Search term:', search);
        console.log('🔍 Filtered results:', filteredResults.length);
      }

      console.log('✅ Service: Results found:', filteredResults.length);

      // Calculate summary
      const totalCredits = filteredResults.reduce(
        (sum, r) => sum + (r.course?.credits || 0),
        0,
      );
      const totalGradePoints = filteredResults.reduce(
        (sum, r) => sum + r.gradePoint * (r.course?.credits || 0),
        0,
      );
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

  // Get results by course
  async getResultsByCourse(courseId, query) {
    try {
      const { semester } = query;
      const filter = { course: courseId };
      if (semester) filter.semester = parseInt(semester);

      const results = await Result.find(filter).sort({ marks: -1 });

      // ✅ Student info populate
      const resultsWithStudents = await Promise.all(
        results.map(async result => {
          const studentData = await Student.findById(result.student).select(
            'studentId',
          );
          return {
            ...result._doc,
            student: studentData || { studentId: 'N/A' },
          };
        }),
      );

      return resultsWithStudents;
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // Update result
  async updateResult(resultId, updateData, userId) {
    try {
      console.log('📝 Service: Updating result:', resultId);
      console.log('📝 Service: Update data:', updateData);

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

      console.log('✅ Service: Result updated:', updatedResult);
      return updatedResult;
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }
}

export default new ResultService();
