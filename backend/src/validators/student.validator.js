import { body, param } from 'express-validator';

export const validateStudent = [
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID is required')
    .isLength({ min: 5, max: 20 })
    .withMessage('Student ID must be between 5 and 20 characters'),

  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isMongoId()
    .withMessage('Invalid department ID'),

  body('semester')
    .notEmpty()
    .withMessage('Semester is required')
    .isInt({ min: 1, max: 12 })
    .withMessage('Semester must be between 1 and 12'),

  body('batch').trim().notEmpty().withMessage('Batch is required'),

  body('guardian.name')
    .trim()
    .notEmpty()
    .withMessage('Guardian name is required'),

  body('guardian.relation')
    .trim()
    .notEmpty()
    .withMessage('Guardian relation is required'),

  body('guardian.phone')
    .trim()
    .notEmpty()
    .withMessage('Guardian phone is required'),

  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Invalid date format'),

  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
];

export const validateStudentId = [
  param('id').isMongoId().withMessage('Invalid student ID'),
];
