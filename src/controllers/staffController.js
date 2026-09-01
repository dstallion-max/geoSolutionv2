// staffController.js 
import bcrypt from 'bcryptjs';
import { staffRepo } from '../repositories/staffRepo.js';
import { staffAttendanceRepo } from '../repositories/staffAttendanceRepo.js';

export const addStaff = async (req, res) => {
    try {
        const { email, full_name, role, pin } = req.body;

        if (!email) return res.status(400).json({ error: 'Email is required' });
        if (!full_name) return res.status(400).json({ error: 'Full name is required' });
        if (!role) return res.status(400).json({ error: 'Role is required' });
        if (!pin) return res.status(400).json({ error: 'PIN is required' });
        if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
            return res.status(400).json({ error: 'PIN must be exactly 6 digits' });
        }

        const hashedPin = await bcrypt.hash(pin, 10);

        const staffData = {
            email: email.toLowerCase(),
            full_name,
            role,
            pin_hash: hashedPin,
            created_by: req.user?.id || null
        };

        const data = await staffRepo.create(staffData);
        res.status(201).json({ success: true, message: 'Staff added successfully', data });

    } catch (err) {
        console.error('Add staff error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getAllStaff = async (req, res) => {
    try {
        const data = await staffRepo.getAll();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await staffRepo.getById(id);
        if (!data) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, pin } = req.body;

        const updates = { role };
        if (pin && pin.length === 6 && /^\d{6}$/.test(pin)) {
            updates.pin_hash = await bcrypt.hash(pin, 10);
        }

        const data = await staffRepo.update(id, updates);
        res.status(200).json({ success: true, message: 'Staff updated successfully', data });

    } catch (err) {
        console.error('Update staff error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await staffRepo.delete(id);
        res.status(200).json({ success: true, message: 'Staff deleted successfully' });
    } catch (err) {
        console.error('Delete staff error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getStaffAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await staffAttendanceRepo.getByStaffId(id);
        res.status(200).json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};