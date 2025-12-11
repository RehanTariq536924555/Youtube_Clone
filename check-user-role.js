const { Client } = require('pg');

const email = process.argv[2] || 'admin@nebulastream.com';

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Rehan',
  database: 'YoutubeClone'
});

async function checkUser() {
  try {
    await client.connect();
    
    const result = await client.query(
      'SELECT id, name, email, role, password IS NOT NULL as has_password FROM "user" WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ User not found: ${email}`);
    } else {
      const user = result.rows[0];
      console.log('\n✅ User found:');
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role || 'user'}`);
      console.log(`   Has Password: ${user.has_password ? 'Yes' : 'No'}`);
      console.log(`   User ID: ${user.id}`);
      
      if (user.role !== 'admin') {
        console.log('\n⚠️  This user is NOT an admin!');
        console.log('   Run: node quick-make-admin.js ' + email);
      } else {
        console.log('\n✅ This user IS an admin!');
      }
      
      if (!user.has_password) {
        console.log('\n⚠️  This user has NO password!');
        console.log('   Run: node set-admin-password-simple.js ' + email + ' admin123');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUser();
