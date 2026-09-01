// uploadController.js 
import { supabase } from '../config/db.js';

export const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { studentId } = req.body;
        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${studentId}-${Date.now()}.${fileExt}`;
        const filePath = `photos/${fileName}`;

        const { data, error } = await supabase.storage
            .from('student-uploads')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600'
            });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('student-uploads')
            .getPublicUrl(filePath);

        res.json({ 
            success: true, 
            url: urlData.publicUrl,
            path: filePath
        });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const uploadForm = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { studentId } = req.body;
        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${studentId}-form-${Date.now()}.${fileExt}`;
        const filePath = `forms/${fileName}`;

        const { data, error } = await supabase.storage
            .from('student-uploads')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600'
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from('student-uploads')
            .getPublicUrl(filePath);

        res.json({ 
            success: true, 
            url: urlData.publicUrl,
            path: filePath
        });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message });
    }
};