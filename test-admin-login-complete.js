async function testAdminLogin() {
  const API_URL = 'http://localhost:4000';
  const email = 'admin@nebulastream.com';
  const password = 'admin123'; // Change this to your actual password

  console.log('🔐 Testing Admin Login Flow\n');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}\n`);

  try {
    // Step 1: Login
    console.log('Step 1: Logging in...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      throw new Error(loginData.message || 'Login failed');
    }

    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(loginData, null, 2));

    const token = loginData.access_token;
    const userFromLogin = loginData.user;

    console.log('\n📋 User from login response:');
    console.log(`   ID: ${userFromLogin.id}`);
    console.log(`   Name: ${userFromLogin.name}`);
    console.log(`   Email: ${userFromLogin.email}`);
    console.log(`   Role: ${userFromLogin.role}`);
    console.log(`   Email Verified: ${userFromLogin.isEmailVerified}`);

    // Step 2: Get user info with token
    console.log('\n\nStep 2: Getting user info with token...');
    const meResponse = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const meData = await meResponse.json();

    console.log('✅ Got user info!');
    console.log('Response:', JSON.stringify(meData, null, 2));

    const userFromMe = meData.user;

    console.log('\n📋 User from /auth/me:');
    console.log(`   ID: ${userFromMe.id}`);
    console.log(`   Name: ${userFromMe.name}`);
    console.log(`   Email: ${userFromMe.email}`);
    console.log(`   Role: ${userFromMe.role}`);
    console.log(`   Email Verified: ${userFromMe.isEmailVerified}`);

    // Step 3: Check admin access
    console.log('\n\nStep 3: Checking admin access...');
    if (userFromMe.role === 'admin') {
      console.log('✅ User HAS admin role!');
      
      // Try to access admin endpoint
      console.log('\nStep 4: Testing admin endpoint...');
      try {
        const statsResponse = await fetch(`${API_URL}/admin/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const statsData = await statsResponse.json();
        
        if (!statsResponse.ok) {
          throw new Error(JSON.stringify(statsData));
        }
        
        console.log('✅ Admin endpoint accessible!');
        console.log('Stats:', JSON.stringify(statsData, null, 2));
      } catch (error) {
        console.log('❌ Admin endpoint failed:', error.message);
      }
    } else {
      console.log(`❌ User does NOT have admin role. Current role: ${userFromMe.role}`);
    }

    console.log('\n\n🎉 Test complete!');
    console.log('\n💡 If the role is "admin" but you still get access denied in the browser:');
    console.log('   1. Clear browser localStorage');
    console.log('   2. Clear browser cookies');
    console.log('   3. Try logging in again');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Login failed. Possible reasons:');
    console.log('   1. Wrong password');
    console.log('   2. User does not exist');
    console.log('   3. Email not verified');
    console.log('   4. Backend server not running');
  }
}

testAdminLogin();
