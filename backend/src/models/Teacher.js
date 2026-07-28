import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    designation: {
      type: String,
      required: true,
      enum: [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lecturer',
        'Senior Lecturer',
      ],
    },
    qualifications: [
      {
        degree: {
          type: String,
          required: true,
          trim: true,
        },
        institution: {
          type: String,
          required: true,
          trim: true,
        },
        year: {
          type: Number,
          required: true,
          min: 1900,
          max: new Date().getFullYear(),
        },
      },
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    specialization: [
      {
        type: String,
        trim: true,
      },
    ],
    office: {
      room: {
        type: String,
        trim: true,
      },
      building: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for search
teacherSchema.index({ employeeId: 1, 'user.name': 1 });

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
