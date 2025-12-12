// Debug script to help identify frontend connection issues
const https = require('https');
const http = require('http');

async function makeRequest(options, data, useHttps = true) {
  return new Promise((resolve, reject) => {
    const client = useHttps ? https : http;
    const req = client.request(options, (res) => {
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

async function debugFrontendConnection() {
  console.log('🔍 Debugging Frontend Connection Issues...\n');

  // Test scenarios that might be causing "Failed to fetch"
  const testScenarios = [
    {
      name: 'Deployed Backend (HTTPS)',
      url: 'youtube-clone-1-ntn4.onrender.com',
      port: 443,
      useHttps: true,
      origin: 'https://youtube-clone-frontend-livid.vercel.app'
    },
    {
      name: 'Deployed Backend from Localhost',
      url: 'youtube-clone-1-ntn4.onrender.com',
      port: 443,
      useHttps: true,
      origin: 'http://localhost:5173'
    },
    {
      name: 'Local Backend (if running)',
      url: 'localhost',
      port: 4000,
      useHttps: false,
      origin: 'http://localhost:5173'
    }
  ];

  for (const scenario of testScenarios) {
    console.log(`🧪 Testing: ${scenario.name}`);
    console.log(`   URL: ${scenario.useHttps ? 'https' : 'http'}://${scenario.url}:${scenario.port}`);
    console.log(`   Origin: ${scenario.origin}`);

    try {
      // Test health endpoint first
      const healthOptions = {
        hostname: scenario.url,
        port: scenario.port,
        path: '/api/health',
        method: 'GET',
        headers: {
          'Origin': scenario.origin
        }
      };

      const healthResponse = await makeRequest(healthOptions, null, scenario.useHttps);
      console.log(`   ✅ Health Check: ${healthResponse.statusCode}`);

      // Test login endpoint
      const loginData = JSON.stringify({
        email: 'admin@nebulastream.com',
        password: 'admin123'
      });

      const loginOptions = {
        hostname: scenario.url,
        port: scenario.port,
        path: '/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginData.length,
          'Origin': scenario.origin
        }
      };

      const loginResponse = await makeRequest(loginOptions, loginData, scenario.useHttps);
      console.log(`   ✅ Login Test: ${loginResponse.statusCode}`);

      if (loginResponse.statusCode === 200 || loginResponse.statusCode === 201) {
        console.log(`   🎉 SUCCESS! This configuration works!`);
        console.log(`   📋 Frontend should use: ${scenario.useHttps ? 'https' : 'http'}://${scenario.url}:${scenario.port}`);
      }

    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      
      if (error.code === 'ECONNREFUSED') {
        console.log(`   💡 Server not running on ${scenario.url}:${scenario.port}`);
      } else if (error.code === 'ENOTFOUND') {
        console.log(`   💡 Cannot resolve hostname: ${scenario.url}`);
      } else if (error.message.includes('fetch')) {
        console.log(`   💡 This is the same error your frontend is getting!`);
      }
    }
    
    console.log('');
  }

  console.log('🔧 SOLUTIONS:');
  console.log('');
  console.log('1. If you\'re running frontend LOCALLY:');
  console.log('   Create/update nebulastream/.env.local with:');
  console.log('   VITE_API_BASE_URL=https://youtube-clone-1-ntn4.onrender.com');
  console.log('');
  console.log('2. If you\'re using DEPLOYED frontend:');
  console.log('   Make sure .env.production has:');
  console.log('   VITE_API_BASE_URL=https://youtube-clone-1-ntn4.onrender.com');
  console.log('');
  console.log('3. Clear browser cache and try again');
  console.log('');
  console.log('4. Check browser developer tools Network tab for exact error');
}

debugFrontendConnection();