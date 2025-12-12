// Script to update user role to admin using API
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

async function updateUserToAdmin() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  const userId = '3ddfa24b-aea6-4fb9-84a7-9582960554ab'; // From previous script
  
  console.log('🔧 Updating user to admin role...\n');

  // First, let's try to login with the user to get a token
  console.log('Step 1: Getting user token...');
  
  // Since we can't login with password (user was created via Google mock), 
  // let's use the Google mock auth again to get a fresh token
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
    const authResult = JSON.parse(authResponse.data);
    
    if (authResponse.statusCode !== 200 && authResponse.statusCode !== 201) {
      console.log('❌ Failed to get user token');
      return;
    }

    const token = authResult.access_token;
    console.log('✅ Got user token');

    // Now try to update the user role using the admin endpoint
    // Note: This will likely fail because the user is not admin yet
    console.log('\nStep 2: Attempting to update role via admin endpoint...');
    
    const updateRoleData = JSON.stringify({
      role: 'admin'
    });

    const updateRoleOptions = {
      hostname: baseUrl,
      port: 443,
      path: `/admin/users/${userId}/role`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': updateRoleData.length
      }
    };

    const updateResponse = await makeRequest(updateRoleOptions, updateRoleData);
    console.log(`Update Role Status: ${updateResponse.statusCode}`);
    
    try {
      const updateResult = JSON.parse(updateResponse.data);
      console.log('Update Response:', JSON.stringify(updateResult, null, 2));
      
      if (updateResponse.statusCode === 200) {
        console.log('✅ SUCCESS! User role updated to admin!');
        console.log('\n📋 You can now login with:');
        console.log('Email: admin@nebulastream.com');
        console.log('Password: admin123 (or use Google OAuth)');
      } else {
        console.log('❌ Failed to update role via API (expected - user needs admin privileges)');
        console.log('\n🔧 MANUAL DATABASE UPDATE REQUIRED:');
        console.log('You need to manually update the database with this SQL:');
        console.log(`UPDATE "user" SET role = 'admin' WHERE id = '${userId}';`);
      }
    } catch (e) {
      console.log('Raw Update Response:', updateResponse.data);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateUserToAdmin();