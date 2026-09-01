// staffAttendanceRoutes.js 
import express from 'express';
import { 
    logStaffAttendance, 
    getTodayStaffAttendance, 
    getStaffAttendanceByDate,
    getStaffAttendanceByStaffId
} from '../controllers/staffAttendanceController.js';
import { verifySession, isStaff } from '../middleware/auth.js';
import { validateId, sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// Protected routes (all require authentication)
router.post('/log', verifySession, isStaff, sanitizeInput, logStaffAttendance);
router.get('/today', verifySession, getTodayStaffAttendance);
router.get('/date', verifySession, getStaffAttendanceByDate);
router.get('/staff/:staffId', verifySession, validateId, getStaffAttendanceByStaffId);

export default router;