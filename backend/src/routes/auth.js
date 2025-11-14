import express from 'express';
import { body } from 'express-validator';
import { signUp, signIn, signOut, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').trim().notEmpty(),
    body('role').optional().isIn(['job_seeker', 'recruiter', 'admin']),
    validate
  ],
  signUp
);

router.post('/signin',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
  ],
  signIn
);

router.post('/signout', authenticate, signOut);

router.get('/me', authenticate, getCurrentUser);

export default router;
