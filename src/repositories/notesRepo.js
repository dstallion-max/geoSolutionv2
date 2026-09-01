// notesRepo.js 
import { supabase } from '../config/db.js';

export const notesRepo = {
    async add(note) {
        const { data, error } = await supabase
            .from('notes')
            .insert([{
                title: note.title,
                description: note.description || '',
                priority: note.priority || 'medium',
                status: 'pending',
                created_by: note.created_by || 'secretary'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('notes')
            .update({
                title: updates.title,
                description: updates.description,
                priority: updates.priority,
                status: updates.status || 'pending',
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
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async getByStatus(status) {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getByPriority(priority) {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('priority', priority)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }
};