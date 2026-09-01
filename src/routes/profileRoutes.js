// profileRoutes.js 
import express from 'express';
import { getStudentProfile, getStaffProfile } from '../controllers/profileController.js';
import { verifySession, isStaff } from '../middleware/auth.js';
import { validateId } from '../middleware/validation.js';

const router = express.Router();

// Protected routes (all require authentication)
router.get('/student/:id', verifySession, isStaff, validateId, getStudentProfile);
router.get('/staff/:id', verifySession, isStaff, validateId, getStaffProfile);

export default router;