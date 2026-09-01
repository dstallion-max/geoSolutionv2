// notesController.js 
import { notesRepo } from '../repositories/notesRepo.js';

export const addNote = async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const note = {
            title,
            description: description || '',
            priority: priority || 'medium',
            created_by: req.user?.email || 'secretary'
        };

        const result = await notesRepo.add(note);
        res.status(201).json({ success: true, message: 'Note added successfully', data: result });

    } catch (err) {
        console.error('Add note error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getNotes = async (req, res) => {
    try {
        const data = await notesRepo.getAll();
        res.json({ success: true, notes: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;

        const result = await notesRepo.update(id, { title, description, priority, status });
        res.json({ success: true, message: 'Note updated successfully', data: result });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        await notesRepo.delete(id);
        res.json({ success: true, message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getNote = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await notesRepo.getById(id);
        res.json({ success: true, note: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};