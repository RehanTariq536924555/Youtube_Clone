const { Client } = require('pg');

// CONFIGURATION - Change this to your email
const YOUR_EMAIL = 'rehantariq0987654321@gmail.com';

// Database configuration (update if needed)
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'YoutubeClone',
  user: 'postgres',
  password: 'Rehan',
};

async function fixAdminAccess() {
  const client = new Client(DB_CONFIG);

  try {
    console.log('🔧 Admin Access Fix Tool\n');
    console.log('=' .repeat(50));
    
    await client.connect();
    console.log('✅ Connected to database\n');

    // Step 1: Check if user exists
    console.log(`📋 Step 1: Looking for user with email: ${YOUR_EMAIL}`);
    const userResult = await client.query(
      'SELECT id, name, email, role FROM "user" WHERE email = $1',
      [YOUR_EMAIL]
    );

    if (userResult.rows.length === 0) {
      console.log(`\n❌ User not found with email: ${YOUR_EMAIL}`);
      console.log('\n📋 Available users:');
      
      const allUsers = await client.query(
        'SELECT name, email, role FROM "user" ORDER BY "createdAt" DESC LIMIT 10'
      );
      
      allUsers.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
      });
      
      console.log('\n💡 Update YOUR_EMAIL in this script and run again.');
      return;
    }

    const user = userResult.rows[0];
    console.log(`✅ Found user: ${user.name} (${user.email})`);
    console.log(`   Current role: ${user.role || 'user'}`);

    // Step 2: Update user to admin
    if (user.role === 'admin') {
      console.log('\n✅ User is already an admin!');
    } else {
      console.log(`\n📋 Step 2: Updating user role to admin...`);
      await client.query(
        'UPDATE "user" SET role = $1 WHERE id = $2',
        ['admin', user.id]
      );
      console.log('✅ User role updated to admin in database');
    }

    // Step 3: Verify the update
    console.log(`\n📋 Step 3: Verifying update...`);
    const verifyResult = await client.query(
      'SELECT id, name, email, role FROM "user" WHERE id = $1',
      [user.id]
    );
    
    const updatedUser = verifyResult.rows[0];
    console.log(`✅ Verified: ${updatedUser.name} is now ${updatedUser.role}`);

    // Step 4: Instructions
    console.log('\n' + '='.repeat(50));
    console.log('🎉 DATABASE UPDATE COMPLETE!\n');
    console.log('📝 NEXT STEPS TO ACCESS ADMIN PANEL:\n');
    console.log('   Option 1 (Recommended - Automatic):');
    console.log('   1. Open: force-admin-session.html in your browser');
    console.log('   2. Click "Force Update to Admin" button');
    console.log('   3. Navigate to http://localhost:3000/#/admin\n');
    
    console.log('   Option 2 (Manual):');
    console.log('   1. Open your app: http://localhost:3000');
    console.log('   2. Logout from the application');
    console.log('   3. Login again with: ' + YOUR_EMAIL);
    console.log('   4. Navigate to: http://localhost:3000/#/admin\n');
    
    console.log('   Option 3 (Quick - Clear Cache):');
    console.log('   1. Open browser DevTools (F12)');
    console.log('   2. Go to Application > Local Storage');
    console.log('   3. Delete "user_data" and "auth_token"');
    console.log('   4. Refresh the page and login again\n');
    
    console.log('=' + '='.repeat(50));
    console.log('\n💡 TIP: After logging in, you will see "Admin Panel"');
    console.log('   in your profile menu (top right corner)\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('  - PostgreSQL is running');
    console.error('  - Database credentials in Backend/.env are correct');
    console.error('  - Database "YoutubeClone" exists');
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixAdminAccess();
