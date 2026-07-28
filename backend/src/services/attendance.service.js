import Attendance from '../models/Attendance.js';
import Course from '../models/Course.js';
import { AppError } from '../utils/AppError.js';

class AttendanceService {
  async markAttendance(attendanceData, userId) {
    const { course, student, date, status, remarks } = attendanceData;

    const existingAttendance = await Attendance.findOne({
      course,
      student,
      date: new Date(date),
    });

    if (existingAttendance) {
      throw new AppError(
        'Attendance already marked for this student on this date',
        400,
      );
    }

    const attendance = await Attendance.create({
      course,
      student,
      date,
      status,
      remarks,
      markedBy: userId,
    });

    return attendance;
  }

  async getAttendanceByCourse(courseId, query) {
    const { startDate, endDate, status } = query;

    const filter = { course: courseId };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (status) filter.status = status;

    const attendance = await Attendance.find(filter)
      .populate('student', 'studentId')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    const course = await Course.findById(courseId).select('name code');

    return {
      attendance,
      course: course || null,
    };
  }

  async getAttendanceByStudent(studentId, query) {
    const { course, semester } = query;

    const filter = { student: studentId };
    if (course) filter.course = course;

    const attendance = await Attendance.find(filter)
      .populate('markedBy', 'name')
      .sort({ date: -1 });

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

    return {
      attendance: attendanceWithCourses,
      summary: {
        totalClasses,
        present: presentClasses,
        absent: attendance.filter(a => a.status === 'absent').length,
        late: attendance.filter(a => a.status === 'late').length,
        excused: attendance.filter(a => a.status === 'excused').length,
        percentage: attendancePercentage.toFixed(2),
      },
    };
  }

  async updateAttendance(attendanceId, updateData) {
    const attendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      updateData,
      { new: true, runValidators: true },
    );

    if (!attendance) {
      throw new AppError('Attendance record not found', 404);
    }

    return attendance;
  }
}

export default new AttendanceService();
