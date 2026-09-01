// upload.js 
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../../uploads');
const photosDir = path.join(uploadsDir, 'photos');
const formsDir = path.join(uploadsDir, 'forms');

[uploadsDir, photosDir, formsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.body.uploadType || 'photo';
        if (type === 'photo') {
            cb(null, photosDir);
        } else if (type === 'form') {
            cb(null, formsDir);
        } else {
            cb(null, uploadsDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed. Allowed: ${allowedTypes.join(', ')}`), false);
    }
};

// Multer configuration
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024 // 5MB default
    }
});

// Single file upload middleware
export const uploadSingle = (fieldName = 'file') => {
    return (req, res, next) => {
        const uploader = upload.single(fieldName);
        
        uploader(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'FILE_TOO_LARGE') {
                    return res.status(413).json({ 
                        error: `File too large. Max size: ${(parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024) / (1024 * 1024)}MB` 
                    });
                }
                return res.status(400).json({ error: err.message });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    };
};

// Multiple files upload middleware
export const uploadMultiple = (fieldName = 'files', maxCount = 5) => {
    return (req, res, next) => {
        const uploader = upload.array(fieldName, maxCount);
        
        uploader(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'FILE_TOO_LARGE') {
                    return res.status(413).json({ 
                        error: `File too large. Max size: ${(parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024) / (1024 * 1024)}MB` 
                    });
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({ error: `Too many files. Max: ${maxCount}` });
                }
                return res.status(400).json({ error: err.message });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    };
};

// Get file URL helper
export const getFileUrl = (filename, type = 'photo') => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const folder = type === 'photo' ? 'photos' : 'forms';
    return `${baseUrl}/uploads/${folder}/${filename}`;
};

// Delete file helper
export const deleteFile = (filepath) => {
    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            return true;
        }
        return false;
    } catch (err) {
        console.error('Error deleting file:', err);
        return false;
    }
};