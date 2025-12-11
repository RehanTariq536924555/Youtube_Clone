const { Client } = require('pg');
require('dotenv').config({ path: '.env.supabase' });

async function setupSupabaseDatabase() {
  console.log('🚀 Setting up Supabase Database...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase database');

    // Test the connection
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', result.rows[0].version);

    // Check existing tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Existing tables:', tablesResult.rows.map(row => row.table_name));

    console.log('✅ Database setup complete!');
    console.log('💡 Your NestJS app will automatically create tables when it starts');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupSupabaseDatabase();