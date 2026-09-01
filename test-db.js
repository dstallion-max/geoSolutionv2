import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔗 Connecting to Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✓ Present' : '✗ Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // Try to get staff count
        const { count, error } = await supabase
            .from('staff')
            .select('*', { count: 'exact', head: true });
        
        if (error) {
            console.log('❌ Error:', error.message);
            console.log('Code:', error.code);
            return;
        }
        
        console.log('✅ Database Connected Successfully!');
        console.log(`📊 Staff count: ${count || 0}`);
        
        // Try to get a staff member
        const { data, error: dataError } = await supabase
            .from('staff')
            .select('email, full_name, role')
            .limit(1);
        
        if (!dataError && data && data.length > 0) {
            console.log('👤 Sample staff:', data[0]);
        }
        
    } catch (err) {
        console.log('❌ Exception:', err.message);
    }
}

testConnection();