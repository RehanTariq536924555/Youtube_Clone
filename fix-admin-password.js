// Script to properly set password for admin user
const https = require('https');

async function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: responseData,
          headers: res.headers
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function fixAdminPassword() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  const userId = '3ddfa24b-aea6-4fb9-84a7-9582960554ab';
  
  console.log('🔧 Fixing admin password...\n');

  // First, let's get a token using Google mock auth (since that works)
  console.log('Step 1: Getting token via Google mock auth...');
  const mockAuthData = JSON.stringify({
    email: 'admin@nebulastream.com',
    name: 'Admin User'
  });

  const mockAuthOptions = {
    hostname: baseUrl,
    port: 443,
    path: '/auth/google/mock',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': mockAuthData.length
    }
  };

  try {
    const authResponse = await makeRequest(mockAuthOptions, mockAuthData);
    
    if (authResponse.statusCode !== 200 && authResponse.statusCode !== 201) {
      console.log('❌ Failed to get token');
      return;
    }

    const authResult = JSON.parse(authResponse.data);
    const token = authResult.access_token;
    console.log('✅ Got authentication token');

    // Now use the admin endpoint to change the password
    console.log('\nStep 2: Setting new password via admin endpoint...');
    const passwordData = JSON.stringify({
      newPassword: 'admin123'
    });

    const passwordOptions = {
      hostname: baseUrl,
      port: 443,
      path: `/admin/users/${userId}/change-password`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': passwordData.length
      }
    };

    const passwordResponse = await makeRequest(passwordOptions, passwordData);
    console.log(`Password Change Status: ${passwordResponse.statusCode}`);
    
    let passwordResult;
    try {
      passwordResult = JSON.parse(passwordResponse.data);
      console.log('Password Response:', JSON.stringify(passwordResult, null, 2));
    } catch (e) {
      console.log('Raw Password Response:', passwordResponse.data);
    }

    if (passwordResponse.statusCode === 200 || passwordResponse.statusCode === 201) {
      console.log('✅ Password set successfully!');
      
      // Test login with new password
      console.log('\nStep 3: Testing login with new password...');
      const loginData = JSON.stringify({
        email: 'admin@nebulastream.com',
        password: 'admin123'
      });

      const loginOptions = {
        hostname: baseUrl,
        port: 443,
        path: '/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginData.length
        }
      };

      const loginResponse = await makeRequest(loginOptions, loginData);
      console.log(`Login Test Status: ${loginResponse.statusCode}`);
      
      if (loginResponse.statusCode === 200 || loginResponse.statusCode === 201) {
        const loginResult = JSON.parse(loginResponse.data);
        console.log('\n🎉 SUCCESS! Password login now works!');
        console.log('\n📋 WORKING ADMIN CREDENTIALS:');
        console.log('Email: admin@nebulastream.com');
        console.log('Password: admin123');
        console.log('Role:', loginResult.user.role);
        
        if (loginResult.user.role === 'admin') {
          console.log('\n✅ PERFECT! User has admin role!');
        } else {
          console.log('\n⚠️ User can login but role is still "user"');
          console.log('   Database update needed: UPDATE "user" SET role = \'admin\' WHERE email = \'admin@nebulastream.com\';');
        }
      } else {
        console.log('\n❌ Login test failed');
        const loginResult = JSON.parse(loginResponse.data);
        console.log('Login Error:', loginResult);
      }
    } else {
      console.log('\n❌ Failed to set password');
      if (passwordResult && passwordResult.message) {
        console.log('Error:', passwordResult.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAdminPassword();