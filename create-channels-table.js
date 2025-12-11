const { Client } = require('pg');
require('dotenv').config();

async function createChannelsTable() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'YoutubeClone',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create channels table
    await client.query(`
      CREATE TABLE IF NOT EXISTS channels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL,
        handle VARCHAR(30) UNIQUE NOT NULL,
        description TEXT,
        avatar VARCHAR(255),
        banner VARCHAR(255),
        "userId" UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "subscribersCount" INTEGER DEFAULT 0,
        "videosCount" INTEGER DEFAULT 0,
        "totalViews" BIGINT DEFAULT 0,
        "isSuspended" BOOLEAN DEFAULT FALSE,
        "suspensionReason" TEXT,
        "isActive" BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Channels table created');

    // Add channelId column to videos table if it doesn't exist
    await client.query(`
      ALTER TABLE videos 
      ADD COLUMN IF NOT EXISTS "channelId" UUID REFERENCES channels(id) ON DELETE SET NULL;
    `);
    console.log('✅ Added channelId column to videos table');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_channels_userId ON channels("userId");
      CREATE INDEX IF NOT EXISTS idx_channels_handle ON channels(handle);
      CREATE INDEX IF NOT EXISTS idx_channels_isActive ON channels("isActive");
      CREATE INDEX IF NOT EXISTS idx_videos_channelId ON videos("channelId");
    `);
    console.log('✅ Created indexes');

    console.log('\n🎉 Channels feature setup complete!');
    console.log('\nNext steps:');
    console.log('1. Restart your backend server');
    console.log('2. Users can now create multiple channels');
    console.log('3. Admin can manage channels from admin panel');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createChannelsTable();
