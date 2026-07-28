import Attendance from '../models/Attendance.js';
import { AppError } from '../utils/AppError.js';

class AttendanceService {
  // Mark attendance
  async markAttendance(attendanceData, userId) {
    const { course, student, date, status, remarks } = attendanceData;

    // Check if attendance already marked
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

  // Get attendance by course
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
      .populate('course', 'name code')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    return attendance;
  }

  // Get attendance by student
  async getAttendanceByStudent(studentId, query) {
    const { course, semester } = query;

    const filter = { student: studentId };
    if (course) filter.course = course;

    const attendance = await Attendance.find(filter)
      .populate('course', 'name code credits')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    // Calculate attendance percentage
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(
      a => a.status === 'present',
    ).length;
    const attendancePercentage =
      totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

    return {
      attendance,
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

  // Update attendance
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

  // Get attendance statistics
  async getAttendanceStats(courseId) {
    const totalRecords = await Attendance.countDocuments({ course: courseId });

    const statusStats = await Attendance.aggregate([
      {
        $match: { course: courseId },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const dailyStats = await Attendance.aggregate([
      {
        $match: { course: courseId },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return {
      totalRecords,
      statusStats,
      dailyStats,
    };
  }
}

export default new AttendanceService();
