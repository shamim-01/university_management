import express from 'express';
import {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  assignCourse,
  removeCourse,
} from '../controllers/teacher.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';

const router = express.Router();

// ✅ সব Route Protected (Login Required)
router.use(protect);

// ✅ সবাই দেখতে পারে (Student, Teacher, Admin)
router.get('/', getTeachers);
router.get('/:id', getTeacher);

// ✅ শুধু Admin Create/Update/Delete করতে পারে
router.post('/', restrictTo('admin'), uploadSingle('avatar'), createTeacher);
router.put('/:id', restrictTo('admin'), updateTeacher);
router.delete('/:id', restrictTo('admin'), deleteTeacher);
router.post('/:id/assign-course', restrictTo('admin'), assignCourse);
router.delete(
  '/:id/remove-course/:courseId',
  restrictTo('admin'),
  removeCourse,
);

export default router;
