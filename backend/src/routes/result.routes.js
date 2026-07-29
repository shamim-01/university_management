// routes/result.routes.js
import express from 'express';
import {
  addResult,
  getResultsByStudent,
  getResultsByCourse,
  updateResult,
  deleteResult,
  getResultDashboard, // ✅ ইম্পোর্ট করা আছে?
} from '../controllers/result.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

console.log('🔄 Setting up result routes...');

// ✅ PUBLIC TEST ROUTE
router.get('/ping', (req, res) => {
  console.log('✅ Ping route accessed!');
  res.json({
    success: true,
    message: 'Result routes are working!',
    timestamp: new Date().toISOString(),
  });
});

// ✅ PUBLIC DASHBOARD (টেস্ট এর জন্য - Authentication লাগবে না)
router.get('/public-dashboard', getResultDashboard);

// ✅ PROTECTED DASHBOARD (Authentication লাগবে)
router.get(
  '/dashboard',
  protect,
  restrictTo('admin', 'teacher'),
  getResultDashboard,
);

// ✅ অন্যান্য routes
router.get('/all', protect, getResultsByStudent);
router.get('/student/:studentId', protect, getResultsByStudent);
router.get(
  '/course/:courseId',
  protect,
  restrictTo('admin', 'teacher'),
  getResultsByCourse,
);
router.post('/', protect, restrictTo('admin', 'teacher'), addResult);
router.put('/:id', protect, restrictTo('admin', 'teacher'), updateResult);
router.delete('/:id', protect, restrictTo('admin'), deleteResult);

console.log('✅ Result routes initialized');

export default router;
