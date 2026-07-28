import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    establishedYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    contactEmail: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    contactPhone: {
      type: String,
      trim: true,
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

// Virtual for student count
departmentSchema.virtual('studentCount', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'department',
  count: true,
});

// Virtual for teacher count
departmentSchema.virtual('teacherCount', {
  ref: 'Teacher',
  localField: '_id',
  foreignField: 'department',
  count: true,
});

// Index for search
departmentSchema.index({ name: 1, code: 1 });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
