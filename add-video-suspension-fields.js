const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'YoutubeClone',
  user: 'postgres',
  password: 'Rehan',
});

async function addVideoSuspensionFields() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if columns already exist
    const checkColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'videos' 
        AND column_name IN ('isSuspended', 'suspensionReason')
    `);

    const existingColumns = checkColumns.rows.map(row => row.column_name);

    if (existingColumns.includes('isSuspended') && existingColumns.includes('suspensionReason')) {
      console.log('✅ Suspension fields already exist!');
      return;
    }

    console.log('📝 Adding suspension fields to videos table...\n');

    // Add isSuspended column
    if (!existingColumns.includes('isSuspended')) {
      await client.query(`
        ALTER TABLE videos 
        ADD COLUMN "isSuspended" BOOLEAN DEFAULT false
      `);
      console.log('✅ Added isSuspended column');
    }

    // Add suspensionReason column
    if (!existingColumns.includes('suspensionReason')) {
      await client.query(`
        ALTER TABLE videos 
        ADD COLUMN "suspensionReason" TEXT
      `);
      console.log('✅ Added suspensionReason column');
    }

    // Update existing videos to not be suspended
    await client.query(`
      UPDATE videos 
      SET "isSuspended" = false 
      WHERE "isSuspended" IS NULL
    `);

    console.log('\n✅ Video suspension fields added successfully!');
    console.log('\n📊 Summary:');
    console.log('  - isSuspended: BOOLEAN (default: false)');
    console.log('  - suspensionReason: TEXT (nullable)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

addVideoSuspensionFields();
