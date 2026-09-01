// financeController.js 
import { financeRepo } from '../repositories/financeRepo.js';

export const addTransaction = async (req, res) => {
    try {
        const { type, category, customer_name, amount, method, description, date } = req.body;
        
        if (!type || !category || !amount) {
            return res.status(400).json({ error: 'Type, category, and amount are required' });
        }
        
        const transaction = {
            type,
            category,
            customer_name: customer_name || '',
            amount: parseFloat(amount),
            method: method || 'cash',
            description: description || '',
            date: date || new Date().toISOString().split('T')[0],
            created_by: req.user?.email || 'secretary'
        };
        
        const result = await financeRepo.add(transaction);
        res.status(201).json({ success: true, message: 'Transaction added successfully', data: result });

    } catch (err) {
        console.error('Add transaction error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getToday = async (req, res) => {
    try {
        const data = await financeRepo.getToday();
        const totals = await financeRepo.getTotals(new Date().toISOString().split('T')[0]);
        res.json({ success: true, transactions: data, totals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getYesterday = async (req, res) => {
    try {
        const data = await financeRepo.getYesterday();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const totals = await financeRepo.getTotals(yesterday.toISOString().split('T')[0]);
        res.json({ success: true, transactions: data, totals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getThisWeek = async (req, res) => {
    try {
        const data = await financeRepo.getThisWeek();
        let totalIncome = 0;
        let totalExpenses = 0;
        (data || []).forEach(t => {
            if (t.transaction_type === 'income') totalIncome += t.amount;
            else totalExpenses += t.amount;
        });
        res.json({ 
            success: true, 
            transactions: data,
            totals: {
                totalIncome,
                totalExpenses,
                net: totalIncome - totalExpenses
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getThisMonth = async (req, res) => {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${String(now.getDate()).padStart(2, '0')}`;

        const data = await financeRepo.getByDateRange(startDate, endDate);
        
        let totalIncome = 0;
        let totalExpenses = 0;
        (data || []).forEach(t => {
            if (t.transaction_type === 'income') totalIncome += t.amount;
            else totalExpenses += t.amount;
        });

        res.json({
            success: true,
            transactions: data || [],
            totals: {
                totalIncome,
                totalExpenses,
                net: totalIncome - totalExpenses
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getThisYear = async (req, res) => {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const data = await financeRepo.getByDateRange(startDate, endDate);
        
        let totalIncome = 0;
        let totalExpenses = 0;
        (data || []).forEach(t => {
            if (t.transaction_type === 'income') totalIncome += t.amount;
            else totalExpenses += t.amount;
        });

        res.json({
            success: true,
            transactions: data || [],
            totals: {
                totalIncome,
                totalExpenses,
                net: totalIncome - totalExpenses
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, customer_name, amount, method, description, date } = req.body;
        
        const updates = { category, customer_name, amount, method, description, date };
        const result = await financeRepo.update(id, updates);
        
        res.json({ success: true, message: 'Transaction updated successfully', data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getByDateRange = async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ error: 'Start and end dates required' });
        }
        const data = await financeRepo.getByDateRange(start, end);
        res.json({ success: true, transactions: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMonthlyStats = async (req, res) => {
    try {
        const stats = await financeRepo.getMonthlyStats();
        res.json({ success: true, stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};