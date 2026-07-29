import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getProfile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
