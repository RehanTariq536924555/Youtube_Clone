// Simple script to create admin user using the register endpoint
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

  // Step 1: Register the user
  console.log('Step 1: Registering user...');
  const registerData = JSON.stringify({
    name: 'Admin User',
    email: 'admin@nebulastream.com',
    password: 'admin123'
  });

  const registerOptions = {
    hostname: baseUrl,
    port: 443,
    path: '/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': registerData.length
    }
  };

  try {
    const registerResponse = await makeRequest(registerOptions, registerData);
    console.log(`Register Status: ${registerResponse.statusCode}`);
    
    let registerResult;
    try {
      registerResult = JSON.parse(registerResponse.data);
      console.log('Register Response:', JSON.stringify(registerResult, null, 2));
    } catch (e) {
      console.log('Raw Register Response:', registerResponse.data);
      return;
    }

    if (registerResponse.statusCode === 201 || registerResponse.statusCode === 200) {
      console.log('✅ User registered successfully!');
      
      // If user already exists, that's fine too
      if (registerResult.statusCode === 409) {
        console.log('ℹ️  User already exists, that\'s okay!');
      }
    } else if (registerResult.statusCode === 409) {
      console.log('ℹ️  User already exists, continuing...');
    } else {
      console.log('❌ Failed to register user');
      return;
    }

    console.log('\n✅ SUCCESS! Admin user setup completed!');
    console.log('\n📋 Login Credentials:');
    console.log('Email: admin@nebulastream.com');
    console.log('Password: admin123');
    console.log('\n🌐 Admin Panel URL: https://youtube-clone-1-ntn4.onrender.com/admin');
    console.log('\n⚠️  IMPORTANT: You need to manually update the user role to "admin" in the database.');
    console.log('   The user has been created but needs admin privileges.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();