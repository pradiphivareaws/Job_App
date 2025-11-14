import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  getAllJobs,
  deleteUser,
  getStats
} from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);

router.get('/jobs', getAllJobs);
router.get('/stats', getStats);

export default router;
