// attendanceRepo.js 
import { supabase } from '../config/db.js';

export const attendanceRepo = {
    async upsert(l) {
        const { data, error } = await supabase
            .from('attendance')
            .upsert([{
                student_id: l.studentId,
                matric_number: l.matric_number || '',
                name: l.name,
                dept: l.dept,
                exam: l.exam,
                log_date: l.date,
                sign_in: l.signIn,
                sign_out: l.signOut || null,      // ✅ FIXED: null instead of empty string
                punctuality: l.punctuality || l.status
            }], { onConflict: 'student_id, log_date' });

        if (error) throw error;
        return data;
    },

    async getByDate(date) {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('log_date', date)
            .order('sign_in', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async getToday() {
        const today = new Date().toLocaleDateString();
        return this.getByDate(today);
    },

    async getByDateRange(startDate, endDate) {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .gte('log_date', startDate)
            .lte('log_date', endDate)
            .order('sign_in', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async getByStudentId(studentId) {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('student_id', studentId)
            .order('log_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getStats(studentId) {
        const { data, error } = await supabase
            .from('attendance')
            .select('punctuality')
            .eq('student_id', studentId);

        if (error) throw error;
        
        let present = 0, late = 0, absent = 0;
        (data || []).forEach(a => {
            if (a.punctuality === 'LATE') late++;
            else if (a.punctuality === 'PRESENT' || a.punctuality === 'EARLY') present++;
            else absent++;
        });
        
        return { present, late, absent, total: data?.length || 0 };
    }
};