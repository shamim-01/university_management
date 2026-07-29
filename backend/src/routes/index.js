import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import studentRoutes from './student.routes.js';
import teacherRoutes from './teacher.routes.js';
import departmentRoutes from './department.routes.js';
import courseRoutes from './course.routes.js';
import attendanceRoutes from './attendance.routes.js';
import resultRoutes from './result.routes.js';
import noticeRoutes from './notice.routes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/departments', departmentRoutes);
router.use('/courses', courseRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/results', resultRoutes);
router.use('/notices', noticeRoutes);

export default router;
