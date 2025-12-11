const fetch = require('node-fetch');

const email = 'admin@nebulastream.com';
const password = 'admin123';

async function testLogin() {
  console.log('🧪 Testing Admin Login Flow\n');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}\n`);

  try {
    // Step 1: Login
    console.log('Step 1: POST /auth/login');
    const loginResponse = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();
    console.log('Response status:', loginResponse.status);
    console.log('Response data:', JSON.stringify(loginData, null, 2));

    if (!loginResponse.ok) {
      console.log('\n❌ Login failed!');
      console.log('Error:', loginData.message || loginData.error);
      return;
    }

    console.log('\n✅ Login successful!');
    console.log('Token:', loginData.access_token ? 'Received' : 'Missing');

    // Step 2: Get user info
    console.log('\nStep 2: GET /auth/me');
    const meResponse = await fetch('http://localhost:4000/auth/me', {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
      },
    });

    const meData = await meResponse.json();
    console.log('Response status:', meResponse.status);
    console.log('Response data:', JSON.stringify(meData, null, 2));

    if (!meResponse.ok) {
      console.log('\n❌ Failed to get user info!');
      return;
    }

    console.log('\n✅ User info retrieved!');
    console.log('User role:', meData.user.role);

    // Step 3: Check admin role
    console.log('\nStep 3: Check admin role');
    if (meData.user.role !== 'admin') {
      console.log('❌ User is NOT an admin!');
      console.log('   Current role:', meData.user.role);
      console.log('   Expected role: admin');
    } else {
      console.log('✅ User IS an admin!');
      console.log('\n🎉 Login flow successful!');
      console.log('   Token can be stored as: admin_token');
      console.log('   User can be stored as: admin_user');
      console.log('   Redirect to: /admin/dashboard');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Make sure backend is running on http://localhost:4000');
  }
}

testLogin();
