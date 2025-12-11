const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Rehan',
  database: 'YoutubeClone'
});

// Get email and password from command line
const email = process.argv[2] || 'admin@nebulastream.com';
const password = process.argv[3] || 'admin123';

async function setPassword() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Find user
    const result = await client.query('SELECT id, name, email, role FROM "user" WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log(`❌ User with email "${email}" not found`);
      return;
    }

    const user = result.rows[0];

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await client.query('UPDATE "user" SET password = $1 WHERE id = $2', [hashedPassword, user.id]);

    console.log('✅ Password set successfully!\n');
    console.log('📝 Admin Login Credentials:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${user.role}`);
    console.log('\n🌐 Access admin panel at:');
    console.log('   http://localhost:3000/#/admin');
    console.log('\n💡 Usage:');
    console.log('   node set-admin-password-simple.js <email> <password>');
    console.log('   Example: node set-admin-password-simple.js admin@nebulastream.com mypassword');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

setPassword();
