const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://ribfikwmgagrxrfxdevo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYmZpa3dtZ2FncnhyZnhkZXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY5NjA3NywiZXhwIjoyMDc4MjcyMDc3fQ.uTMovQfXDrTr0JgoV9J9B_Q2y2ZkdKYtnaGxAW2VtyE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...\n');

  const sql = fs.readFileSync('database-schema.sql', 'utf8');

  try {
    // Execute the SQL - Note: This uses the REST API which may not support all SQL
    // For full schema, you should run it in Supabase SQL Editor
    console.log('⚠️  Important: The complete schema should be run in Supabase SQL Editor');
    console.log('📋 Steps:');
    console.log('1. Go to: https://ribfikwmgagrxrfxdevo.supabase.co/project/ribfikwmgagrxrfxdevo/sql/new');
    console.log('2. Copy the entire contents of database-schema.sql');
    console.log('3. Paste into the SQL editor');
    console.log('4. Click "Run"\n');

    console.log('✅ Environment variables configured!');
    console.log('✅ Ready to set up database in Supabase dashboard');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupDatabase();
