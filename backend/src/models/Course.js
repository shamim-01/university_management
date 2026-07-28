import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    classSchedule: {
      days: [
        {
          type: String,
          enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
        },
      ],
      time: {
        type: String,
        trim: true,
      },
      room: {
        type: String,
        trim: true,
      },
      building: {
        type: String,
        trim: true,
      },
    },
    syllabus: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

// Index for search
courseSchema.index({ code: 1, name: 1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
