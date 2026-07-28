import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'],
      required: true,
    },
    gradePoint: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
    },
    status: {
      type: String,
      enum: ['passed', 'failed'],
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure unique result per student per course per semester
resultSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true });

const Result = mongoose.model('Result', resultSchema);
export default Result;
