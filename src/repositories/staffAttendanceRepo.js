// staffAttendanceRepo.js 
import { supabase } from '../config/db.js';

export const staffAttendanceRepo = {
    async upsert(l) {
        const { data, error } = await supabase
            .from('staff_attendance')
            .upsert([{
                staff_id: l.staff_id,
                name: l.name || '',
                email: l.email || '',
                role: l.role || '',
                log_date: l.log_date,
                sign_in: l.sign_in || null,
                sign_out: l.sign_out || null
            }], { onConflict: 'staff_id, log_date' });

        if (error) throw error;
        return data;
    },

    async getByDate(date) {
        const { data, error } = await supabase
            .from('staff_attendance')
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

    async getByStaffId(staffId) {
        const { data, error } = await supabase
            .from('staff_attendance')
            .select('*')
            .eq('staff_id', staffId)
            .order('log_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getByDateRange(startDate, endDate) {
        const { data, error } = await supabase
            .from('staff_attendance')
            .select('*')
            .gte('log_date', startDate)
            .lte('log_date', endDate)
            .order('log_date', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async getStats(staffId) {
        const { data, error } = await supabase
            .from('staff_attendance')
            .select('sign_in')
            .eq('staff_id', staffId);

        if (error) throw error;
        
        let present = 0, absent = 0;
        (data || []).forEach(a => {
            if (a.sign_in) present++;
            else absent++;
        });
        
        return { present, absent, total: data?.length || 0 };
    }
};