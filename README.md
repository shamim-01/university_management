## 🎓 University Management System

<div align="center">

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

### A Complete Production-Ready University Management Platform

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-4F46E5?style=for-the-badge&logo=vercel)](https://university-management-je87.vercel.app)

</div>

---

## 📌 About

A comprehensive **University Management System** built with the MERN Stack. Features role-based access control for **Admin**, **Teachers**, and **Students** with a modern, responsive dashboard UI.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **👑 Admin** | admin@university.com | admin123 |
| **👨‍🏫 Teacher** | teacher@university.com | Teacher@123 |
| **👨‍🎓 Student** | student@university.com | Student@123 |

---

## ✨ Features

### 👑 Admin Features
- 📊 **Dashboard** - Real-time analytics, charts, statistics
- 👥 **Student Management** - CRUD, profile images, search & filter
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
| **TanStack Query** | Server state management |
| **React Hook Form** | Form handling |
| **Context API** | State management |
| **Recharts** | Charts & analytics |

### Backend
| Technology | Description |
|------------|-------------|
| **Node.js** | Runtime |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Image storage |
| **Nodemailer** | Email service |

---

## 📁 Project Structure

```
university-management-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Database & Cloudinary config
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database models (9 models)
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Auth, error, upload middleware
│   │   ├── utils/          # Helper functions
│   │   └── validators/     # Request validation
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Context providers
│   │   └── services/       # API services
│   ├── .env
│   └── package.json
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm or yarn
- Cloudinary Account

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/university-management-system.git
cd university-management-system/backend

# Install dependencies
npm install

# Create .env file
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/university_management
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000

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

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password/:token` | Reset password |
| `PUT` | `/api/auth/profile` | Update profile |
| `PUT` | `/api/auth/change-password` | Change password |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/students` | Get all students |
| `GET` | `/api/students/:id` | Get single student |
| `POST` | `/api/students` | Create student |
| `PUT` | `/api/students/:id` | Update student |
| `DELETE` | `/api/students/:id` | Delete student |
| `POST` | `/api/students/:id/avatar` | Upload avatar |

### Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/teachers` | Get all teachers |
| `GET` | `/api/teachers/:id` | Get single teacher |
| `POST` | `/api/teachers` | Create teacher |
| `PUT` | `/api/teachers/:id` | Update teacher |
| `DELETE` | `/api/teachers/:id` | Delete teacher |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/courses` | Get all courses |
| `GET` | `/api/courses/:id` | Get single course |
| `POST` | `/api/courses` | Create course |
| `PUT` | `/api/courses/:id` | Update course |
| `DELETE` | `/api/courses/:id` | Delete course |

### Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/results` | Get all results |
| `GET` | `/api/results/:id` | Get single result |
| `POST` | `/api/results` | Create result |
| `PUT` | `/api/results/:id` | Update result |
| `DELETE` | `/api/results/:id` | Delete result |
| `GET` | `/api/results/student/:studentId` | Get student results |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/attendance` | Get all attendance |
| `POST` | `/api/attendance` | Mark attendance |
| `PUT` | `/api/attendance/:id` | Update attendance |
| `GET` | `/api/attendance/student/:studentId` | Get student attendance |

### Notices
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notices` | Get all notices |
| `POST` | `/api/notices` | Create notice |
| `PUT` | `/api/notices/:id` | Update notice |
| `DELETE` | `/api/notices/:id` | Delete notice |

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

- 🌙 **Dark/Light Theme**
- ✨ **Glassmorphism Design**
- 📱 **Responsive Layout**
- 🎯 **Animated Sidebar**
- 💫 **Loading Skeletons**
- 🔔 **Toast Notifications**
- 📊 **Interactive Charts**

---

## 🔒 Security

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Role-Based Access Control
- ✅ Input Validation
- ✅ XSS Protection
- ✅ Rate Limiting
- ✅ Helmet.js Security Headers
- ✅ CORS Configuration

---

## 🚀 Deployment

### Deploy to Vercel (Frontend)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/yourusername/university-management-system)

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

MIT License © 2024

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [@yourusername](https://linkedin.com/in/yourusername)

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by [Shamim alam]

</div>
