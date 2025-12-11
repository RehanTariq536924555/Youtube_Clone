const { Client } = require('pg');

async function fixAdminRole() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Rehan',
    database: 'YoutubeClone',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Get the email from command line or use default
    const email = process.argv[2] || 'admin@nebulastream.com';
    
    console.log(`\n🔍 Checking user: ${email}`);

    // Check if user exists
    const userResult = await client.query(
      'SELECT id, name, email, role, "isBanned", "isEmailVerified" FROM "user" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log(`❌ User not found: ${email}`);
      console.log('\n💡 Please create this user first by registering at http://localhost:3000');
      console.log('   Then run this script again.');
      return;
    }

    const user = userResult.rows[0];
    console.log('\n📋 Current user details:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Banned: ${user.isBanned}`);
    console.log(`   Email Verified: ${user.isEmailVerified}`);

    // Fix the user
    let updated = false;

    if (user.role !== 'admin') {
      await client.query(
        'UPDATE "user" SET role = $1 WHERE id = $2',
        ['admin', user.id]
      );
      console.log('\n✅ Updated role to: admin');
      updated = true;
    }

    if (user.isBanned) {
      await client.query(
        'UPDATE "user" SET "isBanned" = false WHERE id = $1',
        [user.id]
      );
      console.log('✅ Unbanned user');
      updated = true;
    }

    if (!user.isEmailVerified) {
      await client.query(
        'UPDATE "user" SET "isEmailVerified" = true WHERE id = $1',
        [user.id]
      );
      console.log('✅ Verified email');
      updated = true;
    }

    if (!updated) {
      console.log('\n✅ User already has admin privileges!');
    } else {
      console.log('\n✅ User is now ready for admin access!');
    }

    // Verify the changes
    const verifyResult = await client.query(
      'SELECT id, name, email, role, "isBanned", "isEmailVerified" FROM "user" WHERE email = $1',
      [email]
    );

    const updatedUser = verifyResult.rows[0];
    console.log('\n📋 Updated user details:');
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   Banned: ${updatedUser.isBanned}`);
    console.log(`   Email Verified: ${updatedUser.isEmailVerified}`);

    console.log('\n🎉 Done! You can now login at http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixAdminRole();
