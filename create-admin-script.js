// Direct database script to create admin user
// This script connects directly to your database and creates the admin user

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createAdminUser() {
  // Use your DATABASE_URL from Render environment variables
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if admin user already exists
    const existingAdmin = await client.query(
      'SELECT * FROM "user" WHERE email = $1',
      ['admin@nebulastream.com']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('Admin user already exists!');
      
      // Update existing user to admin role
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        'UPDATE "user" SET role = $1, password = $2, "isEmailVerified" = true WHERE email = $3',
        ['admin', hashedPassword, 'admin@nebulastream.com']
      );
      
      console.log('✅ Existing user updated to admin role');
      return;
    }

    // Create new admin user
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const now = new Date();

    await client.query(`
      INSERT INTO "user" (
        id, name, email, password, role, "isEmailVerified", 
        "subscribersCount", "videosCount", "isBanned", 
        "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      id,
      'Admin User',
      'admin@nebulastream.com',
      hashedPassword,
      'admin',
      true,
      0,
      0,
      false,
      now,
      now
    ]);

    console.log('✅ Admin user created successfully!');
    console.log('Login credentials:');
    console.log('Email: admin@nebulastream.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.end();
  }
}

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('Please set DATABASE_URL to your PostgreSQL connection string');
  process.exit(1);
}

createAdminUser();