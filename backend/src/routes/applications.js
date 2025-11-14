import express from 'express';
import { body } from 'express-validator';
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication
} from '../controllers/applicationController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/',
  authenticate,
  requireRole('job_seeker'),
  [
    body('jobId').isUUID(),
    body('resumeUrl').trim().notEmpty(),
    validate
  ],
  applyToJob
);

router.get('/my-applications', authenticate, requireRole('job_seeker'), getMyApplications);
router.get('/job/:jobId', authenticate, requireRole('recruiter', 'admin'), getJobApplications);

router.patch('/:id/status',
  authenticate,
  requireRole('recruiter', 'admin'),
  [
    body('status').isIn(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted']),
    validate
  ],
  updateApplicationStatus
);

router.delete('/:id', authenticate, requireRole('job_seeker'), withdrawApplication);

export default router;
