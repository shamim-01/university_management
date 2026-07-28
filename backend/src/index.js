import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import mongoose from 'mongoose';
import routes from './routes/index.js';

// ✅ Models Import করুন (সব Model রেজিস্টার করার জন্য)
import './models/User.js';
import './models/Student.js';
import './models/Teacher.js';
import './models/Department.js';
import './models/Course.js';
import './models/Attendance.js';
import './models/Result.js';
import './models/Notice.js';
import './models/Message.js';

dotenv.config();

// ... বাকি কোড

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============ API Routes ============
app.use('/api', routes); // ← এইটা যোগ করুন (সব API Routes)

// ============ Test Routes ============
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'University Management System API',
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
    databaseName: mongoose.connection.name || 'Not Connected',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 University Management System API`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
