const { Client } = require('pg');
require('dotenv').config();

async function checkChannels() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'YoutubeClone',
  });

  try {
    console.log('🔍 Connecting to PostgreSQL database...\n');
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if channels table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'channels'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ Channels table does not exist!');
      console.log('💡 Run: node Backend/create-channels-table.js');
      await client.end();
      return;
    }

    console.log('✅ Channels table exists\n');

    // Get total count
    const countResult = await client.query('SELECT COUNT(*) FROM channels');
    const totalChannels = parseInt(countResult.rows[0].count);

    console.log(`📊 Total Channels in Database: ${totalChannels}\n`);

    if (totalChannels === 0) {
      console.log('⚠️  No channels found in database!');
      console.log('\n💡 To create test channels:');
      console.log('   1. Login as regular user (not admin)');
      console.log('   2. Go to: http://localhost:3000/my-channels');
      console.log('   3. Create a channel');
      console.log('   4. Then check admin panel again\n');
      await client.end();
      return;
    }

    // Get all channels with user info
    const channelsResult = await client.query(`
      SELECT 
        c.id,
        c.name,
        c.handle,
        c."userId",
        c."subscribersCount",
        c."videosCount",
        c."totalViews",
        c."isSuspended",
        c."isActive",
        c."createdAt",
        u.name as "userName",
        u.email as "userEmail"
      FROM channels c
      LEFT JOIN users u ON c."userId" = u.id
      ORDER BY c."createdAt" DESC
    `);

    console.log('📺 Channels List:');
    console.log('═'.repeat(100));

    channelsResult.rows.forEach((channel, index) => {
      console.log(`\n${index + 1}. ${channel.name} (@${channel.handle})`);
      console.log(`   ID: ${channel.id}`);
      console.log(`   Owner: ${channel.userName} (${channel.userEmail})`);
      console.log(`   User ID: ${channel.userId}`);
      console.log(`   Subscribers: ${channel.subscribersCount}`);
      console.log(`   Videos: ${channel.videosCount}`);
      console.log(`   Views: ${channel.totalViews}`);
      console.log(`   Suspended: ${channel.isSuspended ? 'Yes' : 'No'}`);
      console.log(`   Active: ${channel.isActive ? 'Yes' : 'No'}`);
      console.log(`   Created: ${new Date(channel.createdAt).toLocaleString()}`);
    });

    // Get stats
    const statsResult = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE "isActive" = true) as active,
        COUNT(*) FILTER (WHERE "isSuspended" = true) as suspended
      FROM channels
    `);

    const stats = statsResult.rows[0];

    console.log('\n' + '═'.repeat(100));
    console.log('\n📊 Channel Statistics:');
    console.log(`   Total Channels: ${stats.total}`);
    console.log(`   Active Channels: ${stats.active}`);
    console.log(`   Suspended Channels: ${stats.suspended}`);

    console.log('\n✅ Database check complete!');
    console.log('\n💡 If admin panel shows 0:');
    console.log('   1. Make sure backend is running');
    console.log('   2. Make sure you are logged in as admin');
    console.log('   3. Check browser console for errors (F12)');
    console.log('   4. Try: diagnose-admin-channels.html');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Check PostgreSQL is running');
    console.log('   - Verify .env file has correct database credentials');
    console.log('   - Make sure database exists');
  } finally {
    await client.end();
  }
}

checkChannels();
