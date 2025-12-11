const { Client } = require('pg');
const bcrypt = require('bcrypt');

const email = process.argv[2] || 'admin@nebulastream.com';
const testPassword = process.argv[3] || 'admin123';

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Rehan',
  database: 'YoutubeClone'
});

async function verifyPassword() {
  try {
    await client.connect();
    
    const result = await client.query(
      'SELECT id, name, email, role, password FROM "user" WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ User not found: ${email}`);
      return;
    }

    const user = result.rows[0];
    console.log('\n✅ User found:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    
    if (!user.password) {
      console.log('\n❌ User has NO password set!');
      console.log('   Run: node set-admin-password-simple.js ' + email + ' admin123');
      return;
    }

    console.log(`\n🔐 Testing password: "${testPassword}"`);
    
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    if (isMatch) {
      console.log('✅ Password is CORRECT!');
      console.log('\n📝 You can login with:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${testPassword}`);
    } else {
      console.log('❌ Password is INCORRECT!');
      console.log('\n💡 To set a new password, run:');
      console.log(`   node set-admin-password-simple.js ${email} newpassword`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

verifyPassword();
