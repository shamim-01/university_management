import express from 'express';
import {
  markAttendance,
  getAttendanceByCourse,
  getAttendanceByStudent,
  updateAttendance,
} from '../controllers/attendance.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

// ✅ সবাই দেখতে পারে
router.get('/course/:courseId', getAttendanceByCourse);
router.get('/student/:studentId', getAttendanceByStudent);

// ✅ Admin এবং Teacher Mark/Update করতে পারে
router.post('/', restrictTo('admin', 'teacher'), markAttendance);
router.put('/:id', restrictTo('admin', 'teacher'), updateAttendance);

export default router;
