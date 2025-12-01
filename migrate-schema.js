const { Client } = require('pg');
require('dotenv').config();

async function migrateSchema() {
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
    
    console.log('🔍 Checking current schema...');
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Existing tables:', tablesResult.rows.map(r => r.table_name));
    
    // If videos table exists, check its structure
    const videosTableExists = tablesResult.rows.some(r => r.table_name === 'videos');
    
    if (videosTableExists) {
      console.log('🎥 Videos table exists, checking structure...');
      
      // Check userId column type
      const columnInfo = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'videos' AND column_name = 'userId'
      `);
      
      if (columnInfo.rows.length > 0) {
        console.log('📊 Current userId column:', columnInfo.rows[0]);
        
        // If userId is integer, we need to migrate
        if (columnInfo.rows[0].data_type === 'integer') {
          console.log('🔄 Migrating userId from integer to UUID...');
          
          // Step 1: Delete all videos (since we can't easily convert integer IDs to UUIDs)
          await client.query('DELETE FROM videos');
          console.log('🗑️ Cleared existing videos');
          
          // Step 2: Drop and recreate the userId column as UUID
          await client.query('ALTER TABLE videos DROP COLUMN "userId"');
          await client.query('ALTER TABLE videos ADD COLUMN "userId" uuid NOT NULL');
          console.log('✅ Updated userId column to UUID');
        }
      }
    }
    
    // Check users table
    const usersTableExists = tablesResult.rows.some(r => r.table_name === 'user');
    
    if (usersTableExists) {
      console.log('👥 Users table exists, checking structure...');
      
      const userIdInfo = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'user' AND column_name = 'id'
      `);
      
      if (userIdInfo.rows.length > 0 && userIdInfo.rows[0].data_type === 'integer') {
        console.log('🔄 Migrating user ID from integer to UUID...');
        
        // Clear users table and recreate with UUID
        await client.query('DELETE FROM "user"');
        await client.query('ALTER TABLE "user" DROP COLUMN id');
        await client.query('ALTER TABLE "user" ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid()');
        console.log('✅ Updated user ID column to UUID');
      }
    }
    
    console.log('✅ Schema migration completed!');
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    await client.end();
  }
}

migrateSchema();