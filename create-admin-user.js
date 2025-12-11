require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'YoutubeClone',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Rehan',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if admin user already exists
    const checkResult = await client.query(
      'SELECT * FROM "user" WHERE email = $1',
      ['admin@nebulastream.com']
    );

    if (checkResult.rows.length > 0) {
      console.log('📝 Admin user already exists, updating role...');
      
      // Update existing user to admin
      await client.query(
        'UPDATE "user" SET role = $1, "isEmailVerified" = true WHERE email = $2',
        ['admin', 'admin@nebulastream.com']
      );
      
      console.log('✅ Admin user updated successfully!');
      console.log('\n📧 Email: admin@nebulastream.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
    } else {
      console.log('📝 Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Create new admin user
      await client.query(
        `INSERT INTO "user" (name, email, password, role, "isEmailVerified", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        ['Admin User', 'admin@nebulastream.com', hashedPassword, 'admin', true]
      );
      
      console.log('✅ Admin user created successfully!');
      console.log('\n📧 Email: admin@nebulastream.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
    }

    console.log('\n🎯 You can now login and access the admin panel at:');
    console.log('   http://localhost:3000/#/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdminUser();
