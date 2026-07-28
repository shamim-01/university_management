import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { AppError } from '../utils/AppError.js';

class TeacherService {
  // Get all teachers
  async getTeachers(query) {
    try {
      console.log('📥 Service: Fetching teachers with query:', query);

      const { page = 1, limit = 10, search, department, designation } = query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (department) filter.department = department;
      if (designation) filter.designation = designation;

      if (search) {
        filter.$or = [
          { employeeId: { $regex: search, $options: 'i' } },
          { 'user.name': { $regex: search, $options: 'i' } },
          { 'user.email': { $regex: search, $options: 'i' } },
        ];
      }

      console.log('🔍 Filter:', JSON.stringify(filter));

      const teachers = await Teacher.find(filter)
        .populate('user', 'name email avatar phoneNumber')
        .populate('department', 'name code')
        .populate('courses', 'name code credits')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Teacher.countDocuments(filter);

      console.log('✅ Service: Teachers found:', teachers.length);
      console.log(
        '✅ Service: Teachers data:',
        JSON.stringify(teachers, null, 2),
      );

      return {
        teachers,
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

  // Get single teacher
  async getTeacher(teacherId) {
    try {
      console.log('📥 Service: Fetching teacher with ID:', teacherId);

      const teacher = await Teacher.findById(teacherId)
        .populate('user', 'name email avatar phoneNumber')
        .populate('department', 'name code')
        .populate('courses', 'name code credits');

      if (!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      console.log('✅ Service: Teacher found:', teacher);
      return teacher;
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // Create teacher
  async createTeacher(teacherData, file) {
    try {
      console.log('📝 Service: Creating teacher with data:', teacherData);

      const { email, name, password, ...data } = teacherData;

      let user = await User.findOne({ email });
      if (user) {
        throw new AppError('User already exists with this email', 400);
      }

      user = await User.create({
        name,
        email,
        password,
        role: 'teacher',
      });

      console.log('✅ User created:', user._id);

      const teacher = await Teacher.create({
        ...data,
        user: user._id,
      });

      console.log('✅ Teacher created:', teacher._id);

      const populatedTeacher = await Teacher.findById(teacher._id)
        .populate('user', 'name email avatar')
        .populate('department', 'name code');

      console.log('✅ Populated teacher:', populatedTeacher);
      return populatedTeacher;
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // Update teacher
  async updateTeacher(teacherId, updateData) {
    try {
      console.log('📝 Service: Updating teacher:', teacherId, updateData);

      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        updateData,
        { new: true, runValidators: true },
      )
        .populate('user', 'name email avatar')
        .populate('department', 'name code')
        .populate('courses', 'name code');

      console.log('✅ Teacher updated:', updatedTeacher);
      return updatedTeacher;
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // Delete teacher
  async deleteTeacher(teacherId) {
    try {
      console.log('🗑️ Service: Deleting teacher:', teacherId);

      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      await User.findByIdAndDelete(teacher.user);
      await teacher.deleteOne();

      console.log('✅ Teacher deleted:', teacherId);
      return { message: 'Teacher deleted successfully' };
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // Assign course to teacher
  async assignCourse(teacherId, courseId) {
    try {
      console.log(
        '📝 Service: Assigning course:',
        courseId,
        'to teacher:',
        teacherId,
      );

      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      const course = await Course.findById(courseId);
      if (!course) {
        throw new AppError('Course not found', 404);
      }

      if (!teacher.courses.includes(courseId)) {
        teacher.courses.push(courseId);
        await teacher.save();
      }

      course.teacher = teacher._id;
      await course.save();

      console.log('✅ Course assigned:', courseId);
      return { message: 'Course assigned successfully' };
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // Remove course from teacher
  async removeCourse(teacherId, courseId) {
    try {
      console.log(
        '📝 Service: Removing course:',
        courseId,
        'from teacher:',
        teacherId,
      );

      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      teacher.courses = teacher.courses.filter(c => c.toString() !== courseId);
      await teacher.save();

      await Course.findByIdAndUpdate(courseId, {
        $unset: { teacher: 1 },
      });

      console.log('✅ Course removed:', courseId);
      return { message: 'Course removed successfully' };
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }

  // Get teacher statistics
  async getTeacherStats() {
    try {
      console.log('📊 Service: Getting teacher statistics');

      const totalTeachers = await Teacher.countDocuments();
      const activeTeachers = await Teacher.countDocuments({ isActive: true });

      const designationStats = await Teacher.aggregate([
        {
          $group: {
            _id: '$designation',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            designation: '$_id',
            count: 1,
            _id: 0,
          },
        },
      ]);

      console.log('✅ Stats:', {
        totalTeachers,
        activeTeachers,
        designationStats,
      });

      return {
        totalTeachers,
        activeTeachers,
        designationStats,
      };
    } catch (error) {
      console.error('❌ Service Error:', error);
      throw error;
    }
  }
}

export default new TeacherService();
