// validation.js 
import { body, validationResult, param, query } from 'express-validator';

// =============================================
// STUDENT VALIDATION
// =============================================

export const validateStudentRegistration = [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('matric_number').notEmpty().withMessage('Matric number is required'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('dob').notEmpty().withMessage('Date of birth is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('student_type').isIn(['exam', 'computer_training']).withMessage('Invalid student type'),
    body('department').if(body('student_type').equals('exam')).notEmpty().withMessage('Department is required for exam students'),
    body('exam_type').if(body('student_type').equals('exam')).notEmpty().withMessage('Exam type is required for exam students'),
    body('course').if(body('student_type').equals('computer_training')).notEmpty().withMessage('Course is required for training students'),
    body('edu_level').if(body('student_type').equals('computer_training')).notEmpty().withMessage('Education level is required for training students'),
    body('parent_name').notEmpty().withMessage('Parent name is required'),
    body('parent_relationship').notEmpty().withMessage('Parent relationship is required'),
    body('parent_phone_call').notEmpty().withMessage('Parent phone (call) is required'),
    body('parent_phone_whatsapp').notEmpty().withMessage('Parent phone (WhatsApp) is required'),
    body('parent_occupation').notEmpty().withMessage('Parent occupation is required'),
    body('parent_address').notEmpty().withMessage('Parent address is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        next();
    }
];

export const validateStudentUpdate = [
    param('id').notEmpty().withMessage('Student ID is required'),
    body('full_name').optional().notEmpty().withMessage('Full name cannot be empty'),
    body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        next();
    }
];

// =============================================
// STAFF VALIDATION
// =============================================

export const validateStaffCreation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('role').isIn(['admin', 'secretary', 'teacher', 'other']).withMessage('Invalid role'),
    body('pin').isLength({ min: 6, max: 6 }).withMessage('PIN must be exactly 6 digits')
        .isNumeric().withMessage('PIN must be numeric'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        next();
    }
];

export const validateStaffUpdate = [
    param('id').notEmpty().withMessage('Staff ID is required'),
    body('role').optional().isIn(['admin', 'secretary', 'teacher', 'other']).withMessage('Invalid role'),
    body('pin').optional().isLength({ min: 6, max: 6 }).withMessage('PIN must be exactly 6 digits')
        .isNumeric().withMessage('PIN must be numeric'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        next();
    }
];

// =============================================
// AUTH VALIDATION
// =============================================

export const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('pin').isLength({ min: 6, max: 6 }).withMessage('PIN must be exactly 6 digits')
        .isNumeric().withMessage('PIN must be numeric'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        next();
    }
];

// =============================================
// FINANCE VALIDATION
// =============================================

export const validateTransaction = [
    body('type').isIn(['income', 'expense']).withMessage('Invalid transaction type'),
    body('category').notEmpty().withMessage('Category is required'),
    body('customer_name').optional().isString().withMessage('Customer name must be a string'),
    body('amount').isNumeric().withMessage('Amount must be a number')
        .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('method').optional().isIn(['cash', 'transfer', 'cheque', 'online']).withMessage('Invalid payment method'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        next();
    }
];

// =============================================
// NOTES VALIDATION
// =============================================

export const validateNote = [
    body('title').notEmpty().withMessage('Title is required'),
    body('priority').optional().isIn(['high', 'medium', 'low']).withMessage('Invalid priority'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        next();
    }
];

// =============================================
// GENERAL VALIDATION MIDDLEWARE
// =============================================

export const validateId = [
    param('id').notEmpty().withMessage('ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        next();
    }
];

export const validateDateRange = [
    query('start').optional().isDate().withMessage('Invalid start date'),
    query('end').optional().isDate().withMessage('Invalid end date'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        next();
    }
];

// =============================================
// SANITIZATION
// =============================================

export const sanitizeInput = (req, res, next) => {
    // Remove potential XSS from string fields
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        return str.trim().replace(/[<>]/g, '');
    };
    
    // Recursively sanitize object
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        
        if (Array.isArray(obj)) {
            return obj.map(item => sanitize(item));
        }
        
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                result[key] = sanitizeString(value);
            } else if (typeof value === 'object' && value !== null) {
                result[key] = sanitize(value);
            } else {
                result[key] = value;
            }
        }
        return result;
    };
    
    req.body = sanitize(req.body);
    // req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    
    next();
};