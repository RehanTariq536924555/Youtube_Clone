const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function testPassword() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Rehan',
    database: 'YoutubeClone',
  });

  try {
    await client.connect();
    
    const email = 'admin@nebulastream.com';
    const testPassword = 'admin123';
    
    console.log('🔍 Testing password for:', email);
    console.log('Password to test:', testPassword);
    console.log('');

    const result = await client.query(
      'SELECT id, name, email, password, role FROM "user" WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = result.rows[0];
    console.log('✅ User found:', user.name);
    console.log('   Role:', user.role);
    console.log('');

    if (!user.password) {
      console.log('❌ No password set for this user');
      console.log('💡 Run: node set-admin-password-simple.js');
      return;
    }

    // Test password
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    if (isMatch) {
      console.log('✅ Password is CORRECT!');
      console.log('');
      console.log('The password "admin123" works for this user.');
      console.log('');
      console.log('💡 If login still fails:');
      console.log('   1. Restart backend server');
      console.log('   2. Clear browser localStorage and cookies');
      console.log('   3. Try logging in again');
    } else {
      console.log('❌ Password is INCORRECT!');
      console.log('');
      console.log('The password "admin123" does NOT match.');
      console.log('');
      console.log('💡 To set a new password, run:');
      console.log('   node set-admin-password-simple.js');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

testPassword();
