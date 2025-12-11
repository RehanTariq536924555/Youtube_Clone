const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Rehan',
  database: 'YoutubeClone'
});

async function checkAndMakeAdmin() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Get all users
    const result = await client.query('SELECT id, name, email, role FROM "user" ORDER BY "createdAt" DESC');
    
    if (result.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    console.log('\n📋 Current users:');
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
    });

    // Make the first user (most recent) an admin
    const firstUser = result.rows[0];
    
    if (firstUser.role === 'admin') {
      console.log(`\n✅ User "${firstUser.name}" is already an admin!`);
    } else {
      await client.query('UPDATE "user" SET role = $1 WHERE id = $2', ['admin', firstUser.id]);
      console.log(`\n✅ Successfully made "${firstUser.name}" (${firstUser.email}) an admin!`);
    }

    // Show updated user
    const updatedUser = await client.query('SELECT id, name, email, role FROM "user" WHERE id = $1', [firstUser.id]);
    console.log('\n📝 Updated user info:');
    console.log(`   Name: ${updatedUser.rows[0].name}`);
    console.log(`   Email: ${updatedUser.rows[0].email}`);
    console.log(`   Role: ${updatedUser.rows[0].role}`);
    
    console.log('\n🔄 Please refresh your browser and try accessing /admin again');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkAndMakeAdmin();
