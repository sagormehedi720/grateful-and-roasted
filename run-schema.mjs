import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://ribfikwmgagrxrfxdevo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYmZpa3dtZ2FncnhyZnhkZXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY5NjA3NywiZXhwIjoyMDc4MjcyMDc3fQ.uTMovQfXDrTr0JgoV9J9B_Q2y2ZkdKYtnaGxAW2VtyE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Setting up database tables...\n');

// Split the SQL into individual statements
const sqlFile = readFileSync('database-schema.sql', 'utf8');

// Try to execute via Supabase
async function setupTables() {
  try {
    // First, let's just try to create the tables using individual commands
    console.log('Creating tables...');

    // The REST API doesn't support raw SQL execution for security
    // So we need to guide the user to do it manually

    console.log('❗ Supabase requires SQL to be run through their dashboard for security.');
    console.log('\n📋 Please follow these steps:\n');
    console.log('1. Click this link to open SQL Editor:');
    console.log('   👉 https://ribfikwmgagrxrfxdevo.supabase.co/project/ribfikwmgagrxrfxdevo/sql/new\n');
    console.log('2. Copy the ENTIRE contents of the file: database-schema.sql');
    console.log('   (It starts with "-- Grateful & Roasted Database Schema")\n');
    console.log('3. Paste it into the SQL Editor in your browser\n');
    console.log('4. Click the green "Run" button (or press Cmd/Ctrl + Enter)\n');
    console.log('5. You should see: "Success. No rows returned" ✅\n');
    console.log('6. Verify by clicking "Table Editor" - you should see 5 tables:\n');
    console.log('   - games');
    console.log('   - players');
    console.log('   - submissions');
    console.log('   - votes');
    console.log('   - reactions\n');
    console.log('This is a ONE-TIME setup and takes ~30 seconds!\n');
    console.log('Once done, your app will be fully functional! 🎉');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupTables();
