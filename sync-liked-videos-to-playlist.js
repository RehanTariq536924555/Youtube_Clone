const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'YoutubeClone',
  user: 'postgres',
  password: 'Rehan',
});

async function syncLikedVideosToPlaylist() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all video likes that are not in playlists
    const orphanedLikes = await client.query(`
      SELECT DISTINCT l."userId", l."targetId" as "videoId"
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
    `);

    console.log(`📊 Found ${orphanedLikes.rows.length} video likes not in playlists\n`);

    if (orphanedLikes.rows.length === 0) {
      console.log('✅ All liked videos are already in playlists!');
      return;
    }

    let created = 0;
    let errors = 0;

    for (const like of orphanedLikes.rows) {
      try {
        // Check if user has a "Liked Videos" playlist
        let playlist = await client.query(`
          SELECT id FROM playlists
          WHERE "userId" = $1
            AND "isSystemPlaylist" = true
            AND "systemPlaylistType" = 'liked_videos'
        `, [like.userId]);

        let playlistId;

        if (playlist.rows.length === 0) {
          // Create "Liked Videos" playlist for this user
          console.log(`  📝 Creating "Liked Videos" playlist for user ${like.userId}`);
          const newPlaylist = await client.query(`
            INSERT INTO playlists (
              id, "userId", name, description, visibility, 
              "isSystemPlaylist", "systemPlaylistType", "videosCount", 
              "createdAt", "updatedAt"
            )
            VALUES (
              gen_random_uuid(), $1, 'Liked Videos', 'Videos you have liked', 
              'private', true, 'liked_videos', 0, NOW(), NOW()
            )
            RETURNING id
          `, [like.userId]);
          playlistId = newPlaylist.rows[0].id;
        } else {
          playlistId = playlist.rows[0].id;
        }

        // Get the next position in the playlist
        const maxPosition = await client.query(`
          SELECT COALESCE(MAX(position), -1) as max_pos
          FROM playlist_videos
          WHERE "playlistId" = $1
        `, [playlistId]);

        const nextPosition = maxPosition.rows[0].max_pos + 1;

        // Add video to playlist
        await client.query(`
          INSERT INTO playlist_videos (
            id, "playlistId", "videoId", position, "addedAt"
          )
          VALUES (
            gen_random_uuid(), $1, $2, $3, NOW()
          )
        `, [playlistId, like.videoId, nextPosition]);

        // Update playlist videos count
        await client.query(`
          UPDATE playlists
          SET "videosCount" = (
            SELECT COUNT(*) FROM playlist_videos WHERE "playlistId" = $1
          ),
          "updatedAt" = NOW()
          WHERE id = $1
        `, [playlistId]);

        created++;
        console.log(`  ✅ Added video ${like.videoId} to playlist for user ${like.userId}`);

      } catch (error) {
        errors++;
        console.error(`  ❌ Error adding video ${like.videoId} for user ${like.userId}:`, error.message);
      }
    }

    console.log(`\n📊 Sync Summary:`);
    console.log(`  - Videos added to playlists: ${created}`);
    console.log(`  - Errors: ${errors}`);
    console.log(`\n✅ Sync complete!`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

syncLikedVideosToPlaylist();
