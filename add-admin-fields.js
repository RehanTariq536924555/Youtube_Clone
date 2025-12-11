const { Client } = require('pg');
require('dotenv').config();

async function addAdminFields() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'YoutubeClone',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Add role and isBanned columns to user table
    console.log('Adding role and isBanned columns to user table...');
    await client.query(`
      ALTER TABLE "user" 
      ADD COLUMN IF NOT EXISTS "role" VARCHAR(50) DEFAULT 'user',
      ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN DEFAULT false;
    `);
    console.log('✅ User table updated');

    // Add isFeatured column to videos table
    console.log('Adding isFeatured column to videos table...');
    await client.query(`
      ALTER TABLE "videos" 
      ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN DEFAULT false;
    `);
    console.log('✅ Videos table updated');

    // Create an admin user (optional)
    console.log('\nCreating admin user...');
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO "user" (id, name, email, password, role, "isEmailVerified")
      VALUES (gen_random_uuid(), 'Admin', 'admin@nebulastream.com', $1, 'admin', true)
      ON CONFLICT (email) DO UPDATE SET role = 'admin';
    `, [hashedPassword]);
    
    console.log('✅ Admin user created/updated');
    console.log('\n📧 Admin credentials:');
    console.log('   Email: admin@nebulastream.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

addAdminFields();
