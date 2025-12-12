// Test CORS and connectivity from different origins
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

async function testCorsConnectivity() {
  const baseUrl = 'youtube-clone-1-ntn4.onrender.com';
  
  console.log('🧪 Testing CORS and connectivity...\n');

  // Test different origins that might be used by frontend
  const testOrigins = [
    'https://youtube-clone-frontend-livid.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ];

  for (const origin of testOrigins) {
    console.log(`🔍 Testing with origin: ${origin}`);
    
    // Test OPTIONS request (CORS preflight)
    const optionsRequest = {
      hostname: baseUrl,
      port: 443,
      path: '/auth/login',
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };

    try {
      const optionsResponse = await makeRequest(optionsRequest);
      console.log(`  OPTIONS Status: ${optionsResponse.statusCode}`);
      console.log(`  CORS Headers:`, {
        'access-control-allow-origin': optionsResponse.headers['access-control-allow-origin'],
        'access-control-allow-methods': optionsResponse.headers['access-control-allow-methods'],
        'access-control-allow-headers': optionsResponse.headers['access-control-allow-headers']
      });

      // Test actual POST request
      const loginData = JSON.stringify({
        email: 'admin@nebulastream.com',
        password: 'admin123'
      });

      const postRequest = {
        hostname: baseUrl,
        port: 443,
        path: '/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginData.length,
          'Origin': origin
        }
      };

      const postResponse = await makeRequest(postRequest, loginData);
      console.log(`  POST Status: ${postResponse.statusCode}`);
      
      if (postResponse.statusCode === 200 || postResponse.statusCode === 201) {
        console.log(`  ✅ SUCCESS with origin: ${origin}`);
      } else {
        console.log(`  ❌ FAILED with origin: ${origin}`);
      }
    } catch (error) {
      console.log(`  ❌ ERROR with origin: ${origin} - ${error.message}`);
    }
    
    console.log('');
  }

  // Test health endpoint
  console.log('🏥 Testing health endpoint...');
  const healthRequest = {
    hostname: baseUrl,
    port: 443,
    path: '/api/health',
    method: 'GET'
  };

  try {
    const healthResponse = await makeRequest(healthRequest);
    console.log(`Health Status: ${healthResponse.statusCode}`);
    
    if (healthResponse.statusCode === 200) {
      const healthData = JSON.parse(healthResponse.data);
      console.log('Health Response:', healthData);
      console.log('✅ Backend is healthy and reachable');
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
}

testCorsConnectivity();