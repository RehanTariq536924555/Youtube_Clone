const { Client } = require('pg');
require('dotenv').config();

async function createNewDatabase() {
  const adminClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await adminClient.connect();
    
    console.log(`🆕 Creating database "${process.env.DB_NAME}"...`);
    
    // Check if database exists
    const result = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [process.env.DB_NAME]
    );
    
    if (result.rows.length === 0) {
      await adminClient.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log(`✅ Database "${process.env.DB_NAME}" created successfully!`);
    } else {
      console.log(`📊 Database "${process.env.DB_NAME}" already exists.`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await adminClient.end();
  }
}

createNewDatabase();