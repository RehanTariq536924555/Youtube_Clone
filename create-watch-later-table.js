const { Client } = require('pg');
require('dotenv').config();

async function createWatchLaterTable() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'YoutubeClone',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if video table exists
    const videoTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'video'
      );
    `);
    
    if (!videoTableCheck.rows[0].exists) {
      console.log('⚠️  Video table does not exist yet. Please start the backend server first to create all tables.');
      console.log('   Run: npm run start:dev');
      console.log('   Then run this script again.');
      process.exit(0);
    }

    // Create watch_later table
    await client.query(`
      CREATE TABLE IF NOT EXISTS watch_later (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL,
        "videoId" UUID NOT NULL,
        "addedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_watch_later_user FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE,
        CONSTRAINT fk_watch_later_video FOREIGN KEY ("videoId") REFERENCES video(id) ON DELETE CASCADE,
        CONSTRAINT unique_user_video UNIQUE ("userId", "videoId")
      );
    `);
    console.log('✅ watch_later table created successfully');

    // Create index for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_watch_later_user ON watch_later("userId");
    `);
    console.log('✅ Index created on userId');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_watch_later_video ON watch_later("videoId");
    `);
    console.log('✅ Index created on videoId');

    console.log('\n🎉 Watch Later feature database setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createWatchLaterTable();
