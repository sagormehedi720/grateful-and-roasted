#!/bin/bash

echo "🚀 Setting up Supabase database..."
echo ""

# Read the SQL file
SQL_CONTENT=$(cat database-schema.sql)

# Use Supabase's query endpoint
curl -X POST 'https://ribfikwmgagrxrfxdevo.supabase.co/rest/v1/rpc/exec_sql' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYmZpa3dtZ2FncnhyZnhkZXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY5NjA3NywiZXhwIjoyMDc4MjcyMDc3fQ.uTMovQfXDrTr0JgoV9J9B_Q2y2ZkdKYtnaGxAW2VtyE" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYmZpa3dtZ2FncnhyZnhkZXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY5NjA3NywiZXhwIjoyMDc4MjcyMDc3fQ.uTMovQfXDrTr0JgoV9J9B_Q2y2ZkdKYtnaGxAW2VtyE" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"$SQL_CONTENT\"}" 2>&1

echo ""
echo "Note: If you see an error above, you'll need to run the SQL manually."
echo "Open: https://ribfikwmgagrxrfxdevo.supabase.co/project/ribfikwmgagrxrfxdevo/sql/new"
echo "Then copy and paste the contents of database-schema.sql"
