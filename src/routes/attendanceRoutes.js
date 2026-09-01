// attendanceRoutes.js 
import express from 'express';
import { 
    logAttendance, 
    getTodayAttendance, 
    getDateAttendance,
    getAttendanceByStudentId
} from '../controllers/attendanceController.js';
import { verifySession, isStaff } from '../middleware/auth.js';
import { validateId, sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// Protected routes (all require authentication)
router.post('/log', verifySession, isStaff, sanitizeInput, logAttendance);
router.get('/today', verifySession, getTodayAttendance);
router.get('/date', verifySession, getDateAttendance);
router.get('/student/:studentId', verifySession, validateId, getAttendanceByStudentId);

export default router;