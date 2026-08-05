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

router.use(protect);

router.get('/', getStudents);
router.get('/:id', getStudent);

router.post(
  '/',
  restrictTo('admin', 'teacher'),
  uploadSingle('avatar'),
  createStudent,
);

router.put('/:id', restrictTo('admin'), updateStudent);
router.delete('/:id', restrictTo('admin'), deleteStudent);
router.post(
  '/:id/avatar',
  restrictTo('admin'),
  uploadSingle('avatar'),
  uploadAvatar,
);

export default router;
