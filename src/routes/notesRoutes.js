// notesRoutes.js 
import express from 'express';
import {
    addNote,
    getNotes,
    updateNote,
    deleteNote,
    getNote
} from '../controllers/notesController.js';
import { verifySession, isStaff } from '../middleware/auth.js';
import { validateNote, validateId, sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// Protected routes (all require authentication)
router.post('/add', verifySession, isStaff, sanitizeInput, validateNote, addNote);
router.get('/', verifySession, getNotes);
router.get('/:id', verifySession, validateId, getNote);
router.put('/:id', verifySession, isStaff, sanitizeInput, updateNote);
router.delete('/:id', verifySession, isStaff, validateId, deleteNote);

export default router;