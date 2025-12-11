const { Client } = require('pg');

// Get email from command line argument
const emailToMakeAdmin = process.argv[2];

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Rehan',
  database: 'YoutubeClone'
});

async function makeAdmin() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    if (!emailToMakeAdmin) {
      // No email provided, show all users and make the most recent one admin
      const result = await client.query('SELECT id, name, email, role FROM "user" ORDER BY "createdAt" DESC LIMIT 5');
      
      console.log('📋 Recent users:');
      result.rows.forEach((user, index) => {
        const roleIcon = user.role === 'admin' ? '👑' : '👤';
        console.log(`${index + 1}. ${roleIcon} ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
      });

      const firstUser = result.rows[0];
      
      if (firstUser.role === 'admin') {
        console.log(`\n✅ Most recent user "${firstUser.name}" is already an admin!`);
      } else {
        await client.query('UPDATE "user" SET role = $1 WHERE id = $2', ['admin', firstUser.id]);
        console.log(`\n✅ Made "${firstUser.name}" (${firstUser.email}) an admin!`);
      }

      console.log('\n💡 Usage: node quick-make-admin.js <email>');
      console.log('   Example: node quick-make-admin.js user@example.com');
    } else {
      // Email provided, make that user admin
      const result = await client.query('SELECT id, name, email, role FROM "user" WHERE email = $1', [emailToMakeAdmin]);
      
      if (result.rows.length === 0) {
        console.log(`❌ User with email "${emailToMakeAdmin}" not found`);
        return;
      }

      const user = result.rows[0];
      
      if (user.role === 'admin') {
        console.log(`✅ User "${user.name}" (${user.email}) is already an admin!`);
      } else {
        await client.query('UPDATE "user" SET role = $1 WHERE id = $2', ['admin', user.id]);
        console.log(`✅ Successfully made "${user.name}" (${user.email}) an admin!`);
      }
    }

    console.log('\n🔄 Next steps:');
    console.log('   1. Logout from your current session');
    console.log('   2. Login with the admin email');
    console.log('   3. Access http://localhost:3000/#/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

makeAdmin();
