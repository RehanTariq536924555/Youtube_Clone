// Test the exact same login request as frontend
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

async function testExactLogin() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  
  console.log('🧪 Testing EXACT login as frontend would do...\n');

  // Test with exact same format as frontend
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
      'Content-Length': loginData.length,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Origin': 'https://youtube-clone-frontend-livid.vercel.app'
    }
  };

  try {
    console.log('🔍 Request Details:');
    console.log('URL:', `https://${baseUrl}/auth/login`);
    console.log('Method: POST');
    console.log('Headers:', JSON.stringify(loginOptions.headers, null, 2));
    console.log('Body:', loginData);
    console.log('\n📡 Sending request...\n');

    const response = await makeRequest(loginOptions, loginData);
    
    console.log('📥 Response Details:');
    console.log('Status Code:', response.statusCode);
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    
    let result;
    try {
      result = JSON.parse(response.data);
      console.log('\n📄 Response Body:');
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('\n📄 Raw Response Body:');
      console.log(response.data);
      return;
    }

    console.log('\n🔍 Analysis:');
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('✅ LOGIN SUCCESS!');
      
      if (result.access_token) {
        console.log('✅ JWT token generated');
        console.log('Token preview:', result.access_token.substring(0, 50) + '...');
      }
      
      if (result.user) {
        console.log('✅ User data returned');
        console.log('User ID:', result.user.id);
        console.log('Email:', result.user.email);
        console.log('Role:', result.user.role);
        console.log('Email Verified:', result.user.isEmailVerified);
        
        if (result.user.role === 'admin') {
          console.log('🎉 PERFECT! User has admin role!');
        } else {
          console.log('⚠️ User role is:', result.user.role, '(expected: admin)');
        }
      }
    } else if (response.statusCode === 401) {
      console.log('❌ LOGIN FAILED - UNAUTHORIZED');
      console.log('This means password comparison failed');
      console.log('The user password in database is likely NULL or incorrect');
      
      console.log('\n💡 SOLUTION:');
      console.log('Run this SQL in your database:');
      console.log("UPDATE \"user\" SET password = '$2a$10$CwTycUXWue0Thq9StjUM0uBUcjQ5d1VwJkpD.O.dV0sQ/4kYeZWxO', role = 'admin' WHERE email = 'admin@nebulastream.com';");
    } else {
      console.log('❌ UNEXPECTED ERROR');
      console.log('Status:', response.statusCode);
      if (result.message) {
        console.log('Message:', result.message);
      }
    }

  } catch (error) {
    console.error('❌ Request Error:', error.message);
  }
}

testExactLogin();