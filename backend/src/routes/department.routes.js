import express from 'express';
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/department.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getDepartments);
router.get('/:id', getDepartment);

router.post('/', restrictTo('admin'), createDepartment);
router.put('/:id', restrictTo('admin'), updateDepartment);
router.delete('/:id', restrictTo('admin'), deleteDepartment);

export default router;
