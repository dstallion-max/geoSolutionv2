// staffRepo.js 
import { supabase } from '../config/db.js';

export const staffRepo = {
    async create(s) {
        const { data, error } = await supabase
            .from('staff')
            .insert([{
                email: s.email,
                pin_hash: s.pin_hash,
                full_name: s.full_name,
                role: s.role,
                photo_url: s.photo_url || null,
                current_status: s.current_status || 'OUT',
                created_by: s.created_by || null
            }])
            .select();

        if (error) throw error;
        return data;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('staff')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('staff')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getByEmail(email) {
        const { data, error } = await supabase
            .from('staff')
            .select('*')
            .eq('email', email)
            .single();
        return { data, error };
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('staff')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('staff')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async updateStatus(id, status) {
        const { data, error } = await supabase
            .from('staff')
            .update({ current_status: status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updatePhoto(id, photoUrl) {
        const { data, error } = await supabase
            .from('staff')
            .update({ photo_url: photoUrl })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};