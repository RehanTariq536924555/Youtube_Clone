const { Client } = require('pg');
const bcrypt = require('bcrypt');
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

async function setAdminPassword() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all admin users
    const result = await client.query('SELECT id, name, email, role FROM "user" WHERE role = $1', ['admin']);
    
    if (result.rows.length === 0) {
      console.log('❌ No admin users found');
      console.log('\nRun this first to make a user admin:');
      console.log('  node quick-make-admin.js your-email@example.com');
      rl.close();
      await client.end();
      return;
    }

    console.log('👑 Admin users:\n');
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
    });

    rl.question('\n🔢 Select user number (or press Enter for first): ', (answer) => {
      let selectedUser;
      
      if (answer.trim() === '') {
        selectedUser = result.rows[0];
      } else {
        const index = parseInt(answer) - 1;
        if (index < 0 || index >= result.rows.length) {
          console.log('❌ Invalid selection');
          rl.close();
          client.end();
          return;
        }
        selectedUser = result.rows[index];
      }

      rl.question(`\n🔐 Enter password for ${selectedUser.email}: `, async (password) => {
        try {
          if (!password || password.length < 3) {
            console.log('❌ Password too short (minimum 3 characters)');
            rl.close();
            await client.end();
            return;
          }

          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Update user password
          await client.query('UPDATE "user" SET password = $1 WHERE id = $2', [hashedPassword, selectedUser.id]);

          console.log('\n✅ Password set successfully!');
          console.log('\n📝 Admin Login Credentials:');
          console.log(`   Email: ${selectedUser.email}`);
          console.log(`   Password: ${password}`);
          console.log('\n🌐 Access admin panel at:');
          console.log('   http://localhost:3000/#/admin');

        } catch (error) {
          console.error('❌ Error:', error.message);
        } finally {
          rl.close();
          await client.end();
        }
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    await client.end();
  }
}

setAdminPassword();
