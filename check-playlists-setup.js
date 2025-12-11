const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'YoutubeClone',
  user: 'postgres',
  password: 'Rehan',
});

async function checkPlaylistsSetup() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if playlists table exists
    const playlistsTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'playlists'
      );
    `);

    console.log('📋 Playlists table exists:', playlistsTableCheck.rows[0].exists);

    if (playlistsTableCheck.rows[0].exists) {
      // Check playlists table structure
      const playlistsColumns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'playlists'
        ORDER BY ordinal_position;
      `);

      console.log('\n📊 Playlists table columns:');
      playlistsColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });

      // Count playlists
      const playlistCount = await client.query('SELECT COUNT(*) FROM playlists');
      console.log(`\n📈 Total playlists: ${playlistCount.rows[0].count}`);

      // Show system playlists
      const systemPlaylists = await client.query(`
        SELECT id, "userId", name, "isSystemPlaylist", "systemPlaylistType", "videosCount"
        FROM playlists
        WHERE "isSystemPlaylist" = true
        LIMIT 10
      `);

      console.log(`\n🔧 System playlists (Liked Videos): ${systemPlaylists.rows.length}`);
      systemPlaylists.rows.forEach(p => {
        console.log(`  - ${p.name} (${p.systemPlaylistType}) - User: ${p.userId} - Videos: ${p.videosCount}`);
      });
    }

    // Check if playlist_videos table exists
    const playlistVideosTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'playlist_videos'
      );
    `);

    console.log('\n📋 Playlist_videos table exists:', playlistVideosTableCheck.rows[0].exists);

    if (playlistVideosTableCheck.rows[0].exists) {
      // Check playlist_videos table structure
      const playlistVideosColumns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'playlist_videos'
        ORDER BY ordinal_position;
      `);

      console.log('\n📊 Playlist_videos table columns:');
      playlistVideosColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });

      // Count playlist videos
      const playlistVideoCount = await client.query('SELECT COUNT(*) FROM playlist_videos');
      console.log(`\n📈 Total playlist videos: ${playlistVideoCount.rows[0].count}`);

      // Show recent playlist videos
      const recentPlaylistVideos = await client.query(`
        SELECT pv.id, pv."playlistId", pv."videoId", pv.position, p.name as playlist_name
        FROM playlist_videos pv
        JOIN playlists p ON p.id = pv."playlistId"
        ORDER BY pv."addedAt" DESC
        LIMIT 10
      `);

      console.log(`\n📹 Recent playlist videos: ${recentPlaylistVideos.rows.length}`);
      recentPlaylistVideos.rows.forEach(pv => {
        console.log(`  - Playlist: ${pv.playlist_name} - Video: ${pv.videoId} - Position: ${pv.position}`);
      });
    }

    // Check likes table
    const likesCheck = await client.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN type = 'like' AND "targetType" = 'video' THEN 1 END) as video_likes
      FROM likes
    `);

    console.log(`\n👍 Likes in database:`);
    console.log(`  - Total likes: ${likesCheck.rows[0].total}`);
    console.log(`  - Video likes: ${likesCheck.rows[0].video_likes}`);

    // Check if there are video likes without corresponding playlist entries
    if (playlistVideosTableCheck.rows[0].exists && playlistsTableCheck.rows[0].exists) {
      const orphanedLikes = await client.query(`
        SELECT l."userId", l."targetId" as "videoId", COUNT(*) as count
        FROM likes l
        WHERE l.type = 'like' 
          AND l."targetType" = 'video'
          AND NOT EXISTS (
            SELECT 1 FROM playlist_videos pv
            JOIN playlists p ON p.id = pv."playlistId"
            WHERE p."userId" = l."userId"
              AND p."isSystemPlaylist" = true
              AND p."systemPlaylistType" = 'liked_videos'
              AND pv."videoId" = l."targetId"
          )
        GROUP BY l."userId", l."targetId"
        LIMIT 10
      `);

      console.log(`\n⚠️  Video likes NOT in "Liked Videos" playlist: ${orphanedLikes.rows.length}`);
      if (orphanedLikes.rows.length > 0) {
        console.log('   These likes exist but are not in the playlist:');
        orphanedLikes.rows.forEach(like => {
          console.log(`   - User: ${like.userId} - Video: ${like.videoId}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkPlaylistsSetup();
