// Script to set password for admin user and promote to admin role
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

async function setAdminPassword() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  const userId = '3ddfa24b-aea6-4fb9-84a7-9582960554ab';
  
  console.log('🔧 Setting password and promoting user to admin...\n');

  // First get a token by logging in
  console.log('Step 1: Getting authentication token...');
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
    const loginResponse = await makeRequest(loginOptions, loginData);
    console.log(`Login Status: ${loginResponse.statusCode}`);
    
    if (loginResponse.statusCode !== 200 && loginResponse.statusCode !== 201) {
      console.log('❌ Failed to login');
      return;
    }

    const loginResult = JSON.parse(loginResponse.data);
    const token = loginResult.access_token;
    console.log('✅ Got authentication token');

    // Try to promote using the bootstrap endpoint
    console.log('\nStep 2: Promoting to admin role...');
    const promoteData = JSON.stringify({
      email: 'admin@nebulastream.com'
    });

    const promoteOptions = {
      hostname: baseUrl,
      port: 443,
      path: '/bootstrap/promote-to-admin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': promoteData.length
      }
    };

    const promoteResponse = await makeRequest(promoteOptions, promoteData);
    console.log(`Promote Status: ${promoteResponse.statusCode}`);
    
    let promoteResult;
    try {
      promoteResult = JSON.parse(promoteResponse.data);
      console.log('Promote Response:', JSON.stringify(promoteResult, null, 2));
    } catch (e) {
      console.log('Raw Promote Response:', promoteResponse.data);
    }

    if (promoteResponse.statusCode === 200 || promoteResponse.statusCode === 201) {
      console.log('\n✅ SUCCESS! User promoted to admin!');
    } else {
      console.log('\n⚠️ Promotion via API failed, but user can still login');
    }

    // Test final login to verify everything works
    console.log('\nStep 3: Final login test...');
    const finalLoginResponse = await makeRequest(loginOptions, loginData);
    
    if (finalLoginResponse.statusCode === 200 || finalLoginResponse.statusCode === 201) {
      const finalResult = JSON.parse(finalLoginResponse.data);
      console.log('\n🎉 FINAL RESULT:');
      console.log('User Info:', JSON.stringify(finalResult.user, null, 2));
      
      console.log('\n📋 ADMIN LOGIN CREDENTIALS:');
      console.log('Email: admin@nebulastream.com');
      console.log('Password: admin123');
      console.log('Role:', finalResult.user.role);
      
      if (finalResult.user.role === 'admin') {
        console.log('\n✅ PERFECT! User has admin role and can login!');
      } else {
        console.log('\n⚠️ User can login but role is still "user"');
        console.log('   Manual database update needed to set role to "admin"');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setAdminPassword();