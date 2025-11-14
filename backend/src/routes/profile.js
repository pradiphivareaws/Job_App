import express from 'express';
import { getProfile, updateProfile, uploadResume } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticate, getProfile);
router.put('/:id', authenticate, updateProfile);
router.post('/resume', authenticate, uploadResume);

export default router;
