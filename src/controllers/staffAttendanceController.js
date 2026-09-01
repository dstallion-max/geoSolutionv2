// staffAttendanceController.js 
import { staffAttendanceRepo } from '../repositories/staffAttendanceRepo.js';

export const logStaffAttendance = async (req, res) => {
    try {
        const { staffId, name, email, role, date, signIn, signOut } = req.body;
        
        const data = {
            staff_id: staffId,
            name: name || '',
            email: email || '',
            role: role || '',
            log_date: date || new Date().toLocaleDateString(),
            sign_in: signIn || null,
            sign_out: signOut || null
        };
        
        const result = await staffAttendanceRepo.upsert(data);
        res.status(200).json({ success: true, message: 'Staff attendance logged', data: result });

    } catch (err) {
        console.error("Staff Attendance Error:", err.message);
        res.status(400).json({ error: err.message });
    }
};

export const getTodayStaffAttendance = async (req, res) => {
    try {
        const data = await staffAttendanceRepo.getToday();
        res.status(200).json(data || []);
    } catch (err) {
        console.error("Error fetching today's staff attendance:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getStaffAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date parameter required' });
        }
        const dateObj = new Date(date + 'T00:00:00');
        const dateStr = dateObj.toLocaleDateString();
        const data = await staffAttendanceRepo.getByDate(dateStr);
        res.status(200).json(data || []);
    } catch (err) {
        console.error("Error fetching staff attendance by date:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getStaffAttendanceByStaffId = async (req, res) => {
    try {
        const { staffId } = req.params;
        const data = await staffAttendanceRepo.getByStaffId(staffId);
        res.status(200).json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};