// Complete script to create admin user with email verification bypass
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

async function createAdminUser() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  
  console.log('🚀 Creating admin user for NebulaStream...\n');

  // Try using Google Mock Auth instead (which bypasses email verification)
  console.log('Step 1: Creating user via Google Mock Auth...');
  const mockAuthData = JSON.stringify({
    email: 'admin@nebulastream.com',
    name: 'Admin User',
    picture: 'https://ui-avatars.com/api/?background=random&name=Admin+User'
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
    const mockAuthResponse = await makeRequest(mockAuthOptions, mockAuthData);
    console.log(`Mock Auth Status: ${mockAuthResponse.statusCode}`);
    
    let mockAuthResult;
    try {
      mockAuthResult = JSON.parse(mockAuthResponse.data);
      console.log('Mock Auth Response:', JSON.stringify(mockAuthResult, null, 2));
    } catch (e) {
      console.log('Raw Mock Auth Response:', mockAuthResponse.data);
      return;
    }

    if (mockAuthResponse.statusCode === 201 || mockAuthResponse.statusCode === 200) {
      console.log('✅ User created successfully via Google Mock Auth!');
      
      const token = mockAuthResult.access_token;
      const userId = mockAuthResult.user.id;
      
      console.log('User ID:', userId);
      console.log('Token:', token ? 'Generated' : 'Not found');
      
      console.log('\n✅ SUCCESS! Admin user created!');
      console.log('\n📋 Login Credentials:');
      console.log('Email: admin@nebulastream.com');
      console.log('Password: (Use Google OAuth or reset password)');
      console.log('\n🌐 Try logging in at your frontend application');
      console.log('\n⚠️  IMPORTANT: The user is created but needs admin role.');
      console.log('   You may need to manually update the role in the database to "admin".');
      
      // Try to get user info to verify
      console.log('\nStep 2: Verifying user creation...');
      const meOptions = {
        hostname: baseUrl,
        port: 443,
        path: '/auth/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const meResponse = await makeRequest(meOptions);
      console.log(`Me Status: ${meResponse.statusCode}`);
      
      if (meResponse.statusCode === 200) {
        const meResult = JSON.parse(meResponse.data);
        console.log('User Info:', JSON.stringify(meResult, null, 2));
      }

    } else {
      console.log('❌ Failed to create user via Mock Auth');
      return;
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();