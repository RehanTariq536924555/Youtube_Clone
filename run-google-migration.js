const { Client } = require('pg');
require('dotenv').config();

async function runGoogleMigration() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    
    console.log('🔍 Checking user table structure...');
    
    // Check if googleId column already exists
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user' AND column_name IN ('googleId', 'picture')
    `);
    
    const existingColumns = columnCheck.rows.map(r => r.column_name);
    console.log('📋 Existing Google columns:', existingColumns);
    
    // Add googleId column if it doesn't exist
    if (!existingColumns.includes('googleId')) {
      console.log('➕ Adding googleId column...');
      await client.query('ALTER TABLE "user" ADD COLUMN "googleId" varchar');
    }
    
    // Add picture column if it doesn't exist
    if (!existingColumns.includes('picture')) {
      console.log('➕ Adding picture column...');
      await client.query('ALTER TABLE "user" ADD COLUMN "picture" varchar');
    }
    
    // Make password nullable for Google OAuth users
    console.log('🔄 Making password column nullable...');
    await client.query('ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL');
    
    console.log('✅ Google OAuth migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

runGoogleMigration();