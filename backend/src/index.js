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

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ✅ Updated CORS Configuration - Production Ready
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://university-management-ruddy.vercel.app',
  'https://your-frontend-domain.vercel.app', // আপনার Frontend URL
];

// অথবা Environment Variable থেকে নিন
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is allowed
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin === allowedOrigin ||
        process.env.NODE_ENV === 'development'
      ) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked for origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============ API Routes ============
app.use('/api', routes);

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
