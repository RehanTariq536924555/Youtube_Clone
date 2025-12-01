const { Client } = require('pg');
require('dotenv').config();

async function runShortsMigration() {
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
    
    console.log('🔍 Checking videos table structure...');
    
    // Check if isShort column already exists
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'videos' AND column_name = 'isShort'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('➕ Adding isShort column...');
      await client.query('ALTER TABLE "videos" ADD COLUMN "isShort" boolean DEFAULT false');
    } else {
      console.log('✅ isShort column already exists');
    }
    
    // Update existing short videos
    console.log('🔄 Updating existing short videos...');
    const updateResult = await client.query(`
      UPDATE "videos" 
      SET "isShort" = true 
      WHERE "duration" <= 60 AND "duration" IS NOT NULL AND "isShort" = false
    `);
    
    console.log(`✅ Updated ${updateResult.rowCount} videos to shorts`);
    console.log('🎬 Shorts migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

runShortsMigration();