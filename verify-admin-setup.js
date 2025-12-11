const { Client } = require('pg');

async function verifyAdminSetup() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Rehan',
    database: 'YoutubeClone',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const email = process.argv[2] || 'admin@nebulastream.com';
    
    console.log('🔍 Checking admin setup for:', email);
    console.log('='.repeat(50));

    // Check if user exists
    const userResult = await client.query(
      'SELECT id, name, email, role, "isBanned", "isEmailVerified", password FROM "user" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('\n❌ FAIL: User not found');
      console.log('\n💡 Solution:');
      console.log('   1. Register at http://localhost:3000');
      console.log('   2. Use email:', email);
      console.log('   3. Then run this script again');
      return;
    }

    const user = userResult.rows[0];
    let allGood = true;

    console.log('\n📋 User Details:');
    console.log('   ID:', user.id);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('');

    // Check role
    if (user.role === 'admin') {
      console.log('✅ Role: admin');
    } else {
      console.log('❌ Role:', user.role, '(should be "admin")');
      allGood = false;
    }

    // Check banned status
    if (!user.isBanned) {
      console.log('✅ Not banned');
    } else {
      console.log('❌ User is banned');
      allGood = false;
    }

    // Check email verification
    if (user.isEmailVerified) {
      console.log('✅ Email verified');
    } else {
      console.log('❌ Email not verified');
      allGood = false;
    }

    // Check password
    if (user.password) {
      console.log('✅ Password set');
    } else {
      console.log('❌ No password (Google OAuth only?)');
      allGood = false;
    }

    console.log('\n' + '='.repeat(50));

    if (allGood) {
      console.log('\n🎉 SUCCESS! Admin user is properly configured!');
      console.log('\n📝 Next steps:');
      console.log('   1. Make sure backend is running: npm run start:dev');
      console.log('   2. Clear browser localStorage and cookies');
      console.log('   3. Go to http://localhost:3000/admin');
      console.log('   4. Login with:');
      console.log('      Email:', email);
      console.log('      Password: (your password)');
    } else {
      console.log('\n⚠️  Issues found! Running auto-fix...\n');
      
      // Auto-fix issues
      if (user.role !== 'admin') {
        await client.query('UPDATE "user" SET role = $1 WHERE id = $2', ['admin', user.id]);
        console.log('✅ Fixed: Set role to admin');
      }
      
      if (user.isBanned) {
        await client.query('UPDATE "user" SET "isBanned" = false WHERE id = $1', [user.id]);
        console.log('✅ Fixed: Unbanned user');
      }
      
      if (!user.isEmailVerified) {
        await client.query('UPDATE "user" SET "isEmailVerified" = true WHERE id = $1', [user.id]);
        console.log('✅ Fixed: Verified email');
      }

      if (!user.password) {
        console.log('⚠️  No password set. Run: node set-admin-password-simple.js');
      }

      console.log('\n🎉 Auto-fix complete! Try logging in now.');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. PostgreSQL is running');
    console.log('   2. Database "YoutubeClone" exists');
    console.log('   3. Credentials in .env are correct');
  } finally {
    await client.end();
  }
}

verifyAdminSetup();
