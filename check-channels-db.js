const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'nebulastream.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Checking Channels in Database...\n');

// Check if channels table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='channels'", (err, row) => {
  if (err) {
    console.error('❌ Error checking table:', err);
    return;
  }

  if (!row) {
    console.log('❌ Channels table does not exist!');
    console.log('💡 Run: node Backend/create-channels-table.js');
    db.close();
    return;
  }

  console.log('✅ Channels table exists\n');

  // Get all channels
  db.all('SELECT * FROM channels ORDER BY createdAt DESC', (err, channels) => {
    if (err) {
      console.error('❌ Error fetching channels:', err);
      db.close();
      return;
    }

    console.log(`📺 Total Channels: ${channels.length}\n`);

    if (channels.length === 0) {
      console.log('⚠️  No channels found in database!');
      console.log('💡 Users need to create channels first.');
    } else {
      console.log('Channels List:');
      console.log('─'.repeat(80));
      channels.forEach((channel, index) => {
        console.log(`\n${index + 1}. ${channel.name} (@${channel.handle})`);
        console.log(`   ID: ${channel.id}`);
        console.log(`   User ID: ${channel.userId}`);
        console.log(`   Subscribers: ${channel.subscribersCount}`);
        console.log(`   Videos: ${channel.videosCount}`);
        console.log(`   Views: ${channel.totalViews}`);
        console.log(`   Suspended: ${channel.isSuspended ? 'Yes' : 'No'}`);
        console.log(`   Active: ${channel.isActive ? 'Yes' : 'No'}`);
        console.log(`   Created: ${channel.createdAt}`);
      });
    }

    // Get channel stats
    db.get('SELECT COUNT(*) as total FROM channels', (err, total) => {
      db.get('SELECT COUNT(*) as active FROM channels WHERE isActive = 1', (err, active) => {
        db.get('SELECT COUNT(*) as suspended FROM channels WHERE isSuspended = 1', (err, suspended) => {
          console.log('\n' + '─'.repeat(80));
          console.log('\n📊 Channel Statistics:');
          console.log(`   Total Channels: ${total.total}`);
          console.log(`   Active Channels: ${active.active}`);
          console.log(`   Suspended Channels: ${suspended.suspended}`);
          
          db.close();
        });
      });
    });
  });
});
