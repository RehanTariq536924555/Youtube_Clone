// Script to create admin user with email and password
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

async function createAdminWithPassword() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  
  console.log('🚀 Creating admin user with password...\n');

  // Step 1: Register user with password
  console.log('Step 1: Registering admin user...');
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
    }

    // Step 2: Manually verify email (bypass email verification)
    console.log('\nStep 2: Manually verifying email...');
    const verifyData = JSON.stringify({
      email: 'admin@nebulastream.com'
    });

    const verifyOptions = {
      hostname: baseUrl,
      port: 443,
      path: '/auth/manual-verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': verifyData.length
      }
    };

    const verifyResponse = await makeRequest(verifyOptions, verifyData);
    console.log(`Verify Status: ${verifyResponse.statusCode}`);
    
    let verifyResult;
    try {
      verifyResult = JSON.parse(verifyResponse.data);
      console.log('Verify Response:', JSON.stringify(verifyResult, null, 2));
    } catch (e) {
      console.log('Raw Verify Response:', verifyResponse.data);
    }

    // Step 3: Test login
    console.log('\nStep 3: Testing login...');
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
    console.log(`Login Status: ${loginResponse.statusCode}`);
    
    let loginResult;
    try {
      loginResult = JSON.parse(loginResponse.data);
      console.log('Login Response:', JSON.stringify(loginResult, null, 2));
    } catch (e) {
      console.log('Raw Login Response:', loginResponse.data);
    }

    if (loginResponse.statusCode === 200 || loginResponse.statusCode === 201) {
      console.log('\n✅ SUCCESS! Admin user created and can login!');
      console.log('\n📋 Admin Login Credentials:');
      console.log('Email: admin@nebulastream.com');
      console.log('Password: admin123');
      console.log('\n⚠️ IMPORTANT: User role is still "user" - needs to be promoted to "admin"');
      console.log('   You can login but won\'t have admin privileges until role is updated.');
      
      if (loginResult.access_token) {
        console.log('\n🔑 JWT Token generated successfully');
        console.log('Token:', loginResult.access_token.substring(0, 50) + '...');
      }
    } else {
      console.log('\n❌ Login failed - check the response above');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminWithPassword();