// Script to set password using bootstrap endpoint
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

async function setPasswordBootstrap() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  
  console.log('🔧 Setting admin password via bootstrap endpoint...\n');

  const passwordData = JSON.stringify({
    email: 'admin@nebulastream.com',
    password: 'admin123'
  });

  const passwordOptions = {
    hostname: baseUrl,
    port: 443,
    path: '/bootstrap/set-password',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': passwordData.length
    }
  };

  try {
    console.log('Setting password for admin@nebulastream.com...');
    const response = await makeRequest(passwordOptions, passwordData);
    console.log(`Status: ${response.statusCode}`);
    
    let result;
    try {
      result = JSON.parse(response.data);
      console.log('Response:', JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('Raw Response:', response.data);
      return;
    }

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Password set successfully!');
      
      // Test login immediately
      console.log('\nTesting login with new password...');
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
      
      if (loginResponse.statusCode === 200 || loginResponse.statusCode === 201) {
        const loginResult = JSON.parse(loginResponse.data);
        console.log('\n🎉 SUCCESS! Login now works!');
        console.log('\n📋 WORKING ADMIN CREDENTIALS:');
        console.log('Email: admin@nebulastream.com');
        console.log('Password: admin123');
        console.log('Role:', loginResult.user.role);
        console.log('\n✅ You can now login with these credentials!');
        
        if (loginResult.user.role !== 'admin') {
          console.log('\n⚠️ Note: Role is still "user" - needs database update to "admin"');
        }
      } else {
        const loginError = JSON.parse(loginResponse.data);
        console.log('\n❌ Login test failed:', loginError);
      }
    } else {
      console.log('\n❌ Failed to set password');
      if (result.message) {
        console.log('Error:', result.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setPasswordBootstrap();