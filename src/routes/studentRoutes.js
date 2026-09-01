// studentRoutes.js 
import express from 'express';
import { 
    registerStudent, 
    getAllStudents, 
    getStudentsByType, 
    getStudentById,
    deleteStudent,
    updateStudent
} from '../controllers/studentController.js';
import { verifySession, isAdmin, isStaff } from '../middleware/auth.js';
import { 
    validateStudentRegistration, 
    validateStudentUpdate,
    validateId,
    sanitizeInput 
} from '../middleware/validation.js';

const router = express.Router();

// Protected routes (all require authentication)
router.post('/register', verifySession, isStaff, sanitizeInput, validateStudentRegistration, registerStudent);
router.get('/all', verifySession, getAllStudents);
router.get('/type/:type', verifySession, getStudentsByType);
router.get('/:id', verifySession, validateId, getStudentById);
router.put('/:id', verifySession, isStaff, sanitizeInput, validateStudentUpdate, updateStudent);
router.delete('/:id', verifySession, isAdmin, validateId, deleteStudent);

export default router;