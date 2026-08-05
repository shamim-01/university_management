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

router.get('/course/:courseId', getAttendanceByCourse);
router.get('/student/:studentId', getAttendanceByStudent);

router.post('/', restrictTo('admin', 'teacher'), markAttendance);
router.put('/:id', restrictTo('admin', 'teacher'), updateAttendance);

export default router;
