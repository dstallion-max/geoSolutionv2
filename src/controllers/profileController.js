// profileController.js 
import { supabase } from '../config/db.js';

export const getStudentProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        // Get student
        const { data: student, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('student_id', id)
            .single();

        if (studentError || !student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Get parent
        const { data: parent, error: parentError } = await supabase
            .from('parents')
            .select('*')
            .eq('student_id', id)
            .single();

        // Get attendance
        const { data: attendance, error: attError } = await supabase
            .from('attendance')
            .select('*')
            .eq('student_id', id)
            .order('log_date', { ascending: false });

        res.json({
            success: true,
            student: student || {},
            parent: parent || null,
            attendance: attendance || []
        });

    } catch (err) {
        console.error('Error fetching student profile:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getStaffProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Staff ID is required' });
        }

        // Get staff
        const { data: staff, error: staffError } = await supabase
            .from('staff')
            .select('*')
            .eq('id', id)
            .single();

        if (staffError || !staff) {
            return res.status(404).json({ error: 'Staff not found' });
        }

        // Get attendance
        const { data: attendance, error: attError } = await supabase
            .from('staff_attendance')
            .select('*')
            .eq('staff_id', id)
            .order('log_date', { ascending: false });

        res.json({
            success: true,
            staff: staff || {},
            attendance: attendance || []
        });

    } catch (err) {
        console.error('Error fetching staff profile:', err);
        res.status(500).json({ error: err.message });
    }
};