// Simple script to test admin login
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

async function testAdminLogin() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  
  console.log('🧪 Testing admin login...\n');

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

  try {
    console.log('Attempting login with:');
    console.log('Email: admin@nebulastream.com');
    console.log('Password: admin123\n');

    const response = await makeRequest(loginOptions, loginData);
    console.log(`Login Status: ${response.statusCode}`);
    
    let result;
    try {
      result = JSON.parse(response.data);
      console.log('Login Response:', JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('Raw Response:', response.data);
      return;
    }

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n🎉 SUCCESS! Admin login works!');
      console.log('\n📋 User Details:');
      console.log('ID:', result.user.id);
      console.log('Name:', result.user.name);
      console.log('Email:', result.user.email);
      console.log('Role:', result.user.role);
      console.log('Email Verified:', result.user.isEmailVerified);
      
      if (result.user.role === 'admin') {
        console.log('\n✅ PERFECT! User has admin role!');
        console.log('🎯 You can now access the admin panel!');
      } else {
        console.log('\n⚠️ User can login but role is:', result.user.role);
        console.log('   Expected: admin');
      }

      if (result.access_token) {
        console.log('\n🔑 JWT Token generated successfully');
        console.log('Token length:', result.access_token.length);
      }
    } else {
      console.log('\n❌ Login failed');
      if (result.error) {
        console.log('Error:', result.error);
      }
      if (result.message) {
        console.log('Message:', result.message);
      }
      
      console.log('\n💡 If login fails, run the SQL update first:');
      console.log('UPDATE "user" SET password = \'$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi\', role = \'admin\' WHERE email = \'admin@nebulastream.com\';');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAdminLogin();