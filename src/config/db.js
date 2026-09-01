// db.js 
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file');
    process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const connectDb = async () => {
    try {
        const { error } = await supabase.from('students').select('*', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Database Connected Successfully');
    } catch (error) {
        console.log('❌ Database Connection Failed: ' + error.message);
        process.exit(1);
    }
};