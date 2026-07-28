import express from 'express';
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadAvatar,
} from '../controllers/student.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';

const router = express.Router();

// ✅ সব Route Protected (Login Required)
router.use(protect);

// ✅ সবাই দেখতে পারে (Student, Teacher, Admin) - restrictTo সরানো হয়েছে
router.get('/', getStudents);
router.get('/:id', getStudent);

// ✅ শুধু Admin এবং Teacher Create করতে পারে
router.post(
  '/',
  restrictTo('admin', 'teacher'),
  uploadSingle('avatar'),
  createStudent,
);

// ✅ শুধু Admin Update/Delete করতে পারে
router.put('/:id', restrictTo('admin'), updateStudent);
router.delete('/:id', restrictTo('admin'), deleteStudent);
router.post(
  '/:id/avatar',
  restrictTo('admin'),
  uploadSingle('avatar'),
  uploadAvatar,
);

export default router;
