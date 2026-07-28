import Course from '../models/Course.js';
import Department from '../models/Department.js';
import { AppError } from '../utils/AppError.js';

class CourseService {
  // Get all courses
  async getCourses(query) {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      semester,
      status,
    } = query;
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

    return {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get single course
  async getCourse(courseId) {
    const course = await Course.findById(courseId)
      .populate('department', 'name code')
      .populate('teacher', 'name email')
      .populate('students', 'studentId')
      .populate('prerequisites', 'name code');

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    return course;
  }

  // Create course
  async createCourse(courseData) {
    const course = await Course.create(courseData);

    // Add course to department
    await Department.findByIdAndUpdate(courseData.department, {
      $push: { courses: course._id },
    });

    return course;
  }

  // Update course
  async updateCourse(courseId, updateData) {
    const course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    return course;
  }

  // Delete course
  async deleteCourse(courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Remove from department
    await Department.findByIdAndUpdate(course.department, {
      $pull: { courses: course._id },
    });

    await course.deleteOne();

    return { message: 'Course deleted successfully' };
  }

  // Enroll student in course
  async enrollStudent(courseId, studentId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }

    return { message: 'Student enrolled successfully' };
  }

  // Get course statistics
  async getCourseStats() {
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ status: 'active' });
    const completedCourses = await Course.countDocuments({
      status: 'completed',
    });

    const departmentWiseCourses = await Course.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department',
        },
      },
      {
        $project: {
          departmentName: { $arrayElemAt: ['$department.name', 0] },
          count: 1,
        },
      },
    ]);

    return {
      totalCourses,
      activeCourses,
      completedCourses,
      departmentWiseCourses,
    };
  }
}

export default new CourseService();
