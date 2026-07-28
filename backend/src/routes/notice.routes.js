import express from 'express';
import {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/notice.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

// ✅ সবাই দেখতে পারে
router.get('/', getNotices);
router.get('/:id', getNotice);

// ✅ Admin এবং Teacher Create/Update করতে পারে
router.post('/', restrictTo('admin', 'teacher'), createNotice);
router.put('/:id', restrictTo('admin', 'teacher'), updateNotice);

// ✅ শুধু Admin Delete করতে পারে
router.delete('/:id', restrictTo('admin'), deleteNotice);

export default router;
