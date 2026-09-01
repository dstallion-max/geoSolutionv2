import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/db.js';
import { JWT_SECRET } from '../config/auth.js';

export const staffLogin = async (req, res) => {
    try {
        const { email, pin } = req.body;
        
        if (!email || !pin) {
            return res.status(400).json({ 
                error: 'Email and PIN are required' 
            });
        }
        
        const { data: staff, error } = await supabase
            .from('staff')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();
        
        if (error || !staff) {
            return res.status(401).json({ 
                error: 'Invalid email or PIN. Please check your credentials.' 
            });
        }
        
        const isValid = await bcrypt.compare(pin, staff.pin_hash);
        if (!isValid) {
            return res.status(401).json({ 
                error: 'Invalid email or PIN. Please check your credentials.' 
            });
        }
        
        const token = jwt.sign(
            { 
                id: staff.id, 
                email: staff.email, 
                role: staff.role,
                lastActivity: Date.now()
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // ✅ Updated cookie settings for production
        const isProduction = process.env.NODE_ENV === 'production';
        const COOKIE_NAME = process.env.COOKIE_NAME || 'geo_session';
        
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000,
            domain: isProduction ? '.onrender.com' : undefined
        });
        
        res.json({ 
            success: true, 
            role: staff.role,
            email: staff.email,
            name: staff.full_name || staff.email
        });
        
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            error: 'Login failed. Please try again later.' 
        });
    }
};

export const staffLogout = async (req, res) => {
    try {
        const COOKIE_NAME = process.env.COOKIE_NAME || 'geo_session';
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });
        
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
};

export const checkSession = async (req, res) => {
    try {
        const COOKIE_NAME = process.env.COOKIE_NAME || 'geo_session';
        const token = req.cookies?.[COOKIE_NAME];
        
        if (!token) {
            return res.json({ valid: false });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const now = Date.now();
        const lastActivity = decoded.lastActivity || 0;
        
        if (now - lastActivity > 10 * 60 * 1000) {
            res.clearCookie(COOKIE_NAME);
            return res.json({ valid: false, expired: true });
        }
        
        res.json({ 
            valid: true, 
            role: decoded.role,
            email: decoded.email,
            name: decoded.name
        });
        
    } catch (err) {
        res.clearCookie(COOKIE_NAME);
        res.json({ valid: false });
    }
};