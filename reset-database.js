const { Client } = require('pg');
require('dotenv').config();

async function resetDatabase() {
  // First connect to the default 'postgres' database
  const adminClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres', // Connect to default database
  });

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await adminClient.connect();
    
    console.log('🗑️ Dropping existing database...');
    // Terminate existing connections
    await adminClient.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid()
    `, [process.env.DB_NAME]);
    
    // Drop database
    await adminClient.query(`DROP DATABASE IF EXISTS "${process.env.DB_NAME}"`);
    
    console.log('🆕 Creating fresh database...');
    // Create database
    await adminClient.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
    
    console.log('✅ Database reset successfully!');
    console.log(`📊 Database "${process.env.DB_NAME}" is ready for use.`);
    
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('🆕 Database does not exist, creating it...');
      try {
        await adminClient.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
        console.log('✅ Database created successfully!');
      } catch (createError) {
        console.error('❌ Error creating database:', createError.message);
      }
    }
  } finally {
    await adminClient.end();
  }
}

resetDatabase();