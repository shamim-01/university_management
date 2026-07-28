import express from 'express';
import {
  addResult,
  getResultsByStudent,
  getResultsByCourse,
  updateResult,
} from '../controllers/result.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

// ✅ Admin এবং Teacher Add/Update করতে পারে
router.post('/', restrictTo('admin', 'teacher'), addResult);
router.put('/:id', restrictTo('admin', 'teacher'), updateResult);

// ✅ সবাই দেখতে পারে
router.get('/student/:studentId', getResultsByStudent);
router.get(
  '/course/:courseId',
  restrictTo('admin', 'teacher'),
  getResultsByCourse,
);

export default router;
