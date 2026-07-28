import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    courses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        enrollmentDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['enrolled', 'completed', 'dropped'],
          default: 'enrolled',
        },
      },
    ],
    guardian: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      relation: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        default: 'Bangladesh',
        trim: true,
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    nationality: {
      type: String,
      default: 'Bangladeshi',
      trim: true,
    },
    totalCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    cgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 4,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

// Index for search
studentSchema.index({ studentId: 1, 'user.name': 1, 'user.email': 1 });

const Student = mongoose.model('Student', studentSchema);
export default Student;
