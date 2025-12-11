require('dotenv').config();
const { Client } = require('pg');

// CHANGE THIS TO YOUR EMAIL
const EMAIL_TO_MAKE_ADMIN = 'rehantariq0987654321@gmail.com'; // Change this to your logged-in email

async function makeSpecificUserAdmin() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'YoutubeClone',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Rehan',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Find the user
    const result = await client.query(
      'SELECT id, name, email, role FROM "user" WHERE email = $1',
      [EMAIL_TO_MAKE_ADMIN]
    );

    if (result.rows.length === 0) {
      console.log(`❌ User with email "${EMAIL_TO_MAKE_ADMIN}" not found`);
      console.log('\n📋 Available users:');
      
      const allUsers = await client.query(
        'SELECT name, email FROM "user" ORDER BY "createdAt" DESC'
      );
      
      allUsers.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
      });
      
      console.log('\n💡 Update the EMAIL_TO_MAKE_ADMIN variable in this script and run again.');
      return;
    }

    const user = result.rows[0];
    
    if (user.role === 'admin') {
      console.log(`✅ User "${user.name}" (${user.email}) is already an admin!`);
      console.log('\n⚠️  If you still see "Access Denied", please:');
      console.log('   1. Logout from the application');
      console.log('   2. Login again with this email');
      console.log('   3. Navigate to: http://localhost:3000/#/admin');
      return;
    }

    console.log(`🔄 Making "${user.name}" (${user.email}) an admin...`);
    
    await client.query(
      'UPDATE "user" SET role = $1 WHERE id = $2',
      ['admin', user.id]
    );

    console.log('✅ User updated successfully!\n');
    console.log('🎯 Admin access granted to:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: admin\n`);
    console.log('⚠️  IMPORTANT NEXT STEPS:');
    console.log('   1. Logout from the application');
    console.log('   2. Login again with this email');
    console.log('   3. Navigate to: http://localhost:3000/#/admin\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

makeSpecificUserAdmin();
