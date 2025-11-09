const fetch = require('node-fetch');
const fs = require('fs');

const SUPABASE_URL = 'https://ribfikwmgagrxrfxdevo.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYmZpa3dtZ2FncnhyZnhkZXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY5NjA3NywiZXhwIjoyMDc4MjcyMDc3fQ.uTMovQfXDrTr0JgoV9J9B_Q2y2ZkdKYtnaGxAW2VtyE';

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...\n');

  const sql = fs.readFileSync('database-schema.sql', 'utf8');

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      console.log('✅ Database schema created successfully!');
      console.log('✅ Tables created: games, players, submissions, votes, reactions');
    } else {
      const error = await response.text();
      console.log('⚠️  Note: The Supabase REST API might not support direct SQL execution.');
      console.log('📋 Please run the schema manually:');
      console.log('\n1. Open: https://ribfikwmgagrxrfxdevo.supabase.co/project/ribfikwmgagrxrfxdevo/sql/new');
      console.log('2. Copy all contents from database-schema.sql');
      console.log('3. Paste into SQL Editor');
      console.log('4. Click "Run"\n');
    }
  } catch (error) {
    console.log('📋 Please set up the database manually in Supabase:');
    console.log('\n1. Open: https://ribfikwmgagrxrfxdevo.supabase.co/project/ribfikwmgagrxrfxdevo/sql/new');
    console.log('2. Copy all contents from database-schema.sql');
    console.log('3. Paste into SQL Editor');
    console.log('4. Click "Run"\n');
    console.log('This is a one-time setup and takes about 30 seconds!');
  }
}

setupDatabase();
