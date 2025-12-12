// Script to promote existing user to admin
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

async function promoteToAdmin() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  
  console.log('🔧 Promoting user to admin...\n');

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

  try {
    console.log('Promoting admin@nebulastream.com to admin role...');
    const response = await makeRequest(promoteOptions, promoteData);
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
      console.log('\n✅ SUCCESS! User promoted to admin!');
      console.log('\n📋 Admin Login Credentials:');
      console.log('Email: admin@nebulastream.com');
      console.log('Password: admin123 (if you set one) or use Google OAuth');
      console.log('\n🌐 Admin Panel: https://youtube-clone-1-ntn4.onrender.com/admin');
      console.log('\n🎉 You can now access the admin panel!');
    } else {
      console.log('\n❌ Failed to promote user to admin');
      if (result.message) {
        console.log('Error:', result.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

promoteToAdmin();