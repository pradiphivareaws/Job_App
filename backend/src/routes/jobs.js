import express from 'express';
import { body } from 'express-validator';
import { createJob, getJobs, getJob, updateJob, deleteJob, getMyJobs } from '../controllers/jobController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticate, getJobs);
router.get('/my-jobs', authenticate, requireRole('recruiter', 'admin'), getMyJobs);
router.get('/:id', authenticate, getJob);

router.post('/',
  authenticate,
  requireRole('recruiter', 'admin'),
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('company_name').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('job_type').isIn(['full_time', 'part_time', 'contract', 'internship']),
    body('experience_level').isIn(['entry', 'mid', 'senior', 'lead']),
    validate
  ],
  createJob
);

router.put('/:id',
  authenticate,
  requireRole('recruiter', 'admin'),
  updateJob
);

router.delete('/:id',
  authenticate,
  requireRole('recruiter', 'admin'),
  deleteJob
);

export default router;
