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
    deleteTransaction,
    getByDateRange,
    getMonthlyStats,
    getProfitSummary
} from '../controllers/financeController.js';
import { verifySession, isAdmin, isStaff } from '../middleware/auth.js';
import {
    validateTransaction,
    validateDateRange,
    validateProfitSummary,
    validateId,
    sanitizeInput
} from '../middleware/validation.js';

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
// ✅ NEW: income-only profit summary for a date range
router.get('/profit-summary', verifySession, isStaff, validateProfitSummary, getProfitSummary);
router.get('/monthly-stats', verifySession, isStaff, getMonthlyStats);
router.put('/:id', verifySession, isAdmin, sanitizeInput, validateId, validateTransaction, updateTransaction);
router.delete('/:id', verifySession, isAdmin, sanitizeInput, validateId, deleteTransaction);

export default router;