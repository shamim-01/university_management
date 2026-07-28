import Student from '../models/Student.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

class StudentService {
  // Get all students with pagination, search, filter
  async getStudents(query) {
    try {
      console.log('📥 Service: Fetching students with query:', query);

      const {
        page = 1,
        limit = 10,
        search,
        department,
        semester,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = query;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Build filter
      const filter = {};
      if (department) filter.department = department;
      if (semester) filter.semester = parseInt(semester);
      if (status) filter.status = status;

      // Search filter
      if (search) {
        filter.$or = [
          { studentId: { $regex: search, $options: 'i' } },
          { 'user.name': { $regex: search, $options: 'i' } },
          { 'user.email': { $regex: search, $options: 'i' } },
        ];
      }

      console.log('🔍 Filter:', filter);

      const students = await Student.find(filter)
        .populate('user', 'name email avatar phoneNumber')
        .populate('department', 'name code')
        .populate('courses.course', 'name code credits')
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sort);

      const total = await Student.countDocuments(filter);

      console.log('✅ Service: Students found:', students.length);

      return {
        data: students,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // Get single student
  async getStudent(studentId) {
    const student = await Student.findById(studentId)
      .populate('user', 'name email avatar phoneNumber')
      .populate('department', 'name code')
      .populate('courses.course', 'name code credits');

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    return student;
  }

  // Create student
  async createStudent(studentData, file) {
    const { email, name, password, ...data } = studentData;

    let user = await User.findOne({ email });
    if (user) {
      throw new AppError('User already exists with this email', 400);
    }

    user = await User.create({
      name,
      email,
      password,
      role: 'student',
    });

    const student = await Student.create({
      ...data,
      user: user._id,
    });

    const populatedStudent = await Student.findById(student._id)
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    return populatedStudent;
  }

  // Update student
  async updateStudent(studentId, updateData) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student not found', 404);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true },
    )
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    return updatedStudent;
  }

  // Delete student
  async deleteStudent(studentId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student not found', 404);
    }

    await User.findByIdAndDelete(student.user);
    await student.deleteOne();

    return { message: 'Student deleted successfully' };
  }

  // Upload student avatar - temporary
  async uploadAvatar(studentId, file) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student not found', 404);
    }

    if (!file) {
      throw new AppError('Please upload an image', 400);
    }

    return { avatar: 'https://via.placeholder.com/500' };
  }

  // Get student statistics
  async getStudentStats() {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });
    const graduatedStudents = await Student.countDocuments({
      status: 'graduated',
    });

    const departmentStats = await Student.aggregate([
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
      totalStudents,
      activeStudents,
      graduatedStudents,
      departmentStats,
    };
  }
}

export default new StudentService();
