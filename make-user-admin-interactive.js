require('dotenv').config();
const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function makeUserAdmin() {
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

    // Get all users
    const result = await client.query(
      'SELECT id, name, email, role FROM "user" ORDER BY "createdAt" DESC'
    );

    if (result.rows.length === 0) {
      console.log('❌ No users found in database');
      rl.close();
      return;
    }

    console.log('📋 Available users:\n');
    result.rows.forEach((user, index) => {
      const roleDisplay = user.role === 'admin' ? '👑 ADMIN' : '👤 User';
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${roleDisplay}`);
    });

    console.log('\n');
    const answer = await question('Enter the number of the user you want to make admin (or press Enter to make user #2): ');
    
    let selectedIndex = answer.trim() ? parseInt(answer) - 1 : 1; // Default to user #2
    
    if (selectedIndex < 0 || selectedIndex >= result.rows.length) {
      console.log('❌ Invalid selection');
      rl.close();
      return;
    }

    const userToUpdate = result.rows[selectedIndex];
    
    console.log(`\n🔄 Making "${userToUpdate.name}" (${userToUpdate.email}) an admin...`);
    
    await client.query(
      'UPDATE "user" SET role = $1 WHERE id = $2',
      ['admin', userToUpdate.id]
    );

    console.log('✅ User updated successfully!\n');
    console.log('🎯 Admin access granted to:');
    console.log(`   Name: ${userToUpdate.name}`);
    console.log(`   Email: ${userToUpdate.email}`);
    console.log(`   Role: admin\n`);
    console.log('⚠️  IMPORTANT: You must logout and login again to refresh your session!');
    console.log('   Then navigate to: http://localhost:3000/#/admin\n');

    rl.close();

  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  } finally {
    await client.end();
  }
}

makeUserAdmin();
