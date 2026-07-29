```markdown
# 🎓 University Management System

<div align="center">

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

### A Complete Production-Ready University Management Platform

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-4F46E5?style=for-the-badge&logo=vercel)](https://university-management-ruddy.vercel.app)

</div>

---

## 📌 About

A comprehensive **University Management System** built with the MERN Stack. Features role-based access control for **Admin**, **Teachers**, and **Students** with a modern, responsive dashboard UI.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **👑 Admin** | `admin@university.com` | `admin123` |
| **👨‍🏫 Teacher** | `teacher@university.com` | `teacher123` |
| **👨‍🎓 Student** | `student@university.com` | `student123` |

> **Note:** You can also register a new account from the register page.

---

## ✨ Features

### 👑 Admin Features
- 📊 **Dashboard** - Real-time analytics, charts, statistics
- 👥 **Student Management** - CRUD, search & filter
- 👨‍🏫 **Teacher Management** - Assign courses & departments
- 🏛️ **Department Management** - Complete CRUD operations
- 📚 **Course Management** - Create, update, delete courses
- 📋 **Attendance Management** - Mark attendance, view history
- 📝 **Result Management** - Add marks, calculate GPA & CGPA
- 📢 **Notice Management** - Publish and manage notices
- 📈 **Analytics** - Performance metrics & insights

### 👨‍🏫 Teacher Features
- 📊 Dashboard with assigned courses
- 👥 Student list management
- ✅ Take attendance
- 📝 Upload results
- 📢 Publish notices
- 👤 Profile management

### 👨‍🎓 Student Features
- 📊 Personal dashboard
- 👤 View profile
- ✅ Check attendance
- 📝 View results with CGPA
- 📢 Browse notices
- ✏️ Update profile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
|------------|-------------|
| **React 19** | UI Library |
| **React Router** | Navigation |
| **Tailwind CSS** | Styling |
| **Axios** | API calls |
| **Context API** | State management |
| **Heroicons** | Icons |

### Backend
| Technology | Description |
|------------|-------------|
| **Node.js** | Runtime |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |

---

## 📁 Project Structure

```
university-management-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── student.controller.js
│   │   │   ├── teacher.controller.js
│   │   │   ├── course.controller.js
│   │   │   ├── department.controller.js
│   │   │   ├── result.controller.js
│   │   │   ├── attendance.controller.js
│   │   │   └── notice.controller.js
│   │   ├── models/         # Database models
│   │   │   ├── User.js
│   │   │   ├── Student.js
│   │   │   ├── Teacher.js
│   │   │   ├── Course.js
│   │   │   ├── Department.js
│   │   │   ├── Result.js
│   │   │   ├── Attendance.js
│   │   │   └── Notice.js
│   │   ├── routes/         # API routes
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── student.routes.js
│   │   │   ├── teacher.routes.js
│   │   │   ├── course.routes.js
│   │   │   ├── department.routes.js
│   │   │   ├── result.routes.js
│   │   │   ├── attendance.routes.js
│   │   │   └── notice.routes.js
│   │   ├── middlewares/    # Auth, error middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── utils/          # Helper functions
│   │   │   └── AppError.js
│   │   └── index.js        # Entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Teachers.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Departments.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Notices.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/        # Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm or yarn

### Backend Setup

```bash
# Clone repository
git clone https://github.com/shamim-01/university_management.git
cd university_management/backend

# Install dependencies
npm install

# Create .env file
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173

# Run server
npm run dev
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=University Management System

# Run application
npm run dev
```

---

## 📊 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### 👨‍🎓 Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### 👨‍🏫 Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teachers` | Get all teachers |
| GET | `/api/teachers/:id` | Get single teacher |
| POST | `/api/teachers` | Create teacher |
| PUT | `/api/teachers/:id` | Update teacher |
| DELETE | `/api/teachers/:id` | Delete teacher |

### 🏛️ Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | Get all departments |
| GET | `/api/departments/:id` | Get single department |
| POST | `/api/departments` | Create department |
| PUT | `/api/departments/:id` | Update department |
| DELETE | `/api/departments/:id` | Delete department |

### 📚 Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get single course |
| POST | `/api/courses` | Create course |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

### 📊 Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/results/student/all` | Get all students results |
| GET | `/api/results/student/:studentId` | Get student results |
| GET | `/api/results/public-dashboard` | Get public dashboard data |
| POST | `/api/results` | Create result |
| PUT | `/api/results/:id` | Update result |
| DELETE | `/api/results/:id` | Delete result |

### 📝 Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/course/:courseId` | Get course attendance |
| POST | `/api/attendance` | Mark attendance |
| PUT | `/api/attendance/:id` | Update attendance |
| DELETE | `/api/attendance/:id` | Delete attendance |

### 📢 Notices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notices` | Get all notices |
| GET | `/api/notices/:id` | Get single notice |
| POST | `/api/notices` | Create notice |
| PUT | `/api/notices/:id` | Update notice |
| DELETE | `/api/notices/:id` | Delete notice |

### 🏥 Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health status |

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | [https://university-management-ruddy.vercel.app](https://university-management-ruddy.vercel.app) |
| **Backend** | [https://university-management-ttvo.onrender.com](https://university-management-ttvo.onrender.com) |

---

## 🔒 Authentication

**Protected Routes** (Need Token in Header):
```
Authorization: Bearer <your_jwt_token>
```

**Public Routes** (No Token Required):
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/forgot-password`
- `/api/auth/reset-password/:token`
- `/api/health`

---

## 📸 Pages

### Admin Panel
- 📊 Dashboard
- 👥 Student Management
- 👨‍🏫 Teacher Management
- 🏛️ Department Management
- 📚 Course Management
- 📋 Attendance Management
- 📝 Results Management
- 📈 Analytics Dashboard
- 👤 Profile Management

### Teacher Panel
- 📊 Dashboard
- 👥 Student List
- ✅ Take Attendance
- 📝 Upload Results
- 📢 Publish Notices

### Student Panel
- 📊 Dashboard
- 👤 Profile
- ✅ Attendance
- 📝 Results & CGPA
- 📢 Notices

---

## 🎨 UI Features

- 🌙 **Dark Theme**
- ✨ **Glassmorphism Design**
- 📱 **Responsive Layout**
- 🎯 **Animated Sidebar**
- 💫 **Loading Animations**
- 🔔 **Toast Notifications**
- 📊 **Interactive Charts**

---

## 🔒 Security

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Role-Based Access Control
- ✅ Input Validation
- ✅ XSS Protection
- ✅ CORS Configuration

---

## 🚀 Deployment

### Deploy to Vercel (Frontend)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/shamim-01/university_management)

### Deploy to Render (Backend)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License © 2026

---

## 👨‍💻 Author

**Shamim Alam**
- GitHub: [@shamim-01](https://github.com/shamim-01)

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by [Shamim Alam](https://github.com/shamim-01)

</div>
```
