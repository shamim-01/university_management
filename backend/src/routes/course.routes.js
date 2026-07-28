import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
} from '../controllers/course.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

// ✅ সবাই দেখতে পারে
router.get('/', getCourses);
router.get('/:id', getCourse);

// ✅ শুধু Admin Create/Update/Delete করতে পারে
router.post('/', restrictTo('admin'), createCourse);
router.put('/:id', restrictTo('admin'), updateCourse);
router.delete('/:id', restrictTo('admin'), deleteCourse);

// ✅ Admin এবং Teacher Enroll করতে পারে
router.post('/:id/enroll', restrictTo('admin', 'teacher'), enrollStudent);

export default router;
