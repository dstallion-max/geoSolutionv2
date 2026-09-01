// parentRepo.js 
import { supabase } from '../config/db.js';

export const parentRepo = {
    async create(p) {
        const { data, error } = await supabase
            .from('parents')
            .insert([{
                student_id: p.student_id,
                full_name: p.full_name,
                relationship: p.relationship,
                phone_call: p.phone_call,
                phone_whatsapp: p.phone_whatsapp,
                email: p.email || null,
                occupation: p.occupation,
                address: p.address
            }])
            .select();

        if (error) throw error;
        return data;
    },

    async getByStudentId(studentId) {
        const { data, error } = await supabase
            .from('parents')
            .select('*')
            .eq('student_id', studentId)
            .single();
        if (error) throw error;
        return data;
    },

    async update(studentId, updates) {
        const { data, error } = await supabase
            .from('parents')
            .update(updates)
            .eq('student_id', studentId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(studentId) {
        const { error } = await supabase
            .from('parents')
            .delete()
            .eq('student_id', studentId);
        if (error) throw error;
        return true;
    }
};