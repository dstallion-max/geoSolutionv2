// staffRoutes.js 
import express from 'express';
import { 
    addStaff, 
    getAllStaff, 
    getStaffById,
    updateStaff,
    deleteStaff,
    getStaffAttendance
} from '../controllers/staffController.js';
import { verifySession, isAdmin } from '../middleware/auth.js';
import { 
    validateStaffCreation, 
    validateStaffUpdate,
    validateId,
    sanitizeInput 
} from '../middleware/validation.js';

const router = express.Router();

// Protected routes (all require authentication)
router.post('/add', verifySession, isAdmin, sanitizeInput, validateStaffCreation, addStaff);
router.get('/all', verifySession, getAllStaff);
router.get('/:id', verifySession, validateId, getStaffById);
router.put('/:id', verifySession, isAdmin, sanitizeInput, validateStaffUpdate, updateStaff);
router.delete('/:id', verifySession, isAdmin, validateId, deleteStaff);
router.get('/:id/attendance', verifySession, validateId, getStaffAttendance);

export default router;