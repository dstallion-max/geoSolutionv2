// security.js 
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting for API endpoints
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        error: 'Too many requests from this IP, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limit for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // 5 attempts per window
    message: {
        error: 'Too many login attempts, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// CSRF Protection (simple implementation)
export const csrfProtection = (req, res, next) => {
    // For simple APIs, we can check the origin/referer
    const origin = req.get('Origin');
    const referer = req.get('Referer');
    
    // Allow requests with no origin (like mobile apps)
    if (!origin && !referer) {
        return next();
    }
    
    const allowedDomains = [
        'http://localhost:3000',
        'http://localhost:5500',
        'https://your-frontend-domain.com' // ⚠️ REPLACE WITH YOUR FRONTEND LINK
    ];
    
    const requestOrigin = origin || referer;
    
    if (requestOrigin) {
        const isAllowed = allowedDomains.some(domain => requestOrigin.startsWith(domain));
        if (!isAllowed) {
            return res.status(403).json({
                error: 'CSRF protection: Invalid origin',
                code: 'CSRF_INVALID_ORIGIN'
            });
        }
    }
    
    next();
};

// Security headers
export const securityHeaders = helmet({
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
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
});

// Request logger (with sensitive data redaction)
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Store original send
    const originalSend = res.send;
    
    // Redact sensitive data
    const redactBody = (body) => {
        if (!body || typeof body !== 'object') return body;
        const redacted = { ...body };
        if (redacted.password) redacted.password = '[REDACTED]';
        if (redacted.pin) redacted.pin = '[REDACTED]';
        if (redacted.token) redacted.token = '[REDACTED]';
        if (redacted.authorization) redacted.authorization = '[REDACTED]';
        return redacted;
    };
    
    // Log request
    console.log(`📤 ${req.method} ${req.url} - ${req.ip}`);
    
    // Response interceptor
    res.send = function(data) {
        const duration = Date.now() - start;
        console.log(`📥 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
        originalSend.call(this, data);
    };
    
    next();
};

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);
    
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            code: 'INVALID_TOKEN'
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            code: 'TOKEN_EXPIRED'
        });
    }
    
    // Handle Multer errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
            return res.status(413).json({
                error: `File too large. Max size: ${(parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024) / (1024 * 1024)}MB`,
                code: 'FILE_TOO_LARGE'
            });
        }
        return res.status(400).json({
            error: err.message,
            code: 'MULTER_ERROR'
        });
    }
    
    // Default error
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || 'Internal Server Error',
        code: err.code || 'INTERNAL_ERROR'
    });
};

// Not found handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: `Route ${req.method} ${req.path} not found`,
        code: 'ROUTE_NOT_FOUND'
    });
};

// Request timeout middleware
export const requestTimeout = (timeout = 30000) => {
    return (req, res, next) => {
        const timeoutId = setTimeout(() => {
            if (!res.headersSent) {
                res.status(408).json({
                    error: 'Request timeout',
                    code: 'REQUEST_TIMEOUT'
                });
            }
        }, timeout);
        
        // Clear timeout on response finish
        res.on('finish', () => clearTimeout(timeoutId));
        res.on('close', () => clearTimeout(timeoutId));
        
        next();
    };
};

// Validate content type
export const validateContentType = (allowedTypes = ['application/json']) => {
    return (req, res, next) => {
        if (req.method === 'GET' || req.method === 'DELETE') {
            return next();
        }
        
        const contentType = req.headers['content-type'];
        if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
            return res.status(415).json({
                error: `Content-Type must be: ${allowedTypes.join(', ')}`,
                code: 'UNSUPPORTED_MEDIA_TYPE'
            });
        }
        
        next();
    };
};