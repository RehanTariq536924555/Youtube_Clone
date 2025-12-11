const { Client } = require('pg');

async function fixSettingsTable() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Rehan',
    database: 'YoutubeClone',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Drop the existing table
    console.log('🗑️  Dropping old site_settings table...');
    await client.query('DROP TABLE IF EXISTS site_settings CASCADE');
    console.log('✅ Dropped old table\n');

    // Create new table with correct schema
    console.log('📝 Creating new site_settings table...');
    await client.query(`
      CREATE TABLE site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(255) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created new table\n');

    // Insert default settings
    console.log('📝 Inserting default settings...');
    await client.query(`
      INSERT INTO site_settings (setting_key, setting_value)
      VALUES 
        ('site_name', 'NebulaStream'),
        ('site_tagline', 'Your Video Streaming Platform'),
        ('site_description', 'Watch, upload, and share videos with the world')
    `);
    console.log('✅ Inserted default settings\n');

    // Verify
    const result = await client.query('SELECT * FROM site_settings ORDER BY id');
    console.log('📋 Current Settings:');
    result.rows.forEach(row => {
      console.log(`   ${row.setting_key}: ${row.setting_value}`);
    });

    console.log('\n🎉 Settings table fixed successfully!');
    console.log('\n💡 Now restart the backend server:');
    console.log('   cd Backend');
    console.log('   npm run start:dev');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixSettingsTable();
