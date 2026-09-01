// auth.js 
import jwt from 'jsonwebtoken';
import { JWT_SECRET, SESSION_TIMEOUT, COOKIE_NAME } from '../config/auth.js';

export const verifySession = async (req, res, next) => {
    const token = req.cookies?.[COOKIE_NAME];
    
    if (!token) {
        return res.status(401).json({ 
            error: 'Unauthorized - No session',
            code: 'NO_SESSION'
        });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const now = Date.now();
        const lastActivity = decoded.lastActivity || 0;
        const inactiveTime = now - lastActivity;
        
        if (inactiveTime > SESSION_TIMEOUT) {
            // ✅ Clear cookie with production settings
            res.clearCookie(COOKIE_NAME, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
            });
            return res.status(401).json({ 
                error: 'Session expired due to inactivity - Please login again',
                code: 'SESSION_EXPIRED'
            });
        }
        
        // Update last activity time
        const newToken = jwt.sign(
            { 
                id: decoded.id, 
                email: decoded.email, 
                role: decoded.role,
                lastActivity: now 
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // ✅ Set cookie with production settings
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie(COOKIE_NAME, newToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000,
            domain: isProduction ? '.onrender.com' : undefined
        });
        
        req.user = decoded;
        next();
        
    } catch (err) {
        res.clearCookie(COOKIE_NAME);
        return res.status(401).json({ 
            error: 'Invalid session',
            code: 'INVALID_SESSION'
        });
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Access denied - Admin only',
            code: 'FORBIDDEN'
        });
    }
    next();
};

export const isStaff = (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'secretary')) {
        return res.status(403).json({ 
            error: 'Access denied - Staff only',
            code: 'FORBIDDEN'
        });
    }
    next();
};