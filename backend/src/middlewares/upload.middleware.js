import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError.js';

// Memory storage for Cloudinary upload
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new AppError(
        'Only image files are allowed (jpeg, jpg, png, gif, webp)',
        400,
      ),
    );
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Single file upload
export const uploadSingle = fieldName => {
  return upload.single(fieldName);
};

// Multiple files upload
export const uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};
