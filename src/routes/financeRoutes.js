// financeRoutes.js 
import express from 'express';
import {
    addTransaction,
    getByDate,
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
router.get('/date', verifySession, isStaff, getByDate);
router.get('/today', verifySession, isStaff, getToday);
router.get('/yesterday', verifySession, isStaff, getYesterday);
router.get('/week', verifySession, isStaff, getThisWeek);
router.get('/month', verifySession, isStaff, getThisMonth);
router.get('/year', verifySession, isStaff, getThisYear);
router.get('/range', verifySession, isStaff, validateDateRange, getByDateRange);
router.get('/monthly-stats', verifySession, isStaff, getMonthlyStats);
router.put('/:id', verifySession, isStaff, sanitizeInput, updateTransaction);

export default router;