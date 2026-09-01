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
    'https://geosolutionv2.onrender.com',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            if (origin && (origin.includes('.onrender.com') || origin.includes('localhost'))) {
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
// ✅ HEALTH CHECK (BEFORE static files)
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
// ✅ AUTH ROUTES (BEFORE static files)
// =============================================
app.use('/api/auth', authRoutes);

// =============================================
// ✅ PROTECTED ROUTES (BEFORE static files)
// =============================================
app.use('/api/students', verifySession, studentRoutes);
app.use('/api/staff', verifySession, staffRoutes);
app.use('/api/attendance', verifySession, attendanceRoutes);
app.use('/api/staff-attendance', verifySession, staffAttendanceRoutes);
app.use('/api/finance', verifySession, financeRoutes);
app.use('/api/notes', verifySession, notesRoutes);
app.use('/api/profile', verifySession, profileRoutes);

// =============================================
// ✅ STATIC FILES (AFTER API routes)
// =============================================
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// =============================================
// ✅ FALLBACK: Serve index.html for frontend routes ONLY
// =============================================
app.use((req, res) => {
    // ✅ If it's an API route, return JSON error
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            error: 'API route not found',
            path: req.path
        });
    }
    
    // ✅ For all other routes, serve index.html
    res.sendFile(path.join(__dirname, '../public/index.html'));
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