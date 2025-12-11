require('dotenv').config();
const { Client } = require('pg');

async function makeCurrentUserAdmin() {
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

    // Get all users
    const result = await client.query(
      'SELECT id, name, email, role FROM "user" ORDER BY "createdAt" DESC'
    );

    if (result.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    console.log('\n📋 Available users:');
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
    });

    // Make the first user (most recent) an admin
    const userToUpdate = result.rows[0];
    
    console.log(`\n🔄 Making "${userToUpdate.name}" (${userToUpdate.email}) an admin...`);
    
    await client.query(
      'UPDATE "user" SET role = $1 WHERE id = $2',
      ['admin', userToUpdate.id]
    );

    console.log('✅ User updated successfully!');
    console.log('\n🎯 Admin access granted to:');
    console.log(`   Name: ${userToUpdate.name}`);
    console.log(`   Email: ${userToUpdate.email}`);
    console.log(`   Role: admin`);
    console.log('\n⚠️  Please logout and login again to refresh your session!');
    console.log('   Then navigate to: http://localhost:3000/#/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

makeCurrentUserAdmin();
