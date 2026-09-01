// attendanceController.js 
import { attendanceRepo } from '../repositories/attendanceRepo.js';

export const logAttendance = async (req, res) => {
    try {
        const l = req.body; 
        
        const data = await attendanceRepo.upsert(l);
        res.status(200).json({ success: true, message: 'Log Synced to Cloud', data });

    } catch (err) {
        console.error("Attendance Error:", err.message);
        res.status(400).json({ error: err.message });
    }
};

export const getTodayAttendance = async (req, res) => {
    try {
        const data = await attendanceRepo.getToday();
        res.status(200).json(data || []);
    } catch (err) {
        console.error("Error fetching today's attendance:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getDateAttendance = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date parameter required' });
        }
        const dateObj = new Date(date + 'T00:00:00');
        const dateStr = dateObj.toLocaleDateString();
        const data = await attendanceRepo.getByDate(dateStr);
        res.status(200).json(data || []);
    } catch (err) {
        console.error("Error fetching attendance by date:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getAttendanceByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        const data = await attendanceRepo.getByStudentId(studentId);
        res.status(200).json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};