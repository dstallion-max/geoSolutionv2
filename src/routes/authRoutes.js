// authRoutes.js 
import express from 'express';
import { staffLogin, staffLogout, checkSession } from '../controllers/authController.js';
import { validateLogin, sanitizeInput } from '../middleware/validation.js';
import { authLimiter } from '../middleware/security.js';

const router = express.Router();

// Public routes (no auth required)
router.post('/login', authLimiter, sanitizeInput, validateLogin, staffLogin);
router.post('/logout', staffLogout);
router.get('/check-session', checkSession);

export default router;