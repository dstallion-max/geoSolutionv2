import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import studentRoutes from './routes/studentRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import staffAttendanceRoutes from './routes/staffAttendanceRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

import { connectDb } from './config/db.js';
import { verifySession } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// SECURITY MIDDLEWARE
// =============================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com", "https://images.unsplash.com"],
            connectSrc: ["'self'", "https://*.supabase.co"],
        },
    },
}));

// =============================================
// CORS CONFIGURATION
// =============================================
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            if (origin && origin.includes('.onrender.com')) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

// =============================================
// PARSERS
// =============================================
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================
// STATIC FILES - Serves all frontend files
// =============================================
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// =============================================
// HEALTH CHECK
// =============================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '2.0.0'
    });
});

// =============================================
// AUTH ROUTES (No session required)
// =============================================
app.use('/api/auth', authRoutes);

// =============================================
// PROTECTED ROUTES (Session required)
// =============================================
app.use('/api/students', verifySession, studentRoutes);
app.use('/api/staff', verifySession, staffRoutes);
app.use('/api/attendance', verifySession, attendanceRoutes);
app.use('/api/staff-attendance', verifySession, staffAttendanceRoutes);
app.use('/api/finance', verifySession, financeRoutes);
app.use('/api/notes', verifySession, notesRoutes);
app.use('/api/profile', verifySession, profileRoutes);

// =============================================
// ✅ FALLBACK: Serve index.html for frontend routes (Express 5 compatible)
// =============================================
app.use((req, res, next) => {
    // Skip API routes - they should have been handled above
    if (req.path.startsWith('/api')) {
        return next();
    }
    
    // Check if the requested file exists in public folder
    const filePath = path.join(__dirname, '../public', req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return next(); // Let express.static handle it
    }
    
    // For all other routes, serve index.html (SPA support)
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// =============================================
// ✅ 404 HANDLER for API routes (Express 5 compatible - no wildcard)
// =============================================
app.use((req, res) => {
    // Only handle API routes that weren't matched
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            error: 'API route not found',
            path: req.path
        });
    }
    // For non-API routes that weren't handled, send 404
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// =============================================
// ERROR HANDLER
// =============================================
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// =============================================
// DATABASE CONNECTION & SERVER START
// =============================================
connectDb();

app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 Geo Solution v2.0 Server');
    console.log(`📡 Running on http://localhost:${PORT}`);
    console.log(`📁 Serving frontend from: ${path.join(__dirname, '../public')}`);
    console.log('========================================');
});

export default app;