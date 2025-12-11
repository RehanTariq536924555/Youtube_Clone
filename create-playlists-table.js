const { Client } = require('pg');
require('dotenv').config();

async function createPlaylistsTables() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'YoutubeClone',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Create playlists table
    console.log('Creating playlists table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS playlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        visibility VARCHAR(50) DEFAULT 'public',
        "isSystemPlaylist" BOOLEAN DEFAULT false,
        "systemPlaylistType" VARCHAR(50),
        thumbnail VARCHAR(500),
        "videosCount" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Playlists table created\n');

    // Create playlist_videos junction table
    console.log('Creating playlist_videos table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS playlist_videos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "playlistId" UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
        "videoId" UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
        position INTEGER NOT NULL DEFAULT 0,
        "addedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("playlistId", "videoId")
      );
    `);
    console.log('✅ Playlist_videos table created\n');

    // Create indexes
    console.log('Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_playlists_user ON playlists("userId");
      CREATE INDEX IF NOT EXISTS idx_playlists_system ON playlists("isSystemPlaylist", "systemPlaylistType");
      CREATE INDEX IF NOT EXISTS idx_playlist_videos_playlist ON playlist_videos("playlistId");
      CREATE INDEX IF NOT EXISTS idx_playlist_videos_video ON playlist_videos("videoId");
      CREATE INDEX IF NOT EXISTS idx_playlist_videos_position ON playlist_videos("playlistId", position);
    `);
    console.log('✅ Indexes created\n');

    // Create system playlists for existing users
    console.log('Creating system playlists for existing users...');
    const usersResult = await client.query('SELECT id FROM users');
    
    for (const user of usersResult.rows) {
      // Check if Liked Videos playlist exists
      const likedPlaylist = await client.query(
        `SELECT id FROM playlists WHERE "userId" = $1 AND "systemPlaylistType" = 'liked_videos'`,
        [user.id]
      );

      if (likedPlaylist.rows.length === 0) {
        await client.query(
          `INSERT INTO playlists ("userId", name, description, visibility, "isSystemPlaylist", "systemPlaylistType")
           VALUES ($1, 'Liked Videos', 'Videos you have liked', 'private', true, 'liked_videos')`,
          [user.id]
        );
        console.log(`  ✅ Created Liked Videos playlist for user ${user.id}`);
      }
    }

    console.log('\n✅ All tables created successfully!');
    console.log('\n📊 Summary:');
    console.log('  - playlists table: Stores playlist information');
    console.log('  - playlist_videos table: Links videos to playlists');
    console.log('  - System playlists created for all users');
    console.log('\n🎉 Playlist feature is ready to use!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createPlaylistsTables();
