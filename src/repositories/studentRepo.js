// studentRepo.js 
import { supabase } from '../config/db.js';

export const studentRepo = {
    async create(s) {
        const { data, error } = await supabase
            .from('students')
            .insert([{
                student_id: s.id || s.student_id,
                full_name: s.full_name,
                gender: s.gender,
                date_of_birth: s.date_of_birth || null,
                phone_number: s.phone_number,
                email: s.email || null,
                address: s.address,
                student_type: s.student_type,
                department: s.department || null,
                exam_type: s.exam_type || null,
                course: s.course || null,
                edu_level: s.edu_level || null,
                goal: s.goal || '',
                current_status: s.current_status || 'OUT',
                matric_number: s.matric_number,
                photo_url: s.photo_url || null,
                form_url: s.form_url || null
            }])
            .select();

        if (error) throw error;
        return data;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getByType(type) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('student_type', type)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('student_id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getByEmail(email) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('email', email)
            .single();
        return { data, error };
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('students')
            .update(updates)
            .eq('student_id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(studentId) {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('student_id', studentId);
        if (error) throw error;
        return true;
    },

    async updatePhoto(studentId, photoUrl) {
        const { data, error } = await supabase
            .from('students')
            .update({ photo_url: photoUrl })
            .eq('student_id', studentId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateForm(studentId, formUrl) {
        const { data, error } = await supabase
            .from('students')
            .update({ form_url: formUrl })
            .eq('student_id', studentId)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};