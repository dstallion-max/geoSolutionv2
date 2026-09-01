// financeRoutes.js 
import express from 'express';
import {
    addTransaction,
    getToday,
    getYesterday,
    getThisWeek,
    getThisMonth,
    getThisYear,
    updateTransaction,
    getByDateRange,
    getMonthlyStats
} from '../controllers/financeController.js';
import { verifySession, isStaff } from '../middleware/auth.js';
import { validateTransaction, validateDateRange, sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// Protected routes (all require authentication)
router.post('/add', verifySession, isStaff, sanitizeInput, validateTransaction, addTransaction);
router.get('/today', verifySession, getToday);
router.get('/yesterday', verifySession, getYesterday);
router.get('/week', verifySession, getThisWeek);
router.get('/month', verifySession, getThisMonth);
router.get('/year', verifySession, getThisYear);
router.get('/range', verifySession, validateDateRange, getByDateRange);
router.get('/monthly-stats', verifySession, getMonthlyStats);
router.put('/:id', verifySession, isStaff, sanitizeInput, updateTransaction);

export default router;