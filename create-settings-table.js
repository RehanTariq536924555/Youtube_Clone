const { Client } = require('pg');

async function createSettingsTable() {
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

    // Create settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created site_settings table');

    // Insert default settings
    await client.query(`
      INSERT INTO site_settings (setting_key, setting_value)
      VALUES 
        ('site_name', 'NebulaStream'),
        ('site_tagline', 'Your Video Streaming Platform'),
        ('site_description', 'Watch, upload, and share videos with the world')
      ON CONFLICT (setting_key) DO NOTHING
    `);
    console.log('✅ Inserted default settings');

    // Verify
    const result = await client.query('SELECT * FROM site_settings');
    console.log('\n📋 Current Settings:');
    result.rows.forEach(row => {
      console.log(`   ${row.setting_key}: ${row.setting_value}`);
    });

    console.log('\n🎉 Settings table created successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createSettingsTable();
