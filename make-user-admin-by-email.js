const { Client } = require('pg');
const readline = require('readline');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Rehan',
  database: 'YoutubeClone'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function makeUserAdmin() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all users
    const result = await client.query('SELECT id, name, email, role FROM "user" ORDER BY "createdAt" DESC');
    
    if (result.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    console.log('📋 Available users:\n');
    result.rows.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : '👤';
      console.log(`${index + 1}. ${roleIcon} ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
    });

    rl.question('\n🔢 Enter the number of the user you want to make admin (or press Enter to make the most recent user admin): ', async (answer) => {
      try {
        let selectedUser;
        
        if (answer.trim() === '') {
          selectedUser = result.rows[0];
        } else {
          const index = parseInt(answer) - 1;
          if (index < 0 || index >= result.rows.length) {
            console.log('❌ Invalid selection');
            rl.close();
            await client.end();
            return;
          }
          selectedUser = result.rows[index];
        }

        if (selectedUser.role === 'admin') {
          console.log(`\n✅ User "${selectedUser.name}" is already an admin!`);
        } else {
          await client.query('UPDATE "user" SET role = $1 WHERE id = $2', ['admin', selectedUser.id]);
          console.log(`\n✅ Successfully made "${selectedUser.name}" (${selectedUser.email}) an admin!`);
        }

        console.log('\n📝 Admin credentials:');
        console.log(`   Email: ${selectedUser.email}`);
        console.log(`   Role: admin`);
        console.log('\n🔄 Next steps:');
        console.log('   1. Logout from your current session');
        console.log('   2. Login with this email');
        console.log('   3. Access http://localhost:3000/#/admin');

      } catch (error) {
        console.error('❌ Error:', error.message);
      } finally {
        rl.close();
        await client.end();
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    await client.end();
  }
}

makeUserAdmin();
