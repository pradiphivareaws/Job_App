import express from 'express';
import { body } from 'express-validator';
import { saveJob, getSavedJobs, unsaveJob } from '../controllers/savedJobController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/',
  authenticate,
  requireRole('job_seeker'),
  [
    body('jobId').isUUID(),
    validate
  ],
  saveJob
);

router.get('/', authenticate, requireRole('job_seeker'), getSavedJobs);
router.delete('/:jobId', authenticate, requireRole('job_seeker'), unsaveJob);

export default router;
