// financeRepo.js 
import { supabase } from '../config/db.js';

export const financeRepo = {
    async add(transaction) {
        const { data, error } = await supabase
            .from('finance')
            .insert([{
                transaction_type: transaction.type,
                category: transaction.category,
                customer_name: transaction.customer_name || '',
                amount: transaction.amount,
                payment_method: transaction.method || null,
                description: transaction.description || '',
                transaction_date: transaction.date || new Date().toISOString().split('T')[0],
                created_by: transaction.created_by || 'secretary'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getToday() {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('finance')
            .select('*')
            .eq('transaction_date', today)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split('T')[0];
        
        const { data, error } = await supabase
            .from('finance')
            .select('*')
            .eq('transaction_date', dateStr)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getThisWeek() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diff));
        const startDate = monday.toISOString().split('T')[0];
        const endDate = new Date().toISOString().split('T')[0];

        return this.getByDateRange(startDate, endDate);
    },

    async getByDateRange(startDate, endDate) {
        const { data, error } = await supabase
            .from('finance')
            .select('*')
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate)
            .order('transaction_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('finance')
            .update({
                category: updates.category,
                customer_name: updates.customer_name || '',
                amount: updates.amount,
                payment_method: updates.method || null,
                description: updates.description || '',
                transaction_date: updates.date || new Date().toISOString().split('T')[0]
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('finance')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async getMonthlyStats() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${String(now.getDate()).padStart(2, '0')}`;

        const { data, error } = await supabase
            .from('finance')
            .select('transaction_type, amount')
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate);

        if (error) throw error;

        let totalIncome = 0;
        let totalExpenses = 0;
        
        (data || []).forEach(t => {
            if (t.transaction_type === 'income') totalIncome += t.amount;
            else totalExpenses += t.amount;
        });

        return {
            totalIncome,
            totalExpenses,
            net: totalIncome - totalExpenses,
            count: data?.length || 0
        };
    },

    async getTotals(date) {
        const { data, error } = await supabase
            .from('finance')
            .select('transaction_type, amount')
            .eq('transaction_date', date);

        if (error) throw error;
        
        let totalIncome = 0;
        let totalExpenses = 0;
        
        (data || []).forEach(t => {
            if (t.transaction_type === 'income') totalIncome += t.amount;
            else totalExpenses += t.amount;
        });
        
        return { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
    },

    async getCustomerTransactions(customerName) {
        const { data, error } = await supabase
            .from('finance')
            .select('*')
            .ilike('customer_name', `%${customerName}%`)
            .order('transaction_date', { ascending: false });

        if (error) throw error;
        return data || [];
    }
};